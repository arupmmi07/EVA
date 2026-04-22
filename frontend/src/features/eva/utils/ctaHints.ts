import type { WorkflowStage } from '../types';

/** DOM / prop target ids for guided clicks */
export const CTA_HINT = {
  OPEN_PREVISIT_SUMMARY: 'open-previsit-summary',
  BEGIN_SESSION: 'begin-session',
  VIEW_REFERRAL: 'view-referral',
  CLOSE_REFERRAL: 'close-referral',
  SAVE_SETUP_DEFAULT: 'save-setup-default',
  SLEEP_POSITION: 'sleep-position',
  ACCEPT_SLEEP: 'accept-sleep',
  STOP_SESSION: 'stop-session',
  REVIEW_FINALIZE: 'review-finalize',
  SHARE_PATIENT: 'share-patient',
  /** Scheduler — same `ds-cta-highlight` treatment as other guided targets */
  SCHEDULER_GET_WEEKEND: 'scheduler-get-weekend',
  SCHEDULER_REQUEST_CONFIRMATIONS: 'scheduler-request-confirmations',
  SCHEDULER_VIEW_UNCONFIRMED: 'scheduler-view-unconfirmed',
  SCHEDULER_MOVE_SAM: 'scheduler-move-sam',
  SCHEDULER_KEEP_SAM: 'scheduler-keep-sam',
} as const;

export type CtaHintId = (typeof CTA_HINT)[keyof typeof CTA_HINT];

type CtaHintParams = {
  stage: WorkflowStage;
  referralOpen: boolean;
  topSetupVisible: boolean;
  recordingActive: boolean;
  sessionPaused: boolean;
  showHighlight: boolean;
  sleepTableVisible: boolean;
  sleepDisturbanceAccepted: boolean;
  schedulerGoodNews?: boolean;
  schedulerSamMoved?: boolean;
};

export function getActiveCtaHints(p: CtaHintParams): Set<CtaHintId> {
  const s = new Set<CtaHintId>();

  if (p.stage === 'scheduler') {
    const goodNews = p.schedulerGoodNews ?? false;
    const samMoved = p.schedulerSamMoved ?? false;
    if (goodNews && !samMoved) {
      s.add(CTA_HINT.SCHEDULER_MOVE_SAM);
      s.add(CTA_HINT.SCHEDULER_KEEP_SAM);
      return s;
    }
    s.add(CTA_HINT.SCHEDULER_GET_WEEKEND);
    s.add(CTA_HINT.SCHEDULER_REQUEST_CONFIRMATIONS);
    s.add(CTA_HINT.SCHEDULER_VIEW_UNCONFIRMED);
    return s;
  }

  if (p.stage === 'dashboard') {
    s.add(CTA_HINT.OPEN_PREVISIT_SUMMARY);
    return s;
  }

  if (p.referralOpen) {
    s.add(CTA_HINT.CLOSE_REFERRAL);
    return s;
  }

  if (p.stage === 'summaryCustomizing' && p.topSetupVisible) {
    s.add(CTA_HINT.SAVE_SETUP_DEFAULT);
    return s;
  }

  if (['summary', 'summaryReady', 'summaryAnswered'].includes(p.stage) && !p.topSetupVisible) {
    s.add(CTA_HINT.BEGIN_SESSION);
    s.add(CTA_HINT.VIEW_REFERRAL);
    return s;
  }

  if (p.stage === 'session' && p.recordingActive && !p.sessionPaused) {
    if (p.sleepTableVisible) {
      s.add(CTA_HINT.ACCEPT_SLEEP);
      return s;
    }
    if (p.showHighlight) {
      if (!p.sleepDisturbanceAccepted) {
        s.add(CTA_HINT.SLEEP_POSITION);
      }
      s.add(CTA_HINT.STOP_SESSION);
      return s;
    }
    return s;
  }

  if (p.stage === 'sessionAccepted' && p.recordingActive && !p.sessionPaused) {
    s.add(CTA_HINT.STOP_SESSION);
    return s;
  }

  if (p.stage === 'sessionStopped') {
    s.add(CTA_HINT.REVIEW_FINALIZE);
    return s;
  }

  if (p.stage === 'finalized') {
    s.add(CTA_HINT.SHARE_PATIENT);
    return s;
  }

  return s;
}

