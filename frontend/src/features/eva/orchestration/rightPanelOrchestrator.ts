/**
 * POC client-side "Panel Coordinator" lite: maps EVAServiceResponse.outputPanel.rightPanel
 * onto the existing scheduler accordion state (no MFE shell yet).
 *
 * Later: shell listens for events, loads MFEs, and runs full navigation.
 */

import type { EVAServiceResponse } from '../api/evaContracts';
import type { SchedulerExpandedPanel, WorkflowStage } from '../types';

/** Maps service `target.subScreen` strings to demo scheduler accordions. */
const SUBSCREEN_TO_SCHEDULER_PANEL: Record<string, SchedulerExpandedPanel> = {
  none: 'none',
  default: 'none',
  dayView: 'none',
  unconfirmed: 'unconfirmed',
  scheduleChanges: 'scheduleChanges',
  potentialNoShow: 'potentialNoShow',
  todaysPatients: 'todaysPatients',
  appointmentComposer: 'todaysPatients',
  unansweredMessages: 'unansweredMessages',
  outstandingCopays: 'outstandingCopays',
};

export type RightPanelOrchestratorContext = {
  stage: WorkflowStage;
  /** Updates accordion only — does not fire scripted Eva chat side-effects. */
  setSchedulerPanelDirect: (panel: SchedulerExpandedPanel) => void;
};

/**
 * Applies declarative right-panel hints when the user is on the scheduler stage.
 * Ignores `prompt_before_navigate` until unsaved-work UX is wired (logs only).
 */
export function applyEvaRightPanelFromResponse(
  res: EVAServiceResponse,
  ctx: RightPanelOrchestratorContext,
): void {
  const rp = res.outputPanel?.rightPanel;
  if (!rp || rp.action === 'none') return;
  if (ctx.stage !== 'scheduler') return;

  if (rp.action === 'prompt_before_navigate') {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info('[EVA rightPanel] prompt_before_navigate (not applied in POC UI)', rp);
    }
    return;
  }

  if (!['highlight', 'update', 'open', 'replace'].includes(rp.action)) return;

  const sub = typeof rp.target?.subScreen === 'string' ? rp.target.subScreen : 'default';
  const panel = SUBSCREEN_TO_SCHEDULER_PANEL[sub] ?? 'none';
  ctx.setSchedulerPanelDirect(panel);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[EVA rightPanel] applied', { action: rp.action, subScreen: sub, panel });
  }
}
