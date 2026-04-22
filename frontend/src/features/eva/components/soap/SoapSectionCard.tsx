import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export function SoapSectionCard({ letter, title, children }: { letter: string; title: string; children: ReactNode }) {
  return (
    <div data-name="SoapSectionCard" className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] shadow-[var(--ds-shadow-card)]">
      <div className="flex items-center justify-between border-b border-[var(--ds-border)] px-[20px] py-[16px]">
        <div className="flex items-center gap-[12px]">
          <div className="flex size-[28px] items-center justify-center rounded-full bg-[var(--ds-primary-action)] font-['Inter',sans-serif] text-[14px] font-semibold text-white">
            {letter}
          </div>
          <p className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">{title}</p>
        </div>
        <div className="flex items-center gap-[8px] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)]">
          3 items
          <ChevronDown className="size-[14px]" strokeWidth={1.5} aria-hidden />
        </div>
      </div>
      <div className="space-y-[20px] px-[20px] py-[16px]">{children}</div>
    </div>
  );
}
