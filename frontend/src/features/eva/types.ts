export type WorkflowStage =
  | 'scheduler'
  | 'dashboard'
  | 'summary'
  | 'summaryCustomizing'
  | 'summaryReady'
  | 'summaryAnswered'
  | 'session'
  | 'sessionAccepted'
  | 'sessionStopped'
  | 'finalized';

export type ChatKind =
  | 'eva'
  | 'user'
  | 'patient-card'
  | 'insight'
  | 'session-widget'
  | 'prompt'
  | 'cascade-unconfirmed-card'
  | 'cascade-noshow-card'
  /** Moment3: Sarah Chen check-in row card (not a suggestion chip). */
  | 'new-patient-checkin-card'
  /** Moment2: “New Reminder” row under Eva (bell + line + View all). */
  | 'inline-reminder-card'
  /** Inline “Suggested actions” chips; scrolls with the thread (scheduler + main workflow). */
  | 'suggestion-chips';

/** Right pane accordion when `stage === 'scheduler'`. */
export type SchedulerExpandedPanel =
  | 'none'
  | 'unconfirmed'
  | 'potentialNoShow'
  | 'scheduleChanges'
  | 'todaysPatients'
  | 'unansweredMessages'
  | 'outstandingCopays';

export type PanelMode = 'both' | 'leftOnly' | 'rightOnly';

export type HeaderMode = 'default' | 'setup' | 'session-disabled' | 'session-active' | 'share';

export interface ChatItem {
  id: string;
  kind: ChatKind;
  content?: string;
  /**
   * When true, `content` is trusted HTML (e.g. `<b>` from app copy). Rendered only for Eva bubbles.
   */
  contentIsHtml?: boolean;
  timestamp?: string;
  /** Required when `kind === 'suggestion-chips'`. */
  suggestionLabels?: string[];
}
