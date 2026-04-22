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
  render?: { blocks?: RenderBlock[] };
  rightPanel?: {
    action?: string;
    target?: { screen?: string; subScreen?: string; entityType?: string; entityId?: string };
    state?: Record<string, unknown>;
    prompt?: Record<string, unknown>;
    pendingTarget?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
};