/** User-facing chat chip labels (must stay in sync with handlers in useEvaWorkflow). */
export const CHAT_CHIP_LABEL: Record<CtaHintId, string> = {
  [CTA_HINT.OPEN_PREVISIT_SUMMARY]: 'Open pre visit summary',
  [CTA_HINT.CLOSE_REFERRAL]: 'Close referral',
  [CTA_HINT.SAVE_SETUP_DEFAULT]: 'Save as Default',
  [CTA_HINT.VIEW_REFERRAL]: 'View referral document',
  [CTA_HINT.BEGIN_SESSION]: 'Begin Session',
  [CTA_HINT.SLEEP_POSITION]: 'Add sleep disturbance',
  [CTA_HINT.ACCEPT_SLEEP]: 'Accept sleep details',
  [CTA_HINT.STOP_SESSION]: 'Stop session',
  [CTA_HINT.REVIEW_FINALIZE]: 'Review & Finalise',
  [CTA_HINT.SHARE_PATIENT]: 'Share with patient',
  [CTA_HINT.SCHEDULER_GET_WEEKEND]: 'Get updates from the weekend',
  [CTA_HINT.SCHEDULER_REQUEST_CONFIRMATIONS]: 'Request confirmations',
  [CTA_HINT.SCHEDULER_VIEW_UNCONFIRMED]: 'View details of unconfirmed',
  [CTA_HINT.SCHEDULER_MOVE_SAM]: 'Move Sam to Potential No-show',
  [CTA_HINT.SCHEDULER_KEEP_SAM]: 'Keep Sam as Unconfirmed',
};

const CHAT_CHIP_ORDER: CtaHintId[] = [
  CTA_HINT.OPEN_PREVISIT_SUMMARY,
  CTA_HINT.CLOSE_REFERRAL,
  CTA_HINT.SAVE_SETUP_DEFAULT,
  CTA_HINT.VIEW_REFERRAL,
  CTA_HINT.BEGIN_SESSION,
  CTA_HINT.SLEEP_POSITION,
  CTA_HINT.ACCEPT_SLEEP,
  CTA_HINT.STOP_SESSION,
  CTA_HINT.REVIEW_FINALIZE,
  CTA_HINT.SHARE_PATIENT,
  CTA_HINT.SCHEDULER_GET_WEEKEND,
  CTA_HINT.SCHEDULER_REQUEST_CONFIRMATIONS,
  CTA_HINT.SCHEDULER_VIEW_UNCONFIRMED,
  CTA_HINT.SCHEDULER_MOVE_SAM,
  CTA_HINT.SCHEDULER_KEEP_SAM,
];

export const COMORBIDITIES_CHIP = 'Any comorbidities I should be aware of?';

const DASHBOARD_SECONDARY_CHIPS = [
  'Show me patient list',
  'Open patient profile',
  'Show pending notes',
  'Check flagged cases',
] as const;

/**
 * Left-panel suggestion chips: mirrors active CTA hints so "Begin Session" disappears once
 * the session starts, and the next actions match the current screen.
 */
export function getChatSuggestionChips(p: CtaHintParams): string[] {
  const hints = getActiveCtaHints(p);
  const fromHints = CHAT_CHIP_ORDER.filter((id) => hints.has(id)).map((id) => CHAT_CHIP_LABEL[id]);

  if (p.stage === 'dashboard') {
    return [...fromHints, ...DASHBOARD_SECONDARY_CHIPS];
  }

  const extras: string[] = [];

  const preSessionSummary =
    ['summary', 'summaryCustomizing', 'summaryReady', 'summaryAnswered'].includes(p.stage) &&
    !(p.stage === 'summaryCustomizing' && p.topSetupVisible);

  if ((p.stage === 'summary' || p.stage === 'summaryReady') && !p.referralOpen) {
    extras.push(COMORBIDITIES_CHIP);
  }

  if (preSessionSummary && !p.referralOpen) {
    extras.push('Show allergies');
  }

  return [...fromHints, ...extras];
}

export function chatChipLabelToCtaHint(label: string): CtaHintId | null {
  const entry = (Object.entries(CHAT_CHIP_LABEL) as [CtaHintId, string][]).find(([, l]) => l === label);
  return entry ? entry[0] : null;
}

export function ctaHighlightClass(
  isTargeted: boolean,
  rounded: 'pill' | 'button' | 'card' | 'circle' | 'none' = 'button',
) {
  if (!isTargeted) return '';
  const radius =
    rounded === 'pill'
      ? 'rounded-[var(--ds-radius-pill)]'
      : rounded === 'card'
        ? 'rounded-[var(--ds-radius-card)]'
        : rounded === 'circle'
          ? 'rounded-full'
          : rounded === 'button'
            ? 'rounded-[var(--ds-radius-button)]'
            : '';
  // return `ds-cta-highlight ${radius}`;
  return `${radius}`;
}
