import type { MomentId } from '@/moments/momentTypes';
import { AppRail } from './components/layout/AppRail';
import { TopHeader } from './components/layout/TopHeader';
import { ChatPane } from './components/chat/ChatPane';
import { RightPane } from './components/panels/RightPane';
import { useEvaWorkflow } from './hooks/useEvaWorkflow';
import { useSharedScreenshotsLayout } from './hooks/useSharedScreenshotsLayout';

export function EvaWorkflowApp({ momentId }: { momentId: MomentId }) {
  const workflow = useEvaWorkflow({ momentId });
  const sharedScreenshotsLayout = useSharedScreenshotsLayout();

  return (
    <div
      data-name="EvaWorkflowApp"
      className="h-screen overflow-hidden bg-[#fcfcfd] font-['Inter',sans-serif] text-[var(--ds-text-primary)]"
    >
      <div className="flex h-full">
        <AppRail />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#ffffff] border-[#0000001a] border mr-[8px] my-[8px] rounded-[12px]">
          <TopHeader
            mode={workflow.headerMode}
            title={workflow.headerTitle}
            saveDraftEnabled={workflow.saveDraftEnabled}
            reviewEnabled={workflow.reviewEnabled}
            onFinalize={workflow.finalizeReview}
            setupVisible={workflow.topSetupVisible}
            onSetupResolve={workflow.resolveCustomization}
            ctaHints={workflow.ctaHints}
            panelMode={workflow.panelMode}
            onPanelModeChange={workflow.setPanelMode}
          />

          <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#ffffff]">
            <div
              className={`grid min-h-0 min-w-0 flex-1 overflow-hidden bg-[#ffffff] ${
                workflow.panelMode === 'both'
                  ? 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-2'
                  : workflow.panelMode === 'leftOnly'
                    ? 'grid-cols-[minmax(0,1fr)_0px]'
                    : 'grid-cols-[minmax(0,1fr)]'
              }`}
            >
              {workflow.panelMode !== 'rightOnly' ? (
                <section className="relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-[#ffffff]">
                  <ChatPane
                    chatItems={workflow.chatItems}
                    chatInput={workflow.chatInput}
                    onInputChange={workflow.setChatInput}
                    onSubmit={workflow.submitChat}
                    onQuickAction={workflow.selectSuggestion}
                    stage={workflow.stage}
                    sessionSeconds={workflow.sessionSeconds}
                    onOpenSummary={workflow.openSummaryFromUser}
                    onSchedulerViewUnconfirmed={() => workflow.expandSchedulerPanel('unconfirmed')}
                    onSchedulerViewNoShow={() => workflow.expandSchedulerPanel('potentialNoShow')}
                    onMoment3CheckIn={momentId === 'moment3' ? () => workflow.openM3CheckIn() : undefined}
                    figmaWorkspaceShell
                    panelMode={workflow.panelMode}
                    sharedScreenshotsLayout={sharedScreenshotsLayout}
                    ctaHints={workflow.ctaHints}
                    schedulerChrome={workflow.shellSchedulerChrome}
                  />
                </section>
              ) : null}

              <section
                className={`relative flex min-h-0 min-w-0 flex-col overflow-hidden ${
                  workflow.panelMode === 'leftOnly'
                    ? ''
                    : `box-border pb-[8px] pt-[8px] ${workflow.panelMode === 'rightOnly' ? 'pr-0' : 'pr-[8px]'}`
                }`}
              >
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-solid border-[#0000001A] bg-[#F7F9FC]">
                  <RightPane
                    stage={workflow.stage}
                    referralOpen={workflow.referralOpen}
                    topSetupVisible={workflow.topSetupVisible}
                    recordingActive={workflow.recordingActive}
                    sessionPaused={workflow.sessionPaused}
                    sessionSeconds={workflow.sessionSeconds}
                    showHighlight={workflow.showHighlight}
                    sleepTableVisible={workflow.sleepTableVisible}
                    sleepDisturbanceAccepted={workflow.sleepDisturbanceAccepted}
                    chiefComplaint={workflow.chiefComplaint}
                    chiefComplaintFocused={workflow.chiefComplaintFocused}
                    mentionVisible={workflow.mentionVisible}
                    clarificationApplied={workflow.clarificationApplied}
                    leftPanelCollapsed={workflow.leftPanelCollapsed}
                    schedulerExpanded={workflow.schedulerPanel}
                    schedulerReminders={workflow.schedulerReminders}
                    schedulerSamMoved={workflow.schedulerSamMoved}
                    schedulerGoodNews={workflow.schedulerGoodNews}
                    schedulerToasts={workflow.schedulerToasts}
                    onSchedulerExpand={workflow.expandSchedulerPanel}
                    onSchedulerResend={workflow.resendSchedulerReminder}
                    onSchedulerMarkSamNoShow={workflow.markSamNoShow}
                    onSchedulerDismissToast={workflow.dismissSchedulerToast}
                    onOpenSummary={workflow.openSummaryFromUser}
                    onOpenReferral={() => workflow.setReferralOpen(true)}
                    onCloseReferral={workflow.closeReferral}
                    onBeginSession={workflow.beginSession}
                    onSleepPosition={() => workflow.setSleepTableVisible(true)}
                    onAcceptSleep={workflow.acceptSleepSuggestion}
                    onPause={workflow.togglePause}
                    onStop={workflow.stopSession}
                    onChiefComplaintChange={workflow.handleChiefComplaintChange}
                    onChiefComplaintFocus={workflow.setChiefComplaintFocused}
                    onSelectMention={workflow.insertMention}
                    onDismissClinicalTags={workflow.dismissClinicalTags}
                    ctaHints={workflow.ctaHints}
                    schedulerRightSlot={workflow.momentUi.schedulerRightSlot}
                    clinicalDualRight={workflow.momentUi.clinicalDualRight}
                    momentId={momentId}
                    m3CheckInInvoiceOpen={workflow.m3CheckInInvoiceOpen}
                    m3InvoiceInstanceKey={workflow.m3InvoiceInstanceKey}
                    onM3OpenCheckInFromPanel={() => workflow.openM3CheckIn({ withUserEcho: true })}
                    onM3CompleteCheckIn={workflow.completeM3CheckIn}
                  />
                </div>
              </section>
            </div>

            {workflow.panelMode === 'rightOnly' ? (
              <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-start pb-6 pl-5 pr-4">
                <div className="pointer-events-auto w-full max-w-[min(100%,560px)]">
                  <ChatPane
                    chatItems={workflow.chatItems}
                    chatInput={workflow.chatInput}
                    onInputChange={workflow.setChatInput}
                    onSubmit={workflow.submitChat}
                    onQuickAction={workflow.selectSuggestion}
                    stage={workflow.stage}
                    sessionSeconds={workflow.sessionSeconds}
                    onOpenSummary={workflow.openSummaryFromUser}
                    onSchedulerViewUnconfirmed={() => workflow.expandSchedulerPanel('unconfirmed')}
                    onSchedulerViewNoShow={() => workflow.expandSchedulerPanel('potentialNoShow')}
                    onMoment3CheckIn={momentId === 'moment3' ? () => workflow.openM3CheckIn() : undefined}
                    figmaWorkspaceShell
                    panelMode={workflow.panelMode}
                    sharedScreenshotsLayout={sharedScreenshotsLayout}
                    ctaHints={workflow.ctaHints}
                    schedulerChrome={workflow.shellSchedulerChrome}
                  />
                </div>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}
