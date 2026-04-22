export type UnconfirmedId = 'angela' | 'maria' | 'sam';

export interface UnconfirmedPatient {
  id: UnconfirmedId;
  name: string;
  time: string;
  doctor: string;
  visitType: string;
  remindersLabel: string;
}

export const UNCONFIRMED_PATIENTS: UnconfirmedPatient[] = [
  {
    id: 'angela',
    name: 'Angela Wu',
    time: '10:00 AM',
    doctor: 'Dr. Kumar',
    visitType: 'Follow-up',
    remindersLabel: '2 of 3 reminders sent · Last: Apr 13, 6:00 PM',
  },
  {
    id: 'maria',
    name: 'Maria Santos',
    time: '1:00 PM',
    doctor: 'Dr. Aris',
    visitType: 'Initial Eval',
    remindersLabel: '3 of 3 reminders sent · Last: Apr 14, 8:00 AM',
  },
  {
    id: 'sam',
    name: 'Sam Greene',
    time: '2:30 PM',
    doctor: 'Dr. Aris',
    visitType: 'Follow-up',
    remindersLabel: '1 of 3 reminders sent · Last: Apr 14, 7:00 AM',
  },
];

export interface PotentialNoShowPatient {
  id: string;
  name: string;
  /** Use empty string when no risk pill (Figma: Aiden Lee). */
  risk: string;
  time: string;
  doctor: string;
  /** Each line renders with the warning triangle icon. */
  warnings: string[];
  /** Muted single line under warnings. */
  footer: string;
  /** Optional; used when rendering sc1-style chat lines (`Name · type | time · doctor`). */
  visitType?: string;
}

export const POTENTIAL_NO_SHOWS_SEED: PotentialNoShowPatient[] = [
  {
    id: 'sam-pns',
    name: 'Sam Greene',
    risk: 'High Risk',
    time: '10:00 AM',
    doctor: 'Dr. Kumar',
    warnings: ['Missed last 2 appointments', 'No confirmation response'],
    footer: '2 no-shows in last 30 days',
  },
  {
    id: 'isabella',
    name: 'Isabella Clark',
    risk: 'High Risk',
    time: '10:00 AM',
    doctor: 'Dr. Kumar',
    warnings: ['Missed last 2 appointments', 'No confirmation response'],
    footer: '2 no-shows in last 30 days',
  },
  {
    id: 'james',
    name: 'James Martinez',
    risk: 'Moderate',
    time: '11:00 AM',
    doctor: 'Dr. Kumar',
    warnings: ['Late cancellation pattern', 'Unconfirmed today'],
    footer: '1 no-show, 2 late cancels',
  },
  {
    id: 'maria-ns',
    name: 'Maria Santos',
    risk: 'Moderate',
    time: '1:00 PM',
    doctor: 'Dr. Aris',
    warnings: ['New patient — no history', '3 reminder attempts, no reply'],
    footer: 'First visit',
  },
  {
    id: 'aiden',
    name: 'Aiden Lee',
    risk: '',
    time: '11:30 AM',
    doctor: 'Dr. Joshi',
    warnings: ['Overdue balance $320', 'Declined last reschedule'],
    footer: '1 no-show in 60 days',
  },
];

/**
 * Left-chat “Potential No-Shows” preview row — matches new-design sc1
 * (`D. Martinez · Follow up | 4:00 PM · Dr. Kumar`).
 */
export const CHAT_POTENTIAL_NOSHOW_SC1: PotentialNoShowPatient = {
  id: 'd-martinez-chat',
  name: 'D. Martinez',
  risk: 'High Risk',
  time: '4:00 PM',
  doctor: 'Dr. Kumar',
  warnings: ['Likely no-show'],
  footer: '',
  visitType: 'Follow-up',
};

/** Visit labels as shown in sc1 chat cards (e.g. “Follow up”, “Initial Evaluation”). */
export function chatVisitTypeLabel(visitType: string): string {
  const v = visitType.trim();
  if (v === 'Follow-up' || v === 'Follow-Up') return 'Follow up';
  if (v === 'Initial Eval') return 'Initial Evaluation';
  return v;
}

export interface TodayPatientRow {
  id: string;
  name: string;
  time: string;
  doctor: string;
  visitType: string;
}

export const TODAY_PATIENTS: TodayPatientRow[] = [
  { id: 'p1', name: 'Sarah Chen', time: '9:00 AM', doctor: 'Dr. Kumar', visitType: 'Initial Eval' },
  { id: 'p2', name: 'Anna Brooks', time: '9:30 AM', doctor: 'Dr. Kumar', visitType: 'Follow-Up' },
  { id: 'p3', name: 'Carlos Vega', time: '10:15 AM', doctor: 'Dr. Aris', visitType: 'Follow-Up' },
];

