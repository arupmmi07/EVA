from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class QueryPayload(BaseModel):
    """User / system query. POC: require rawInput only."""

    model_config = ConfigDict(extra="allow")
    type: str = "text"
    rawInput: str = Field(..., min_length=1)


class InputPanel(BaseModel):
    """
    Client snapshot: EVA renderer state + right-panel application state.
    Extra keys allowed so FE can evolve without breaking the parser.
    """

    model_config = ConfigDict(extra="allow")
    render: Dict[str, Any] = Field(default_factory=dict)
    rightPanel: Dict[str, Any] = Field(default_factory=dict)


class EVAClientRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    messageType: Literal["EVAClientRequest"] = "EVAClientRequest"
    version: str = "1.0"
    requestId: Optional[str] = None
    timestamp: Optional[str] = None
    query: QueryPayload
    inputPanel: InputPanel = Field(default_factory=InputPanel)
    debug: bool = Field(
        default=False,
        description="If true, pipeline metadata may include full chunk text for each vector hit.",
    )


class ConversationMessage(BaseModel):
    model_config = ConfigDict(extra="allow")

    messageId: Optional[str] = None
    role: str = "assistant"
    type: str = "structured_response"
    text: str = ""


class ConversationPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    conversationId: Optional[str] = None
    contextId: Optional[str] = None
    message: ConversationMessage = Field(default_factory=ConversationMessage)


class RenderBlock(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    type: str
    component: str
    props: Dict[str, Any] = Field(default_factory=dict)


class RenderPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    layoutMode: Optional[str] = None
    blocks: List[RenderBlock] = Field(default_factory=list)


class RightPanelTarget(BaseModel):
    model_config = ConfigDict(extra="allow")

    screen: Optional[str] = None
    subScreen: Optional[str] = None
    entityType: Optional[str] = None
    entityId: Optional[str] = None


class RightPanelPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    action: Literal[
        "none",
        "open",
        "update",
        "replace",
        "highlight",
        "prompt_before_navigate",
    ] = "none"
    target: RightPanelTarget = Field(default_factory=RightPanelTarget)
    state: Dict[str, Any] = Field(default_factory=dict)
    prompt: Optional[Dict[str, Any]] = None
    pendingTarget: Optional[RightPanelTarget] = None


class OutputPanel(BaseModel):
    """
    Server → client UI snapshot: same keys as ``inputPanel`` on ``EVAClientRequest`` (``render``, ``rightPanel``),
    with typed payloads for the governed chat turn.
    """

    model_config = ConfigDict(extra="allow")

    render: RenderPayload = Field(default_factory=RenderPayload)
    rightPanel: RightPanelPayload = Field(default_factory=RightPanelPayload)


class EVAServiceResponse(BaseModel):
    """
    Service → client governed turn.

    Panel output lives under ``outputPanel`` (mirror of request ``inputPanel``).

    Common **metadata** keys (flat on ``metadata``):
    - ``chosen_skill_id``: skill this **response** is grounded on (UI, right-panel hints). Same as the skill-selection LLM pick when that step returned ``use_skill`` (often absent for ``ambiguous`` / ``no_match``).
    - ``display``: EMR-facing hints from the orchestrator (and defaults on error): ``scenario``, ``left_panel_instruction``, ``right_panel_instruction``, ``suggested_chip_labels``. Use these for host chrome; ``outputPanel`` holds the concrete blocks and right-panel hints.
    - ``pipeline``: under chat, ``routing`` (stage 1) + ``orchestrator`` (stage 2 LLM trace) when applicable; plus ``router_rationale`` may be copied onto ``metadata`` for convenience.
    """

    model_config = ConfigDict(extra="allow")

    messageType: Literal["EVAServiceResponse"] = "EVAServiceResponse"
    version: str = "1.0"
    requestId: Optional[str] = None
    responseId: Optional[str] = None
    timestamp: Optional[str] = None
    status: Literal["success", "error", "clarify"] = "success"
    conversation: ConversationPayload = Field(default_factory=ConversationPayload)
    outputPanel: OutputPanel = Field(default_factory=OutputPanel)
    clientStatePatch: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EVASkillResolutionResponse(BaseModel):
    """
    Stage 1 — **skill resolution**: retrieval (vector similarity over knowledge chunks) + classifier LLM
    that binds the user request to a registry skill (or no_match / ambiguous).

    REST: ``POST /api/eva/skill-resolution`` (request body still ``EVAClientRequest``).
    Full governed UI turn: ``POST /api/eva/chat`` → ``EVAServiceResponse``.
    """

    model_config = ConfigDict(extra="allow")

    messageType: Literal["EVASkillResolutionResponse"] = "EVASkillResolutionResponse"
    version: str = "1.0"
    requestId: Optional[str] = None
    responseId: Optional[str] = None
    timestamp: Optional[str] = None
    status: Literal["success", "error", "clarify"] = "success"
    router_decision: str = Field(
        default="",
        description="use_skill | no_match | ambiguous (from skill router).",
    )
    chosen_skill_id: Optional[str] = Field(
        default=None,
        description="Skill id for this resolution when use_skill (same value the skill-selection LLM chose; see pipeline.comparison.llm_chosen_skill_id).",
    )
    router_rationale: str = ""
    clarify_prompt: Optional[str] = Field(
        default=None,
        description="When status is clarify, the question to show the user.",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Includes pipeline.vectorSearch, pipeline.skillRouter (LLM skill-selection trace), pipeline.comparison.",
    )
