import { useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { SendHorizontalIcon } from '../icons/SendHorizontalIcon';
import type { ChatItem, PanelMode, WorkflowStage } from '../../types';
import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT } from '../../utils/ctaHints';
import { AudioControls } from '../audio/AudioControls';
import { ChatBubble } from './ChatBubble';

/** One chat shell for every workflow stage — only copy and optional chrome differ. */
export function ChatPane({
  chatItems,
  chatInput,
  onInputChange,
  onSubmit,
  onQuickAction,
  stage,
  sessionSeconds,
  onOpenSummary,
  onSchedulerViewUnconfirmed,
  onSchedulerViewNoShow,
  onMoment3CheckIn,
  figmaWorkspaceShell,
  panelMode,
  sharedScreenshotsLayout,
  ctaHints,
  schedulerChrome,
}: {
  chatItems: ChatItem[];
  chatInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onQuickAction: (label: string) => void;
  stage: WorkflowStage;
  sessionSeconds: number;
  onOpenSummary: () => void;
  onSchedulerViewUnconfirmed?: () => void;
  onSchedulerViewNoShow?: () => void;
  /** Moment3: primary action on the new-patient chat card. */
  onMoment3CheckIn?: () => void;
  /** Match `figma-make-moment3` chat workspace (header, transcript, Ask Eva). */
  figmaWorkspaceShell?: boolean;
  panelMode?: PanelMode;
  /** With `?sharedscreenshots` and Conversation mode, composer spans chat column width (transcript unchanged). */
  sharedScreenshotsLayout?: boolean;
  ctaHints: ReadonlySet<CtaHintId>;
  /** When set, use scheduler chat chrome even if `stage` is not `scheduler` (e.g. clinician moment). */
  schedulerChrome?: boolean;
}) {
  const showHistory = stage === 'session' || stage === 'sessionAccepted' || stage === 'sessionStopped';
  const schedulerChromeVisual = schedulerChrome ?? stage === 'scheduler';
  const finalInputPlaceholder =
    schedulerChromeVisual
      ? 'Ask Eva anything: Patients, insurance, schedule...'
      : stage === 'finalized'
        ? 'Ask Eva anything — patients, insurance, schedule...'
        : 'Ask eva about your schedule...';
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatScroll = chatScrollRef.current;
    if (!chatScroll) return;
    chatScroll.scrollTo({
      top: chatScroll.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatItems]);

  const figmaWs = Boolean(figmaWorkspaceShell);
  const figmaChatHeaderVisible = figmaWs && showHistory && stage !== 'scheduler';
  /** Focused mode: composer only, bottom-left floating overlay (see EvaWorkflowApp). */
  const focusedComposerOnly = figmaWs && panelMode === 'rightOnly';
  const focusedComposerPlaceholder =
    'Ask Eva anything: Patients, insurance, schedule...';
  const conversationScreenshotComposerFullWidth =
    figmaWs && panelMode === 'leftOnly' && Boolean(sharedScreenshotsLayout);
  const skipFigmaHeader = figmaWs && (!figmaChatHeaderVisible || focusedComposerOnly);

  return (
    <div
      data-name="ChatPane"
      className={`box-border font-['Inter',sans-serif] ${
        figmaWs
          ? focusedComposerOnly
            ? 'm-0 w-full'
            : 'm-0 flex min-h-0 flex-1 flex-col'
          : 'm-3 flex min-h-0 flex-1 flex-col'
      }`}
    >
      <div
        className={
          figmaWs
            ? focusedComposerOnly
              ? 'flex w-full flex-col bg-transparent'
              : 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#ffffff]'
            : 'flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] shadow-[var(--ds-shadow-card)]'
        }
      >
        {skipFigmaHeader ? null : (
          <header
            className={
              figmaWs
                ? 'relative z-[3] min-h-[64px] w-full shrink-0 bg-[#fcfcfd]'
                : 'shrink-0 border-b border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-5 py-3'
            }
            data-name="ChatPaneHeader"
          >
            {figmaWs ? (
              <>
                <div className="relative flex min-h-[64px] w-full flex-row items-center">
                  <div className="flex size-full min-h-[inherit] items-center justify-between px-4 pb-[9px] pt-2">
                    <div className="flex min-w-0 flex-1 items-center gap-5">
                      <div className="flex shrink-0 items-center gap-1.5 text-[14px] font-medium leading-5 text-[#64748b]">
                        <History className="size-4 shrink-0" strokeWidth={1.25} aria-hidden />
                        History
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-5 text-[12px] font-medium leading-[18px]">
                  {showHistory && stage !== 'scheduler' ? (
                    <div className="flex items-center gap-1.5 pb-0.5 text-[var(--ds-text-secondary)]">
                      <History className="size-[12px]" strokeWidth={1.5} aria-hidden />
                      History
                    </div>
                  ) : null}
                </div>
                {schedulerChromeVisual ? (
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-[rgba(0,9,50,0.12)] bg-slate-50/90 px-3.5 py-2 text-[12px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
                  >
                    Tasks
                  </button>
                ) : null}
              </div>
            )}
          </header>
        )}

        <div
          ref={chatScrollRef}
          className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-gutter:stable] ${figmaWs ? 'px-8 py-6' : 'space-y-[16px] px-[50px] py-4'} ${focusedComposerOnly ? 'hidden' : ''}`}
        >
          <div className={figmaWs ? 'mx-auto flex w-full max-w-[720px] flex-col gap-10' : 'contents'}>
            {chatItems.map((item) => (
              <ChatBubble
                key={item.id}
                item={item}
                sessionSeconds={sessionSeconds}
                onOpenSummary={onOpenSummary}
                highlightPatientSummary={ctaHints.has(CTA_HINT.OPEN_PREVISIT_SUMMARY)}
                onSchedulerViewUnconfirmed={onSchedulerViewUnconfirmed}
                onSchedulerViewNoShow={onSchedulerViewNoShow}
                onMoment3CheckIn={onMoment3CheckIn}
                figmaWorkspaceChat={figmaWs}
                schedulerChrome={schedulerChromeVisual}
                onQuickAction={onQuickAction}
                ctaHints={ctaHints}
              />
            ))}
          </div>
        </div>

        <div
          className={`shrink-0 ${
            figmaWs
              ? `pb-2 pt-2 ${focusedComposerOnly ? 'bg-transparent px-0' : `${conversationScreenshotComposerFullWidth ? 'px-8' : 'px-4'}`}`
              : 'space-y-2 px-5 pb-5 pt-2'
          }`}
        >
          <div
            className={
              figmaWs
                ? conversationScreenshotComposerFullWidth
                  ? 'box-border flex h-[112px] w-full min-w-0 flex-col rounded-[12px] bg-[#f3f4f7] p-4'
                  : focusedComposerOnly
                    ? 'box-border flex w-full min-w-0 flex-row items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-4 shadow-[0px_4px_20px_rgba(15,23,42,0.08)]'
                    : 'mx-auto box-border flex h-[112px] w-full max-w-full flex-col rounded-[12px] bg-[#f3f4f7] p-4'
                : 'rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-4 pb-3 pt-3 shadow-[var(--ds-shadow-card)]'
            }
          >
            {focusedComposerOnly ? (
              <>
                <textarea
                  value={chatInput}
                  onChange={(event) => onInputChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      onSubmit(chatInput);
                    }
                  }}
                  rows={1}
                  className="box-border min-h-[28px] min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent py-0.5 font-['Inter',sans-serif] text-[16px] font-normal leading-[28px] text-[#020617] outline-none placeholder:text-[#64748b]"
                  placeholder={focusedComposerPlaceholder}
                  aria-label="Message Eva"
                />
                <AudioControls size="md" variant="micOnly" />
                <button
                  type="button"
                  onClick={() => onSubmit(chatInput)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#C4B5FD] text-white transition hover:bg-[#A78BFA]"
                  aria-label="Send message"
                >
                  <SendHorizontalIcon className="size-4" />
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={chatInput}
                  onChange={(event) => onInputChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      onSubmit(chatInput);
                    }
                  }}
                  {...(figmaWs ? { rows: 1 as const } : {})}
                  className={
                    figmaWs
                      ? 'box-border h-[28px] min-h-[28px] w-full resize-none overflow-hidden border-none bg-transparent py-0 font-["Inter",sans-serif] text-[16px] font-normal leading-[28px] text-[#020617] outline-none placeholder:text-[#64748b]'
                      : 'min-h-[64px] w-full resize-none border-none bg-transparent font-["Inter",sans-serif] text-[14px] font-normal leading-[20px] text-[var(--ds-text-primary)] outline-none placeholder:text-[var(--ds-text-muted)]'
                  }
                  placeholder={finalInputPlaceholder}
                  aria-label="Message Eva"
                />
                <div
                  className={
                    figmaWs
                      ? 'mt-5 flex h-8 min-h-8 shrink-0 items-center justify-between gap-2'
                      : 'mt-2 flex items-center justify-end gap-4 pt-2'
                  }
                >
                  <div className={`flex min-w-0 justify-start ${figmaWs ? '' : 'flex-1'}`} data-name="ChatPaneQuickActions">
                    <button
                      type="button"
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-[#64748B] bg-[#eaecf0] h-8`}
                    >
                      Quick Actions
                      {figmaWs ? (
                        <ChevronUp className="size-3.5 opacity-70" strokeWidth={2} aria-hidden />
                      ) : (
                        <ChevronDown className="size-3.5 opacity-70" strokeWidth={2} aria-hidden />
                      )}
                    </button>
                  </div>
                  <div className={`flex shrink-0 items-center ${figmaWs ? 'gap-2' : 'gap-4'}`}>
                    <AudioControls size="md" variant={figmaWs ? 'micOnly' : 'full'} />
                    <button
                      type="button"
                      onClick={() => onSubmit(chatInput)}
                      className={
                        figmaWs
                          ? 'flex size-8 shrink-0 items-center justify-center rounded-[12px] bg-[#4E37F6] opacity-30 text-white transition hover:bg-[#4338ca]'
                          : 'flex size-[32px] shrink-0 items-center justify-center rounded-full bg-[#4E37F6] opacity-30 text-white transition hover:bg-[#4338ca]'
                      }
                      aria-label="Send message"
                    >
                      <SendHorizontalIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
