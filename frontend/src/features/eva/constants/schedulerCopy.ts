import type { ChatItem } from '../types';

/** Cascade scheduler + Eva chat copy (aligned with storyline screenshots). */

export const SC1_EVA_MESSAGE =
  'Good morning Maya. Two things need your attention before 10am. There are three unconfirmed appointments this morning and one patient flagged as a likely no-show. I\'d start there.';

export const SC2_EVA_REPLY =
  'Got it. I Opened up Upcoming Appointments on the right side. You could send the reminders again or watch a particular patient. After you click on watch, I shall send you all the updates regarding the patient.';

export const SC4_GOOD_NEWS =
  "Good news! I just confirmed that both Angela Wu and Maria Santos have confirmed their appointments. Sam Greene hasn't responded lately, so I will keep an eye and move it as a potential no-show if they don't answer in the next hour.";

export const SC6_SAM_MOVED =
  'I have moved Sam Greene as a "Potential No-Show" and saved the note, which I will use to further improve my future predictions.';

/** Trusted HTML for Eva chat. Spread into `ChatItem` with `kind: 'eva'` (includes `contentIsHtml`). */
export const SC7_SCHEDULE_CHANGES =
  "<p><b>Schedule Changes:</b> Two cancellations had come in over the weekend on Dr. Park's schedule. Both of them have already been filled - one returning patient, one new.</p><br/><p>One flag: John Smith is only forty percent through their digital patient intake. Not a problem yet. If they arrived without finishing, I would let you know before they reach the desk.</p><br/>Anything else I can let you know, Maya?";

export const SC7_SCHEDULE_CHANGES_CHAT_FIELDS = {
  content: SC7_SCHEDULE_CHANGES,
  contentIsHtml: true,
} as const satisfies Pick<ChatItem, 'content' | 'contentIsHtml'>;

export const SC9_NEW_PATIENT =
  "Their name is Sarah Chen. Copay is already confirmed, Digital Patient Intake is complete, their appointment is already on the schedule at 9:00 am.\nOnly thing left to do is greet them when arriving, everything else is covered.";

/** Partial match for move Sam (user story includes long note). */
export const MOVE_SAM_PREFIX = 'move sam to potential no-show';
