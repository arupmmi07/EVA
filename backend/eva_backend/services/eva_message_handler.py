from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from eva_backend.contracts.message_models import (
    ConversationMessage,
    ConversationPayload,
    EVAClientRequest,
    EVAServiceResponse,
    RenderBlock,
    RenderPayload,
    RightPanelPayload,
    RightPanelTarget,
)
from eva_backend.llm.base import LLMCompletionRequest, LLMProvider
from eva_backend.llm.factory import get_default_llm_provider
from eva_backend.prompts import load_text_prompt
from eva_backend.skills.registry_loader import find_entry, load_skill_corpus
from eva_backend.skills.skill_index import SkillCandidate, search_skills
from eva_backend.utils.json_extract import extract_json_object

logger = logging.getLogger(__name__)


def _iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _select_skill_via_llm(
    llm: LLMProvider,
    user_query: str,
    candidates: List[SkillCandidate],
) -> Tuple[Optional[str], bool, Optional[str]]:
    if not candidates:
        return None, True, "No matching skills are configured yet."
    system = load_text_prompt("skill_select_system")
    payload = {
        "user_message": user_query,
        "candidates": [
            {
                "skill_id": c.skill_id,
                "display_name": c.display_name,
                "score": round(c.score, 4),
                "excerpt": c.corpus_excerpt[:400],
            }
            for c in candidates
        ],
    }
    raw = llm.complete(
        LLMCompletionRequest(
            system_prompt=system,
            user_message=json.dumps(payload),
            max_tokens=256,
        )
    )
    data = extract_json_object(raw) or {}
    cid = data.get("chosen_skill_id")
    need = bool(data.get("need_clarification"))
    cq = data.get("clarifying_question")
    if need and isinstance(cq, str) and cq.strip():
        return None, True, cq.strip()
    if isinstance(cid, str) and cid.strip():
        valid = {c.skill_id for c in candidates}
        if cid.strip() in valid:
            return cid.strip(), False, None
    return candidates[0].skill_id, False, None


def _default_response_for_skill(
    req: EVAClientRequest,
    skill_id: str,
    *,
    assistant_text: Optional[str] = None,
) -> EVAServiceResponse:
    entry = find_entry(skill_id)
    title = entry.display_name if entry else skill_id
    text = assistant_text or (
        f"I'm using the **{title}** skill for your request. "
        "This POC does not call real EMR or scheduler APIs yet; I can walk through steps and "
        "what the right panel should focus on once those services are connected."
    )
    blocks: list[RenderBlock] = [
        RenderBlock(
            id=f"blk_{uuid.uuid4().hex[:8]}",
            type="text",
            component="EvaTextBlock",
            props={"text": text},
        )
    ]
    chips: list[dict[str, str]] = []
    if skill_id == "front_desk.appointment_booking":
        chips = [
            {"id": "act_avail", "label": "Check provider availability", "actionType": "send_event"},
            {"id": "act_cancel", "label": "Cancellation policy checklist", "actionType": "send_event"},
        ]
    elif skill_id == "front_desk.scheduler_view":
        chips = [
            {"id": "act_unconf", "label": "Explain unconfirmed list", "actionType": "send_event"},
            {"id": "act_day", "label": "Day-view navigation tips", "actionType": "send_event"},
        ]
    if chips:
        blocks.append(
            RenderBlock(
                id=f"blk_{uuid.uuid4().hex[:8]}",
                type="actionChips",
                component="ActionChipGroup",
                props={"actions": chips},
            )
        )

    rp_in = req.inputPanel.rightPanel
    action = "none"
    state: dict = {}
    target = RightPanelTarget()
    screen = rp_in.get("screen") if isinstance(rp_in, dict) else None
    if skill_id == "front_desk.scheduler_view":
        action = "highlight"
        target = RightPanelTarget(screen=screen or "scheduler", subScreen="unconfirmed")
        state = {"hint": "POC: open Unconfirmed accordion so the user sees schedule follow-ups."}
    elif skill_id == "front_desk.appointment_booking":
        action = "update"
        target = RightPanelTarget(
            screen=screen or "scheduler",
            subScreen="todaysPatients",
            entityType=rp_in.get("entityType") if isinstance(rp_in, dict) else None,
            entityId=rp_in.get("entityId") if isinstance(rp_in, dict) else None,
        )
        state = {"focus": "appointment_flow", "hasUnsavedWork": rp_in.get("hasUnsavedWork")}

    return EVAServiceResponse(
        requestId=req.requestId,
        responseId=f"res_{uuid.uuid4().hex[:12]}",
        timestamp=_iso(),
        status="success",
        conversation=ConversationPayload(
            message=ConversationMessage(
                messageId=f"msg_{uuid.uuid4().hex[:10]}",
                role="assistant",
                type="structured_response",
                text=text,
            )
        ),
        render=RenderPayload(layoutMode="hybrid", blocks=blocks),
        rightPanel=RightPanelPayload(action=action, target=target, state=state),
        metadata={"chosen_skill_id": skill_id},
    )


def handle_eva_client_request(req: EVAClientRequest, llm: Optional[LLMProvider] = None) -> EVAServiceResponse:
    """
    Retrieve skill candidates, ask LLM to pick or clarify, then build schema-driven response.
    """
    llm = llm or get_default_llm_provider()
    query_text = req.query.rawInput.strip()
    candidates = search_skills(query_text, top_k=5)
    skill_id, need_clar, question = _select_skill_via_llm(llm, query_text, candidates)

    if need_clar and question:
        return EVAServiceResponse(
            requestId=req.requestId,
            responseId=f"res_{uuid.uuid4().hex[:12]}",
            timestamp=_iso(),
            status="clarify",
            conversation=ConversationPayload(
                message=ConversationMessage(
                    messageId=f"msg_{uuid.uuid4().hex[:10]}",
                    role="assistant",
                    type="structured_response",
                    text=question,
                )
            ),
            render=RenderPayload(
                blocks=[
                    RenderBlock(
                        id=f"blk_{uuid.uuid4().hex[:8]}",
                        type="text",
                        component="EvaTextBlock",
                        props={"text": question},
                    )
                ]
            ),
            rightPanel=RightPanelPayload(action="none"),
            metadata={"candidates": [c.skill_id for c in candidates]},
        )

    if not skill_id:
        return EVAServiceResponse(
            requestId=req.requestId,
            responseId=f"res_{uuid.uuid4().hex[:12]}",
            timestamp=_iso(),
            status="error",
            conversation=ConversationPayload(
                message=ConversationMessage(
                    role="assistant",
                    text="I could not route this request to a skill.",
                )
            ),
            metadata={"reason": "no_skill"},
        )

    entry = find_entry(skill_id)
    corpus = load_skill_corpus(entry) if entry else ""
    paraphrase_system = (
        "You are EVA, a concise medical front-desk assistant (POC). "
        "Reply in 2–4 short sentences. No HTML. Do not claim real data was read from an EMR."
    )
    user_msg = (
        f"User request:\n{query_text}\n\nSkill selected: {skill_id}\n"
        f"Skill knowledge (excerpt):\n{corpus[:3500]}"
    )
    try:
        refined = llm.complete(
            LLMCompletionRequest(
                system_prompt=paraphrase_system,
                user_message=user_msg,
                max_tokens=400,
            )
        ).strip()
    except Exception as exc:  # pragma: no cover
        logger.warning("refine completion failed: %s", exc)
        refined = None

    return _default_response_for_skill(req, skill_id, assistant_text=refined)
