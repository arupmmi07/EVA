import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT, ctaHighlightClass } from '../../utils/ctaHints';
import { ReferralSection, SummaryFact } from '../shared/primitives';

export function ReferralDrawer({ onClose, ctaHints }: { onClose: () => void; ctaHints: ReadonlySet<CtaHintId> }) {
  return (
    <div data-name="ReferralDrawer" className="absolute inset-0 z-20 flex bg-[rgba(2,6,23,0.45)]" role="dialog" aria-modal="true" aria-labelledby="referral-title">
      <button type="button" className="min-h-0 flex-1 cursor-default border-0 bg-transparent p-0" aria-label="Close overlay" onClick={onClose} />
      <div className="h-full w-[56%] min-w-[520px] overflow-y-auto border-l border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[24px] shadow-[var(--ds-shadow-card)]">
        <div className="mb-[20px] flex items-start justify-between">
          <div className="flex items-start gap-[16px]">
            <div className="h-[40px] w-[4px] rounded-[var(--ds-radius-pill)] bg-[var(--ds-primary-brand)]" aria-hidden />
            <div>
              <h3 id="referral-title" className="font-['Inter',sans-serif] text-[28px] font-semibold leading-[36px] text-[var(--ds-text-primary)]">
                Physical Therapy Referral
              </h3>
              <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">
                Clinical Ledger Reference ID: #RX-2024-0812
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            {...(ctaHints.has(CTA_HINT.CLOSE_REFERRAL) ? { 'data-cta-hint': CTA_HINT.CLOSE_REFERRAL } : {})}
            className={`flex size-[32px] items-center justify-center rounded-full bg-[var(--ds-bg-tertiary)] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)] ${ctaHighlightClass(ctaHints.has(CTA_HINT.CLOSE_REFERRAL), 'circle')}`}
            aria-label="Close referral document"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[24px] font-['Inter',sans-serif] text-[12px] leading-[18px]">
          <SummaryFact label="Patient Name" value="Sarah Chen" />
          <SummaryFact label="MRN" value="104992-8" />
          <SummaryFact label="Date of Birth" value="04/22/1985" />
        </div>

        <div className="mt-[24px] space-y-[20px]">
          <ReferralSection
            index="01"
            title="Physician & Provider Details"
            rows={[
              ['Referring Physician', 'Dr. Samantha Wickram, MD'],
              ['NPI Number', '1285093341'],
              ['Clinic Phone', '(555) 123-4567'],
              ['Address', '900 Clinical Way, Suite 402, Metro City'],
            ]}
          />
          <ReferralSection
            index="02"
            title="Clinical Diagnosis (ICD-10)"
            rows={[
              ['Primary Diagnosis', 'e.g. Chronic low back pain, unspecified'],
              ['ICD-10 Code', 'M54.50'],
              ['Secondary Diagnosis', 'e.g. Spondylosis without myelopathy or radiculopathy'],
              ['ICD-10 Code', 'M47.817'],
            ]}
          />
          <ReferralSection
            index="03"
            title="Treatment Parameters"
            rows={[
              ['Frequency', '2-3 Times Week'],
              ['Duration', '4-6 Weeks'],
            ]}
          />
          <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] p-[20px]">
            <p className="mb-[12px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
              Rehab Interventions
            </p>
            <div className="grid grid-cols-2 gap-[12px] font-['Inter',sans-serif] text-[14px] leading-[20px] text-[var(--ds-text-primary)]">
              {[
                'Therapeutic Exercise (Strength/Flexibility)',
                'Neuromuscular Re-education',
                'Manual Therapy / Mobilization',
                'Gait Training',
                'Soft Tissue Mobilization (STM)',
                'Kinesiology Taping',
                'Ergonomic / Home Safety Instruction',
              ].map((item) => (
                <label key={item} className="flex items-center gap-[8px]">
                  <input type="checkbox" checked readOnly className="accent-[var(--ds-primary-action)]" />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] p-[20px]">
            <p className="mb-[12px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
              Clinical Precautions &amp; Notes
            </p>
            <div className="h-[96px] rounded-[var(--ds-radius-card)] bg-[var(--ds-bg-tertiary)]" aria-hidden />
            <div className="mt-[40px] flex items-center justify-between font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-primary)]">
              <p className="font-serif text-[18px] italic text-[var(--ds-primary-brand)]">Samantha Wickram, MD</p>
              <p className="text-[26px] font-semibold">March 12, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
