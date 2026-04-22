import { useRef } from 'react';
import type { WorkflowStage } from '../../types';
import type { UnconfirmedId } from '../../scheduler/schedulerData';
import type { CtaHintId } from '../../utils/ctaHints';
import { SchedulerRightPane, type SchedulerToast } from '../../scheduler/SchedulerRightPane';
import { DashboardSurface } from '../dashboard/DashboardSurface';
import { FinalizedSurface } from '../finalized/FinalizedSurface';
import { ReferralDrawer } from '../summary/ReferralDrawer';
import { SummarySurface } from '../summary/SummarySurface';
import { SoapSurface } from '../soap/SoapSurface';
import { ClinicalSplitRightPane } from '@/moments/ClinicalSplitRightPane';
import { FrontDeskCheckInInvoice } from '@/moments/FrontDeskCheckInInvoice';
import { Moment3SchedulerHero } from '@/moments/Moment3SchedulerHero';
import type { RightPaneProps } from './rightPaneProps';

const CLINICAL_DUAL_STAGES: readonly WorkflowStage[] = [
  'summary',
  'summaryCustomizing',
  'summaryReady',
  'summaryAnswered',
  'session',
  'sessionAccepted',
  'sessionStopped',
];

export function RightPane(props: RightPaneProps) {
  const soapScrollRef = useRef<HTMLDivElement | null>(null);
  const {
    stage,
    referralOpen,
    topSetupVisible,
    recordingActive,
    sessionPaused,
    sessionSeconds,
    showHighlight,
    sleepTableVisible,
    sleepDisturbanceAccepted,
    chiefComplaint,
    chiefComplaintFocused,
    mentionVisible,
    clarificationApplied,
    leftPanelCollapsed,
    schedulerExpanded,
    schedulerReminders,
    schedulerSamMoved,
    schedulerGoodNews,
    schedulerToasts,
    onSchedulerExpand,
    onSchedulerResend,
    onSchedulerMarkSamNoShow,
    onSchedulerDismissToast,
    onOpenSummary,
    onOpenReferral,
    onCloseReferral,
    onBeginSession,
    onSleepPosition,
    onAcceptSleep,
    onPause,
    onStop,
    onChiefComplaintChange,
    onChiefComplaintFocus,
    onSelectMention,
    onDismissClinicalTags,
    ctaHints,
    clinicalDualRight,
    schedulerRightSlot,
    momentId,
    m3CheckInInvoiceOpen,
    m3InvoiceInstanceKey,
    onM3OpenCheckInFromPanel,
    onM3CompleteCheckIn,
  } = props;

  if (clinicalDualRight && CLINICAL_DUAL_STAGES.includes(stage)) {
    return <ClinicalSplitRightPane {...props} />;
  }

  if (stage === 'scheduler') {
    if (momentId === 'moment3' && m3CheckInInvoiceOpen) {
      return (
        <FrontDeskCheckInInvoice key={m3InvoiceInstanceKey} onCompleteCheckIn={onM3CompleteCheckIn} />
      );
    }
    if (schedulerRightSlot === 'invoice') {
      return (
        <div
          data-name="InvoiceSlotPlaceholder"
          className="flex h-full min-h-0 flex-col items-center justify-center gap-3 bg-transparent px-6 text-center font-['Inter',sans-serif]"
        >
          <p className="text-[15px] font-semibold text-[var(--ds-text-primary)]">Invoices</p>
          <p className="max-w-md text-[14px] leading-relaxed text-[var(--ds-text-secondary)]">
            Invoice slot is reserved for future moments.
          </p>
        </div>
      );
    }
    const schedulerPane = (
      <SchedulerRightPane
        expanded={schedulerExpanded}
        onExpand={onSchedulerExpand}
        remindersSent={schedulerReminders}
        onResendReminder={onSchedulerResend}
        samMovedToNoShow={schedulerSamMoved}
        onMarkSamNoShow={onSchedulerMarkSamNoShow}
        toasts={schedulerToasts}
        onDismissToast={onSchedulerDismissToast}
        goodNewsFired={schedulerGoodNews}
        onOpenPreVisitSummary={onOpenSummary}
      />
    );

    // if (momentId === 'moment3') {
    //   return (
    //     <div className="flex h-full min-h-0 flex-col overflow-hidden">
    //       <div className="shrink-0 px-5 pb-2 pt-5">
    //         <Moment3SchedulerHero onCheckIn={onM3OpenCheckInFromPanel} />
    //       </div>
    //       <div className="min-h-0 flex-1 overflow-hidden">{schedulerPane}</div>
    //     </div>
    //   );
    // }

    return schedulerPane;
  }

  if (stage === 'dashboard') {
    return (
      <div className="h-full overflow-y-auto" data-name="RightPaneDashboard">
        <DashboardSurface onOpenSummary={onOpenSummary} ctaHints={ctaHints} />
      </div>
    );
  }

  if (stage === 'finalized') {
    return (
      <div className="h-full overflow-y-auto" data-name="RightPaneFinalized">
        <FinalizedSurface clarificationApplied={clarificationApplied} />
      </div>
    );
  }

  if (stage === 'summary' || stage === 'summaryCustomizing' || stage === 'summaryReady' || stage === 'summaryAnswered') {
    return (
      <div
        className={`relative h-full px-3 py-3 ${referralOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}
        data-name="RightPaneSummary"
      >
        <SummarySurface
          disabledActions={topSetupVisible}
          topSetupVisible={topSetupVisible}
          answered={stage === 'summaryAnswered'}
          onOpenReferral={onOpenReferral}
          onBeginSession={() => onBeginSession()}
          ctaHints={ctaHints}
        />
        {referralOpen && <ReferralDrawer onClose={onCloseReferral} ctaHints={ctaHints} />}
      </div>
    );
  }

  return (
    <div ref={soapScrollRef} className="h-full overflow-y-auto px-3 py-3" data-name="RightPaneSoap">
      <div className="min-h-full rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[15px] shadow-[var(--ds-shadow-card)]">
        <SoapSurface
          stage={stage}
          recordingActive={recordingActive}
          sessionPaused={sessionPaused}
          sessionSeconds={sessionSeconds}
          showHighlight={showHighlight}
          sleepTableVisible={sleepTableVisible}
          sleepDisturbanceAccepted={sleepDisturbanceAccepted}
          chiefComplaint={chiefComplaint}
          chiefComplaintFocused={chiefComplaintFocused}
          mentionVisible={mentionVisible}
          leftPanelCollapsed={leftPanelCollapsed}
          onSleepPosition={onSleepPosition}
          onAcceptSleep={onAcceptSleep}
          onPause={onPause}
          onStop={onStop}
          onChiefComplaintChange={onChiefComplaintChange}
          onChiefComplaintFocus={onChiefComplaintFocus}
          onSelectMention={onSelectMention}
          onDismissClinicalTags={onDismissClinicalTags}
          scrollContainerRef={soapScrollRef}
          ctaHints={ctaHints}
        />
      </div>
    </div>
  );
}
