import { useState } from 'react';
import { AlarmClock, ArrowUpRight, ChevronDown, ChevronUp, User } from 'lucide-react';
import type { ChatItem } from '../../types';
import { imgPatient } from '../../assets';
import {
  CHAT_POTENTIAL_NOSHOW_SC1,
  UNCONFIRMED_PATIENTS,
  chatVisitTypeLabel,
} from '../../scheduler/schedulerData';
import type { CtaHintId } from '../../utils/ctaHints';
import { EvaLogo } from '../icons/EvaLogo';
import { CTA_HINT, chatChipLabelToCtaHint, ctaHighlightClass } from '../../utils/ctaHints';
import { formatSessionClock } from '../../utils/format';
import { Tag } from '../shared/primitives';

/** `figma-make-moment3` Chat Widget/Accordion — outer shell (not scheduler column tint). */
const FIGMA_CHAT_WIDGET_ACCORDION =
  'box-border w-full min-w-0 overflow-hidden rounded-[12px] border border-[rgba(0,9,50,0.12)] bg-[#fcfcfd] text-left';

/** Figma Header1 / Header2 strip above task rows (`bg-[rgba(0,0,85,0.01)]`). */
const FIGMA_CASCADE_SECTION_HEADER = 'bg-[rgba(0,0,85,0.01)] border-b border-[rgba(0,9,50,0.12)]';

/** Same chrome as patient-card / insight when thread is no longer on scheduler (archived KPI rows). */
const THREAD_ARCHIVE_CARD =
  'box-border w-full min-w-0 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-4 text-left shadow-[var(--ds-shadow-card)]';

