import { Calendar, FileText, MessageCircle, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { imgPatient } from '../../assets';
import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT, ctaHighlightClass } from '../../utils/ctaHints';

function DashboardCard({
  icon,
  title,
  subtitle,
  badge,
  action,
  onAction,
  compact = false,
  actionCta = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  action?: string;
  onAction?: () => void;
  compact?: boolean;
  actionCta?: boolean;
}) {
  return (
    <div
      data-name="DashboardCard"
      className={`rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-[20px] py-[16px] shadow-[var(--ds-shadow-card)] ${
        compact ? 'min-h-[112px]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex size-[48px] items-center justify-center rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-secondary)]">
            {icon}
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">{title}</p>
            {subtitle && (
              <p className="mt-[4px] font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[var(--ds-text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <button
            type="button"
            onClick={onAction}
            {...(actionCta ? { 'data-cta-hint': CTA_HINT.OPEN_PREVISIT_SUMMARY } : {})}
            className={`font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-[var(--ds-success)] ${ctaHighlightClass(actionCta, 'none')}`}
          >
            {action}
          </button>
        )}
        {badge && !action && (
          <span className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-success)]">{badge}</span>
        )}
      </div>
    </div>
  );
}

export function DashboardSurface({
  onOpenSummary,
  ctaHints,
}: {
  onOpenSummary: () => void;
  ctaHints: ReadonlySet<CtaHintId>;
}) {
  return (
    <div data-name="DashboardSurface" className="flex min-h-full items-start justify-center px-[40px] py-[36px]">
      <div className="w-full max-w-[430px] space-y-[20px]">
        <DashboardCard
          icon={<img src={imgPatient} alt="Sarah Chen" className="size-[32px] rounded-[var(--ds-radius-card)] object-cover" />}
          title="Your First Patient Sarah Chen"
          subtitle="Initial Eval"
          action="Open pre-visit summary"
          onAction={onOpenSummary}
          actionCta={ctaHints.has(CTA_HINT.OPEN_PREVISIT_SUMMARY)}
        />
        <DashboardCard
          icon={<Calendar className="size-[18px] text-[var(--ds-success)]" strokeWidth={1.5} />}
          title="Today's Patients"
          subtitle="8 Patients"
          badge="4 Checked In"
        />
        <DashboardCard
          icon={<Zap className="size-[18px] text-[var(--ds-primary-brand)]" strokeWidth={1.5} />}
          title="Notes Incomplete"
          subtitle="2 need attention"
          badge="4"
        />
        <div className="grid grid-cols-2 gap-[16px]">
          <DashboardCard compact icon={<FileText className="size-[18px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} />} title="Authorizations Expired" />
          <DashboardCard compact icon={<FileText className="size-[18px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} />} title="Plan of Care Expired" />
        </div>
        <DashboardCard
          icon={<FileText className="size-[18px] text-[var(--ds-warning-text)]" strokeWidth={1.5} />}
          title="Mid-Treatment Referral Received"
          subtitle="2 Items"
          badge="2"
        />
        <DashboardCard
          icon={<MessageCircle className="size-[18px] text-[var(--ds-success)]" strokeWidth={1.5} />}
          title="New Messages"
          subtitle="3 Clinic | 2 Patients"
          badge="6"
        />
        <DashboardCard
          icon={<FileText className="size-[18px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} />}
          title="Co-Signatures Pending"
          subtitle="2 Items"
        />
        <div className="flex justify-center pt-[8px]">
          <button
            type="button"
            className="rounded-[var(--ds-radius-button)] bg-[var(--ds-bg-accent-purple)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-[var(--ds-primary-action)]"
          >
            Customize Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
