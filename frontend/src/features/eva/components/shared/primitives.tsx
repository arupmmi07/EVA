import type { ReactNode } from 'react';

export function Tag({ children, tone }: { children: ReactNode; tone: 'amber' | 'purple' | 'rose' | 'green' | 'slate' | 'blue' }) {
  const styles = {
    amber: 'bg-[#fff4d8] text-[#ca8a04]',
    purple: 'bg-[var(--ds-bg-accent-purple)] text-[var(--ds-primary-action)]',
    rose: 'bg-[var(--ds-danger-soft-bg)] text-[var(--ds-danger)]',
    green: 'bg-[var(--ds-success-bg)] text-[var(--ds-success)]',
    slate: 'bg-[var(--ds-badge-bg)] text-[var(--ds-badge-text)]',
    blue: 'border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]',
  } as const;
  return (
    <span
      data-name="Tag"
      className={`rounded-[var(--ds-radius-pill)] px-[12px] py-[6px] font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[var(--ds-radius-xs)] bg-[var(--ds-warning-surface)] px-[6px] py-[2px] font-['Inter',sans-serif] text-[14px] font-semibold italic leading-[20px] text-[var(--ds-warning-text)]">
      {children}
    </span>
  );
}

export function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-name="InfoBlock">
      <p className="mb-[8px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
        {label}
      </p>
      <div className="font-['Inter',sans-serif] text-[14px] font-normal leading-[28px] text-[var(--ds-text-primary)]">{children}</div>
    </div>
  );
}

export function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--ds-radius-card)] bg-[var(--ds-bg-tertiary)] p-[12px]" data-name="DetailPill">
      <p className="font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-secondary)]">{label}</p>
      <p className="mt-[4px] font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-[var(--ds-text-primary)]">{value}</p>
    </div>
  );
}

export function SmallChip({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-name="SmallChip"
      onClick={onClick}
      className={`rounded-[var(--ds-radius-button)] border px-[12px] py-[6px] font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] transition-colors ${
        active
          ? 'border-[var(--ds-border-accent)] text-[var(--ds-primary-action)]'
          : 'border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:border-[var(--ds-border-accent)]'
      }`}
    >
      {children}
    </button>
  );
}

export function SummaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div data-name="SummaryFact">
      <p className="mb-[4px] font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-secondary)]">{label}</p>
      <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-[var(--ds-text-primary)]">{value}</p>
    </div>
  );
}

export function SleepTableRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-[var(--ds-border)]">
      <td className="w-[140px] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)]">{label}</td>
      <td className="px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-primary)]">{value}</td>
    </tr>
  );
}

export function ClinicalTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-[var(--ds-radius-card)] border border-[var(--ds-border)]" data-name="ClinicalTable">
      <div className="flex items-center justify-between bg-[var(--ds-bg-tertiary)] px-[16px] py-[12px]">
        <span className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">{title}</span>
        <span className="size-[6px] rounded-full bg-[var(--ds-primary-brand)]" aria-hidden />
      </div>
      <table className="w-full text-left">
        <thead className="bg-[var(--ds-bg-secondary)] font-['Inter',sans-serif] text-[11px] font-semibold uppercase leading-[16px] tracking-[0.06em] text-[var(--ds-text-secondary)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-t border-[var(--ds-border)] px-[16px] py-[12px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-primary)]">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[var(--ds-border)]">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="px-[16px] py-[12px] align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GoalText({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-[16px] last:mb-0">
      <p>
        <Highlight>{title}</Highlight>
      </p>
      <p className="mt-[4px] leading-[32px]">
        <Highlight>{children}</Highlight>
      </p>
    </div>
  );
}

export function SuggestionRow({ items }: { items: string[] }) {
  return (
    <div data-name="SuggestionRow">
      <p className="mb-[8px] font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-primary-accent)]">
        AI Suggestions
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {items.map((item) => (
          <SmallChip key={item}>{item}</SmallChip>
        ))}
      </div>
    </div>
  );
}

export function PanelCard({
  title,
  titleIcon,
  children,
  rightSlot,
  compact = false,
}: {
  title: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  rightSlot?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      data-name="PanelCard"
      className={`rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[16px] shadow-[var(--ds-shadow-card)] ${
        compact ? 'min-h-[160px]' : ''
      }`}
    >
      <div className="mb-[12px] flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[8px] font-['Inter',sans-serif] text-[16px] font-semibold leading-[24px] text-[var(--ds-primary-accent)]">
          {titleIcon}
          <span>{title}</span>
        </div>
        {rightSlot}
      </div>
      <div className="font-['Inter',sans-serif] text-[15px] font-normal leading-[28px] text-[var(--ds-text-primary)]">{children}</div>
    </div>
  );
}

export function ReferralSection({ index, title, rows }: { index: string; title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] p-[20px]" data-name="ReferralSection">
      <div className="mb-[16px] flex items-center gap-[12px]">
        <span className="rounded-[var(--ds-radius-xs)] bg-[var(--ds-bg-accent-purple)] px-[8px] py-[4px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-[var(--ds-primary-brand)]">
          {index}
        </span>
        <p className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-[16px]">
        {rows.map(([label, value]) => (
          <SummaryFact key={`${label}-${value}`} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

export function TriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2L12 11H2L7 2Z" stroke="var(--ds-primary-brand)" strokeWidth="1.25" />
    </svg>
  );
}

export function MapPinMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 7.75C8.24264 7.75 9.25 6.74264 9.25 5.5C9.25 4.25736 8.24264 3.25 7 3.25C5.75736 3.25 4.75 4.25736 4.75 5.5C4.75 6.74264 5.75736 7.75 7 7.75Z"
        stroke="var(--ds-primary-action)"
        strokeWidth="1.25"
      />
      <path
        d="M7 12C7 12 10.5 8.8 10.5 5.5C10.5 3.57 8.93 2 7 2C5.07 2 3.5 3.57 3.5 5.5C3.5 8.8 7 12 7 12Z"
        stroke="var(--ds-primary-action)"
        strokeWidth="1.25"
      />
    </svg>
  );
}