function InlineReminderBellIcon() {
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
      <path
        d="M12.8667 9.86683C13.4 10.9335 14 11.3335 14 11.3335H2C2 11.3335 4 10.0002 4 5.3335C4 3.1335 5.8 1.3335 8 1.3335C8.66667 1.3335 9.26667 1.46683 9.86667 1.80016M6.8667 14.0002C6.97829 14.2031 7.14233 14.3724 7.34169 14.4903C7.54106 14.6082 7.76842 14.6704 8.00003 14.6704C8.23165 14.6704 8.45901 14.6082 8.65837 14.4903C8.85773 14.3724 9.02178 14.2031 9.13337 14.0002M10 5.3335H14M12 3.3335V7.3335"
        stroke="#94A3B8"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function cascadeItemCountLabel(count: number) {
  return `${count} item${count === 1 ? '' : 's'}`;
}

/** sc1 chat card row: `Name · Visit type | Time · Doctor` */
function CascadeSc1Line({
  name,
  visitType,
  time,
  doctor,
}: {
  name: string;
  visitType: string;
  time: string;
  doctor: string;
}) {
  const vt = chatVisitTypeLabel(visitType);
  return (
    <p className="w-full text-left text-[12px] leading-relaxed text-slate-700">
      <span className="font-semibold text-slate-900">{name}</span>
      <span className="text-slate-400"> · </span>
      <span>{vt}</span>
      <span className="text-slate-300"> | </span>
      <span className="text-slate-600">{time}</span>
      <span className="text-slate-300"> · </span>
      <span className="text-slate-600">{doctor}</span>
    </p>
  );
}

/** Figma PoV: 48px rows, 20px-tall text line, alarm icon, list on `#f8fafc`. */
function UnconfirmedTaskRow({
  name,
  visitType,
  time,
  doctor,
}: {
  name: string;
  visitType: string;
  time: string;
  doctor: string;
}) {
  const vt = chatVisitTypeLabel(visitType);
  return (
    <li
      className="relative flex h-12 list-none items-stretch border-b border-[rgba(0,9,50,0.12)] last:border-b-0"
      data-name="UnconfirmedTaskRow"
    >
      <div className="flex h-12 w-full min-w-0 items-center gap-3 px-5">
        <AlarmClock className="size-4 shrink-0 text-[#135bec]" strokeWidth={1.25} aria-hidden />
        <div className="flex min-h-5 min-w-0 flex-1 items-center justify-between gap-3">
          <p className="min-w-0 truncate text-left text-[14px] leading-5">
            <span className="font-semibold text-[#020617]">{name}</span>
            <span className="font-normal text-[#94a3b8]"> · </span>
            <span className="font-normal text-[#64748b]">{vt}</span>
          </p>
          <p className="shrink-0 text-right text-[14px] font-normal leading-5 text-[#64748b]">
            {time} · {doctor}
          </p>
        </div>
      </div>
    </li>
  );
}

/** L-connector from parent card to child suggested actions (`figma-make-moment3` Frame4 + Arrow). */
function SchedulerChildActionConnector() {
  return (
    <div className="relative flex w-4 shrink-0 flex-col self-stretch" aria-hidden>
      <svg
        className="block h-1/2 w-full min-h-0 shrink-0"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 21.25 19.625"
      >
        <g id="Top">
          <path
            d="M0.624999 4V15C0.624999 17.2091 2.41586 19 4.625 19H20.625"
            id="Divider"
            stroke="var(--stroke-0, #000932)"
            strokeLinecap="round"
            strokeOpacity="0.121569"
            strokeWidth="1.25"
          />
        </g>
      </svg>
    </div>
  );
}

/** Figma PoV (e.g. 1960-61266): 216px card, 70px header, 48px rows, list `#f8fafc`. */
const UNCONFIRMED_CARD_SHELL =
  'box-border flex w-full min-w-0 flex-col overflow-hidden rounded-[12px] border border-[rgba(0,9,50,0.12)] bg-white text-left font-[\'Inter\',sans-serif]';

const UNCONFIRMED_CARD_HEADER =
  'flex h-[70px] shrink-0 items-center border-b border-[rgba(0,9,50,0.12)] bg-[rgba(0,0,85,0.01)] px-5';

/** 216 − 70 header = 146px list band; bottom padding balances 3×48px rows to spec height. */
const UNCONFIRMED_CARD_LIST =
  'm-0 box-border flex h-[146px] w-full list-none flex-col bg-[#f8fafc] pb-0.5 pt-0 text-left font-[\'Inter\',sans-serif]';

/** Left-chat KPI-style cascade (sc1 / sc2): title + “N items”, View details + chevron; list expands/collapses. */
function ChatCascadeUnconfirmedCard({ onOpen, readOnly = false }: { onOpen: () => void; readOnly?: boolean }) {
  const [expanded, setExpanded] = useState(true);
  if (readOnly) {
    return (
      <div data-name="ChatCascadeUnconfirmed" className={`${UNCONFIRMED_CARD_SHELL} h-[216px]`}>
        <div className={`${UNCONFIRMED_CARD_HEADER}`}>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="text-[16px] font-semibold leading-6 text-[#020617]">Unconfirmed Appointments</p>
            <p className="mt-0.5 text-[14px] font-normal leading-5 text-[#64748b]">
              {cascadeItemCountLabel(UNCONFIRMED_PATIENTS.length)}
            </p>
          </div>
        </div>
        <ul className={UNCONFIRMED_CARD_LIST}>
          {UNCONFIRMED_PATIENTS.map((p) => (
            <UnconfirmedTaskRow key={p.id} name={p.name} visitType={p.visitType} time={p.time} doctor={p.doctor} />
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div
      data-name="ChatCascadeUnconfirmed"
      className={`${UNCONFIRMED_CARD_SHELL} ${expanded ? 'h-[216px]' : ''}`}
    >
      <div className={`${UNCONFIRMED_CARD_HEADER} justify-between gap-3`}>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-[16px] font-semibold leading-6 text-[#020617]">Unconfirmed Appointments</p>
          <p className="mt-0.5 text-[14px] font-normal leading-5 text-[#64748b]">
            {cascadeItemCountLabel(UNCONFIRMED_PATIENTS.length)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#020617] shadow-sm transition hover:bg-[#f8fafc]"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white p-1.5 text-slate-600 shadow-sm transition hover:bg-[#f8fafc]"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse appointment list' : 'Expand appointment list'}
          >
            {expanded ? (
              <ChevronUp className="size-4" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronDown className="size-4" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </div>
      {expanded ? (
        <ul className={UNCONFIRMED_CARD_LIST}>
          {UNCONFIRMED_PATIENTS.map((p) => (
            <UnconfirmedTaskRow key={p.id} name={p.name} visitType={p.visitType} time={p.time} doctor={p.doctor} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Matches `figma-make-moment3` Chat Widget / Accordion + Header3. */
function ChatNewPatientCheckInCard({ onCheckIn }: { onCheckIn?: () => void }) {
  return (
    <div className="relative w-full min-w-0 shrink-0 rounded-[12px] bg-[#fcfcfd]" data-name="ChatNewPatientCheckIn">
      <div className="relative flex flex-col overflow-hidden rounded-[inherit] border border-[rgba(0,9,50,0.12)]">
        <div className="relative z-[1] min-h-[48px] w-full border-b border-[rgba(0,9,50,0.12)] bg-[rgba(0,0,85,0.01)]">
          <div className="flex min-h-[48px] w-full items-center justify-between gap-4 px-5 py-3">
            <p className="min-w-0 flex-1 truncate text-left text-[16px] font-medium leading-6 text-[#020617]">
              New Patient - Sarah Chen
            </p>
            <button
              type="button"
              onClick={() => onCheckIn?.()}
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-[12px] border border-[rgba(0,9,50,0.12)] bg-white px-3 text-[12px] font-medium leading-[18px] tracking-[0.04px] text-[#0f172a] shadow-sm transition hover:bg-[#f8fafc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-cta-ring)]"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatCascadeNoShowCard({ onOpen, readOnly = false }: { onOpen: () => void; readOnly?: boolean }) {
  const [expanded, setExpanded] = useState(true);
  if (readOnly) {
    return (
      <div
        data-name="ChatCascadeNoShow"
        className={`flex flex-col font-['Inter',sans-serif] ${FIGMA_CHAT_WIDGET_ACCORDION}`}
      >
        <div className={`px-5 py-4 ${FIGMA_CASCADE_SECTION_HEADER}`}>
          <p className="font-['Inter',sans-serif] text-[16px] font-medium leading-6 text-[#020617]">
            Potential No-Shows
          </p>
          <p className="mt-0.5 font-['Inter',sans-serif] text-[14px] font-normal leading-5 text-[#64748b]">
            {cascadeItemCountLabel(1)}
          </p>
        </div>
        <ul className="m-0 min-h-0 w-full list-none p-0 text-left font-['Inter',sans-serif]">
          <li>
            <CascadeSc1Line
              name={CHAT_POTENTIAL_NOSHOW_SC1.name}
              visitType={CHAT_POTENTIAL_NOSHOW_SC1.visitType ?? 'Follow-up'}
              time={CHAT_POTENTIAL_NOSHOW_SC1.time}
              doctor={CHAT_POTENTIAL_NOSHOW_SC1.doctor}
            />
          </li>
        </ul>
      </div>
    );
  }
  return (
    <div
      data-name="ChatCascadeNoShow"
      className={`flex flex-col font-['Inter',sans-serif] ${FIGMA_CHAT_WIDGET_ACCORDION}`}
    >
      <div className={`flex items-start justify-between gap-2 px-5 py-3 text-left ${FIGMA_CASCADE_SECTION_HEADER}`}>
        <div className="min-w-0 flex-1">
          <p className="font-['Inter',sans-serif] text-[16px] font-medium leading-6 text-[#020617]">
            Potential No-Shows
          </p>
          <p className="mt-0.5 font-['Inter',sans-serif] text-[14px] font-normal leading-5 text-[#64748b]">
            {cascadeItemCountLabel(1)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-slate-50/90 px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-lg border border-[rgba(0,9,50,0.12)] bg-white p-1.5 text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse patient list' : 'Expand patient list'}
          >
            {expanded ? (
              <ChevronUp className="size-4" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronDown className="size-4" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </div>
      {expanded ? (
        <ul className="m-0 min-h-0 w-full list-none p-0 text-left font-['Inter',sans-serif]">
          <li className="border-b-0 px-4 py-2">
            <CascadeSc1Line
              name={CHAT_POTENTIAL_NOSHOW_SC1.name}
              visitType={CHAT_POTENTIAL_NOSHOW_SC1.visitType ?? 'Follow-up'}
              time={CHAT_POTENTIAL_NOSHOW_SC1.time}
              doctor={CHAT_POTENTIAL_NOSHOW_SC1.doctor}
            />
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function ChatBubble({
  item,
  sessionSeconds,
  onOpenSummary,
  highlightPatientSummary = false,
  onSchedulerViewUnconfirmed,
  onSchedulerViewNoShow,
  onMoment3CheckIn,
  figmaWorkspaceChat = false,
  schedulerChrome = false,
  onQuickAction,
  ctaHints,
}: {
  item: ChatItem;
  sessionSeconds: number;
  onOpenSummary: () => void;
  highlightPatientSummary?: boolean;
  onSchedulerViewUnconfirmed?: () => void;
  onSchedulerViewNoShow?: () => void;
  onMoment3CheckIn?: () => void;
  /** Typography + chrome aligned with `figma-make-moment3` chat export. */
  figmaWorkspaceChat?: boolean;
  schedulerChrome?: boolean;
  onQuickAction?: (label: string) => void;
  ctaHints?: ReadonlySet<CtaHintId>;
}) {
  if (item.kind === 'suggestion-chips') {
    const labels = item.suggestionLabels ?? [];
    const body = (
      <>
        <p
          className={`text-left text-[12px] font-medium leading-[18px] tracking-[0.04px] ${schedulerChrome ? 'text-[#64748b]' : 'mb-3 text-[11px] leading-none tracking-wide text-[var(--ds-text-muted)]'
            }`}
        >
          Suggested actions
        </p>
        <div className={`flex ${schedulerChrome ? 'items-start gap-2 pt-3' : 'flex-wrap gap-2'}`}>
          {schedulerChrome ? <SchedulerChildActionConnector /> : null}
          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            {labels.map((label, idx) => {
              const hint = chatChipLabelToCtaHint(label);
              const isHighlighted = Boolean(ctaHints && hint !== null && ctaHints.has(hint));
              const Icon = ArrowUpRight;
              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => onQuickAction?.(label)}
                  {...(isHighlighted && hint ? { 'data-cta-hint': hint } : {})}
                  aria-label={label}
                  className={`inline-flex min-h-0 max-w-full cursor-pointer items-center justify-start gap-2 font-['Inter',sans-serif] font-medium transition ${schedulerChrome
                      ? `rounded-xl border border-[rgba(0,9,50,0.12)] bg-[#f8fafc] px-[17px] py-[9px] text-left text-[14px] leading-5 text-[#020617] hover:bg-[#f1f5f9] ${ctaHighlightClass(isHighlighted, 'none')}`
                      : `inline-flex min-h-[40px] border border-[var(--ds-border-accent)] px-4 py-2 text-[12px] leading-snug text-[var(--ds-primary-action)] ${ctaHighlightClass(isHighlighted, 'pill')} rounded-[var(--ds-radius-pill)] bg-white hover:bg-[var(--ds-bg-secondary)]`
                    }`}
                >
                  <span
                    className={`inline-flex size-4 shrink-0 items-center justify-center ${schedulerChrome ? 'text-[#64748b]' : 'size-[18px] text-[var(--ds-primary-action)]'
                      }`}
                    aria-hidden
                  >
                    <Icon className={schedulerChrome ? 'size-4' : 'size-3.5'} strokeWidth={1.25} />
                  </span>
                  <span className="inline-flex min-w-0 items-center text-left">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
    /** sc1 / sc2: suggested actions sit in the chat column with no outer card — only the chip pills are bordered. */
    return (
      <div
        data-name="ChatSuggestionChips"
        className={`flex w-full min-w-0 flex-col justify-start text-left font-['Inter',sans-serif] ${schedulerChrome ? '' : 'max-w-[min(100%,440px)]'
          }`}
      >
        {body}
      </div>
    );
  }

  if (item.kind === 'cascade-unconfirmed-card') {
    return (
      <ChatCascadeUnconfirmedCard
        readOnly={!schedulerChrome}
        onOpen={() => onSchedulerViewUnconfirmed?.()}
      />
    );
  }

  if (item.kind === 'cascade-noshow-card') {
    return <ChatCascadeNoShowCard readOnly={!schedulerChrome} onOpen={() => onSchedulerViewNoShow?.()} />;
  }

  if (item.kind === 'new-patient-checkin-card') {
    return <ChatNewPatientCheckInCard onCheckIn={onMoment3CheckIn} />;
  }

  if (item.kind === 'inline-reminder-card') {
    const detail = item.content?.trim() ?? '';
    return (
      <div
        data-name="InlineReminderCard"
        className={`flex w-full min-w-0 justify-start font-['Inter',sans-serif] ${schedulerChrome ? '' : 'max-w-[min(100%,440px)]'}`}
      >
        <div className="flex w-full min-w-0 max-w-full items-center gap-3 rounded-xl border border-[rgba(0,9,50,0.12)] bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
            <InlineReminderBellIcon />
          </div>
          <p className="min-w-0 flex-1 text-left text-[14px] leading-snug text-[#020617]">
            <span className="font-semibold">New Reminder:</span>
            {detail ? <> {detail}</> : null}
          </p>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-[rgba(0,9,50,0.14)] bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View all
          </button>
        </div>
      </div>
    );
  }

  if (item.kind === 'patient-card') {
    return (
      <div
        data-name="ChatPatientCard"
        className="w-full rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[16px] shadow-[var(--ds-shadow-card)]"
      >
        <div className="flex items-start gap-[12px]">
          <img src={imgPatient} alt="Sarah Chen" className="size-[40px] rounded-[var(--ds-radius-card)] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="mb-[4px] flex items-center justify-between gap-[12px]">
              <div>
                <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">
                  Sarah Chen
                </p>
                <p className="font-['Inter',sans-serif] text-[12px] font-normal leading-[18px] text-[var(--ds-text-secondary)]">
                  (Brachial Plexus Injury) is ready for evaluation.
                </p>
              </div>
              <span className="rounded-[var(--ds-radius-xs)] bg-[var(--ds-bg-accent-purple)] px-[8px] py-[4px] font-['Inter',sans-serif] text-[10px] font-semibold leading-none text-[var(--ds-primary-brand)]">
                Checked in
              </span>
            </div>
            <div className="mt-[12px] font-['Inter',sans-serif] text-[12px] leading-[18px] text-[var(--ds-text-primary)]">
              <p className="mb-[4px] font-semibold">Intake flags:</p>
              <ul className="list-disc space-y-[4px] pl-[16px]">
                <li>Pain level reported: 7/10</li>
                <li>Tingling in fingers</li>
                <li>Post-surgical case (6 weeks)</li>
              </ul>
            </div>
            <div className="mt-[12px] flex flex-wrap gap-[8px]">
              <Tag tone="amber">New patient</Tag>
              <Tag tone="purple">Intake evaluation</Tag>
              <Tag tone="rose">Latex Allergy</Tag>
            </div>
            <button
              type="button"
              {...(highlightPatientSummary ? { 'data-cta-hint': CTA_HINT.OPEN_PREVISIT_SUMMARY } : {})}
              className={`mt-[12px] rounded-[var(--ds-radius-button)] bg-[var(--ds-primary-action)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-white ${ctaHighlightClass(highlightPatientSummary, 'button')}`}
              onClick={onOpenSummary}
            >
              Open pre visit summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === 'insight') {
    return (
      <div
        data-name="ChatInsight"
        className="w-full p-[16px] font-['Inter',sans-serif] text-[14px] font-normal leading-[24px] text-[var(--ds-text-primary)]"
      >
        {item.content}
        <div className="mt-[8px] text-[11px] leading-[16px] text-[var(--ds-text-muted)]">{item.timestamp}</div>
      </div>
    );
  }

  if (item.kind === 'session-widget') {
    return (
      <div
        data-name="ChatSessionWidget"
        className="w-full rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] p-[16px] shadow-[var(--ds-shadow-card)]"
      >
        <p className="font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">
          Session Started
        </p>
        <div className="mt-[12px] flex items-center justify-between gap-[16px]">
          <div className="min-w-0 flex-1">
            <p className="font-['Inter',sans-serif] text-[20px] font-medium tracking-[0.1em] text-[var(--ds-text-primary)]">
              {formatSessionClock(sessionSeconds)}
            </p>
            <div className="mt-[8px] flex items-center gap-[6px]">
              {[8, 13, 10, 18, 7, 16, 9, 12, 5, 14, 8, 15, 11].map((height, index) => (
                <span
                  key={`bar-${index}`}
                  className="block rounded-full bg-[var(--ds-primary-action)]"
                  style={{ height: `${height}px`, width: '2px', opacity: index > 6 ? 0.2 : 1 }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] px-[12px] py-[8px] font-['Inter',sans-serif] text-[12px] font-semibold leading-[18px] text-[var(--ds-text-secondary)]"
          >
            View Transcript
          </button>
        </div>
        <div className="mt-[8px] text-[11px] text-[var(--ds-text-muted)]">{item.timestamp}</div>
      </div>
    );
  }

  if (item.kind === 'prompt') {
    return (
      <div
        data-name="ChatPrompt"
        className="w-fit rounded-[var(--ds-radius-pill)] border border-[var(--ds-border-accent)] bg-[var(--ds-warning-surface)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] text-[var(--ds-warning-text)]"
      >
        {item.content}
      </div>
    );
  }

  const isUser = item.kind === 'user';
  return (
    <div
      className={`flex min-w-0 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      data-name={isUser ? 'ChatUser' : 'ChatEva'}
    >
      <div
        className={
          isUser
            ? 'flex w-full min-w-0 flex-col items-end gap-1.5'
            : 'w-full min-w-0'
        }
      >
        {!isUser && (
          <div
            className={`mb-2 flex items-center justify-between gap-3 font-['Inter',sans-serif] ${figmaWorkspaceChat
                ? 'text-[14px] font-normal normal-case tracking-normal text-[#64748b]'
                : `text-[11px] font-semibold uppercase leading-none tracking-[0.08em] ${schedulerChrome ? 'text-indigo-600' : 'text-[var(--ds-primary-accent)]'
                }`
              }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex shrink-0 items-center justify-center rounded-[12px] ${figmaWorkspaceChat
                    ? 'size-8 bg-[#ebf0ff] text-[#6e56cf]'
                    : schedulerChrome
                      ? 'size-5 rounded-full bg-indigo-100 text-indigo-700'
                      : 'size-5 rounded-full bg-[var(--ds-bg-accent-purple)] text-[var(--ds-primary-action)]'
                  }`}
              >
                <EvaLogo className={figmaWorkspaceChat ? 'size-[14px]' : 'size-[11px]'} decorative />
              </span>
            </div>
            {item.timestamp ? (
              <time
                className={`shrink-0 font-normal normal-case tracking-normal ${figmaWorkspaceChat
                    ? 'text-[14px] text-[#64748b] opacity-60'
                    : schedulerChrome
                      ? 'text-[11px] font-medium text-slate-400'
                      : 'text-[11px] font-medium text-[var(--ds-text-muted)]'
                  }`}
              >
                {item.timestamp}
              </time>
            ) : null}
          </div>
        )}
        <div
          className={
            isUser
              ? `inline-block max-w-[80%] min-w-0 break-words text-left font-['Inter',sans-serif] text-[14px] font-normal leading-relaxed bg-[#eef2f7] px-4 py-3 text-[var(--ds-text-primary)] ${schedulerChrome
                ? 'rounded-2xl shadow-sm'
                : 'rounded-[var(--ds-radius-card)] shadow-[var(--ds-shadow-card)]'
              }`
              : figmaWorkspaceChat
                ? `whitespace-pre-wrap border-0 bg-transparent px-0 py-0 text-left font-['Inter',sans-serif] text-[16px] font-normal leading-[28px] text-[#020617] shadow-none`
                : schedulerChrome
                  ? `whitespace-pre-wrap border-0 bg-transparent px-0 py-2 text-left font-['Inter',sans-serif] text-[14px] font-normal leading-relaxed text-slate-800 shadow-none`
                  : `box-border w-full min-w-0 p-4 font-['Inter',sans-serif] text-[14px] font-normal leading-relaxed text-[var(--ds-text-primary)]`
          }
        >
          {!isUser && item.contentIsHtml ? (
            <div
              className="eva-html-content [&_b]:font-semibold [&_strong]:font-semibold [&_p]:m-0 [&_p+p]:mt-3 [&_br]:block"
              dangerouslySetInnerHTML={{ __html: item.content ?? '' }}
            />
          ) : (
            item.content
          )}
        </div>
        {isUser && item.timestamp ? (
          <div
            className={`max-w-[80%] text-[11px] font-medium text-right ${schedulerChrome ? 'text-slate-400' : 'text-[var(--ds-text-muted)]'
              }`}
          >
            {item.timestamp}
          </div>
        ) : null}
      </div>
    </div>
  );
}
