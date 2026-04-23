/** POC mirror of backend EVAClientRequest / EVAServiceResponse (subset). */

export type EVAClientRequest = {
  messageType: 'EVAClientRequest';
  version: string;
  requestId?: string;
  timestamp?: string;
  query: { type?: string; rawInput: string };
  inputPanel: {
    render?: Record<string, unknown>;
    rightPanel?: Record<string, unknown>;
  };
};

export type RenderBlock = {
  id: string;
  type: string;
  component: string;
  props?: Record<string, unknown>;
};

/** Orchestrator / server hints for host EMR: what to emphasize left vs right. */
export type EVAMetadataDisplay = {
  scenario?: 'success' | 'clarify' | 'no_match' | 'error' | string;
  left_panel_instruction?: string;
  right_panel_instruction?: string;
  suggested_chip_labels?: string[];
};

/** Mirrors `inputPanel` on the request: concrete render tree + right-panel hints for this turn. */
export type EVAOutputPanel = {
  render?: { layoutMode?: string; blocks?: RenderBlock[] };
  rightPanel?: {
    action?: string;
    target?: { screen?: string; subScreen?: string; entityType?: string; entityId?: string };
    state?: Record<string, unknown>;
    prompt?: Record<string, unknown>;
    pendingTarget?: Record<string, unknown>;
  };
};

/** Stage 1 — skill resolution: vector search + skill-router LLM (no full UI orchestration). */
export type EVASkillResolutionResponse = {
  messageType: 'EVASkillResolutionResponse';
  version: string;
  requestId?: string | null;
  responseId?: string | null;
  timestamp?: string | null;
  status: string;
  router_decision: string;
  chosen_skill_id?: string | null;
  router_rationale?: string;
  clarify_prompt?: string | null;
  metadata?: Record<string, unknown>;
};

export type EVAServiceResponse = {
  messageType: 'EVAServiceResponse';
  version: string;
  requestId?: string | null;
  responseId?: string | null;
  timestamp?: string | null;
  status: string;
  conversation?: {
    message?: { text?: string; role?: string };
  };
  outputPanel?: EVAOutputPanel;
  metadata?: Record<string, unknown> & {
    display?: EVAMetadataDisplay;
    chosen_skill_id?: string | null;
    router_rationale?: string;
  };
};
