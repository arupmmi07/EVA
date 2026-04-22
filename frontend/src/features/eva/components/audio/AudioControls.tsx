import { Gauge, Mic, Play } from 'lucide-react';

export type AudioControlsSize = 'sm' | 'md';

export function AudioControls({
  size = 'md',
  gap = 'md',
  variant = 'full',
  className = '',
}: {
  size?: AudioControlsSize;
  /** Spacing between mic / play / gauge */
  gap?: 'sm' | 'md';
  /** `micOnly` matches figma workspace composer (mic + send only). */
  variant?: 'full' | 'micOnly';
  className?: string;
}) {
  const iconClass = size === 'sm' ? 'size-[14px]' : 'size-[16px]';
  const gapClass = gap === 'sm' ? 'gap-[12px]' : 'gap-[16px]';
  const stroke = 1.5;

  if (variant === 'micOnly') {
    return (
      <div data-name="AudioControls" className={`flex items-center text-[#64748b] ${className}`}>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-[12px] p-0"
          aria-label="Voice input"
        >
          <Mic className="size-4" strokeWidth={1.25} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div
      data-name="AudioControls"
      role="group"
      aria-label="Audio controls"
      className={`flex items-center ${gapClass} text-[var(--ds-text-secondary)] ${className}`}
    >
      <button type="button" className="p-[4px]" aria-label="Voice input">
        <Mic className={iconClass} strokeWidth={stroke} aria-hidden />
      </button>
      <button type="button" className="p-[4px]" aria-label="Play audio">
        <Play className={iconClass} strokeWidth={stroke} aria-hidden />
      </button>
      <button type="button" className="p-[4px]" aria-label="Audio levels">
        <Gauge className={iconClass} strokeWidth={stroke} aria-hidden />
      </button>
    </div>
  );
}
