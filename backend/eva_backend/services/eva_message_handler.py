from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, List, NamedTuple, Optional

from eva_backend.contracts.message_models import (
    ConversationMessage,
    ConversationPayload,
    EVAClientRequest,
    EVAServiceResponse,
    EVASkillResolutionResponse,
    OutputPanel,
    RenderBlock,
    RenderPayload,
    RightPanelPayload,
    RightPanelTarget,
)
from eva_backend.llm.base import LLMCompletionRequest, LLMProvider
from eva_backend.llm.factory import get_default_llm_provider
from eva_backend.prompts import load_text_prompt
from eva_backend.skills.knowledge_chunks import KnowledgeHit, search_knowledge_chunks
from eva_backend.skills.registry_loader import find_entry, load_skill_corpus
from eva_backend.utils.json_extract import extract_json_object

logger = logging.getLogger(__name__)

SKILL_RESOLUTION_PIPELINE_VERSION = "skill-resolution-v1"
CHAT_PIPELINE_VERSION = "eva-chat-v1"


class SkillResolutionResult(NamedTuple):
    ok: bool
    hits: List[KnowledgeHit]
    pipeline: dict[str, Any]
    decision: str
    skill_id: Optional[str]
    rationale: str
    clar: Optional[str]
    error_message: Optional[str]


