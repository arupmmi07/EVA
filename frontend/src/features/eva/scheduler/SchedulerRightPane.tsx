import { Fragment, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleSlash2,
  DollarSign,
  MessageSquareDot,
  MoreVertical,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import {
  OUTSTANDING_COPAYS,
  POTENTIAL_NO_SHOWS_SEED,
  SCHEDULE_CHANGE_PAIRS,
  SCHEDULE_CHANGES_KPI_COUNT,
  TODAY_PATIENTS,
  UNANSWERED_THREADS,
  type PotentialNoShowPatient,
  type ScheduleChangePair,
  type UnconfirmedId,
  UNCONFIRMED_PATIENTS,
  type UnconfirmedPatient,
} from './schedulerData';
import type { SchedulerExpandedPanel } from '../types';
import { SchedulerCalendar } from './SchedulerCalendar';

export interface SchedulerToast {
  id: string;
  patientName: string;
  /** e.g. "10 AM with Dr. Kumar" */
  scheduleLine: string;
  /** e.g. "1 min ago" */
  relativeTime: string;
  /** When set, replaces default “{patientName} Confirmed her appointment” headline. */
  headlineOverride?: string;
}

/** Figma export: rounded-square mint shell + green disc + white check (32×32). */
function SchedulerToastSuccessIcon() {
  const uid = useId().replace(/:/g, '');
  const maskId = `scheduler-toast-success-mask-${uid}`;
  const clipId = `scheduler-toast-success-clip-${uid}`;

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <mask id={maskId} fill="white">
        <path d="M0 14C0 6.26801 6.26801 0 14 0H18C25.732 0 32 6.26801 32 14V18C32 25.732 25.732 32 18 32H14C6.26801 32 0 25.732 0 18V14Z" />
      </mask>
      <path
        d="M0 14C0 6.26801 6.26801 0 14 0H18C25.732 0 32 6.26801 32 14V18C32 25.732 25.732 32 18 32H14C6.26801 32 0 25.732 0 18V14Z"
        fill="#F4FBF6"
      />
      <path
        d="M14 0V1H18V0V-1H14V0ZM32 14H31V18H32H33V14H32ZM18 32V31H14V32V33H18V32ZM0 18H1V14H0H-1V18H0ZM14 32V31C6.8203 31 1 25.1797 1 18H0H-1C-1 26.2843 5.71573 33 14 33V32ZM32 18H31C31 25.1797 25.1797 31 18 31V32V33C26.2843 33 33 26.2843 33 18H32ZM18 0V1C25.1797 1 31 6.8203 31 14H32H33C33 5.71573 26.2843 -1 18 -1V0ZM14 0V-1C5.71573 -1 -1 5.71573 -1 14H0H1C1 6.8203 6.8203 1 14 1V0Z"
        fill="#D6F1DF"
        mask={`url(#${maskId})`}
      />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M16.0002 22.6666C19.6821 22.6666 22.6668 19.6818 22.6668 15.9999C22.6668 12.318 19.6821 9.33325 16.0002 9.33325C12.3183 9.33325 9.3335 12.318 9.3335 15.9999C9.3335 19.6818 12.3183 22.6666 16.0002 22.6666Z"
          fill="#30A46C"
        />
        <path d="M14.0002 15.9999L15.3335 17.3333L18.0002 14.6666" fill="#30A46C" />
        <path
          d="M14.0002 15.9999L15.3335 17.3333L18.0002 14.6666M22.6668 15.9999C22.6668 19.6818 19.6821 22.6666 16.0002 22.6666C12.3183 22.6666 9.3335 19.6818 9.3335 15.9999C9.3335 12.318 12.3183 9.33325 16.0002 9.33325C19.6821 9.33325 22.6668 12.318 22.6668 15.9999Z"
          stroke="white"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width={16} height={16} fill="white" transform="translate(8 8)" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Figma export: 16×16 green disc + white check for “Reminder Sent”. */
function ReminderSentTickIcon() {
  const uid = useId().replace(/:/g, '');
  const clipId = `reminder-sent-tick-clip-${uid}`;

  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 7.99999C14.6668 4.3181 11.6821 1.33333 8.00016 1.33333C4.31826 1.33333 1.3335 4.3181 1.3335 7.99999C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z"
          fill="#30A46C"
        />
        <path d="M6.00016 7.99999L7.3335 9.33333L10.0002 6.66666" fill="#30A46C" />
        <path
          d="M6.00016 7.99999L7.3335 9.33333L10.0002 6.66666M14.6668 7.99999C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 7.99999C1.3335 4.3181 4.31826 1.33333 8.00016 1.33333C11.6821 1.33333 14.6668 4.3181 14.6668 7.99999Z"
          stroke="white"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width={16} height={16} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const card = 'rounded-xl border border-[rgba(0,9,50,0.12)] bg-white';

function PotentialNoShowAlertIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <rect width={16} height={16} fill="white" fillOpacity={0.01} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.00809 0.649345C8.55305 -0.114154 7.44734 -0.114154 6.99229 0.649346L0.172118 12.0926C-0.294017 12.8747 0.269532 13.8667 1.18001 13.8667H14.8204C15.7309 13.8667 16.2944 12.8747 15.8282 12.0926L9.00809 0.649345ZM7.90857 1.19544C7.94993 1.12603 8.05046 1.12603 8.09182 1.19544L14.912 12.6387C14.9544 12.7098 14.9031 12.8 14.8204 12.8H1.18001C1.09725 12.8 1.04601 12.7098 1.08839 12.6387L7.90857 1.19544ZM7.28222 4.78518C7.26655 4.37784 7.59255 4.03907 8.0002 4.03907C8.40784 4.03907 8.73383 4.37784 8.71817 4.78519L8.55402 9.05281C8.54257 9.3504 8.29801 9.58575 8.0002 9.58575C7.70238 9.58575 7.45781 9.3504 7.44636 9.05281L7.28222 4.78518ZM8.80008 11.1744C8.80008 11.6162 8.4419 11.9744 8.00008 11.9744C7.55824 11.9744 7.20008 11.6162 7.20008 11.1744C7.20008 10.7326 7.55824 10.3744 8.00008 10.3744C8.4419 10.3744 8.80008 10.7326 8.80008 11.1744Z"
        fill="#020617"
      />
    </svg>
  );
}

function PotentialNoShowCallIcon() {
  const uid = useId().replace(/:/g, '');
  const clipId = `pns-call-clip-${uid}`;

  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M14.667 5.33333V1.33333M14.667 1.33333H10.667M14.667 1.33333L10.667 5.33333M14.6669 11.2801V13.2801C14.6677 13.4657 14.6297 13.6495 14.5553 13.8196C14.4809 13.9897 14.3718 14.1425 14.235 14.268C14.0982 14.3935 13.9367 14.489 13.7608 14.5485C13.5849 14.608 13.3985 14.6301 13.2136 14.6134C11.1622 14.3905 9.19161 13.6895 7.46028 12.5667C5.8495 11.5432 4.48384 10.1775 3.46028 8.56673C2.3336 6.82753 1.63244 4.84739 1.41361 2.78673C1.39695 2.60237 1.41886 2.41657 1.47795 2.24114C1.53703 2.06572 1.63199 1.90452 1.75679 1.76781C1.88159 1.63109 2.03348 1.52187 2.20281 1.44707C2.37213 1.37228 2.55517 1.33357 2.74028 1.33339H4.74028C5.06382 1.33021 5.37748 1.44478 5.62279 1.65575C5.8681 1.86672 6.02833 2.15969 6.07361 2.48006C6.15803 3.1201 6.31458 3.74854 6.54028 4.35339C6.62998 4.59201 6.64939 4.85134 6.59622 5.10065C6.54305 5.34996 6.41952 5.5788 6.24028 5.76006L5.39361 6.60673C6.34265 8.27576 7.72458 9.65769 9.39361 10.6067L10.2403 9.76006C10.4215 9.58082 10.6504 9.45729 10.8997 9.40412C11.149 9.35095 11.4083 9.37036 11.6469 9.46006C12.2518 9.68576 12.8802 9.84231 13.5203 9.92673C13.8441 9.97241 14.1399 10.1355 14.3513 10.3851C14.5627 10.6346 14.6751 10.9531 14.6669 11.2801Z"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width={16} height={16} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function noShowRiskPillClass(risk: string): string {
  if (risk === 'High Risk') {
    return 'rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[11px] font-semibold leading-none text-[#B91C1C]';
  }
  if (risk === 'Moderate') {
    return 'rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-semibold leading-none text-[#B45309]';
  }
  return '';
}

/** Parse `2 of 3 reminders sent · Last: …` → filled segment count (for 3-slot progress UI). */
function parseReminderFilledCount(remindersLabel: string): number {
  const head = remindersLabel.split(' · Last:')[0] ?? remindersLabel;
  const m = /^(\d+)\s+of\s+(\d+)/i.exec(head.trim());
  if (!m) return 0;
  const n = Number(m[1]);
  const cap = Number(m[2]) || 3;
  return Math.max(0, Math.min(cap, Number.isFinite(n) ? n : 0));
}

/** Narrow fixed-width segments; filled uses `#D5AE39` per design reference. */
function ReminderSegmentBar({ filled, total = 3 }: { filled: number; total?: number }) {
  return (
    <div
      className="inline-flex shrink-0 gap-1"
      role="img"
      aria-label={`${filled} of ${total} reminders`}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-[22px] shrink-0 rounded-[3px] ${i < filled ? 'bg-[#D5AE39]' : 'bg-slate-100'}`}
        />
      ))}
    </div>
  );
}

/** Expanded KPI shell — same white surface as collapsed chips (no background shift on expand). */
const expandedShell =
  'w-full min-w-0 overflow-hidden rounded-2xl border border-[rgba(0,9,50,0.12)] bg-white';

/** Full width of grid column, fixed height 80px; no max-width so labels aren’t clipped. */
const KPI_CHIP =
  'box-border flex h-[80px] w-full min-w-0 items-center rounded-xl border border-[rgba(0,9,50,0.12)] bg-white px-4 transition-colors hover:border-[rgba(0,9,50,0.18)]';

/** Icon tile: neutral fill so it reads on both white (idle) and lavender (active) chips. */
const KPI_ICON_TILE =
  'flex size-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(0,9,50,0.08)] bg-[#eef2f6] text-[#64748b]';

function KpiTileHeader({
  label,
  count: _count,
  sub,
  badgeCount,
  Icon,
}: {
  label: string;
  count: number | string;
  sub?: string;
  badgeCount?: number;
  Icon: LucideIcon;
}) {
  const showBadge = badgeCount !== undefined && badgeCount > 0;
  return (
    <div className="relative flex min-h-8 w-full min-w-0 items-center gap-3">
      {showBadge ? (
        <span
          className={`absolute right-0 top-1/2 flex h-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#ef4444] text-[12px] font-bold leading-none text-white ${badgeCount! > 9 ? 'min-w-6 px-1.5' : 'size-6'}`}
        >
          {badgeCount! > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
      <div className={KPI_ICON_TILE} aria-hidden>
        <Icon className="size-[18px]" strokeWidth={1.65} />
      </div>
      <div className={`min-w-0 flex-1 self-center ${showBadge ? 'pr-10' : ''}`}>
        <span className="line-clamp-2 min-w-0 text-pretty text-[14px] font-medium leading-snug text-[#020617]">{label}</span>
        {sub ? <span className="mt-0.5 block line-clamp-1 text-[12px] leading-tight text-[#64748b]">{sub}</span> : null}
      </div>
    </div>
  );
}

function ExpandedKpiUnified({
  label,
  count,
  sub,
  badgeCount,
  listLabel,
  onCollapse,
  Icon,
  children,
}: {
  label: string;
  count: number | string;
  sub?: string;
  badgeCount?: number;
  listLabel: string;
  onCollapse: () => void;
  Icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className={expandedShell}>
      <button
        type="button"
        onClick={onCollapse}
        className="relative box-border flex h-[80px] w-full items-center bg-white px-4 text-left transition hover:bg-[#f8fafc]"
        aria-label="Collapse section"
      >
        <KpiTileHeader label={label} count={count} sub={sub} badgeCount={badgeCount} Icon={Icon} />
      </button>
      <div className="bg-white px-3 py-4 sm:px-6 sm:py-5">
        <ul className="m-0 flex w-full min-w-0 list-none flex-col gap-2.5 p-0">{children}</ul>
      </div>
    </section>
  );
}

const LIST_LABEL_BY_PANEL: Partial<Record<SchedulerExpandedPanel, string>> = {
  unconfirmed: 'Appointments',
  potentialNoShow: 'Patients',
  scheduleChanges: 'Next 72 hours',
  todaysPatients: 'Appointments',
  unansweredMessages: 'Threads',
  outstandingCopays: 'Accounts',
};

interface SchedulerRightPaneProps {
  expanded: SchedulerExpandedPanel;
  onExpand: (panel: SchedulerExpandedPanel) => void;
  remindersSent: Record<UnconfirmedId, boolean>;
  onResendReminder: (id: UnconfirmedId) => void;
  samMovedToNoShow: boolean;
  onMarkSamNoShow: () => void;
  toasts: SchedulerToast[];
  onDismissToast: (id: string) => void;
  goodNewsFired: boolean;
  onOpenPreVisitSummary: () => void;
}

function KpiCard({
  label,
  count,
  sub,
  onClick,
  badgeCount,
  Icon,
}: {
  label: string;
  count: number | string;
  sub?: string;
  onClick: () => void;
  badgeCount?: number;
  Icon: LucideIcon;
}) {
  return (
    <button type="button" onClick={onClick} className={`text-left ${KPI_CHIP}`}>
      <KpiTileHeader label={label} count={count} sub={sub} badgeCount={badgeCount} Icon={Icon} />
    </button>
  );
}

const SCHEDULE_PROGRESS_FILL = '#2E04E8';

/** Merged cancellation + filled slot with FILLED BY divider (schedule changes design). */
function ScheduleChangeMergedCard({ pair }: { pair: ScheduleChangePair }) {
  const { cancellation, filled } = pair;
  return (
    <div className="overflow-hidden rounded-xl border border-[rgba(0,9,50,0.12)] bg-white">
      <div className="flex gap-3 px-4 pb-3 pt-4">
        <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" strokeWidth={2} aria-hidden />
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-snug text-slate-900">{cancellation.headline}</p>
            <p className="mt-1 text-[12px] font-medium text-slate-500">{cancellation.slot}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-[12px] font-semibold text-red-600">Cancellation</span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-1">
        <div className="h-px min-w-0 flex-1 bg-slate-200" aria-hidden />
        <div className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
          <ArrowLeftRight className="size-3.5" strokeWidth={2} aria-hidden />
          <span>FILLED BY</span>
        </div>
        <div className="h-px min-w-0 flex-1 bg-slate-200" aria-hidden />
      </div>
      <div className="flex gap-3 px-4 pb-4 pt-3">
        {filled.variant === 'returning' ? (
          <div
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
            aria-hidden
          >
            <Check className="size-3 stroke-[3]" />
          </div>
        ) : (
          <User className="mt-0.5 size-5 shrink-0 text-[#6d28d9]" strokeWidth={2} aria-hidden />
        )}
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold leading-snug text-slate-900">{filled.headline}</p>
            <p className="mt-1 text-[12px] font-medium text-slate-500">{filled.subtitle}</p>
            {filled.detail ? <p className="mt-1 text-[12px] text-slate-500">{filled.detail}</p> : null}
            {filled.variant === 'newPatient' && filled.progressPct != null ? (
              <>
                <div className="mt-3 flex max-w-md items-center gap-3">
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${filled.progressPct}%`,
                        backgroundColor: SCHEDULE_PROGRESS_FILL,
                      }}
                    />
                  </div>
                  <span
                    className="shrink-0 text-[14px] font-semibold tabular-nums"
                    style={{ color: SCHEDULE_PROGRESS_FILL }}
                  >
                    {filled.progressPct}%
                  </span>
                </div>
                {filled.intakeStatus ? (
                  <p className="mt-1.5 text-[11px] font-medium text-slate-500">{filled.intakeStatus}</p>
                ) : null}
              </>
            ) : null}
          </div>
          <span className="shrink-0 self-start pt-0.5 text-[12px] font-semibold text-emerald-700">Filled</span>
        </div>
      </div>
    </div>
  );
}

function UnconfirmedRow({
  p,
  sent,
  onResend,
  onMenuMarkNoShow,
  showSamKebab,
  nested = false,
}: {
  p: UnconfirmedPatient;
  sent: boolean;
  onResend: () => void;
  onMenuMarkNoShow?: () => void;
  showSamKebab: boolean;
  /** When true, render as a child row inside the expanded panel (sc2 / sc3). */
  nested?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const filledSegments = parseReminderFilledCount(p.remindersLabel);
  const samMenuEnabled = p.id === 'sam' && showSamKebab;

  const rowClass = nested
    ? 'rounded-xl border border-[rgba(0,9,50,0.08)] bg-white px-4 py-3.5'
    : `${card} p-4`;

  return (
    <div className={rowClass}>
      <div className="flex items-center gap-3">
        <h4 className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight text-slate-900">{p.name}</h4>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onResend}
            disabled={sent}
            className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-1.5 text-[12px] font-semibold transition ${
              sent
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'
                : 'border border-[rgba(0,9,50,0.14)] bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {sent ? (
              <>
                <ReminderSentTickIcon />
                Reminder Sent
              </>
            ) : (
              'Resend reminder'
            )}
          </button>
          <div className="relative shrink-0" ref={samMenuEnabled ? menuRef : undefined}>
            <button
              type="button"
              onClick={() => samMenuEnabled && setMenuOpen((o) => !o)}
              className={`rounded-lg p-1.5 text-[#5b6ee8] transition hover:bg-slate-100 hover:text-[#3e4dc4] ${
                p.id === 'sam' && !showSamKebab ? 'opacity-50' : ''
              }`}
              aria-label="More actions"
              aria-haspopup={samMenuEnabled ? 'menu' : undefined}
              aria-expanded={samMenuEnabled ? menuOpen : undefined}
            >
              <MoreVertical className="size-4" strokeWidth={2} aria-hidden />
            </button>
            {menuOpen && samMenuEnabled ? (
              <div className="absolute right-0 top-9 z-30 min-w-[200px] rounded-lg border border-[rgba(0,9,50,0.12)] bg-white py-1">
                <button
                  type="button"
                  className="block w-full px-3 py-2.5 text-left text-[14px] text-slate-800 hover:bg-slate-50"
                  onClick={() => {
                    setMenuOpen(false);
                    onMenuMarkNoShow?.();
                  }}
                >
                  Mark as potential no-show
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <p className="mt-1 text-[12px] font-medium text-slate-500">
        {p.time} · {p.doctor} · {p.visitType}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <ReminderSegmentBar filled={filledSegments} />
        <p className="min-w-0 flex-1 text-left text-[11px] leading-snug text-slate-400">{p.remindersLabel}</p>
      </div>
    </div>
  );
}

function NoShowCard({ p, nested = false }: { p: PotentialNoShowPatient; nested?: boolean }) {
  const shell = nested
    ? 'rounded-xl border border-[rgba(0,9,50,0.08)] bg-white px-4 py-3.5'
    : `${card} p-4`;

  return (
    <div className={shell}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[15px] font-semibold leading-tight text-[#020617]">{p.name}</span>
            {p.risk ? <span className={noShowRiskPillClass(p.risk)}>{p.risk}</span> : null}
          </div>
          <p className="mt-1 text-[12px] font-medium leading-snug text-[#64748B]">
            {p.time} · {p.doctor}
          </p>
          <ul className="mt-2.5 space-y-2">
            {p.warnings.map((line, i) => (
              <li key={`${p.id}-w-${i}`} className="flex gap-2 text-[12px] font-normal leading-snug text-[#020617]">
                <PotentialNoShowAlertIcon />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          {p.footer ? (
            <p className="mt-2.5 text-[11px] font-medium leading-snug text-[#94A3B8]">{p.footer}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border border-[rgba(0,52,220,0.45)] bg-white px-3 py-2 text-[12px] font-semibold text-[rgb(0,52,220)] transition hover:bg-[rgba(0,52,220,0.06)]"
        >
          <PotentialNoShowCallIcon />
          Call
        </button>
      </div>
    </div>
  );
}

export function SchedulerRightPane({
  expanded,
  onExpand,
  remindersSent,
  onResendReminder,
  samMovedToNoShow,
  onMarkSamNoShow,
  toasts,
  onDismissToast: _onDismissToast,
  goodNewsFired,
  onOpenPreVisitSummary,
}: SchedulerRightPaneProps) {
  const noShowList: PotentialNoShowPatient[] = samMovedToNoShow
    ? [
        {
          id: 'sam',
          name: 'Sam Greene',
          risk: 'High Risk',
          time: '10:00 AM',
          doctor: 'Dr. Kumar',
          warnings: ['Missed last 2 appointments', 'No confirmation response'],
          footer: '2 no-shows in last 30 days',
        },
        ...POTENTIAL_NO_SHOWS_SEED.filter((row) => row.id !== 'sam-pns'),
      ]
    : POTENTIAL_NO_SHOWS_SEED;

  const unconfirmedBase = UNCONFIRMED_PATIENTS.filter((p) => !(samMovedToNoShow && p.id === 'sam'));
  const unconfirmedVisible = goodNewsFired ? unconfirmedBase.filter((p) => p.id === 'sam') : unconfirmedBase;
  const unconfirmedCount = goodNewsFired ? unconfirmedVisible.length : unconfirmedBase.length;

  const todaysPatientCount = TODAY_PATIENTS.length;
  const scheduleChangesKpiTotal = SCHEDULE_CHANGES_KPI_COUNT;
  const unansweredCount = UNANSWERED_THREADS.length;
  const copayCount = OUTSTANDING_COPAYS.length;
  const noShowCount = noShowList.length;

  const kpiDefs = useMemo(
    () => [
      {
        panel: 'unconfirmed' as const,
        label: 'Unconfirmed Appointments',
        count: unconfirmedCount,
        badge: unconfirmedCount,
        sub: undefined as string | undefined,
        Icon: CalendarDays,
      },
      {
        panel: 'potentialNoShow' as const,
        label: 'Potential No-Shows',
        count: noShowCount,
        badge: noShowCount,
        sub: undefined,
        Icon: CircleSlash2,
      },
      {
        panel: 'todaysPatients' as const,
        label: "Today's Patients",
        count: todaysPatientCount,
        badge: todaysPatientCount,
        sub: undefined,
        Icon: Users,
      },
      {
        panel: 'unansweredMessages' as const,
        label: 'Unanswered Patient Messages',
        count: unansweredCount,
        badge: unansweredCount,
        sub: undefined,
        Icon: MessageSquareDot,
      },
      {
        panel: 'outstandingCopays' as const,
        label: 'Outstanding Copays',
        count: copayCount,
        badge: copayCount,
        sub: undefined,
        Icon: DollarSign,
      },
      {
        panel: 'scheduleChanges' as const,
        label: 'Schedule Changes - Next 72 Hours',
        count: scheduleChangesKpiTotal,
        badge: scheduleChangesKpiTotal,
        sub: undefined,
        Icon: ArrowLeftRight,
      },
    ],
    [
      unconfirmedCount,
      noShowCount,
      todaysPatientCount,
      unansweredCount,
      copayCount,
      scheduleChangesKpiTotal,
    ],
  );

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute right-4 top-4 z-20 flex w-[418px] max-w-[calc(100vw-2rem)] flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-[418px] max-w-full shrink-0 items-start justify-center gap-3 rounded-none bg-white p-3 shadow-[var(--ds-shadow-card)]"
            data-name="SchedulerToast"
          >
            <SchedulerToastSuccessIcon />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-md bg-[#ecfdf5] px-2 py-1 text-[11px] font-semibold leading-none text-[#166534]">
                  Confirmed
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[11px] font-medium leading-none text-[#64748b]">{t.relativeTime}</span>
                  <button
                    type="button"
                    className="p-0.5 text-[#94a3b8] transition hover:text-slate-600"
                    aria-label="Expand notification"
                  >
                    <ChevronDown className="size-4" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>
              <p className="mt-2.5 font-['Inter',sans-serif] text-[14px] font-bold leading-snug text-[#020617]">
                {t.headlineOverride ?? `${t.patientName} Confirmed her appointment`}
              </p>
              <p className="mt-1 font-['Inter',sans-serif] text-[12px] font-normal leading-snug text-[#64748b]">
                {t.scheduleLine}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="w-full min-w-0 max-w-[1200px] mx-auto">
          {/* KPI: 2 per row; expanded option becomes one full-width card (same header) + children (sc2/sc3). */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            {[0, 1, 2].map((rowIdx) => {
              const left = kpiDefs[rowIdx * 2];
              const right = kpiDefs[rowIdx * 2 + 1];
              const leftOpen = expanded === left.panel;
              const rightOpen = expanded === right.panel;
              const rowOpen = leftOpen || rightOpen;

              if (!rowOpen) {
                return (
                  <Fragment key={rowIdx}>
                    <KpiCard
                      key={left.panel}
                      label={left.label}
                      count={left.count}
                      sub={left.sub}
                      badgeCount={left.badge}
                      Icon={left.Icon}
                      onClick={() => onExpand(expanded === left.panel ? 'none' : left.panel)}
                    />
                    <KpiCard
                      key={right.panel}
                      label={right.label}
                      count={right.count}
                      sub={right.sub}
                      badgeCount={right.badge}
                      Icon={right.Icon}
                      onClick={() => onExpand(expanded === right.panel ? 'none' : right.panel)}
                    />
                  </Fragment>
                );
              }

              const activeDef = leftOpen ? left : right;
              const siblingDef = leftOpen ? right : left;
              const listLabel = (LIST_LABEL_BY_PANEL[expanded] ?? 'Items') as string;

              let expandedChildren: ReactNode = null;
              if (expanded === 'unconfirmed') {
                expandedChildren = (
                  <>
                    {unconfirmedVisible.map((p) => (
                      <li key={p.id} className="min-w-0">
                        <UnconfirmedRow
                          nested
                          p={p}
                          sent={remindersSent[p.id]}
                          onResend={() => onResendReminder(p.id)}
                          onMenuMarkNoShow={onMarkSamNoShow}
                          showSamKebab={goodNewsFired && !samMovedToNoShow}
                        />
                      </li>
                    ))}
                  </>
                );
              } else if (expanded === 'potentialNoShow') {
                expandedChildren = (
                  <>
                    {noShowList.map((p) => (
                      <li key={p.id} className="min-w-0">
                        <NoShowCard nested p={p} />
                      </li>
                    ))}
                  </>
                );
              } else if (expanded === 'scheduleChanges') {
                expandedChildren = (
                  <>
                    {SCHEDULE_CHANGE_PAIRS.map((pair) => (
                      <li key={pair.id} className="min-w-0">
                        <ScheduleChangeMergedCard pair={pair} />
                      </li>
                    ))}
                  </>
                );
              } else if (expanded === 'todaysPatients') {
                expandedChildren = (
                  <>
                    {TODAY_PATIENTS.map((row) => (
                      <li key={row.id} className="min-w-0">
                        <TodayPatientRow nested row={row} onOpenPreVisitSummary={onOpenPreVisitSummary} />
                      </li>
                    ))}
                  </>
                );
              } else if (expanded === 'unansweredMessages') {
                expandedChildren = (
                  <>
                    {UNANSWERED_THREADS.map((t) => (
                      <li key={t.id} className="min-w-0">
                        <div className="rounded-xl border border-[rgba(0,9,50,0.08)] bg-white px-4 py-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[14px] font-semibold text-slate-900">{t.patient}</p>
                              <p className="mt-1 text-[12px] leading-snug text-slate-600">{t.preview}</p>
                            </div>
                            <span className="shrink-0 text-[11px] font-medium text-slate-400">{t.timeLabel}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                );
              } else if (expanded === 'outstandingCopays') {
                expandedChildren = (
                  <>
                    {OUTSTANDING_COPAYS.map((c) => (
                      <li key={c.id} className="min-w-0">
                        <div className="rounded-xl border border-[rgba(0,9,50,0.08)] bg-white px-4 py-3.5">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[14px] font-semibold text-slate-900">{c.patient}</span>
                            <span className="text-[14px] font-semibold text-slate-800">{c.amount}</span>
                          </div>
                          <p className="mt-1 text-[11px] font-medium text-slate-500">{c.daysPast} days past due</p>
                        </div>
                      </li>
                    ))}
                  </>
                );
              }

              return (
                <Fragment key={rowIdx}>
                  <div className="col-span-2 w-full min-w-0">
                    <ExpandedKpiUnified
                      label={activeDef.label}
                      count={activeDef.count}
                      sub={activeDef.sub}
                      badgeCount={activeDef.badge}
                      listLabel={listLabel}
                      Icon={activeDef.Icon}
                      onCollapse={() => onExpand('none')}
                    >
                      {expandedChildren}
                    </ExpandedKpiUnified>
                  </div>
                  <KpiCard
                    key={siblingDef.panel}
                    label={siblingDef.label}
                    count={siblingDef.count}
                    sub={siblingDef.sub}
                    badgeCount={siblingDef.badge}
                    Icon={siblingDef.Icon}
                    onClick={() => onExpand(siblingDef.panel)}
                  />
                  <div className="min-w-0" aria-hidden />
                </Fragment>
              );
            })}
          </div>

          <div className="mt-1">
            <SchedulerCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}

function TodayPatientRow({
  row,
  onOpenPreVisitSummary,
  nested = false,
}: {
  row: (typeof TODAY_PATIENTS)[number];
  onOpenPreVisitSummary: () => void;
  nested?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const shell = nested
    ? 'flex items-center justify-between rounded-xl border border-[rgba(0,9,50,0.08)] bg-white px-4 py-3'
    : 'flex items-center justify-between rounded-xl border border-[rgba(0,9,50,0.1)] bg-white px-4 py-3';

  return (
    <div className={shell}>
      <div>
        <div className="text-[14px] font-semibold text-slate-900">{row.name}</div>
        <div className="mt-0.5 text-[12px] font-medium text-slate-500">
          {row.time} · {row.doctor} · {row.visitType}
        </div>
      </div>
      <div className="relative" ref={ref}>
        <button
          type="button"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <MoreVertical className="size-4" />
        </button>
        {open ? (
          <div className="absolute right-0 top-10 z-30 min-w-[200px] rounded-xl border border-[rgba(0,9,50,0.12)] bg-white py-1">
            <button
              type="button"
              className="block w-full px-4 py-2.5 text-left text-[14px] text-slate-800 hover:bg-slate-50"
              onClick={() => {
                setOpen(false);
                onOpenPreVisitSummary();
              }}
            >
              Open pre visit summary
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
