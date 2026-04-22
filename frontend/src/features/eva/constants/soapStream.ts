/**
 * Step thresholds for progressive SOAP reveal (1..SOAP_STREAM_TOTAL_STEPS).
 * When `streamStep >= n`, content gated at `n` is visible (unless force-complete).
 */
export const SOAP_STEP = {
  AI_SUGGESTIONS: 1,
  HPI_INTRO: 2,
  HPI_HIGHLIGHT_1: 3,
  HPI_HIGHLIGHT_2: 4,
  HPI_HIGHLIGHT_3: 5,
  PAIN: 6,
  PT_GOALS: 7,
  PMH: 8,
  SURGICAL: 9,
  OBJ_SUGGEST_INCISION: 10,
  OBJ_ROM: 11,
  OBJ_STRENGTH: 12,
  OBJ_OUTCOME: 13,
  ASM_SUGGEST: 14,
  ASM_REHAB: 15,
  PLAN_SUGGEST: 16,
  PLAN_GOALS_1: 17,
  PLAN_GOALS_2: 18,
  PLAN_INTERVENTION: 19,
  BILLING: 20,
} as const;