export interface ScheduleChangeRow {
  id: string;
  title: string;
  subtitle: string;
  status: 'cancellation' | 'filled';
  meta?: string;
}

/** One merged card: cancellation (top) + filled slot (bottom), per schedule KPI design. */
export interface ScheduleChangePair {
  id: string;
  cancellation: {
    headline: string;
    slot: string;
  };
  filled: {
    headline: string;
    subtitle: string;
    /** e.g. “Smart waitlist filled” — gray supporting line */
    detail?: string;
    /** New-patient row shows intake progress */
    variant: 'returning' | 'newPatient';
    progressPct?: number;
    intakeStatus?: string;
  };
}

export interface UnansweredThreadRow {
  id: string;
  patient: string;
  preview: string;
  timeLabel: string;
}

/** Demo threads; KPI count = this array’s length. */
export const UNANSWERED_THREADS: UnansweredThreadRow[] = [
  {
    id: 'um1',
    patient: 'Jordan Ellis',
    preview: 'Can I move my Tuesday PT to Thursday?',
    timeLabel: '18m ago',
  },
  {
    id: 'um2',
    patient: 'Priya Nair',
    preview: 'Insurance card updated — need confirmation before visit.',
    timeLabel: '1h ago',
  },
  {
    id: 'um3',
    patient: 'Leo Han',
    preview: 'Post-op brace rubbing — is that normal?',
    timeLabel: '3h ago',
  },
  {
    id: 'um4',
    patient: 'Morgan Tate',
    preview: 'Running late by 15 min for 2:00 — still OK?',
    timeLabel: 'Yesterday',
  },
];

export interface OutstandingCopayRow {
  id: string;
  patient: string;
  amount: string;
  daysPast: number;
}

/** Demo accounts; KPI count = this array’s length. */
export const OUTSTANDING_COPAYS: OutstandingCopayRow[] = [
  { id: 'cp1', patient: 'Sarah Chen', amount: '$45', daysPast: 3 },
  { id: 'cp2', patient: 'Carlos Vega', amount: '$75', daysPast: 5 },
  { id: 'cp3', patient: 'Anna Brooks', amount: '$120', daysPast: 8 },
  { id: 'cp4', patient: 'Riley Chen', amount: '$385', daysPast: 12 },
];

/** Legacy flat rows (chat copy / tests); UI uses `SCHEDULE_CHANGE_PAIRS`. */
export const SCHEDULE_CHANGES: ScheduleChangeRow[] = [
  {
    id: 'c1',
    title: 'Marcus Rivera Cancelled — Dr. Park',
    subtitle: 'Mon 9:30 AM slot',
    status: 'cancellation',
  },
  {
    id: 'c2',
    title: 'Sarah Miller — Returning Patient',
    subtitle: 'Mon 9:30 AM · Dr. Park',
    status: 'filled',
    meta: 'Smart waitlist filled',
  },
  {
    id: 'c3',
    title: 'Shruti Gupta Cancelled — Dr. Kumar',
    subtitle: 'Mon 2:00 PM slot',
    status: 'cancellation',
  },
  {
    id: 'c4',
    title: 'John Smith — New Patient',
    subtitle: 'Mon 2:00 PM · Dr. Park',
    status: 'filled',
    meta: 'Digital intake in progress',
  },
];

/** Merged cards for expanded Schedule Changes (items 1+2, 3+4). KPI badge matches design. */
export const SCHEDULE_CHANGE_PAIRS: ScheduleChangePair[] = [
  {
    id: 'pair-1',
    cancellation: {
      headline: 'Marcus Rivera Cancelled – Dr. Park',
      slot: 'Mon 9:30 AM slot',
    },
    filled: {
      headline: 'Sarah Miller – Returning Patient',
      subtitle: 'Mon 9:30 AM · Dr. Park',
      detail: 'Smart waitlist filled',
      variant: 'returning',
    },
  },
  {
    id: 'pair-2',
    cancellation: {
      headline: 'Shruti Gupta Cancelled - Dr. Kumar',
      slot: 'Mon 2:00 PM slot',
    },
    filled: {
      headline: 'John Smith – New Patient',
      subtitle: 'Mon 2:00 PM · Dr. Park',
      variant: 'newPatient',
      progressPct: 40,
      intakeStatus: 'Digital intake in progress',
    },
  },
];

/** Red badge on Schedule Changes KPI tile (screenshot). */
export const SCHEDULE_CHANGES_KPI_COUNT = 3;
