import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CALENDAR_APPOINTMENTS,
  CALENDAR_RANGE_MIN,
  NOW_FROM_7_MIN,
  SCHEDULER_DOCTORS,
  STATUS_LINE_LABEL,
  type CalendarAppointment,
  type ClinicalTag,
  type StatusKind,
} from './schedulerCalendarData';

const COL_HEIGHT_PX = 312;
const HEADER_ROW_PX = 36;

const HOUR_LABELS = [7, 8, 9, 10, 11, 12].map((h) => {
  if (h === 12) return '12:00 PM';
  return `${String(h).padStart(2, '0')}:00 AM`;
});

const clinicalLabel: Record<ClinicalTag, string> = {
  'follow-up': 'Follow-Up',
  evaluation: 'Evaluation',
};

const statusChrome: Record<
  StatusKind,
  { bar: string; border: string; bg: string; statusText: string }
> = {
  validated: {
    bar: 'bg-[#22c55e]',
    border: 'border-[#bbf7d0]',
    bg: 'bg-[#f0fdf4]',
    statusText: 'text-[#15803d]',
  },
  copay: {
    bar: 'bg-[#eab308]',
    border: 'border-[#fde68a]',
    bg: 'bg-[#fffbeb]',
    statusText: 'text-[#b45309]',
  },
  overdue: {
    bar: 'bg-[#f87171]',
    border: 'border-[#fecaca]',
    bg: 'bg-[#fef2f2]',
    statusText: 'text-[#dc2626]',
  },
};

const clinicalPillClass: Record<ClinicalTag, string> = {
  'follow-up': 'rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold leading-tight text-slate-700',
  evaluation: 'rounded-full bg-[#6e56cf] px-2 py-0.5 text-[10px] font-semibold leading-tight text-white',
};

function AppointmentBlock({ appt }: { appt: CalendarAppointment }) {
  const topPct = (appt.startFrom7 / CALENDAR_RANGE_MIN) * 100;
  const heightPct = (appt.durationMin / CALENDAR_RANGE_MIN) * 100;
  const chrome = statusChrome[appt.statusKind];

  return (
    <div
      className={`pointer-events-none absolute left-[4px] right-[4px] overflow-hidden rounded-lg border ${chrome.border} ${chrome.bg}`}
      style={{ top: `${topPct}%`, height: `${Math.max(heightPct, 10)}%` }}
    >
      <div className={`absolute bottom-0 left-0 top-0 w-[4px] rounded-l-lg ${chrome.bar}`} aria-hidden />
      <div className="flex h-full min-h-0 flex-col justify-between pl-3 pr-2 pb-2 pt-2">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 truncate text-[12px] font-semibold leading-tight text-[#020617]">{appt.patient}</div>
          <span className={`shrink-0 ${clinicalPillClass[appt.clinicalTag]}`}>{clinicalLabel[appt.clinicalTag]}</span>
        </div>
        <p className={`text-[11px] font-semibold leading-tight ${chrome.statusText}`}>{STATUS_LINE_LABEL[appt.statusKind]}</p>
      </div>
    </div>
  );
}

export function SchedulerCalendar() {
  const nowLinePct = NOW_FROM_7_MIN / CALENDAR_RANGE_MIN;
  const nowTopPx = HEADER_ROW_PX + nowLinePct * COL_HEIGHT_PX;

  return (
    <section
      className="overflow-hidden rounded-xl border border-[rgba(0,9,50,0.12)] bg-white"
      data-name="SchedulerCalendar"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(0,9,50,0.08)] px-4 py-3">
        <div className="text-[16px] font-semibold tracking-tight text-[#020617]">April 2026</div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white p-1.5 text-slate-500 transition hover:bg-slate-50"
            aria-label="Previous day"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Today
          </button>
          <button
            type="button"
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white p-1.5 text-slate-500 transition hover:bg-slate-50"
            aria-label="Next day"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex rounded-lg border border-[rgba(0,9,50,0.1)] bg-[#f1f5f9] p-0.5">
          {(['Day', 'Week', 'Month', 'Year'] as const).map((v, i) => (
            <button
              key={v}
              type="button"
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${
                i === 0 ? 'bg-white text-[#020617]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative flex min-w-[640px]" style={{ minHeight: HEADER_ROW_PX + COL_HEIGHT_PX }}>
          {/* Current time — pill in time gutter + line across columns (Figma). */}
          <div
            className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
            style={{ top: nowTopPx }}
          >
            <div className="flex w-[56px] shrink-0 justify-end pr-1.5">
              <span className="rounded-full bg-[#4e37f6] px-2 py-1 text-[10px] font-semibold leading-none text-white">
                07:47 AM
              </span>
            </div>
            <div className="h-[2px] min-w-0 flex-1 bg-[#4e37f6]" />
          </div>

          {/* Time labels */}
          <div className="relative z-10 w-[56px] shrink-0 border-r border-[rgba(0,9,50,0.08)] bg-white">
            <div className="h-9 border-b border-[rgba(0,9,50,0.08)]" aria-hidden />
            {HOUR_LABELS.map((label) => (
              <div
                key={label}
                className="flex h-[52px] items-start justify-end border-b border-[rgba(0,9,50,0.06)] pr-2 pt-1 text-[11px] font-medium text-slate-400"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Doctor columns */}
          <div className="grid min-w-0 flex-1 grid-cols-3">
            {SCHEDULER_DOCTORS.map((doc, docIdx) => (
              <div
                key={doc.fullName}
                className="border-r border-[rgba(0,9,50,0.08)] last:border-r-0"
                style={{ height: HEADER_ROW_PX + COL_HEIGHT_PX }}
              >
                <div className="flex h-9 items-center justify-center gap-2 border-b border-[rgba(0,9,50,0.08)] bg-white px-2">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600"
                    aria-hidden
                  >
                    {doc.initials}
                  </span>
                  <span className="min-w-0 truncate text-center text-[11px] font-semibold leading-tight text-[#020617]">
                    {doc.fullName}
                  </span>
                </div>
                <div className="relative bg-white" style={{ height: COL_HEIGHT_PX }}>
                  {HOUR_LABELS.map((_, h) => (
                    <div
                      key={h}
                      className="pointer-events-none absolute left-0 right-0 border-t border-[rgba(0,9,50,0.06)]"
                      style={{ top: `${(h / HOUR_LABELS.length) * 100}%` }}
                    />
                  ))}
                  {CALENDAR_APPOINTMENTS.filter((a) => a.doctorIndex === docIdx).map((a) => (
                    <AppointmentBlock key={a.id} appt={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
