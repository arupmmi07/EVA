import { imgPatient } from '../../assets';

export function PatientDataCard() {
  const patientDetails: [string, string][] = [
    ['Dominance', 'Right hand dominant'],
    ['Occupation', 'Retired schoolteacher'],
    ['Visit', '1 of 12 - Initial Evaluation - Week 0'],
    ['Living situation', 'Lives alone'],
    ['Payer', 'Medicare Part B'],
    ['Activity level prior to injury', 'Moderate. Gardening, cooking, light housework.'],
    ['Referring physician', 'Orthopedic surgeon. Arthroscopic rotator cuff repair performed 10 weeks prior to initial evaluation.'],
    ['Primary Diagnosis', 'M75.11, Complete rotator cuff tear, right shoulder, not specified as traumatic'],
    ['Secondary Diagnosis', 'M79.621, Pain in right upper arm, post-surgical'],
  ];

  return (
    <div data-name="PatientDataCard" className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-[20px] py-[16px] shadow-[var(--ds-shadow-card)]">
      <div className="mb-[16px] flex items-center gap-[12px]">
        <img src={imgPatient} alt="Sarah Chen" className="size-[48px] rounded-[var(--ds-radius-card)] object-cover" />
        <div>
          <p className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">Sarah Chen</p>
          <p className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[var(--ds-text-secondary)]">Age - 65 | Female</p>
        </div>
      </div>

      <div className="grid gap-x-[32px] gap-y-[12px] font-['Inter',sans-serif] text-[14px] leading-[20px] text-[var(--ds-text-primary)] lg:grid-cols-2">
        {patientDetails.map(([label, value], index) => (
          <div key={label} className={index >= 5 ? 'lg:col-span-2' : ''}>
            <span className="font-semibold text-[var(--ds-text-primary)]">{label}: </span>
            <span className={label === 'Dominance' || label === 'Visit' ? 'text-[var(--ds-success)]' : ''}>{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-[16px] flex flex-wrap gap-[8px]">
        <span className="rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-accent-purple)] px-[12px] py-[6px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-[var(--ds-primary-action)]">
          12 visits authorized
        </span>
        <span className="rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-accent-purple)] px-[12px] py-[6px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-[var(--ds-primary-action)]">
          GP Modifier pre-loaded
        </span>
      </div>
    </div>
  );
}
