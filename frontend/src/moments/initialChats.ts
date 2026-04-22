import type { ChatItem } from '@/features/eva/types';
import { SC1_EVA_MESSAGE } from '@/features/eva/constants/schedulerCopy';
import { COMORBIDITIES_CHIP } from '@/features/eva/utils/ctaHints';
import type { MomentId } from './momentTypes';
import { MOMENT3_EVA_INTRO } from './moment3Copy';

const SCHEDULER_SC1_CHIP_LABELS = [
  'Get updates from the weekend',
  'Request confirmations',
  'View details of unconfirmed',
] as const;

const schedulerFrontDeskInitialChat: ChatItem[] = [
  { id: 'sc1', kind: 'eva', content: SC1_EVA_MESSAGE, timestamp: '07:47 am' },
  { id: 'c-un', kind: 'cascade-unconfirmed-card', timestamp: '07:47 am' },
  { id: 'c-ns', kind: 'cascade-noshow-card', timestamp: '07:47 am' },
  {
    id: 'sc1-chips',
    kind: 'suggestion-chips',
    suggestionLabels: [...SCHEDULER_SC1_CHIP_LABELS],
    timestamp: '07:47 am',
  },
];

const moment3FrontDeskInitialChat: ChatItem[] = [
  { id: 'm3-intro', kind: 'eva', content: MOMENT3_EVA_INTRO, timestamp: '09:00 am' },
  { id: 'm3-new-patient-card', kind: 'new-patient-checkin-card', timestamp: '09:00 am' },
];

const clinicianInitialChat: ChatItem[] = [
  {
    id: 'm2-intro',
    kind: 'eva',
    content:
      "<p>Good morning, Dr. Park. Sarah Chen is arriving at 9:00 AM. Your eval starts in a few minutes. She's on day 8 post total knee replacement. Pain is running 6 at rest, 8 with movement. Dr. Mitchell at Cascade Orthopedics wants a conservative PT approach with reassessment in six weeks.</p><br/><p>I've pulled her intake from Friday: her goals, sleep notes, and what she mentioned giving up since surgery. You flagged one item to follow up on in person: sleeping position.</p>",
    timestamp: '07:53 PM',
    contentIsHtml: true,
  },
  {
    id: 'm2-chips',
    kind: 'suggestion-chips',
    suggestionLabels: ['Begin Session', 'View referral document', COMORBIDITIES_CHIP, 'Show allergies'],
    timestamp: '07:53 PM',
  },
];

export function getInitialChatItems(momentId: MomentId): ChatItem[] {
  switch (momentId) {
    case 'moment1':
      return schedulerFrontDeskInitialChat;
    case 'moment3':
      return moment3FrontDeskInitialChat;
    case 'moment2':
      return clinicianInitialChat;
    default: {
      const _exhaustive: never = momentId;
      return _exhaustive;
    }
  }
}
