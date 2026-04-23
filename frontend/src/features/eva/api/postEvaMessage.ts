import type { ChatItem } from '../types';
import type { EVAClientRequest, EVAServiceResponse } from './evaContracts';

export async function postEvaMessage(
  rawInput: string,
  ctx: {
    stage: string;
    momentId: string;
    panelMode: string;
    schedulerPanel: string;
  },
): Promise<EVAServiceResponse> {
  const body: EVAClientRequest = {
    messageType: 'EVAClientRequest',
    version: '1.0',
    requestId: `req_${Date.now()}`,
    timestamp: new Date().toISOString(),
    query: { type: 'text', rawInput },
    inputPanel: {
      render: {
        workflowStage: ctx.stage,
        momentId: ctx.momentId,
        panelMode: ctx.panelMode,
      },
      rightPanel: {
        screen: ctx.stage === 'scheduler' ? 'scheduler' : ctx.stage,
        subScreen: ctx.schedulerPanel === 'none' ? 'default' : ctx.schedulerPanel,
        hasUnsavedWork: false,
      },
    },
  };
  const r = await fetch('/api/eva/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${r.status} ${t.slice(0, 200)}`);
  }
  return (await r.json()) as EVAServiceResponse;
}

export function appendFromEvaResponse(append: (item: ChatItem) => void, res: EVAServiceResponse) {
  const parts: string[] = [];
  for (const block of res.outputPanel?.render?.blocks ?? []) {
    if (block.type === 'text' && block.props && typeof block.props.text === 'string') {
      parts.push(block.props.text);
    }
  }
  const text =
    parts.join('\n\n') ||
    (typeof res.conversation?.message?.text === 'string' ? res.conversation.message.text : '') ||
    '(empty response)';
  append({
    id: `eva-be-${Date.now()}`,
    kind: 'eva',
    content: text,
    timestamp: '07:48 am',
  });
  const chips = (res.outputPanel?.render?.blocks ?? []).find((b) => b.type === 'actionChips');
  const actions = chips?.props?.actions as { label?: string }[] | undefined;
  if (actions?.length) {
    append({
      id: `eva-be-chips-${Date.now()}`,
      kind: 'suggestion-chips',
      suggestionLabels: actions.map((a) => a.label ?? '').filter(Boolean),
      timestamp: '07:48 am',
    });
  }
}
