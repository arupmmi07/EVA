import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CalendarClock,
  Check,
  ChevronRight,
  Hexagon,
  MoreVertical,
  Play,
  Sparkles,
  Stethoscope,
  User,
} from 'lucide-react';
import { imgBodyDiagram, imgPatient } from '../../assets';
import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT, ctaHighlightClass } from '../../utils/ctaHints';
import { DetailPill, MapPinMini, PanelCard, SmallChip, Tag, TriangleIcon } from '../shared/primitives';

const summaryCard =
  'rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-5 shadow-[var(--ds-shadow-card)]';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-['Inter',sans-serif] text-[11px] font-semibold uppercase leading-[16px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
      {children}
    </p>
  );
}

function InjuryRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--ds-radius-card)] bg-[var(--ds-bg-tertiary)] text-[var(--ds-primary-accent)]">
        <Icon className="size-[16px]" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">{label}</p>
        <p className="font-['Inter',sans-serif] text-[14px] font-medium leading-[22px] text-[var(--ds-text-primary)]">{value}</p>
      </div>
    </div>
  );
}

export function SummarySurface({
  disabledActions,
  topSetupVisible,
  answered,
  onOpenReferral,
  onBeginSession,
  ctaHints,
}: {
  disabledActions: boolean;
  topSetupVisible: boolean;
  answered: boolean;
  onOpenReferral: () => void;
  onBeginSession: () => void;
  ctaHints: ReadonlySet<CtaHintId>;
}) {
  return (
    <div data-name="SummarySurface" className="space-y-4">
      <SectionLabel>Pre-Visit Patient Summary</SectionLabel>

      {/* Profile + actions */}
      <div className={summaryCard}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <img src={imgPatient} alt="Sarah Chen" className="size-14 shrink-0 rounded-[var(--ds-radius-card)] object-cover" />
            <div className="min-w-0">
              <p className="font-['Inter',sans-serif] text-[22px] font-semibold leading-[28px] tracking-tight text-[var(--ds-text-primary)] sm:text-[24px] sm:leading-[30px]">
                Sarah Chen
              </p>
              <p className="mt-1 font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[var(--ds-text-secondary)]">
                ID: #1123-K · Age: 58y
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag tone="amber">New patient</Tag>
                <Tag tone="purple">Intake evaluation</Tag>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              disabled={disabledActions}
              className="rounded-[var(--ds-radius-button)] border border-[var(--ds-border-accent)] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-primary-action)] disabled:opacity-40"
            >
              <span className="inline-flex items-center gap-1.5">
                <User className="size-[14px]" strokeWidth={1.5} aria-hidden />
                Patient profile
              </span>
            </button>
            <button
              type="button"
              disabled={disabledActions}
              onClick={() => onBeginSession()}
              {...(!disabledActions && ctaHints.has(CTA_HINT.BEGIN_SESSION) ? { 'data-cta-hint': CTA_HINT.BEGIN_SESSION } : {})}
              className={`rounded-[var(--ds-radius-button)] bg-[var(--ds-primary-action)] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-white disabled:opacity-40 ${ctaHighlightClass(!disabledActions && ctaHints.has(CTA_HINT.BEGIN_SESSION), 'card')}`}
            >
              <span className="inline-flex items-center gap-2">
                <Play className="size-[14px] fill-white text-white" strokeWidth={0} aria-hidden />
                Begin session
              </span>
            </button>
            <button
              type="button"
              disabled={disabledActions}
              className="flex size-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] border border-[var(--ds-border)] text-[var(--ds-text-secondary)] disabled:opacity-40"
              aria-label="More options"
            >
              <Hexagon className="size-[15px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Chief complaint + first visit */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_200px]">
        <PanelCard
          title="Chief complaint"
          titleIcon={<Stethoscope className="size-[14px] text-[var(--ds-primary-accent)]" strokeWidth={1.5} />}
          rightSlot={topSetupVisible ? <MoreVertical className="size-[14px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} /> : undefined}
        >
          Severe right shoulder pain and limited range of motion following a fall 3 days ago. Patient reports sharp pain (8/10)
          with overhead movements and difficulty sleeping on right side.
        </PanelCard>

        <PanelCard title="First visit" compact rightSlot={<Tag tone="amber">Today</Tag>}>
          <div className="pt-1">
            <p className="font-['Inter',sans-serif] text-[32px] font-semibold leading-none text-[var(--ds-text-primary)]">
              Apr 14 <span className="text-[16px] font-semibold text-[var(--ds-text-secondary)]">2026</span>
            </p>
            <p className="mt-2 font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Intake evaluation</p>
          </div>
        </PanelCard>
      </div>

      {/* Referral */}
      <div className={summaryCard}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-['Inter',sans-serif] text-[18px] font-semibold leading-7 text-[var(--ds-text-primary)]">Referred by</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenReferral}
              {...(ctaHints.has(CTA_HINT.VIEW_REFERRAL) ? { 'data-cta-hint': CTA_HINT.VIEW_REFERRAL } : {})}
              className={`rounded-[var(--ds-radius-button)] bg-[var(--ds-bg-accent-purple)] px-4 py-2 font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-primary-action)] ${ctaHighlightClass(ctaHints.has(CTA_HINT.VIEW_REFERRAL), 'button')}`}
            >
              View Referral Document
            </button>
            {topSetupVisible && <MoreVertical className="size-[14px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} />}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Provider</p>
            <p className="mt-1 font-['Inter',sans-serif] text-[14px] font-medium leading-5 text-[var(--ds-text-primary)]">Dr. Samantha Wickram, MD</p>
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Specialty</p>
            <p className="mt-1 font-['Inter',sans-serif] text-[14px] font-medium leading-5 text-[var(--ds-text-primary)]">Orthopedic Surgery</p>
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Date referred</p>
            <p className="mt-1 font-['Inter',sans-serif] text-[14px] font-medium leading-5 text-[var(--ds-text-primary)]">Mar 12, 2026</p>
          </div>
        </div>
        <div className="mt-4 rounded-[var(--ds-radius-card)] border border-[var(--ds-success)] bg-[var(--ds-success-bg)] p-4 font-['Inter',sans-serif] text-[14px] font-medium leading-5 text-[var(--ds-text-primary)]">
          Arthroscopic rotator cuff repair performed. Recommend conservative PT approach with reassessment in 6 weeks.
        </div>
      </div>

      {/* Pain assessment */}
      <div>
        <p className="mb-3 font-['Inter',sans-serif] text-[16px] font-semibold leading-6 text-[var(--ds-text-primary)]">Pain assessment</p>
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          <PanelCard
            title="Current pain level"
            titleIcon={<TriangleIcon />}
            rightSlot={topSetupVisible ? <MoreVertical className="size-[14px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} /> : undefined}
          >
            <div className="flex items-end justify-between gap-3">
              <span className="font-['Inter',sans-serif] text-[52px] font-semibold leading-none text-[var(--ds-danger)] sm:text-[58px]">8</span>
              <span className="pb-1.5 font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)]">out of 10</span>
            </div>
            <div className="relative mt-4 h-3 rounded-[var(--ds-radius-pill)] bg-gradient-to-r from-[var(--ds-success)] via-[var(--ds-warning-surface)] to-[var(--ds-danger)]">
              <div
                className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-md ring-2 ring-[var(--ds-danger)]/25"
                style={{ right: '6%', left: 'auto' }}
                aria-hidden
              />
            </div>
            <div className="mt-2 flex justify-between font-['Inter',sans-serif] text-[11px] leading-4 text-[var(--ds-text-secondary)]">
              <span>No pain</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <DetailPill label="Pain type" value="Sharp, stabbing" />
              <DetailPill label="Frequency" value="Constant" />
              <DetailPill label="Aggravating factors" value="Overhead reach" />
              <DetailPill label="Relieving factors" value="Rest, ice" />
            </div>
          </PanelCard>

          <PanelCard
            title="Pain location"
            titleIcon={<MapPinMini />}
            rightSlot={topSetupVisible ? <MoreVertical className="size-[14px] text-[var(--ds-text-secondary)]" strokeWidth={1.5} /> : undefined}
          >
            <div
              className={`rounded-[var(--ds-radius-card)] p-4 ${
                topSetupVisible
                  ? 'border border-[var(--ds-border-accent)] bg-[var(--ds-bg-primary)] shadow-[var(--ds-shadow-card)]'
                  : 'bg-[var(--ds-bg-secondary)]'
              }`}
            >
              <div className="flex justify-center py-1">
                <img src={imgBodyDiagram} alt="Body diagram highlighting right shoulder" className="h-[200px] max-h-[240px] object-contain sm:h-[220px]" />
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] px-4 py-3 font-['Inter',sans-serif] text-[14px] leading-5 text-[var(--ds-text-primary)]">
                <span className="size-2 shrink-0 rounded-full bg-[var(--ds-success)]" aria-hidden />
                Right shoulder joint pain
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Injury + medical history */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={summaryCard}>
          <p className="mb-4 font-['Inter',sans-serif] text-[16px] font-semibold leading-6 text-[var(--ds-primary-accent)]">Injury details</p>
          <div className="space-y-4">
            <InjuryRow icon={Calendar} label="Date of injury" value="Apr 11, 2026 (3 days ago)" />
            <InjuryRow icon={Activity} label="Mechanism of injury" value="Fall onto outstretched arm" />
            <InjuryRow icon={Stethoscope} label="Prior treatment" value="Rest, ice, OTC NSAIDs — limited relief" />
          </div>
        </div>

        <div className={summaryCard}>
          <p className="mb-4 font-['Inter',sans-serif] text-[16px] font-semibold leading-6 text-[var(--ds-primary-accent)]">Medical history</p>
          <div>
            <p className="font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] text-[var(--ds-text-secondary)]">Current medications</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag tone="blue">Ibuprofen</Tag>
              <Tag tone="blue">Lisinopril</Tag>
            </div>
          </div>
          <div className="mt-5">
            <p className="font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] text-[var(--ds-text-secondary)]">Past medical history</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 font-['Inter',sans-serif] text-[14px] leading-[22px] text-[var(--ds-text-primary)]">
              <li>Hypertension — well controlled</li>
              <li>Left knee arthroscopy (2019)</li>
              <li>No prior shoulder surgery</li>
            </ul>
          </div>
          <div className="mt-5 flex gap-3 rounded-[var(--ds-radius-card)] border border-amber-200/80 bg-[var(--ds-warning-surface)] p-4">
            <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-[var(--ds-warning-text)]" strokeWidth={2} aria-hidden />
            <div>
              <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-warning-text)]">Red flags screened</p>
              <p className="mt-1 font-['Inter',sans-serif] text-[14px] leading-5 text-[var(--ds-text-primary)]">No contraindications to PT identified at intake.</p>
            </div>
          </div>
          {answered && (
            <div className="mt-4 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-secondary)] p-4 font-['Inter',sans-serif] text-[14px] leading-5 text-[var(--ds-text-primary)]">
              No significant comorbidities documented beyond the above.
            </div>
          )}
        </div>
      </div>

      {/* Patient notes */}
      <div className={summaryCard}>
        <p className="mb-4 font-['Inter',sans-serif] text-[16px] font-semibold leading-6 text-[var(--ds-text-primary)]">Patient notes</p>
        <div className="space-y-5">
          <div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">Primary goals</p>
            <p className="mt-1.5 font-['Inter',sans-serif] text-[14px] leading-[22px] text-[var(--ds-text-secondary)]">
              “I want to get back to gardening and sleeping through the night without waking up from this shoulder.”
            </p>
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">Sleep patterns</p>
            <p className="mt-1.5 font-['Inter',sans-serif] text-[14px] leading-[22px] text-[var(--ds-text-secondary)]">
              “I can’t lie on my right side — I end up on my back and still wake up sore.”
            </p>
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">Activity restrictions / losses</p>
            <p className="mt-1.5 font-['Inter',sans-serif] text-[14px] leading-[22px] text-[var(--ds-text-secondary)]">
              Overhead reaching, carrying groceries, and reaching behind the car seat are painful or avoided.
            </p>
          </div>
        </div>
      </div>

      {/* AI diagnostic assistance */}
      <div className="rounded-[var(--ds-radius-card)] border border-[#e4dcff] bg-[#f7f4ff] p-5 shadow-[var(--ds-shadow-card)]">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="size-[18px] text-[var(--ds-primary-action)]" strokeWidth={1.75} aria-hidden />
          <p className="font-['Inter',sans-serif] text-[16px] font-semibold leading-6 text-[var(--ds-text-primary)]">Suggested differential diagnosis</p>
        </div>

        <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[var(--ds-radius-pill)] bg-[var(--ds-danger-soft-bg)] px-2.5 py-1 font-['Inter',sans-serif] text-[11px] font-semibold uppercase leading-4 tracking-wide text-[var(--ds-danger)]">
              High probability
            </span>
            <span className="ml-auto font-['Inter',sans-serif] text-[24px] font-semibold leading-none text-[var(--ds-primary-action)]">85%</span>
          </div>
          <p className="mt-3 font-['Inter',sans-serif] text-[17px] font-semibold leading-6 text-[var(--ds-text-primary)]">Rotator cuff tear</p>
          <p className="mt-2 font-['Inter',sans-serif] text-[14px] leading-[22px] text-[var(--ds-text-secondary)]">
            Clinical presentation aligns with partial- to full-thickness cuff involvement after trauma; confirm with focused exam and imaging if indicated.
          </p>
          <p className="mt-4 font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-wide text-[var(--ds-text-secondary)]">Recommended tests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SmallChip>Empty can test</SmallChip>
            <SmallChip>Drop arm test</SmallChip>
            <SmallChip>External rotation lag</SmallChip>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-4">
            <span className="text-[11px] font-semibold uppercase leading-4 tracking-wide text-[#b45309]">Moderate probability</span>
            <p className="mt-2 font-['Inter',sans-serif] text-[15px] font-semibold leading-5 text-[var(--ds-text-primary)]">AC joint sprain</p>
            <p className="mt-1.5 text-[14px] leading-5 text-[var(--ds-text-secondary)]">Consider if pain is superior and focal to AC line.</p>
          </div>
          <div className="rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-4">
            <span className="text-[11px] font-semibold uppercase leading-4 tracking-wide text-[var(--ds-text-secondary)]">Lower probability</span>
            <p className="mt-2 font-['Inter',sans-serif] text-[15px] font-semibold leading-5 text-[var(--ds-text-primary)]">Glenohumeral dislocation</p>
            <p className="mt-1.5 text-[14px] leading-5 text-[var(--ds-text-secondary)]">Less likely without instability history or deformity.</p>
          </div>
        </div>

        <div className="mt-5 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-4">
          <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">AI recommendations for therapist</p>
          <ul className="mt-3 space-y-2.5">
            {[
              'Start with pain-guided ROM and scapular setting before aggressive loading.',
              'Educate on sleep positioning and activity modification for the first 1–2 weeks.',
              'Reassess irritability after initial intervention to calibrate progression.',
            ].map((line) => (
              <li key={line} className="flex gap-2.5 font-['Inter',sans-serif] text-[14px] leading-5 text-[var(--ds-text-primary)]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--ds-bg-accent-purple)] text-[var(--ds-primary-action)]">
                  <Check className="size-3" strokeWidth={2.5} aria-hidden />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer status */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-[var(--ds-radius-card)] border border-[var(--ds-success)] bg-[var(--ds-success-bg)] p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/80">
            <Check className="size-[18px] text-[var(--ds-success)]" strokeWidth={2.5} aria-hidden />
          </div>
          <div>
            <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">Insurance verified</p>
            <p className="mt-0.5 font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Aetna PPO — authorization pending</p>
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-[var(--ds-radius-card)] border border-[var(--ds-border-accent)] bg-[var(--ds-bg-accent-purple)] p-4 text-left transition-colors hover:bg-[#e8e8ff]"
        >
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 size-[18px] shrink-0 text-[var(--ds-primary-action)]" strokeWidth={1.75} aria-hidden />
            <div>
              <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-5 text-[var(--ds-text-primary)]">Next session</p>
              <p className="mt-0.5 font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-secondary)]">Full evaluation scheduled</p>
            </div>
          </div>
          <ChevronRight className="size-5 shrink-0 text-[var(--ds-primary-action)]" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
