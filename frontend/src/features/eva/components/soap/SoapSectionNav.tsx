export function SoapSectionNav({
  showPlanSections,
  activeSection,
  onSubjective,
  onObjective,
  onAssessment,
  onPlan,
  onBilling,
}: {
  showPlanSections: boolean;
  activeSection: string;
  onSubjective: () => void;
  onObjective: () => void;
  onAssessment: () => void;
  onPlan: () => void;
  onBilling: () => void;
}) {
  const items = [
    { id: 'subjective', label: 'S', title: 'Subjective', onClick: onSubjective },
    { id: 'objective', label: 'O', title: 'Objective', onClick: onObjective },
    { id: 'assessment', label: 'A', title: 'Assessment', onClick: onAssessment },
    ...(showPlanSections
      ? [
          { id: 'plan', label: 'P', title: 'Plan', onClick: onPlan },
          { id: 'billing', label: 'C', title: 'Billing codes', onClick: onBilling },
        ]
      : []),
  ];

  return (
    <nav
      data-name="SoapSectionNav"
      className="sticky top-[16px] z-10 float-right -mr-[36px] ml-[12px] flex w-[28px] flex-col items-center gap-[12px] px-[4px] py-[8px]"
      aria-label="SOAP sections"
    >
      <span className="text-[9px] font-semibold uppercase text-[var(--ds-text-secondary)] [writing-mode:vertical-rl]">SOAP</span>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          title={item.title}
          aria-label={`Go to ${item.title}`}
          aria-current={activeSection === item.id ? 'true' : undefined}
          className={`flex size-[24px] items-center justify-center rounded-[var(--ds-radius-button)] font-['Inter',sans-serif] text-[11px] font-semibold leading-none transition-colors ${
            activeSection === item.id
              ? 'bg-[var(--ds-primary-action)] text-white shadow-[var(--ds-shadow-card)]'
              : 'bg-transparent text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-accent-purple)] hover:text-[var(--ds-primary-action)]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
