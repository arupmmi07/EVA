import type { ReactNode } from 'react';

/**
 * Floating toolbar on the split between AI chat and main content — chrome matches
 * `figma-make-moment3` Split-View-Button.
 * Top: expand chat · Middle: split view · Bottom: collapse chat
 */
interface PanelDividerToolbarProps {
  chatOpen: boolean;
  onExpandChat: () => void;
  onCollapseChat: () => void;
  onSplitView: () => void;
}

function IconExpandLeft({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" stroke={stroke} strokeWidth="1.25" />
      <path d="M10 2.5v11" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M6.5 8L4.5 6M6.5 8L4.5 10" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSplit({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" stroke={stroke} strokeWidth="1.25" />
      <path d="M8 2.5v11" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconCollapseLeft({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" stroke={stroke} strokeWidth="1.25" />
      <path d="M6 2.5v11" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M9.5 8l2-2M9.5 8l2 2" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type DockTone = 'selected' | 'default' | 'muted';

function DockIconButton({
  label,
  title,
  tone,
  disabled,
  onClick,
  children,
}: {
  label: string;
  title: string;
  tone: DockTone;
  disabled?: boolean;
  onClick: () => void;
  children: (stroke: string) => ReactNode;
}) {
  const stroke = tone === 'selected' ? '#3E63DD' : '#64748B';
  return (
    <button
      type="button"
      title={title}
      aria-label={label}
      aria-pressed={tone === 'selected'}
      disabled={disabled}
      onClick={onClick}
      className={`relative shrink-0 rounded-[4px] p-0 transition-[opacity,background-color] ${
        disabled
          ? 'cursor-not-allowed opacity-30'
          : tone === 'selected'
            ? 'z-[3] bg-[rgba(0,64,255,0.03)]'
            : tone === 'muted'
              ? 'z-[1] opacity-50 hover:opacity-90 focus-visible:opacity-100'
              : 'z-[1]'
      }`}
    >
      <span className="flex items-center p-2">{children(stroke)}</span>
    </button>
  );
}

export function PanelDividerToolbar({
  chatOpen,
  onExpandChat,
  onCollapseChat,
  onSplitView,
}: PanelDividerToolbarProps) {
  return (
    <div
      className="relative isolate flex flex-col items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.9)] p-1"
      role="toolbar"
      aria-label="Panel layout"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-1px] z-0 rounded-[13px] border border-solid border-[rgba(0,9,50,0.12)]"
      />
      <div className="relative z-[1] flex flex-col">
        <DockIconButton
          label="Show chat panel"
          title="Show chat panel"
          tone={!chatOpen ? 'selected' : 'muted'}
          onClick={onExpandChat}
        >
          {(stroke) => <IconExpandLeft stroke={stroke} />}
        </DockIconButton>
        <DockIconButton label="Split view" title="Split view" tone="default" onClick={onSplitView}>
          {(stroke) => <IconSplit stroke={stroke} />}
        </DockIconButton>
        <DockIconButton
          label="Hide chat panel"
          title="Hide chat panel"
          tone="default"
          disabled={!chatOpen}
          onClick={onCollapseChat}
        >
          {(stroke) => <IconCollapseLeft stroke={stroke} />}
        </DockIconButton>
      </div>
    </div>
  );
}
