import { Loader2 } from 'lucide-react';

/** Lightweight status row — primary demo affordance is CTA button highlights elsewhere. */
export function SoapStreamingFeedback({
  visible,
  progress,
}: {
  visible: boolean;
  progress: number;
}) {
  if (!visible) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      data-name="SoapStreamingFeedback"
      role="status"
      aria-live="polite"
      className="flex flex-wrap items-center gap-[12px] rounded-[var(--ds-radius-button)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-secondary)]"
    >
      <Loader2 className="size-[14px] shrink-0 animate-spin text-[var(--ds-primary-action)]" strokeWidth={2} aria-hidden />
      <span>Live capture</span>
      <div className="h-[4px] min-w-[100px] flex-1 overflow-hidden rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-tertiary)]">
        <div className="h-full bg-[var(--ds-primary-action)] transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums text-[var(--ds-text-muted)]">{pct}%</span>
    </div>
  );
}
