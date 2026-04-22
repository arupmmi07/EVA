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


class EVAServiceResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    messageType: Literal["EVAServiceResponse"] = "EVAServiceResponse"
    version: str = "1.0"
    requestId: Optional[str] = None
    responseId: Optional[str] = None
    timestamp: Optional[str] = None
    status: Literal["success", "error", "clarify"] = "success"
    conversation: ConversationPayload = Field(default_factory=ConversationPayload)
    render: RenderPayload = Field(default_factory=RenderPayload)
    rightPanel: RightPanelPayload = Field(default_factory=RightPanelPayload)
    clientStatePatch: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