def _iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _skills_ranked_from_hits(hits: List[KnowledgeHit]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    order: list[str] = []
    best_score: dict[str, float] = {}
    chunk_hits: dict[str, int] = {}
    display_name: dict[str, str] = {}
    for h in hits:
        sid = h.skill_id
        chunk_hits[sid] = chunk_hits.get(sid, 0) + 1
        if sid not in seen:
            seen.add(sid)
            order.append(sid)
            best_score[sid] = h.score
            display_name[sid] = h.skill_display_name
        else:
            best_score[sid] = max(best_score[sid], h.score)
    ranked: list[dict[str, Any]] = []
    for rank, sid in enumerate(order, start=1):
        ranked.append(
            {
                "rank": rank,
                "skill_id": sid,
                "skill_display_name": display_name.get(sid, ""),
                "best_chunk_similarity": round(best_score[sid], 6),
                "chunk_hits_in_passages": chunk_hits.get(sid, 0),
            }
        )
    return ranked


def _vector_search_metadata(hits: List[KnowledgeHit], *, debug: bool) -> dict[str, Any]:
    previews = [h.preview(300) for h in hits]
    skills_ranked = _skills_ranked_from_hits(hits)
    out: dict[str, Any] = {
        "hit_count": len(hits),
        "distinct_skill_count": len(skills_ranked),
        "distinct_skill_ids": [s["skill_id"] for s in skills_ranked],
        "skills_ranked": skills_ranked,
        "top_similarity_skill_id": hits[0].skill_id if hits else None,
        "hits": previews,
    }
    if debug:
        out["hits_full_text"] = [{"skill_id": h.skill_id, "chunk_index": h.chunk_index, "text": h.chunk_text} for h in hits]
    return out


def _run_skill_router_llm(llm: LLMProvider, user_query: str, hits: List[KnowledgeHit]) -> tuple[str, dict[str, Any]]:
    system = load_text_prompt("skill_router_system")
    payload = {
        "user_message": user_query,
        "passages": [h.to_router_dict() for h in hits],
    }
    raw = llm.complete(
        LLMCompletionRequest(
            system_prompt=system,
            user_message=json.dumps(payload, ensure_ascii=False),
            max_tokens=500,
        )
    )
    parsed = extract_json_object(raw) or {}
    return raw, parsed


def _parse_router_decision(parsed: dict[str, Any], hits: List[KnowledgeHit]) -> tuple[str, Optional[str], str, Optional[str]]:
    decision = str(parsed.get("decision", "")).strip().lower()
    sid = parsed.get("skill_id")
    rationale = str(parsed.get("rationale", "") or "").strip()
    cq = parsed.get("clarifying_question")
    clar = str(cq).strip() if isinstance(cq, str) and cq.strip() else None

    valid_ids = {h.skill_id for h in hits}

    if decision == "no_match":
        return "no_match", None, rationale or "No passage matched the request.", clar

    if decision == "ambiguous":
        return "ambiguous", None, rationale or "Ambiguous intent.", clar or "Could you clarify what you want to do?"

    if decision == "use_skill" and isinstance(sid, str) and sid in valid_ids:
        return "use_skill", sid, rationale or f"Selected skill {sid}.", None

    legacy = parsed.get("chosen_skill_id")
    if isinstance(legacy, str) and legacy in valid_ids:
        return "use_skill", legacy, rationale or "Selected via legacy field.", clar

    if hits:
        return "use_skill", hits[0].skill_id, rationale or "Fallback to top similarity hit.", clar

    return "no_match", None, "No indexed knowledge.", None


def _chunks_for_skill(hits: List[KnowledgeHit], skill_id: str, max_chunks: int = 5) -> list[str]:
    texts = [h.chunk_text for h in hits if h.skill_id == skill_id][:max_chunks]
    if texts:
        return texts
    entry = find_entry(skill_id)
    if not entry:
        return []
    return [load_skill_corpus(entry)[:4000]]


def _passage_summaries(hits: List[KnowledgeHit], max_items: int = 6) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    seen: set[tuple[str, int]] = set()
    for h in hits:
        key = (h.skill_id, h.chunk_index)
        if key in seen:
            continue
        seen.add(key)
        prev = h.chunk_text.replace("\n", " ")[:120]
        out.append({"skill_id": h.skill_id, "chunk_index": h.chunk_index, "summary": prev})
        if len(out) >= max_items:
            break
    return out


def _excerpts_from_hits_multi(hits: List[KnowledgeHit], max_chunks: int = 6) -> list[str]:
    """Short labeled excerpts from top hits when no single skill is chosen (ambiguous / no_match)."""
    out: list[str] = []
    for h in hits[:max_chunks]:
        out.append(f"[{h.skill_id}]\n{h.chunk_text[:650]}")
    return out


def _orchestrator_skill_and_chunks(routing: SkillResolutionResult) -> tuple[Optional[str], list[str]]:
    if routing.decision == "use_skill" and routing.skill_id:
        return routing.skill_id, _chunks_for_skill(routing.hits, routing.skill_id)
    return None, _excerpts_from_hits_multi(routing.hits)


def _orchestrator_phase(routing: SkillResolutionResult) -> str:
    if not routing.ok:
        return "error"
    if routing.decision == "ambiguous":
        return "ambiguous"
    if routing.decision == "no_match" or not routing.skill_id:
        return "no_match"
    return "use_skill"


def _default_display_instructions(phase: str, routing: SkillResolutionResult) -> dict[str, Any]:
    if phase == "error":
        return {
            "scenario": "error",
            "left_panel_instruction": (
                "Show that skill knowledge is not indexed or the service failed; suggest checking Redis / backend logs."
            ),
            "right_panel_instruction": "No right-panel change.",
            "suggested_chip_labels": [],
        }
    if phase == "ambiguous":
        ids = routing.pipeline.get("vectorSearch", {}).get("distinct_skill_ids", [])[:5]
        chips = [f"Focus: {sid.split('.')[-1].replace('_', ' ')}" for sid in ids if sid]
        return {
            "scenario": "clarify",
            "left_panel_instruction": (
                "Show the clarifying question from skill resolution first; keep EVA chat short. "
                "Use chips to separate scheduling vs documentation vs coding if those were competing."
            ),
            "right_panel_instruction": (
                "Do not auto-navigate or change the right panel until the user answers the clarifying question."
            ),
            "suggested_chip_labels": chips or ["Scheduling / calendar", "Notes / documentation", "CPT / billing"],
        }
    if phase == "no_match":
        return {
            "scenario": "no_match",
            "left_panel_instruction": (
                "Explain that no registered skill matched; invite the user to rephrase or pick a broad area."
            ),
            "right_panel_instruction": "No right-panel change unless the user selects a guided workflow from chips.",
            "suggested_chip_labels": ["Scheduler", "Clinical documentation", "Try different wording"],
        }
    return {
        "scenario": "success",
        "left_panel_instruction": "Render the assistant_text and render_blocks as the EVA chat turn.",
        "right_panel_instruction": (
            "If rightPanel.action is not none, apply it when consistent with input_panel.rightPanel and safety rules."
        ),
        "suggested_chip_labels": [],
    }


def _coerce_display_metadata(
    parsed: dict[str, Any], *, phase: str, routing: SkillResolutionResult
) -> dict[str, Any]:
    d = parsed.get("display")
    base = _default_display_instructions(phase, routing)
    if not isinstance(d, dict):
        return base
    scenario = str(d.get("scenario") or base["scenario"] or phase).strip().lower()
    left = str(d.get("left_panel_instruction") or d.get("left_panel") or "").strip()
    right = str(d.get("right_panel_instruction") or d.get("right_panel") or "").strip()
    raw_chips = d.get("suggested_chip_labels") or d.get("suggested_chips")
    chips: list[str] = []
    if isinstance(raw_chips, list):
        chips = [str(c).strip() for c in raw_chips[:8] if c is not None and str(c).strip()]
    return {
        "scenario": scenario or base["scenario"],
        "left_panel_instruction": left or base["left_panel_instruction"],
        "right_panel_instruction": right or base["right_panel_instruction"],
        "suggested_chip_labels": chips if chips else list(base["suggested_chip_labels"]),
    }


def run_skill_resolution(req: EVAClientRequest, llm: Optional[LLMProvider] = None) -> SkillResolutionResult:
    """Stage 1 — skill resolution: vector search + skill-router LLM only (no orchestrator)."""
    llm = llm or get_default_llm_provider()
    query_text = req.query.rawInput.strip()
    hits = search_knowledge_chunks(query_text, top_k=10)

    if not hits:
        pl: dict[str, Any] = {
            "version": SKILL_RESOLUTION_PIPELINE_VERSION,
            "vectorSearch": _vector_search_metadata([], debug=req.debug),
            "skillRouter": {"skipped": True, "reason": "no_chunks_indexed"},
        }
        return SkillResolutionResult(
            ok=False,
            hits=[],
            pipeline=pl,
            decision="",
            skill_id=None,
            rationale="",
            clar=None,
            error_message="No skill knowledge is indexed yet.",
        )

    pipeline: dict[str, Any] = {
        "version": SKILL_RESOLUTION_PIPELINE_VERSION,
        "vectorSearch": _vector_search_metadata(hits, debug=req.debug),
    }
    router_raw, router_parsed = _run_skill_router_llm(llm, query_text, hits)
    pipeline["skillRouter"] = {
        "rawLlm": router_raw[:4000],
        "parsed": router_parsed,
    }
    decision, skill_id, rationale, clar = _parse_router_decision(router_parsed, hits)
    vtop = hits[0].skill_id if hits else None
    ranked_ids = [s["skill_id"] for s in pipeline["vectorSearch"]["skills_ranked"]]
    llm_chosen = skill_id if decision == "use_skill" and skill_id else None
    pipeline["comparison"] = {
        "vector_top_similarity_skill_id": vtop,
        "vector_ranked_skill_ids": ranked_ids,
        "router_decision": decision,
        "llm_chosen_skill_id": llm_chosen,
        "router_matches_vector_top": (skill_id == vtop) if (skill_id and vtop) else None,
    }
    return SkillResolutionResult(
        ok=True,
        hits=hits,
        pipeline=pipeline,
        decision=decision,
        skill_id=skill_id,
        rationale=rationale,
        clar=clar,
        error_message=None,
    )


def handle_skill_resolution_request(req: EVAClientRequest, llm: Optional[LLMProvider] = None) -> EVASkillResolutionResponse:
    """HTTP handler for POST /api/eva/skill-resolution → EVASkillResolutionResponse."""
    r = run_skill_resolution(req, llm)
    rid = f"sr_{uuid.uuid4().hex[:12]}"
    if not r.ok:
        return EVASkillResolutionResponse(
            requestId=req.requestId,
            responseId=rid,
            timestamp=_iso(),
            status="error",
            router_decision="",
            chosen_skill_id=None,
            router_rationale="",
            clarify_prompt=None,
            metadata={"pipeline": r.pipeline},
        )
    if r.decision == "ambiguous":
        clarify = r.clar or "Could you clarify what you want to do?"
        return EVASkillResolutionResponse(
            requestId=req.requestId,
            responseId=rid,
            timestamp=_iso(),
            status="clarify",
            router_decision=r.decision,
            chosen_skill_id=None,
            router_rationale=r.rationale,
            clarify_prompt=clarify,
            metadata={"pipeline": r.pipeline},
        )
    if r.decision == "no_match" or not r.skill_id:
        return EVASkillResolutionResponse(
            requestId=req.requestId,
            responseId=rid,
            timestamp=_iso(),
            status="success",
            router_decision="no_match",
            chosen_skill_id=None,
            router_rationale=r.rationale or (r.clar or ""),
            clarify_prompt=None,
            metadata={"pipeline": r.pipeline},
        )
    return EVASkillResolutionResponse(
        requestId=req.requestId,
        responseId=rid,
        timestamp=_iso(),
        status="success",
        router_decision="use_skill",
        chosen_skill_id=r.skill_id,
        router_rationale=r.rationale,
        clarify_prompt=None,
        metadata={"pipeline": r.pipeline},
    )


def _run_eva_agent_orchestrator_llm(
    llm: LLMProvider,
    req: EVAClientRequest,
    *,
    routing: SkillResolutionResult,
    resolution_phase: str,
    skill_id: Optional[str],
    chunk_texts: list[str],
) -> str:
    """Stage 2 — orchestrator LLM: always runs after skill resolution for /api/eva/chat (except hard index errors)."""
    system = load_text_prompt("eva_agent_orchestrator_system")
    comp = routing.pipeline.get("comparison", {})
    routing_payload = {
        "llm_chosen_skill_id": comp.get("llm_chosen_skill_id"),
        "router_decision": routing.decision,
        "router_rationale": routing.rationale,
        "vector_ranked_skill_ids": comp.get("vector_ranked_skill_ids", []),
        "vector_top_similarity_skill_id": comp.get("vector_top_similarity_skill_id"),
        "passage_summaries": _passage_summaries(routing.hits),
        "skill_selection_parsed": (routing.pipeline.get("skillRouter") or {}).get("parsed"),
    }
    entry = find_entry(skill_id) if skill_id else None
    capsule: dict[str, Any] = {
        "skill_id": skill_id,
        "display_name": entry.display_name if entry else (skill_id or ""),
        "description": entry.description if entry else "",
        "knowledge_excerpts": chunk_texts[:8] if chunk_texts else [],
    }
    body = {
        "user_message": req.query.rawInput,
        "input_panel": req.inputPanel.model_dump(),
        "resolution_phase": resolution_phase,
        "routing": routing_payload,
        "skill_capsule": capsule,
    }
    return llm.complete(
        LLMCompletionRequest(
            system_prompt=system,
            user_message=json.dumps(body, ensure_ascii=False),
            max_tokens=1400,
        )
    ).strip()


def _coerce_right_panel_action(raw: Any) -> str:
    allowed = {"none", "open", "update", "replace", "highlight", "prompt_before_navigate"}
    s = str(raw or "none").strip().lower()
    return s if s in allowed else "none"


def _append_chips_from_display(blocks: list[RenderBlock], display: dict[str, Any]) -> None:
    labels = display.get("suggested_chip_labels") or []
    if not isinstance(labels, list) or not labels:
        return
    if any(getattr(b, "type", None) == "actionChips" for b in blocks):
        return
    actions = [
        {"id": f"chip_{uuid.uuid4().hex[:6]}", "label": str(lab)[:120], "actionType": "send_event"}
        for lab in labels[:8]
        if str(lab).strip()
    ]
    if not actions:
        return
    blocks.append(
        RenderBlock(
            id=f"blk_{uuid.uuid4().hex[:8]}",
            type="actionChips",
            component="ActionChipGroup",
            props={"actions": actions},
        )
    )


def _service_response_from_orchestrator_json(
    req: EVAClientRequest,
    *,
    raw_llm: str,
    routing_pipeline: dict[str, Any],
    routing: SkillResolutionResult,
    resolution_phase: str,
    fallback_skill_id: Optional[str],
) -> tuple[EVAServiceResponse, dict[str, Any]]:
    """Returns (response, orchestrator_metadata). Merges ``metadata.display`` for EMR left/right guidance."""
    parsed = extract_json_object(raw_llm) or {}
    display_meta = _coerce_display_metadata(parsed, phase=resolution_phase, routing=routing)
    orch_meta: dict[str, Any] = {
        "rawLlm": raw_llm[:6000],
        "parsed": parsed,
        "parse_ok": bool(parsed),
    }
    conv_status = str(parsed.get("conversation_status", "success")).strip().lower()
    assistant_text = str(parsed.get("assistant_text", "") or "").strip()
    rp_raw = parsed.get("rightPanel") if isinstance(parsed.get("rightPanel"), dict) else {}
    tgt = rp_raw.get("target") if isinstance(rp_raw.get("target"), dict) else {}
    action = _coerce_right_panel_action(rp_raw.get("action"))
    target = RightPanelTarget(
        screen=tgt.get("screen"),
        subScreen=tgt.get("subScreen"),
        entityType=tgt.get("entityType"),
        entityId=tgt.get("entityId"),
    )
    state = rp_raw.get("state") if isinstance(rp_raw.get("state"), dict) else {}
    blocks_in = parsed.get("render_blocks")
    blocks: list[RenderBlock] = []
    if isinstance(blocks_in, list):
        for b in blocks_in[:12]:
            if not isinstance(b, dict):
                continue
            blocks.append(
                RenderBlock(
                    id=f"blk_{uuid.uuid4().hex[:8]}",
                    type=str(b.get("type", "text")),
                    component=str(b.get("component", "EvaTextBlock")),
                    props=b.get("props") if isinstance(b.get("props"), dict) else {},
                )
            )
    if not blocks and assistant_text:
        blocks = [
            RenderBlock(
                id=f"blk_{uuid.uuid4().hex[:8]}",
                type="text",
                component="EvaTextBlock",
                props={"text": assistant_text},
            )
        ]
    _append_chips_from_display(blocks, display_meta)

    full_pipeline: dict[str, Any] = {
        "version": CHAT_PIPELINE_VERSION,
        "routing": routing_pipeline,
        "orchestrator": orch_meta,
    }
    meta_base: dict[str, Any] = {"pipeline": full_pipeline, "display": display_meta}
    if fallback_skill_id:
        meta_base["chosen_skill_id"] = fallback_skill_id

    if not blocks:
        orch_meta["fallback"] = "default_blocks"
        text_fb = (
            assistant_text
            or (routing.clar or routing.rationale or "I'm not sure how to help with that yet.")
        )
        if fallback_skill_id:
            resp = _default_response_for_skill(
                req,
                fallback_skill_id,
                assistant_text=text_fb,
                pipeline=full_pipeline,
            )
            md = dict(resp.metadata)
            md["display"] = display_meta
            return resp.model_copy(update={"metadata": md}), orch_meta
        return (
            EVAServiceResponse(
                requestId=req.requestId,
                responseId=f"res_{uuid.uuid4().hex[:12]}",
                timestamp=_iso(),
                status="clarify" if resolution_phase == "ambiguous" else "success",  # type: ignore[arg-type]
                conversation=ConversationPayload(
                    message=ConversationMessage(
                        messageId=f"msg_{uuid.uuid4().hex[:10]}",
                        role="assistant",
                        type="structured_response",
                        text=text_fb,
                    )
                ),
                outputPanel=OutputPanel(
                    render=RenderPayload(
                        layoutMode="hybrid",
                        blocks=[
                            RenderBlock(
                                id=f"blk_{uuid.uuid4().hex[:8]}",
                                type="text",
                                component="EvaTextBlock",
                                props={"text": text_fb},
                            )
                        ],
                    ),
                    rightPanel=RightPanelPayload(action="none"),
                ),
                metadata=meta_base,
            ),
            orch_meta,
        )

    text_for_conv = assistant_text or (
        str(blocks[0].props.get("text", "")) if blocks and isinstance(blocks[0].props, dict) else ""
    )
    status: str = "clarify" if conv_status == "clarify" else "success"
    return (
        EVAServiceResponse(
            requestId=req.requestId,
            responseId=f"res_{uuid.uuid4().hex[:12]}",
            timestamp=_iso(),
            status=status,  # type: ignore[arg-type]
            conversation=ConversationPayload(
                message=ConversationMessage(
                    messageId=f"msg_{uuid.uuid4().hex[:10]}",
                    role="assistant",
                    type="structured_response",
                    text=text_for_conv,
                )
            ),
            outputPanel=OutputPanel(
                render=RenderPayload(layoutMode="hybrid", blocks=blocks),
                rightPanel=RightPanelPayload(action=action, target=target, state=state),
            ),
            metadata=meta_base,
        ),
        orch_meta,
    )


def _default_response_for_skill(
    req: EVAClientRequest,
    skill_id: str,
    *,
    assistant_text: Optional[str] = None,
    pipeline: Optional[dict[str, Any]] = None,
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

    meta: dict[str, Any] = {"chosen_skill_id": skill_id}
    if pipeline:
        meta["pipeline"] = pipeline

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
        outputPanel=OutputPanel(
            render=RenderPayload(layoutMode="hybrid", blocks=blocks),
            rightPanel=RightPanelPayload(action=action, target=target, state=state),
        ),
        metadata=meta,
    )


def handle_eva_chat_request(req: EVAClientRequest, llm: Optional[LLMProvider] = None) -> EVAServiceResponse:
    """
    Governed chat turn: (1) skill resolution in-process, then (2) **always** the orchestrator LLM
    so the client gets ``outputPanel.render`` / ``outputPanel.rightPanel`` plus ``metadata.display`` for left/right guidance.
    The second call can gain more context later without changing the HTTP contract.
    """
    llm = llm or get_default_llm_provider()
    routing = run_skill_resolution(req, llm)
    routing_pl = routing.pipeline

    if not routing.ok:
        disp = _default_display_instructions("error", routing)
        return EVAServiceResponse(
            requestId=req.requestId,
            responseId=f"res_{uuid.uuid4().hex[:12]}",
            timestamp=_iso(),
            status="error",
            conversation=ConversationPayload(
                message=ConversationMessage(
                    role="assistant",
                    text=routing.error_message or "No indexed knowledge.",
                )
            ),
            metadata={
                "pipeline": {"version": CHAT_PIPELINE_VERSION, "routing": routing_pl},
                "display": disp,
            },
        )

    phase = _orchestrator_phase(routing)
    skill_id, chunk_texts = _orchestrator_skill_and_chunks(routing)
    orch_error: str | None = None
    raw_orch = ""
    try:
        raw_orch = _run_eva_agent_orchestrator_llm(
            llm,
            req,
            routing=routing,
            resolution_phase=phase,
            skill_id=skill_id,
            chunk_texts=chunk_texts,
        )
    except Exception as exc:  # pragma: no cover
        logger.warning("orchestrator llm failed: %s", exc)
        orch_error = str(exc)

    if orch_error:
        pl = {
            "version": CHAT_PIPELINE_VERSION,
            "routing": routing_pl,
            "orchestrator": {"error": orch_error, "skipped": True},
        }
        disp = _default_display_instructions(phase, routing)
        if skill_id:
            resp = _default_response_for_skill(req, skill_id, pipeline=pl)
            md = dict(resp.metadata)
            md["display"] = disp
            return resp.model_copy(update={"metadata": md})
        text_fb = routing.clar or routing.rationale or "Eva could not reach the model. Try again."
        return EVAServiceResponse(
            requestId=req.requestId,
            responseId=f"res_{uuid.uuid4().hex[:12]}",
            timestamp=_iso(),
            status="clarify" if phase == "ambiguous" else "success",
            conversation=ConversationPayload(message=ConversationMessage(role="assistant", text=text_fb)),
            outputPanel=OutputPanel(
                render=RenderPayload(
                    layoutMode="hybrid",
                    blocks=[
                        RenderBlock(
                            id=f"blk_{uuid.uuid4().hex[:8]}",
                            type="text",
                            component="EvaTextBlock",
                            props={"text": text_fb},
                        )
                    ],
                ),
                rightPanel=RightPanelPayload(action="none"),
            ),
            metadata={
                "pipeline": pl,
                "display": disp,
                "router_rationale": routing.rationale,
            },
        )

    resp, _orch_meta = _service_response_from_orchestrator_json(
        req,
        raw_llm=raw_orch,
        routing_pipeline=routing_pl,
        routing=routing,
        resolution_phase=phase,
        fallback_skill_id=skill_id,
    )
    if routing.rationale and isinstance(resp.metadata, dict):
        md = dict(resp.metadata)
        md.setdefault("router_rationale", routing.rationale)
        return resp.model_copy(update={"metadata": md})
    return resp


def handle_eva_client_request(req: EVAClientRequest, llm: Optional[LLMProvider] = None) -> EVAServiceResponse:
    """Deprecated alias for handle_eva_chat_request (full EVAServiceResponse)."""
    return handle_eva_chat_request(req, llm)
