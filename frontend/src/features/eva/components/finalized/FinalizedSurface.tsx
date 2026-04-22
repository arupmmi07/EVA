import { Check, FileText } from 'lucide-react';
import { Tag } from '../shared/primitives';

function FinalSection({
  title,
  colorClass,
  items,
  highlight,
}: {
  title: string;
  colorClass: string;
  items: string[];
  highlight?: string;
}) {
  return (
    <div
      data-name="FinalSection"
      className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[15px] shadow-[var(--ds-shadow-card)]"
    >
      <div className="mb-[20px] flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div
            className={`flex size-[32px] items-center justify-center rounded-[var(--ds-radius-card)] text-white ${colorClass}`}
            aria-hidden
          >
            {title[0]}
          </div>
          <p className="font-['Inter',sans-serif] text-[22px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">{title}</p>
        </div>
        <button type="button" className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-primary-action)]">
          Edit section
        </button>
      </div>
      {highlight && (
        <div className="mb-[16px] rounded-[var(--ds-radius-button)] bg-[var(--ds-warning-surface)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[14px] font-semibold italic leading-[20px] text-[var(--ds-warning-text)]">
          {highlight}
        </div>
      )}
      <ul className="space-y-[12px] font-['Inter',sans-serif] text-[15px] font-normal leading-[28px] text-[var(--ds-text-primary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-[12px]">
            <span className="mt-[12px] size-[6px] shrink-0 rounded-full bg-[var(--ds-text-secondary)] opacity-40" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FinalizedSurface({ clarificationApplied }: { clarificationApplied: boolean }) {
  return (
    <div data-name="FinalizedSurface" className="space-y-[20px] px-3 py-3">
      <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[15px] shadow-[var(--ds-shadow-card)]">
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex items-center gap-[20px]">
            <div className="flex size-[56px] items-center justify-center rounded-[var(--ds-radius-card)] bg-[var(--ds-success-bg)] text-[var(--ds-success)]">
              <Check className="size-[22px]" strokeWidth={2} aria-hidden />
            </div>
            <div>
              <p className="font-['Inter',sans-serif] text-[34px] font-semibold leading-[40px] tracking-tight text-[var(--ds-text-primary)]">
                Visit 1 of 7 complete - Sarah Chen
              </p>
              <p className="mt-[4px] font-['Inter',sans-serif] text-[15px] leading-[24px] text-[var(--ds-text-secondary)]">
                Left ACL Tear <span className="mx-[8px] text-[var(--ds-border)]">•</span>
                <span className="font-medium text-[var(--ds-success)]">Finalized successfully</span>
              </p>
              <div className="mt-[16px] flex gap-[8px]">
                <Tag tone="slate"># 97110 (TherEx)</Tag>
                <Tag tone="slate"># 97112 (Neuro re-ed)</Tag>
              </div>
            </div>
          </div>

          <div className="w-[220px] shrink-0">
            <div className="mb-[8px] flex justify-between font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
              <span>Progress</span>
              <span>42%</span>
            </div>
            <div className="h-[8px] rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-tertiary)]">
              <div className="h-full w-[42%] rounded-[var(--ds-radius-pill)] bg-[var(--ds-primary-action)]" />
            </div>
            <div className="mt-[24px] flex justify-end">
              <Tag tone="green">100% Documentation quality</Tag>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px] font-['Inter',sans-serif] text-[24px] font-semibold leading-[32px] text-[var(--ds-text-primary)]">
          <div className="flex size-[32px] items-center justify-center rounded-[var(--ds-radius-card)] bg-[var(--ds-bg-accent-purple)] text-[var(--ds-primary-action)]">
            <FileText className="size-[16px]" strokeWidth={1.5} aria-hidden />
          </div>
          SOAP Documentation
        </div>
        <div className="font-['Inter',sans-serif] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.08em] text-[var(--ds-success)]">
          Verified 4/4
        </div>
      </div>

      <FinalSection
        title="Subjective"
        colorClass="bg-[var(--ds-primary-action)]"
        highlight={
          clarificationApplied ? 'Pain is improving slightly compared to last visit but continues to limit activity.' : undefined
        }
        items={[
          'Persistent left knee pain worse with descending stairs, and weight bearing. AROM limited to 90° of flexion',
          clarificationApplied
            ? 'Updated: Flexion clarified to 110 degrees with a sharp catch specifically when descending stairs.'
            : 'Current: 3/10',
          clarificationApplied ? 'Worst (past week): 6/10' : 'Worst (past week): 6/10',
        ]}
      />

      <FinalSection
        title="Objective"
        colorClass="bg-[var(--ds-primary-brand)]"
        items={[
          'Mild antalgic gait pattern on right.',
          'Slight varus alignment noted.',
          'Trace swelling present.',
          'Tenderness along medial joint line.',
        ]}
      />
    </div>
  );
}
