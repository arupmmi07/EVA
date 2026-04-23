import { useEffect, useMemo, useRef, useState } from 'react';
import type { MomentId } from '@/moments/momentTypes';
import { getMomentUiConfig } from '@/moments/momentConfig';
import { getInitialChatItems } from '@/moments/initialChats';
import type { ChatItem, HeaderMode, PanelMode, SchedulerExpandedPanel, WorkflowStage } from '../types';
import { EVA_TIMESTAMP, FINAL_CLARIFICATION, INITIAL_CHIEF_COMPLAINT } from '../constants';
import {
  SC2_EVA_REPLY,
  SC4_GOOD_NEWS,
  SC6_SAM_MOVED,
  SC7_SCHEDULE_CHANGES_CHAT_FIELDS,
  SC9_NEW_PATIENT,
  MOVE_SAM_PREFIX,
} from '../constants/schedulerCopy';
import type { UnconfirmedId } from '../scheduler/schedulerData';
import type { SchedulerToast } from '../scheduler/SchedulerRightPane';
import { COMORBIDITIES_CHIP, getActiveCtaHints, getChatSuggestionChips } from '../utils/ctaHints';
import { normalizeText } from '../utils/format';
import { MOMENT3_CHECK_IN_CHIP } from '@/moments/moment3Copy';
import { isEvaBackendChatEnabled } from '../api/evaBackend';
import { appendFromEvaResponse, postEvaMessage } from '../api/postEvaMessage';
import { applyEvaRightPanelFromResponse } from '../orchestration/rightPanelOrchestrator';

/** Moment 2 — user free-text; matched with `normalizeText`. */
const M2_SLEEPING_POSITION_REMINDER_QUERY =
  'I have a question about sleeping position that I want to explore in person. Remind me to ask later in the session with Sarah.';

const SCHEDULER_SC1_CHIP_LABELS = [
  'Get updates from the weekend',
  'Request confirmations',
  'View details of unconfirmed',
] as const;

const SCHEDULER_SAM_DECISION_CHIP_LABELS = ['Move Sam to Potential No-show', 'Keep Sam as Unconfirmed'] as const;

/** Matches typed / pasted “today’s” (ASCII or typographic apostrophe) and optional trailing `?`. */
const NEW_PATIENT_BRIEF_PHRASES = ["Brief me about today's new patient", 'Brief me about todays new patient'] as const;

function normalizeSchedulerUserPhrase(raw: string) {
  return normalizeText(
    raw
      .replace(/[\u2018\u2019\u201B\u2032]/g, "'")
      .replace(/\?+\s*$/u, '')
      .trim(),
  );
}

function isNewPatientBriefQuery(raw: string) {
  const n = normalizeSchedulerUserPhrase(raw);
  return NEW_PATIENT_BRIEF_PHRASES.some((p) => n === normalizeSchedulerUserPhrase(p));
}

