type Moment3SchedulerHeroProps = {
  onCheckIn: () => void;
};

/** Hero card above the scheduler KPI grid (moment3 / Figma front desk). */
export function Moment3SchedulerHero({ onCheckIn }: Moment3SchedulerHeroProps) {
  return (
    <section
      data-name="Moment3SchedulerHero"
      className="mb-5 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-4 shadow-[var(--ds-shadow-card)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase tracking-wide text-[var(--ds-text-secondary)]">
            Incoming patient
          </p>
          <p className="mt-1.5 font-['Inter',sans-serif] text-[15px] font-semibold leading-snug text-[var(--ds-text-primary)]">
            Sarah Chen
          </p>
          <p className="mt-2 max-w-xl font-['Inter',sans-serif] text-[14px] font-normal leading-relaxed text-[var(--ds-text-secondary)]">
            You have a new patient coming: Sarah Chen. Identity is verified and insurance is confirmed.
          </p>
          <p className="mt-2 font-['Inter',sans-serif] text-[12px] font-medium text-[var(--ds-text-muted)]">
            9:00 AM · Dr. Park · New patient visit
          </p>
        </div>
        <button
          type="button"
          onClick={onCheckIn}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] bg-[var(--ds-primary-action)] px-5 font-['Inter',sans-serif] text-[14px] font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-cta-ring)]"
        >
          Check In
        </button>
      </div>
    </section>
  );
}
