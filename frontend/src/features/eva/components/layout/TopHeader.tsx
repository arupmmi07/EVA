import { ChevronDown } from 'lucide-react';
import profileAvatar from '@/assets/nav-profile-avatar.png';
import type { HeaderMode, PanelMode } from '../../types';
import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT, ctaHighlightClass } from '../../utils/ctaHints';

function IconTodaysTasks({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 11.3334L3.33333 12.6667L6 10M8.66667 4.00004H14M8.66667 8.00004H14M8.66667 12H14M2.66667 3.33337H5.33333C5.70152 3.33337 6 3.63185 6 4.00004V6.66671C6 7.0349 5.70152 7.33337 5.33333 7.33337H2.66667C2.29848 7.33337 2 7.0349 2 6.66671V4.00004C2 3.63185 2.29848 3.33337 2.66667 3.33337Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWorkspaceConversation({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8.66667 5.33333H4.66667M11.3333 8H4.66667M14 10C14 10.3536 13.8595 10.6928 13.6095 10.9428C13.3594 11.1929 13.0203 11.3333 12.6667 11.3333H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWorkspaceHybrid({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2V14M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWorkspaceFocused({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 2H2.66667C2.29848 2 2 2.29848 2 2.66667V7.33333C2 7.70152 2.29848 8 2.66667 8H6C6.36819 8 6.66667 7.70152 6.66667 7.33333V2.66667C6.66667 2.29848 6.36819 2 6 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 2H10C9.63181 2 9.33333 2.29848 9.33333 2.66667V4.66667C9.33333 5.03486 9.63181 5.33333 10 5.33333H13.3333C13.7015 5.33333 14 5.03486 14 4.66667V2.66667C14 2.29848 13.7015 2 13.3333 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 8H10C9.63181 8 9.33333 8.29848 9.33333 8.66667V13.3333C9.33333 13.7015 9.63181 14 10 14H13.3333C13.7015 14 14 13.7015 14 13.3333V8.66667C14 8.29848 13.7015 8 13.3333 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10.6667H2.66667C2.29848 10.6667 2 10.9651 2 11.3333V13.3333C2 13.7015 2.29848 14 2.66667 14H6C6.36819 14 6.66667 13.7015 6.66667 13.3333V11.3333C6.66667 10.9651 6.36819 10.6667 6 10.6667Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WorkspaceModeSegment({
  panelMode,
  onPanelModeChange,
}: {
  panelMode: PanelMode;
  onPanelModeChange: (mode: PanelMode) => void;
}) {
  const segments: {
    mode: PanelMode;
    label: string;
    Icon: typeof IconWorkspaceConversation;
  }[] = [
    { mode: 'leftOnly', label: 'Conversation', Icon: IconWorkspaceConversation },
    { mode: 'both', label: 'Hybrid', Icon: IconWorkspaceHybrid },
    { mode: 'rightOnly', label: 'Focused', Icon: IconWorkspaceFocused },
  ];

  return (
    <div
      role="tablist"
      aria-label="Workspace layout"
      className="inline-flex items-center rounded-[10px] border border-[rgba(0,0,51,0.08)] bg-[#F7F9FC] p-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
    >
      {segments.map(({ mode, label, Icon }) => {
        const active = panelMode === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={label}
            title={label}
            onClick={() => onPanelModeChange(mode)}
            className={`flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 font-['Inter',sans-serif] text-[14px] font-medium leading-5 transition ${
              active
                ? 'bg-white text-[#1F2933]'
                : 'text-[#A3ABB3]'
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function TopHeader({
  mode,
  title = 'My Dashboard',
  saveDraftEnabled,
  reviewEnabled,
  onFinalize,
  setupVisible,
  onSetupResolve,
  ctaHints,
  figmaTopNav = true,
  panelMode,
  onPanelModeChange,
}: {
  mode: HeaderMode;
  title?: string;
  saveDraftEnabled: boolean;
  reviewEnabled: boolean;
  onFinalize: () => void;
  setupVisible: boolean;
  onSetupResolve: () => void;
  ctaHints: ReadonlySet<CtaHintId>;
  figmaTopNav?: boolean;
  /** When set with `onPanelModeChange`, shows workspace mode switcher in the navbar (replaces CenterDock). */
  panelMode?: PanelMode;
  onPanelModeChange?: (mode: PanelMode) => void;
}) {
  const btnBase =
    "rounded-[var(--ds-radius-button)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] transition-opacity disabled:opacity-45";
  const btnGhost = `${btnBase} border border-[var(--ds-border)] text-[var(--ds-text-secondary)]`;
  const btnPrimary = `${btnBase} bg-[var(--ds-primary-action)] font-semibold text-white`;

  const showWorkspaceChrome =
    figmaTopNav &&
    mode === 'default' &&
    panelMode !== undefined &&
    onPanelModeChange !== undefined;

  return (
    <header
      data-name="TopHeader"
      className={`relative flex shrink-0 items-center ${
        figmaTopNav
          ? 'min-h-[64px] border-b-0 bg-[#ffffff] px-3 py-2 shadow-none'
          : 'min-h-[var(--ds-header-min-height)] border-b bg-[#ffffff] px-4 border-[var(--ds-border)]'
      }`}
    >
      {!figmaTopNav ? (
        <div className="flex w-full min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">
              {title}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {setupVisible && mode === 'setup' && (
              <>
                <button type="button" className={btnGhost} onClick={onSetupResolve}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${btnBase} border border-[var(--ds-border-accent)] bg-[var(--ds-bg-accent-purple)] font-semibold text-[var(--ds-primary-action)]`}
                  onClick={onSetupResolve}
                >
                  Save for similar profile
                </button>
                <button
                  type="button"
                  {...(ctaHints.has(CTA_HINT.SAVE_SETUP_DEFAULT) ? { 'data-cta-hint': CTA_HINT.SAVE_SETUP_DEFAULT } : {})}
                  className={`${btnPrimary} ${ctaHighlightClass(ctaHints.has(CTA_HINT.SAVE_SETUP_DEFAULT), 'button')}`}
                  onClick={onSetupResolve}
                >
                  Save as Default
                </button>
              </>
            )}
            {(mode === 'session-disabled' || mode === 'session-active') && (
              <>
                <button type="button" disabled={!saveDraftEnabled} className={btnGhost}>
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={!reviewEnabled}
                  {...(ctaHints.has(CTA_HINT.REVIEW_FINALIZE) ? { 'data-cta-hint': CTA_HINT.REVIEW_FINALIZE } : {})}
                  className={`${btnPrimary} ${ctaHighlightClass(ctaHints.has(CTA_HINT.REVIEW_FINALIZE) && reviewEnabled, 'button')}`}
                  onClick={onFinalize}
                >
                  Review &amp; Finalise →
                </button>
              </>
            )}
            {mode === 'share' && (
              <button
                type="button"
                {...(ctaHints.has(CTA_HINT.SHARE_PATIENT) ? { 'data-cta-hint': CTA_HINT.SHARE_PATIENT } : {})}
                className={`${btnPrimary} px-[16px] py-[8px] ${ctaHighlightClass(ctaHints.has(CTA_HINT.SHARE_PATIENT), 'button')}`}
              >
                Share with Patient
              </button>
            )}
          </div>
        </div>
      ) : showWorkspaceChrome ? (
        <div className="flex w-full min-w-0 items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <button
              type="button"
              className="inline-flex h-10 max-w-full shrink-0 items-center gap-2 rounded-[10px] border border-[rgba(0,0,51,0.08)] bg-white px-3 py-1.5 text-left hover:bg-[#f8fafc]"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <IconTodaysTasks className="size-4 shrink-0 text-[#64748b]" />
              <span className="truncate font-['Inter',sans-serif] text-[14px] font-medium leading-5 text-[#616E7C]">
                {"Today's Tasks"}
              </span>
              <ChevronDown className="size-4 shrink-0 text-[#64748b]" strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-48">
            <div className="pointer-events-auto shrink-0">
              <WorkspaceModeSegment panelMode={panelMode} onPanelModeChange={onPanelModeChange} />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-0.5 rounded-[10px] border border-[#0000000A] bg-white py-3 pl-1 pr-1.5 transition hover:bg-[#f8fafc]"
              aria-label="Account menu"
            >
              <img
                src={profileAvatar}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-[10px] object-cover"
              />
              <ChevronDown className="size-3.5 shrink-0 text-[#64748b]" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <div className="min-w-0 flex-1 truncate font-['Inter',sans-serif] text-[14px] font-semibold text-[#020617]">
            {title || '\u00a0'}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {setupVisible && mode === 'setup' && (
              <>
                <button type="button" className={btnGhost} onClick={onSetupResolve}>
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${btnBase} border border-[var(--ds-border-accent)] bg-[var(--ds-bg-accent-purple)] font-semibold text-[var(--ds-primary-action)]`}
                  onClick={onSetupResolve}
                >
                  Save for similar profile
                </button>
                <button
                  type="button"
                  {...(ctaHints.has(CTA_HINT.SAVE_SETUP_DEFAULT) ? { 'data-cta-hint': CTA_HINT.SAVE_SETUP_DEFAULT } : {})}
                  className={`${btnPrimary} ${ctaHighlightClass(ctaHints.has(CTA_HINT.SAVE_SETUP_DEFAULT), 'button')}`}
                  onClick={onSetupResolve}
                >
                  Save as Default
                </button>
              </>
            )}
            {(mode === 'session-disabled' || mode === 'session-active') && (
              <>
                <button type="button" disabled={!saveDraftEnabled} className={btnGhost}>
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={!reviewEnabled}
                  {...(ctaHints.has(CTA_HINT.REVIEW_FINALIZE) ? { 'data-cta-hint': CTA_HINT.REVIEW_FINALIZE } : {})}
                  className={`${btnPrimary} ${ctaHighlightClass(ctaHints.has(CTA_HINT.REVIEW_FINALIZE) && reviewEnabled, 'button')}`}
                  onClick={onFinalize}
                >
                  Review &amp; Finalise →
                </button>
              </>
            )}
            {mode === 'share' && (
              <button
                type="button"
                {...(ctaHints.has(CTA_HINT.SHARE_PATIENT) ? { 'data-cta-hint': CTA_HINT.SHARE_PATIENT } : {})}
                className={`${btnPrimary} px-[16px] py-[8px] ${ctaHighlightClass(ctaHints.has(CTA_HINT.SHARE_PATIENT), 'button')}`}
              >
                Share with Patient
              </button>
            )}
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center gap-0.5 rounded-[10px] border border-[#0000000A] bg-white py-3 pl-1 pr-1.5 transition hover:bg-[#f8fafc]"
              aria-label="Account menu"
            >
              <img
                src={profileAvatar}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-[10px] object-cover"
              />
              <ChevronDown className="size-3.5 shrink-0 text-[#64748b]" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
