/** Day grid for Cascade scheduler (April 2026) — matches Figma PoV calendar content. */

export const SCHEDULER_DOCTORS = [
  { fullName: 'Dr. Arushi Kumar', initials: 'AK' },
  { fullName: 'Dr. Aris J.', initials: 'AJ' },
  { fullName: 'Dr. Park', initials: 'JB' },
] as const;

/** Top-right pill on each card. */
export type ClinicalTag = 'follow-up' | 'evaluation';

/** Card chrome + bottom status line (Validated / Co-Pay Due / Overdue Balance). */
export type StatusKind = 'validated' | 'copay' | 'overdue';

export interface CalendarAppointment {
  id: string;
  /** Minutes from 7:00 AM (0 = 7:00). */
  startFrom7: number;
  durationMin: number;
  doctorIndex: 0 | 1 | 2;
  patient: string;
  clinicalTag: ClinicalTag;
  statusKind: StatusKind;
}

/** Visible window: 7:00 AM – 12:30 PM (330 min). */
export const CALENDAR_RANGE_MIN = 330;

/** Current time marker (07:47 AM). */
export const NOW_FROM_7_MIN = 47;

export const STATUS_LINE_LABEL: Record<StatusKind, string> = {
  validated: 'Validated',
  copay: 'Co-Pay Due',
  overdue: 'Overdue Balance',
};

/**
 * Appointments per Figma (times ~7:30 / 8:15 / 9:15 / 10:15; columns AK / AJ / JB).
 */
export const CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'anna',
    startFrom7: 30,
    durationMin: 45,
    doctorIndex: 0,
    patient: 'Anna Brooks',
    clinicalTag: 'follow-up',
    statusKind: 'validated',
  },
  {
    id: 'carlos',
    startFrom7: 30,
    durationMin: 45,
    doctorIndex: 1,
    patient: 'Carlos Vega',
    clinicalTag: 'follow-up',
    statusKind: 'copay',
  },
  {
    id: 'sarah',
    startFrom7: 30,
    durationMin: 45,
    doctorIndex: 2,
    patient: 'Sarah Miller',
    clinicalTag: 'evaluation',
    statusKind: 'validated',
  },
  {
    id: 'sasha',
    startFrom7: 75,
    durationMin: 45,
    doctorIndex: 0,
    patient: 'Sasha Kyle',
    clinicalTag: 'follow-up',
    statusKind: 'validated',
  },
  {
    id: 'sophia',
    startFrom7: 75,
    durationMin: 45,
    doctorIndex: 1,
    patient: 'Sophia Lewis',
    clinicalTag: 'follow-up',
    statusKind: 'validated',
  },
  {
    id: 'ethan',
    startFrom7: 75,
    durationMin: 45,
    doctorIndex: 2,
    patient: 'Ethan Hall',
    clinicalTag: 'evaluation',
    statusKind: 'copay',
  },
  {
    id: 'isabella',
    startFrom7: 135,
    durationMin: 45,
    doctorIndex: 0,
    patient: 'Isabella Clark',
    clinicalTag: 'evaluation',
    statusKind: 'copay',
  },
  {
    id: 'liam',
    startFrom7: 135,
    durationMin: 45,
    doctorIndex: 2,
    patient: 'Liam Johnson',
    clinicalTag: 'follow-up',
    statusKind: 'validated',
  },
  {
    id: 'james',
    startFrom7: 195,
    durationMin: 45,
    doctorIndex: 0,
    patient: 'James Martin',
    clinicalTag: 'evaluation',
    statusKind: 'copay',
  },
  {
    id: 'aiden',
    startFrom7: 195,
    durationMin: 45,
    doctorIndex: 2,
    patient: 'Aiden Lee',
    clinicalTag: 'follow-up',
    statusKind: 'overdue',
  },
];
