import { useRef } from 'react';
import type { WorkflowStage } from '@/features/eva/types';
import type { RightPaneProps } from '@/features/eva/components/panels/rightPaneProps';
import { FinalizedSurface } from '@/features/eva/components/finalized/FinalizedSurface';
import { ReferralDrawer } from '@/features/eva/components/summary/ReferralDrawer';
import { SummarySurface } from '@/features/eva/components/summary/SummarySurface';
import { SoapSurface } from '@/features/eva/components/soap/SoapSurface';

const CLINICAL_SUMMARY_STAGES: readonly WorkflowStage[] = [
  'summary',
  'summaryCustomizing',
  'summaryReady',
  'summaryAnswered',
];

const CLINICAL_SOAP_STAGES: readonly WorkflowStage[] = ['session', 'sessionAccepted', 'sessionStopped'];

/** Clinician layout: patient summary until Begin session, then SOAP-only for the live note. */
export function ClinicalSplitRightPane(props: RightPaneProps) {
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
  } = props;

  const showPatientSummary = CLINICAL_SUMMARY_STAGES.includes(stage);
  const showSoapNote = CLINICAL_SOAP_STAGES.includes(stage);

  if (stage === 'finalized') {
    return (
      <div className="h-full overflow-y-auto" data-name="ClinicalSplitFinalized">
        <FinalizedSurface clarificationApplied={clarificationApplied} />
      </div>
    );
  }

  if (showPatientSummary) {
    return (
      <div
        data-name="ClinicalSplitRight"
        className={`relative h-full min-h-0 px-3 py-3 ${referralOpen ? 'overflow-hidden' : 'overflow-y-auto'}`}
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
    <div ref={soapScrollRef} className="h-full min-h-0 overflow-y-auto px-3 py-3" data-name="ClinicalSplitSoap">
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