export function useEvaWorkflow({ momentId }: { momentId: MomentId }) {
  const momentUi = useMemo(() => getMomentUiConfig(momentId), [momentId]);
  const [stage, setStage] = useState<WorkflowStage>(momentUi.initialStage);
  const [chatItems, setChatItems] = useState<ChatItem[]>(() => getInitialChatItems(momentId));
  const [chatInput, setChatInput] = useState('');
  const [referralOpen, setReferralOpen] = useState(false);
  const [topSetupVisible, setTopSetupVisible] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(274);
  const [showHighlight, setShowHighlight] = useState(false);
  const [sleepTableVisible, setSleepTableVisible] = useState(false);
  const [sleepDisturbanceAccepted, setSleepDisturbanceAccepted] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState(INITIAL_CHIEF_COMPLAINT);
  const [chiefComplaintFocused, setChiefComplaintFocused] = useState(false);
  const [clarificationApplied, setClarificationApplied] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>('both');
  const highlightTimerRef = useRef<number | null>(null);

  const [schedulerPanel, setSchedulerPanel] = useState<SchedulerExpandedPanel>('none');
  const [schedulerReminders, setSchedulerReminders] = useState<Record<UnconfirmedId, boolean>>({
    angela: false,
    maria: false,
    sam: false,
  });
  const [schedulerSamMoved, setSchedulerSamMoved] = useState(false);
  const [schedulerGoodNews, setSchedulerGoodNews] = useState(false);
  const [schedulerToasts, setSchedulerToasts] = useState<SchedulerToast[]>([]);
  const [m3CheckInInvoiceOpen, setM3CheckInInvoiceOpen] = useState(false);
  const [m3InvoiceInstanceKey, setM3InvoiceInstanceKey] = useState(0);
  const unconfirmedDetailsReplyShownRef = useRef(false);
  const scheduleDetailsReplyShownRef = useRef(false);
  const samMovedRef = useRef(false);
  const schedulerToastTimersRef = useRef<Map<string, number>>(new Map());

  const headerMode: HeaderMode = useMemo(() => {
    if (stage === 'summaryCustomizing') return 'setup';
    if (stage === 'finalized') return 'share';
    if (stage === 'session' || stage === 'sessionAccepted') return 'session-disabled';
    if (stage === 'sessionStopped') return 'session-active';
    return 'default';
  }, [stage]);

  useEffect(() => {
    if (!recordingActive || sessionPaused) return;
    const timer = window.setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [recordingActive, sessionPaused]);

  useEffect(() => {
    if (stage !== 'session' || !recordingActive || showHighlight) return;
    highlightTimerRef.current = window.setTimeout(() => {
      setShowHighlight(true);
    }, 10_000);
    return () => {
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    };
  }, [stage, recordingActive, showHighlight]);

  const suggestionButtons = useMemo(() => {
    if (stage === 'scheduler') {
      return [];
    }
    return getChatSuggestionChips({
      stage,
      referralOpen,
      topSetupVisible,
      recordingActive,
      sessionPaused,
      showHighlight,
      sleepTableVisible,
      sleepDisturbanceAccepted,
      schedulerGoodNews,
      schedulerSamMoved,
    });
  }, [
    stage,
    referralOpen,
    topSetupVisible,
    recordingActive,
    sessionPaused,
    showHighlight,
    sleepTableVisible,
    sleepDisturbanceAccepted,
    schedulerGoodNews,
    schedulerSamMoved,
  ]);

  const suggestionButtonsKey = useMemo(() => suggestionButtons.join('\u0001'), [suggestionButtons]);

  /** Keep suggestion chips in the scrollable transcript (not pinned above the composer). */
  useEffect(() => {
    if (stage === 'scheduler') return;
    if (suggestionButtons.length === 0) return;
    setChatItems((prev) => {
      const last = prev[prev.length - 1];
      if (last?.kind === 'suggestion-chips') {
        const prevKey = (last.suggestionLabels ?? []).join('\u0001');
        if (prevKey === suggestionButtonsKey) return prev;
        return [
          ...prev.slice(0, -1),
          {
            id: `suggest-${Date.now()}`,
            kind: 'suggestion-chips',
            suggestionLabels: [...suggestionButtons],
            timestamp: last.timestamp ?? EVA_TIMESTAMP,
          },
        ];
      }
      return [
        ...prev,
        {
          id: `suggest-${Date.now()}`,
          kind: 'suggestion-chips',
          suggestionLabels: [...suggestionButtons],
          timestamp: EVA_TIMESTAMP,
        },
      ];
    });
  }, [stage, suggestionButtonsKey, suggestionButtons]);

  const ctaHints = useMemo(
    () =>
      getActiveCtaHints({
        stage,
        referralOpen,
        topSetupVisible,
        recordingActive,
        sessionPaused,
        showHighlight,
        sleepTableVisible,
        sleepDisturbanceAccepted,
        schedulerGoodNews,
        schedulerSamMoved,
      }),
    [
      stage,
      referralOpen,
      topSetupVisible,
      recordingActive,
      sessionPaused,
      showHighlight,
      sleepTableVisible,
      sleepDisturbanceAccepted,
      schedulerGoodNews,
      schedulerSamMoved,
    ],
  );

  const saveDraftEnabled = stage === 'sessionStopped';
  const reviewEnabled = stage === 'sessionStopped';

  const appendChat = (item: ChatItem) => {
    setChatItems((prev) => [...prev, item]);
  };

  const openM3CheckIn = (options?: { withUserEcho?: boolean }) => {
    if (momentId !== 'moment3') return;
    if (m3CheckInInvoiceOpen) return;
    if (options?.withUserEcho) {
      appendChat({
        id: `user-m3-panel-${Date.now()}`,
        kind: 'user',
        content: MOMENT3_CHECK_IN_CHIP,
        timestamp: '07:47 am',
      });
    }
    setM3CheckInInvoiceOpen(true);
    setM3InvoiceInstanceKey((k) => k + 1);
    appendChat({
      id: `eva-m3-open-${Date.now()}`,
      kind: 'eva',
      content:
        "I've opened Sarah Chen's copay on the right ($25). Select the Visa card on file, then tap Collect $25.00. After payment clears, use Complete Checkin when it unlocks.",
      timestamp: '07:47 am',
    });
  };

  const completeM3CheckIn = () => {
    if (momentId !== 'moment3') return;
    setM3CheckInInvoiceOpen(false);
    appendChat({
      id: `eva-m3-done-${Date.now()}`,
      kind: 'eva',
      content: 'Check-in is complete. Sarah Chen is ready for the clinical team.',
      timestamp: '07:47 am',
    });
    if (stage === 'scheduler') {
      setSchedulerToasts((prev) => [
        ...prev,
        {
          id: `m3-checkin-${Date.now()}`,
          patientName: 'Sarah Chen',
          scheduleLine: '9 AM with Dr. Park',
          relativeTime: '1 min ago',
          headlineOverride: 'Sarah Chen checked in',
        },
      ]);
    }
  };

  /** Scheduler accordion only — use when EVA service drives UI (no scripted Eva follow-up messages). */
  const setSchedulerPanelDirect = (panel: SchedulerExpandedPanel) => {
    setSchedulerPanel(panel);
  };

  const handleSchedulerExpand = (panel: SchedulerExpandedPanel) => {
    setSchedulerPanel(panel);
    if (panel === 'unconfirmed' && !unconfirmedDetailsReplyShownRef.current) {
      unconfirmedDetailsReplyShownRef.current = true;
      appendChat({
        id: `eva-sc2-${Date.now()}`,
        kind: 'eva',
        content: SC2_EVA_REPLY,
        timestamp: '07:48 am',
      });
    }
    if (panel === 'scheduleChanges') {
      appendScheduleChangesEvaOnce();
    }
  };

  const appendScheduleChangesEvaOnce = () => {
    if (scheduleDetailsReplyShownRef.current) return;
    scheduleDetailsReplyShownRef.current = true;
    appendChat({
      id: `eva-sc7-${Date.now()}`,
      kind: 'eva',
      ...SC7_SCHEDULE_CHANGES_CHAT_FIELDS,
      timestamp: '07:49 am',
    });
    appendChat({
      id: `sc7-newpt-chips-${Date.now()}`,
      kind: 'suggestion-chips',
      suggestionLabels: [NEW_PATIENT_BRIEF_PHRASES[0]],
      timestamp: '07:49 am',
    });
  };

  const appendScheduleReplyOnly = () => {
    appendScheduleChangesEvaOnce();
  };

  const markSamNoShow = () => {
    if (samMovedRef.current) return;
    samMovedRef.current = true;
    setSchedulerSamMoved(true);
    setSchedulerPanel('potentialNoShow');
    appendChat({
      id: `eva-sc6-${Date.now()}`,
      kind: 'eva',
      content: SC6_SAM_MOVED,
      timestamp: '07:49 am',
    });
  };

  const { angela: remAngela, maria: remMaria, sam: remSam } = schedulerReminders;
  const allSchedulerRemindersSent = remAngela && remMaria && remSam;

  useEffect(() => {
    if (momentId !== 'moment1') return;
    if (stage !== 'scheduler' || schedulerSamMoved || schedulerGoodNews) return;
    if (!allSchedulerRemindersSent) return;
    const timer = window.setTimeout(() => {
      setSchedulerGoodNews(true);
      setSchedulerToasts([
        {
          id: 'toast-angela',
          patientName: 'Angela Wu',
          scheduleLine: '10 AM with Dr. Kumar',
          relativeTime: '1 min ago',
        },
        {
          id: 'toast-maria',
          patientName: 'Maria Santos',
          scheduleLine: '1:00 PM with Dr. Aris',
          relativeTime: '1 min ago',
        },
      ]);
      setChatItems((prev) => [
        ...prev,
        {
          id: `eva-sc4-${Date.now()}`,
          kind: 'eva',
          content: SC4_GOOD_NEWS,
          timestamp: '07:48 am',
        },
        {
          id: `sc4-chips-${Date.now()}`,
          kind: 'suggestion-chips',
          suggestionLabels: [...SCHEDULER_SAM_DECISION_CHIP_LABELS],
          timestamp: '07:48 am',
        },
      ]);
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [momentId, stage, schedulerSamMoved, schedulerGoodNews, allSchedulerRemindersSent]);

  const resendSchedulerReminder = (id: UnconfirmedId) => {
    setSchedulerReminders((prev) => ({ ...prev, [id]: true }));
  };

  const dismissSchedulerToast = (id: string) => {
    setSchedulerToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const map = schedulerToastTimersRef.current;
    const idsPresent = new Set(schedulerToasts.map((t) => t.id));

    for (const [id, handle] of [...map.entries()]) {
      if (!idsPresent.has(id)) {
        window.clearTimeout(handle);
        map.delete(id);
      }
    }

    for (const t of schedulerToasts) {
      if (map.has(t.id)) continue;
      const handle = window.setTimeout(() => {
        map.delete(t.id);
        setSchedulerToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5_000);
      map.set(t.id, handle);
    }
  }, [schedulerToasts]);

  useEffect(() => {
    return () => {
      schedulerToastTimersRef.current.forEach((h) => window.clearTimeout(h));
      schedulerToastTimersRef.current.clear();
    };
  }, []);

  const openSummary = (opts?: { userMessage?: ChatItem }) => {
    if (!['dashboard', 'scheduler', 'summary'].includes(stage)) return;

    const insightItem: ChatItem = {
      id: `insight-${Date.now()}`,
      kind: 'insight',
      timestamp: EVA_TIMESTAMP,
      content:
        "I've pulled these insights from Sarah's pre-visit surveys.\n\nHigh Fear-Avoidance: Patient may require extra verbal cueing and reassurance during PROM to manage protective guarding.\nSource: pre-eval survey TSK-11\n\nGoal Mismatch: Patient expects to return to high-level gardening within 6 weeks, but current DASH score suggests significant functional deficit. Recommend setting intermediate 'micro-goals' to manage expectations.\n\nWould you like to start the session or review intake?",
    };
    const evaItem: ChatItem = {
      id: `eva-summary-${Date.now()}`,
      kind: 'eva',
      timestamp: EVA_TIMESTAMP,
      content:
        'Sure let me bring Sarah Chen profile before we start the session. You can check her profile right here →',
    };
    const user = opts?.userMessage;

    if (stage === 'scheduler') {
      setSchedulerPanel('none');
    }
    /** Always extend the transcript — do not replace history when opening Patient Summary. */
    setChatItems((prev) => [...prev, ...(user ? [user] : []), insightItem, evaItem]);
    setStage('summary');
  };

  const openSummaryFromUser = () => {
    if (!['dashboard', 'scheduler', 'summary'].includes(stage)) return;
    openSummary({
      userMessage: {
        id: `user-open-summary-${Date.now()}`,
        kind: 'user',
        content: 'Open pre visit summary',
        timestamp: '07:53 PM',
      },
    });
  };

  const closeReferral = () => {
    setReferralOpen(false);
    setTopSetupVisible(true);
    setStage('summaryCustomizing');
  };

  const resolveCustomization = () => {
    setTopSetupVisible(false);
    setStage('summaryReady');
  };

  const answerComorbidities = () => {
    if (!['summary', 'summaryCustomizing', 'summaryReady', 'summaryAnswered'].includes(stage)) return;
    if (stage === 'summaryAnswered') return;
    setStage('summaryAnswered');
    appendChat({
      id: `user-comorb-${Date.now()}`,
      kind: 'user',
      content: 'Any comorbidities I should be aware of?',
      timestamp: '07:53 PM',
    });
    appendChat({
      id: `eva-comorb-${Date.now()}`,
      kind: 'eva',
      timestamp: EVA_TIMESTAMP,
      content:
        "None documented. Past medical history states no significant history. Prognosis is good given her motivation and no complicating factors.\n\nIs there anything else you'd like to know before you begin your session?",
    });
  };

  const beginSession = (includeUserMessage = true) => {
    if (!['summary', 'summaryReady', 'summaryAnswered'].includes(stage)) return;
    setStage('session');
    setRecordingActive(true);
    setSessionPaused(false);
    if (includeUserMessage) {
      appendChat({
        id: `user-begin-${Date.now()}`,
        kind: 'user',
        content: 'Begin Session',
        timestamp: '07:53 PM',
      });
    }
    appendChat({
      id: `eva-begin-${Date.now()}`,
      kind: 'eva',
      timestamp: EVA_TIMESTAMP,
      content:
        "I've pre-filled initial intake details into the note. I'll continue capturing as you speak. You can start naturally. I'm listening..",
    });
    appendChat({
      id: `widget-${Date.now()}`,
      kind: 'session-widget',
      timestamp: EVA_TIMESTAMP,
    });
  };

  const acceptSleepSuggestion = () => {
    setSleepTableVisible(false);
    setSleepDisturbanceAccepted(true);
    setStage('sessionAccepted');
  };

  const stopSession = () => {
    setRecordingActive(false);
    setSessionPaused(false);
    setPanelMode('rightOnly');
    setStage('sessionStopped');
  };

  const finalizeReview = () => {
    if (!reviewEnabled) return;
    setStage('finalized');
  };

  const submitChat = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setChatInput('');
    const normalized = normalizeText(text);

    if (isEvaBackendChatEnabled()) {
      const ts = stage === 'scheduler' ? ('07:48 am' as const) : ('07:53 PM' as const);
      void (async () => {
        appendChat({ id: `user-be-${Date.now()}`, kind: 'user', content: text, timestamp: ts });
        try {
          const res = await postEvaMessage(text, {
            stage,
            momentId,
            panelMode,
            schedulerPanel,
          });
          appendFromEvaResponse(appendChat, res);
          applyEvaRightPanelFromResponse(res, { stage, setSchedulerPanelDirect });
        } catch (e) {
          appendChat({
            id: `eva-be-err-${Date.now()}`,
            kind: 'eva',
            content: `EVA service: ${e instanceof Error ? e.message : String(e)}`,
            timestamp: ts,
          });
        }
      })();
      return;
    }

    if (stage === 'scheduler') {
      if (momentId === 'moment3' && (normalized === 'check in' || normalized === normalizeText(MOMENT3_CHECK_IN_CHIP))) {
        appendChat({ id: `user-m3-${Date.now()}`, kind: 'user', content: text, timestamp: '07:47 am' });
        openM3CheckIn();
        return;
      }

      if (normalized === 'open pre visit summary') {
        openSummaryFromUser();
        return;
      }

      appendChat({ id: `user-${Date.now()}`, kind: 'user', content: text, timestamp: '07:48 am' });

      const unconfirmedPhrase = normalizeText('Give me more details about the Unconfirmed Appointments');
      const schedulePhrase = normalizeText('Give me an update on schedule changes for the next 72 hrs');
      const moveSamNorm = normalizeText(MOVE_SAM_PREFIX);

      if (normalized === unconfirmedPhrase || normalized === normalizeText('View details of unconfirmed')) {
        handleSchedulerExpand('unconfirmed');
        return;
      }
      if (normalized === schedulePhrase) {
        handleSchedulerExpand('scheduleChanges');
        return;
      }
      if (isNewPatientBriefQuery(text)) {
        appendChat({
          id: `eva-sc9-${Date.now()}`,
          kind: 'eva',
          content: SC9_NEW_PATIENT,
          timestamp: '07:49 am',
        });
        return;
      }
      if (normalized.startsWith(moveSamNorm)) {
        markSamNoShow();
        if (normalized.includes('weekend') || normalized.includes('schedule')) {
          appendScheduleReplyOnly();
        }
        return;
      }

      appendChat({
        id: `eva-sched-fallback-${Date.now()}`,
        kind: 'eva',
        content: "I'm on it — tell me if you'd like schedule, patients, or confirmations next.",
        timestamp: '07:48 am',
      });
      return;
    }

    if ((stage === 'dashboard' || stage === 'summary') && normalized === 'open pre visit summary') {
      openSummary({
        userMessage: { id: `user-open-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' },
      });
      return;
    }

    if (
      ['summary', 'summaryCustomizing', 'summaryReady', 'summaryAnswered'].includes(stage) &&
      normalized === 'begin session'
    ) {
      appendChat({ id: `user-begin-chat-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' });
      beginSession(false);
      return;
    }

    if (
      ['summary', 'summaryCustomizing', 'summaryReady', 'summaryAnswered'].includes(stage) &&
      normalized === normalizeText(COMORBIDITIES_CHIP)
    ) {
      answerComorbidities();
      return;
    }

    if (normalized === 'view referral document' && ['summary', 'summaryReady', 'summaryAnswered'].includes(stage) && !referralOpen) {
      setReferralOpen(true);
      return;
    }

    if (normalized === 'close referral' && referralOpen) {
      closeReferral();
      return;
    }

    if (normalized === 'save as default' && stage === 'summaryCustomizing' && topSetupVisible) {
      resolveCustomization();
      return;
    }

    if (normalized === 'add sleep disturbance' && stage === 'session' && recordingActive && showHighlight && !sleepTableVisible) {
      setSleepTableVisible(true);
      return;
    }

    if (normalized === 'accept sleep details' && sleepTableVisible) {
      acceptSleepSuggestion();
      return;
    }

    if (normalized === 'stop session' && (stage === 'session' || stage === 'sessionAccepted') && recordingActive) {
      stopSession();
      return;
    }

    if (normalized === 'review & finalise' && stage === 'sessionStopped' && reviewEnabled) {
      finalizeReview();
      return;
    }

    if (stage === 'finalized' && normalized === 'share with patient') {
      appendChat({ id: `user-share-type-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' });
      appendChat({
        id: `eva-share-type-${Date.now()}`,
        kind: 'eva',
        content: 'Opening share options for the patient portal.',
        timestamp: EVA_TIMESTAMP,
      });
      return;
    }

    if (stage === 'finalized' && normalized === FINAL_CLARIFICATION) {
      appendChat({ id: `user-fix-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' });
      appendChat({
        id: `eva-fix-${Date.now()}`,
        kind: 'eva',
        content: 'Updated pain details.',
        timestamp: EVA_TIMESTAMP,
      });
      appendChat({
        id: `eva-verify-${Date.now()}`,
        kind: 'prompt',
        content: 'Do you want to verify Complete Source details?',
        timestamp: EVA_TIMESTAMP,
      });
      setClarificationApplied(true);
      return;
    }

    if (momentId === 'moment2' && normalized === normalizeText(M2_SLEEPING_POSITION_REMINDER_QUERY)) {
      appendChat({ id: `user-m2-sleep-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' });
      appendChat({
        id: `eva-m2-sleep-${Date.now()}`,
        kind: 'eva',
        content: 'Noted. Will remind you about asking the question about sleeping position later.',
        timestamp: EVA_TIMESTAMP,
      });
      appendChat({
        id: `m2-reminder-card-${Date.now()}`,
        kind: 'inline-reminder-card',
        content: 'Ask Sarah Chen about Sleeping Position',
        timestamp: EVA_TIMESTAMP,
      });
      return;
    }

    appendChat({ id: `user-generic-${Date.now()}`, kind: 'user', content: text, timestamp: '07:53 PM' });
  };

  const togglePause = () => {
    if (!recordingActive) return;
    setSessionPaused((prev) => !prev);
  };

  const appendUserChipEcho = (content: string, timestamp: '07:48 am' | '07:53 PM' = '07:53 PM') => {
    appendChat({
      id: `user-chip-${Date.now()}`,
      kind: 'user',
      content,
      timestamp,
    });
  };

  const selectSuggestion = (label: string) => {
    if (stage === 'scheduler') {
      appendUserChipEcho(label, '07:48 am');
      if (label === 'View details of unconfirmed') {
        handleSchedulerExpand('unconfirmed');
        return;
      }
      if (label === 'Get updates from the weekend') {
        handleSchedulerExpand('scheduleChanges');
        return;
      }
      if (label === NEW_PATIENT_BRIEF_PHRASES[0]) {
        appendChat({
          id: `eva-sc9-${Date.now()}`,
          kind: 'eva',
          content: SC9_NEW_PATIENT,
          timestamp: '07:49 am',
        });
        return;
      }
      if (label === 'Request confirmations') {
        appendChat({
          id: `eva-req-${Date.now()}`,
          kind: 'eva',
          content:
            "I've sent confirmation requests to the unconfirmed appointments. I'll notify you if anything changes.",
          timestamp: '07:48 am',
        });
        return;
      }
      if (label === 'Move Sam to Potential No-show') {
        markSamNoShow();
        return;
      }
      if (label === 'Keep Sam as Unconfirmed') {
        appendChat({
          id: `eva-keep-sam-${Date.now()}`,
          kind: 'eva',
          content: "Understood — I'll keep Sam Greene on the unconfirmed list for now.",
          timestamp: '07:48 am',
        });
        return;
      }
      return;
    }

    if (label === 'Open pre visit summary') {
      openSummaryFromUser();
      return;
    }
    if (label === 'Begin Session') {
      beginSession();
      return;
    }
    if (label === 'View referral document') {
      appendUserChipEcho(label);
      setReferralOpen(true);
      return;
    }
    if (label === 'Close referral') {
      appendUserChipEcho(label);
      closeReferral();
      return;
    }
    if (label === 'Save as Default') {
      appendUserChipEcho(label);
      resolveCustomization();
      return;
    }
    if (label === COMORBIDITIES_CHIP) {
      answerComorbidities();
      return;
    }
    if (label === 'Add sleep disturbance') {
      appendUserChipEcho(label);
      setSleepTableVisible(true);
      return;
    }
    if (label === 'Accept sleep details') {
      appendUserChipEcho(label);
      acceptSleepSuggestion();
      return;
    }
    if (label === 'Stop session') {
      appendUserChipEcho(label);
      stopSession();
      return;
    }
    if (label === 'Review & Finalise') {
      appendUserChipEcho(label);
      finalizeReview();
      return;
    }
    if (label === 'Share with patient') {
      appendChat({ id: `user-share-${Date.now()}`, kind: 'user', content: label, timestamp: '07:53 PM' });
      appendChat({
        id: `eva-share-${Date.now()}`,
        kind: 'eva',
        content: 'Opening share options for the patient portal.',
        timestamp: EVA_TIMESTAMP,
      });
      return;
    }
    submitChat(label);
  };

  const mentionVisible = chiefComplaint.includes('@');

  const shellSchedulerChrome = momentUi.shellSchedulerChrome || stage === 'scheduler';

  /** Match `figma-make-moment3` Headerv2: workspace title at every stage. */
  const headerTitle = momentUi.workspaceTitle;

  const handleChiefComplaintChange = (value: string) => {
    setChiefComplaint(value);
  };

  const insertMention = (value: string) => {
    setChiefComplaint((prev) => prev.replace(/@[^ ]*$/, value));
  };

  const dismissClinicalTags = () => {
    setChiefComplaint((prev) => prev.replace(/@[^ ]*$/, ''));
  };

  return {
    evaApiLive: isEvaBackendChatEnabled(),
    stage,
    chatItems,
    chatInput,
    setChatInput,
    referralOpen,
    setReferralOpen,
    topSetupVisible,
    recordingActive,
    sessionPaused,
    sessionSeconds,
    showHighlight,
    sleepTableVisible,
    setSleepTableVisible,
    sleepDisturbanceAccepted,
    chiefComplaint,
    chiefComplaintFocused,
    setChiefComplaintFocused,
    mentionVisible,
    clarificationApplied,
    panelMode,
    setPanelMode,
    headerMode,
    suggestionButtons,
    saveDraftEnabled,
    reviewEnabled,
    submitChat,
    selectSuggestion,
    openSummaryFromUser,
    closeReferral,
    resolveCustomization,
    beginSession,
    acceptSleepSuggestion,
    stopSession,
    finalizeReview,
    togglePause,
    handleChiefComplaintChange,
    insertMention,
    dismissClinicalTags,
    leftPanelCollapsed: panelMode === 'rightOnly',
    ctaHints,
    schedulerPanel,
    schedulerReminders,
    schedulerSamMoved,
    schedulerGoodNews,
    schedulerToasts,
    expandSchedulerPanel: handleSchedulerExpand,
    setSchedulerPanelDirect,
    resendSchedulerReminder,
    markSamNoShow,
    dismissSchedulerToast,
    headerTitle,
    momentUi,
    shellSchedulerChrome,
    momentId,
    m3CheckInInvoiceOpen,
    m3InvoiceInstanceKey,
    openM3CheckIn,
    completeM3CheckIn,
  };
}
