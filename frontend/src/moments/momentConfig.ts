import type { WorkflowStage } from '@/features/eva/types';
import type { MomentId, SchedulerRightSlot } from './momentTypes';

export type MomentUiConfig = {
  id: MomentId;
  /** Workflow stage when the moment loads. */
  initialStage: WorkflowStage;
  /** Right column when `stage === 'scheduler'`. */
  schedulerRightSlot: SchedulerRightSlot;
  /** Clinician moment: summary-only right pane until session; then SOAP-only (same route as stacked layout). */
  clinicalDualRight: boolean;
  /** Use scheduler-style chrome (tinted chat column + light right pane) for the whole moment. */
  shellSchedulerChrome: boolean;
  /** App header label when not in session/share modes. */
  workspaceTitle: string;
};

export function getMomentUiConfig(id: MomentId): MomentUiConfig {
  switch (id) {
    case 'moment1':
      return {
        id,
        initialStage: 'scheduler',
        schedulerRightSlot: 'calendar',
        clinicalDualRight: false,
        shellSchedulerChrome: false,
        workspaceTitle: '',
      };
    case 'moment2':
      return {
        id,
        initialStage: 'summary',
        schedulerRightSlot: 'calendar',
        clinicalDualRight: true,
        shellSchedulerChrome: true,
        workspaceTitle: '',
      };
    case 'moment3':
      return {
        id,
        initialStage: 'scheduler',
        schedulerRightSlot: 'calendar',
        clinicalDualRight: false,
        shellSchedulerChrome: false,
        workspaceTitle: '',
      };
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
