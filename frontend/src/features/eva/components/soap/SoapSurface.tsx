import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { SOAP_STEP } from '../../constants/soapStream';
import { useSoapStreamProgress, SOAP_STREAM_TOTAL_STEPS } from '../../hooks/useSoapStreamProgress';
import type { WorkflowStage } from '../../types';
import type { CtaHintId } from '../../utils/ctaHints';
import { CTA_HINT, ctaHighlightClass } from '../../utils/ctaHints';
import { formatSessionClock } from '../../utils/format';
import {
  ClinicalTable,
  GoalText,
  Highlight,
  InfoBlock,
  SleepTableRow,
  SmallChip,
  SuggestionRow,
} from '../shared/primitives';
import { EditableChiefComplaint } from './EditableChiefComplaint';
import { IntakeSummaryStrip } from './IntakeSummaryStrip';
import { PatientDataCard } from './PatientDataCard';
import { SoapSectionCard } from './SoapSectionCard';
import { SoapSectionNav } from './SoapSectionNav';
import { SoapStreamingFeedback } from './SoapStreamingFeedback';

export function SoapSurface({
  stage,
  recordingActive,
  sessionPaused,
  sessionSeconds,
  showHighlight,
  sleepTableVisible,
  sleepDisturbanceAccepted,
  chiefComplaint,
  chiefComplaintFocused,
  mentionVisible,
  leftPanelCollapsed,
  onSleepPosition,
  onAcceptSleep,
  onPause,
  onStop,
  onChiefComplaintChange,
  onChiefComplaintFocus,
  onSelectMention,
  onDismissClinicalTags,
  scrollContainerRef,
  ctaHints,
}: {
  stage: WorkflowStage;
  recordingActive: boolean;
  sessionPaused: boolean;
  sessionSeconds: number;
  showHighlight: boolean;
  sleepTableVisible: boolean;
  sleepDisturbanceAccepted: boolean;
  chiefComplaint: string;
  chiefComplaintFocused: boolean;
  mentionVisible: boolean;
  leftPanelCollapsed: boolean;
  onSleepPosition: () => void;
  onAcceptSleep: () => void;
  onPause: () => void;
  onStop: () => void;
  onChiefComplaintChange: (value: string) => void;
  onChiefComplaintFocus: (focused: boolean) => void;
  onSelectMention: (value: string) => void;
  onDismissClinicalTags: () => void;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  ctaHints: ReadonlySet<CtaHintId>;
}) {
  const showRecordingControls = stage === 'session' || stage === 'sessionAccepted';
  const streamComplete = showHighlight || stage === 'sessionAccepted' || stage === 'sessionStopped';
  const isStreamingSoap = stage === 'session' && recordingActive && !streamComplete;
  const { step, progress } = useSoapStreamProgress(isStreamingSoap, sessionPaused, streamComplete);

  const showGeneratedSoap = streamComplete || step > 0;
  const showPlanInNav = streamComplete || step >= SOAP_STEP.PLAN_SUGGEST;
  const subjectiveEditable = stage === 'session' || stage === 'sessionAccepted';

  const vis = (minStep: number) => streamComplete || step >= minStep;

  const [activeSoapSection, setActiveSoapSection] = useState('subjective');
  const subjectiveRef = useRef<HTMLDivElement | null>(null);
  const objectiveRef = useRef<HTMLDivElement | null>(null);
  const assessmentRef = useRef<HTMLDivElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);
  const billingRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (section: string, sectionRef: RefObject<HTMLDivElement | null>) => {
    setActiveSoapSection(section);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useLayoutEffect(() => {
    const root = scrollContainerRef.current;
    if (!root || step < 1) return;
    const el = root.querySelector(`[data-soap-stream-anchor="${step}"]`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step, scrollContainerRef]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const updateActiveSection = () => {
      const sectionOffset = scrollContainer.getBoundingClientRect().top + 32;
      const sectionRefs = [
        ['subjective', subjectiveRef],
        ['objective', objectiveRef],
        ['assessment', assessmentRef],
        ...(showPlanInNav ? [['plan', planRef], ['billing', billingRef]] : []),
      ] as const;

      let nextActive = sectionRefs[0][0];
      sectionRefs.forEach(([section, sectionRef]) => {
        const element = sectionRef.current;
        if (element && element.getBoundingClientRect().top <= sectionOffset) {
          nextActive = section;
        }
      });
      setActiveSoapSection(nextActive);
    };

    updateActiveSection();
    scrollContainer.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      scrollContainer.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [scrollContainerRef, showPlanInNav]);

  const showStreamFeedback = isStreamingSoap && !sessionPaused && step < SOAP_STREAM_TOTAL_STEPS;

  return (
    <div data-name="SoapSurface" className="relative space-y-[16px] pr-[40px]">
      <SoapSectionNav
        showPlanSections={showPlanInNav}
        activeSection={activeSoapSection}
        onSubjective={() => scrollToSection('subjective', subjectiveRef)}
        onObjective={() => scrollToSection('objective', objectiveRef)}
        onAssessment={() => scrollToSection('assessment', assessmentRef)}
        onPlan={() => scrollToSection('plan', planRef)}
        onBilling={() => scrollToSection('billing', billingRef)}
      />

      <div className="flex items-center justify-between rounded-[var(--ds-radius-card)] bg-[var(--ds-bg-primary)] px-[20px] py-[16px] shadow-[var(--ds-shadow-card)]">
        <h2 className="font-['Inter',sans-serif] text-[30px] font-semibold leading-[36px] tracking-tight text-[var(--ds-text-primary)]">
          SOAP Note
        </h2>
        <div className="flex items-center gap-[12px]">
          <div className="rounded-[var(--ds-radius-pill)] border border-[var(--ds-danger-soft-bg)] px-[16px] py-[6px] font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-danger)]">
            <span className="mr-[8px] inline-block size-[8px] rounded-full bg-[var(--ds-danger)]" aria-hidden />
            REC {formatSessionClock(sessionSeconds)}
          </div>
          {showRecordingControls && (
            <>
              <button
                type="button"
                onClick={onPause}
                className="rounded-[var(--ds-radius-button)] border border-[var(--ds-border)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] leading-[20px] text-[var(--ds-text-secondary)]"
              >
                {sessionPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                type="button"
                onClick={onStop}
                {...(ctaHints.has(CTA_HINT.STOP_SESSION) ? { 'data-cta-hint': CTA_HINT.STOP_SESSION } : {})}
                className={`rounded-[var(--ds-radius-button)] border border-[var(--ds-border)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] leading-[20px] text-[var(--ds-text-secondary)] ${ctaHighlightClass(ctaHints.has(CTA_HINT.STOP_SESSION), 'button')}`}
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <SoapStreamingFeedback visible={showStreamFeedback} progress={progress} />

      <PatientDataCard />
      <IntakeSummaryStrip />

      <div ref={subjectiveRef} className="scroll-mt-[24px] rounded-[var(--ds-radius-card)] border border-[var(--ds-border)] bg-[var(--ds-bg-primary)] shadow-[var(--ds-shadow-card)]">
        <div className="flex items-center justify-between border-b border-[var(--ds-border)] px-[20px] py-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="flex size-[28px] items-center justify-center rounded-full bg-[var(--ds-primary-action)] font-['Inter',sans-serif] text-[14px] font-semibold text-white">
              S
            </div>
            <p className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[28px] text-[var(--ds-text-primary)]">Subjective</p>
          </div>
          <div className="flex items-center gap-[8px] font-['Inter',sans-serif] text-[14px] text-[var(--ds-text-secondary)]">
            3 items
            <ChevronDown className="size-[14px]" strokeWidth={1.5} aria-hidden />
          </div>
        </div>

        {vis(SOAP_STEP.AI_SUGGESTIONS) && (
          <div
            className="border-b border-[var(--ds-border)] px-[20px] py-[12px]"
            data-soap-stream-anchor={SOAP_STEP.AI_SUGGESTIONS}
          >
            <p className="mb-[8px] font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-primary-accent)]">
              AI Suggestions
            </p>
            <div className="flex flex-wrap gap-[8px]">
              <SmallChip>Grip Strength</SmallChip>
              <span
                className={`inline-block ${ctaHighlightClass(ctaHints.has(CTA_HINT.SLEEP_POSITION), 'button')}`}
                {...(ctaHints.has(CTA_HINT.SLEEP_POSITION) ? { 'data-cta-hint': CTA_HINT.SLEEP_POSITION } : {})}
              >
                <SmallChip active={sleepTableVisible} onClick={onSleepPosition}>
                  Sleep Position
                </SmallChip>
              </span>
              <SmallChip>Pain Medication Use</SmallChip>
              <SmallChip>Radiation Pattern</SmallChip>
              <SmallChip>ADL Functional Screen</SmallChip>
            </div>
          </div>
        )}

        <div className="space-y-[20px] px-[20px] py-[16px]">
          {sleepTableVisible && (
            <div className="overflow-hidden rounded-[var(--ds-radius-card)] border border-[var(--ds-border)]">
              <div className="flex items-center justify-between bg-[var(--ds-bg-secondary)] px-[16px] py-[8px] font-['Inter',sans-serif] text-[14px] font-semibold leading-[20px] text-[var(--ds-text-primary)]">
                Sleep Disturbance
                <button
                  type="button"
                  onClick={onAcceptSleep}
                  {...(ctaHints.has(CTA_HINT.ACCEPT_SLEEP) ? { 'data-cta-hint': CTA_HINT.ACCEPT_SLEEP } : {})}
                  className={`rounded-[var(--ds-radius-button)] bg-[var(--ds-primary-action)] px-[12px] py-[6px] font-['Inter',sans-serif] text-[12px] font-medium leading-[18px] text-white ${ctaHighlightClass(ctaHints.has(CTA_HINT.ACCEPT_SLEEP), 'button')}`}
                >
                  Accept
                </button>
              </div>
              <table className="w-full text-left">
                <tbody>
                  <SleepTableRow label="Pattern" value="Difficulty sleeping on affected (right) side" />
                  <SleepTableRow label="Duration" value="Past 3-4 weeks" />
                  <SleepTableRow label="Impact" value="Reports 4-5 hrs interrupted sleep per night." />
                </tbody>
              </table>
            </div>
          )}

          <EditableChiefComplaint
            label="Chief Complaint"
            value={chiefComplaint}
            editable={subjectiveEditable}
            focused={chiefComplaintFocused}
            mentionVisible={mentionVisible}
            onChange={onChiefComplaintChange}
            onFocusChange={onChiefComplaintFocus}
            onSelectMention={onSelectMention}
            onDismissClinicalTags={onDismissClinicalTags}
          />

          <div>
            <p className="mb-[8px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
              {showGeneratedSoap ? 'HPI' : 'History of Present Condition'}
            </p>
            <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-[32px] text-[var(--ds-text-primary)]">
              {!vis(SOAP_STEP.HPI_INTRO) ? (
                <>
                  The patient reports a gradual onset of right shoulder pain over the past 3-4 months. She was diagnosed with a rotator cuff complete tear for
                  which she got operated 10 weeks prior to evaluation.
                </>
              ) : (
                <>
                  <span data-soap-stream-anchor={SOAP_STEP.HPI_INTRO}>
                    The patient reports gradual onset of right shoulder pain over the past 3-4 months. She was diagnosed with a rotator cuff complete tear for
                    which she got operated 10 weeks prior to evaluation.
                  </span>{' '}
                  {vis(SOAP_STEP.HPI_HIGHLIGHT_1) ? (
                    <span data-soap-stream-anchor={SOAP_STEP.HPI_HIGHLIGHT_1} className="inline">
                      <Highlight>
                        Following surgery, the patient reports incomplete recovery of shoulder function, with persistent pain and progressive difficulty in
                        raising her right arm above shoulder level.
                      </Highlight>
                    </span>
                  ) : null}
                  {vis(SOAP_STEP.HPI_HIGHLIGHT_1) && vis(SOAP_STEP.HPI_HIGHLIGHT_2) ? ' ' : null}
                  {vis(SOAP_STEP.HPI_HIGHLIGHT_2) ? (
                    <span data-soap-stream-anchor={SOAP_STEP.HPI_HIGHLIGHT_2} className="inline">
                      <Highlight>
                        She reports significant limitations in overhead activities such as reaching overhead for kitchen cabinets, combing her hair and unable to
                        perform gardening activities.
                      </Highlight>
                    </span>
                  ) : null}
                  {vis(SOAP_STEP.HPI_HIGHLIGHT_2) && vis(SOAP_STEP.HPI_HIGHLIGHT_3) ? ' ' : null}
                  {vis(SOAP_STEP.HPI_HIGHLIGHT_3) ? (
                    <span data-soap-stream-anchor={SOAP_STEP.HPI_HIGHLIGHT_3} className="inline">
                      <Highlight>
                        The pain is localized to the right shoulder, worsened by active abduction and forward flexion, and is associated with mild weakness in the
                        right upper extremity.
                      </Highlight>
                    </span>
                  ) : null}
                </>
              )}
            </p>
          </div>

          {vis(SOAP_STEP.PAIN) && (
            <div data-soap-stream-anchor={SOAP_STEP.PAIN}>
              <InfoBlock label="Pain Presentation">
                On the Numeric Pain Rating Scale (NPRS), the patient reports 8/10 pain with movement and 6/10 at rest.
              </InfoBlock>
            </div>
          )}

          {vis(SOAP_STEP.PT_GOALS) && (
            <div data-soap-stream-anchor={SOAP_STEP.PT_GOALS}>
              <InfoBlock label="Patient Goals">Patient desires to return to a prior level of function like gardening, cooking.</InfoBlock>
            </div>
          )}

          {vis(SOAP_STEP.PMH) && (
            <div data-soap-stream-anchor={SOAP_STEP.PMH}>
              <InfoBlock label="Past Medical History">No significant past medical history.</InfoBlock>
            </div>
          )}

          {vis(SOAP_STEP.SURGICAL) && (
            <div data-soap-stream-anchor={SOAP_STEP.SURGICAL}>
              <InfoBlock label="Surgical History">Arthroscopic rotator cuff repair prior to 10 weeks of evaluation.</InfoBlock>
            </div>
          )}

          {sleepDisturbanceAccepted && (
            <InfoBlock label="Sleep Disturbance">
              Difficulty sleeping on affected (right) side, Past 3-4 weeks, Reports 4-5 hrs interrupted sleep per night.
            </InfoBlock>
          )}
        </div>
      </div>

      <div ref={objectiveRef} className="scroll-mt-[24px]">
        <SoapSectionCard letter="O" title="Objective">
          {!vis(SOAP_STEP.OBJ_SUGGEST_INCISION) ? (
            <InfoBlock label="No Input"> </InfoBlock>
          ) : (
            <div className="space-y-[24px]">
              <div data-soap-stream-anchor={SOAP_STEP.OBJ_SUGGEST_INCISION}>
                <SuggestionRow items={['Add PROM measurements', 'MMT — Rotator cuff', 'Special Tests', 'Posterior capsule tightness']} />
              </div>
              <div data-soap-stream-anchor={SOAP_STEP.OBJ_SUGGEST_INCISION}>
                <InfoBlock label="Incision">
                  2 cm thin slit-like scar is present on the anterior and posterior part of the shoulder. Scar looks pale, thin and well healed.
                </InfoBlock>
              </div>
              {vis(SOAP_STEP.OBJ_ROM) && (
                <div data-soap-stream-anchor={SOAP_STEP.OBJ_ROM}>
                  <InfoBlock label="Shoulder ROM Table — Right Side">
                    <ClinicalTable
                      title="AROM and PROM: Shoulder Joint"
                      headers={['Measure', 'AROM Right', 'PROM Right', 'AROM Left', 'PROM Left']}
                      rows={[
                        ['Flexion', '68°', '85°', 'WFL', 'WFL'],
                        ['Abduction', '54°', '70°', 'WFL', 'WFL'],
                        ['External Rotation', '22°', '35°', 'WFL', 'WFL'],
                        ['End feel', 'N/A', 'Firm, consistent with early posterior capsule tightness', 'N/A', 'Soft, normal'],
                        ['DASH score', '72 (severe disability)', 'N/A', 'N/A', 'N/A'],
                        ['Penn Shoulder Score', '28/100 (severe dysfunction)', 'N/A', 'N/A', 'N/A'],
                      ]}
                    />
                  </InfoBlock>
                </div>
              )}
              {vis(SOAP_STEP.OBJ_STRENGTH) && (
                <div data-soap-stream-anchor={SOAP_STEP.OBJ_STRENGTH}>
                  <InfoBlock label="Strength Test">
                    <ClinicalTable
                      title="Strength Test"
                      headers={['Muscle', 'Movement', 'MMT Right', 'MMT Left', 'Interpretation']}
                      rows={[
                        ['Supraspinatus', 'Abduction 0-15° (Empty Can position)', '2/5', '5/5', 'Right: full range in gravity eliminated position only. Left: normal strength.'],
                        ['Infraspinatus', 'External Rotation', '3/5', '5/5', 'Right: can lift against gravity without resistance. Left: normal strength.'],
                        ['Teres Minor', 'External Rotation', '3/5', '5/5', 'Right: can lift against gravity without resistance. Left: normal strength.'],
                        ['Subscapularis', 'Internal Rotation', '4/5', '5/5', 'Right: full range against gravity with minimal resistance. Left: normal strength.'],
                      ]}
                    />
                  </InfoBlock>
                </div>
              )}
              {vis(SOAP_STEP.OBJ_OUTCOME) && (
                <div data-soap-stream-anchor={SOAP_STEP.OBJ_OUTCOME}>
                  <InfoBlock label="Outcome Measures">
                    <ClinicalTable
                      title="Outcome Measures"
                      headers={['Measure', 'Score', 'Interpretation']}
                      rows={[
                        ['DASH score', '72', 'Severe disability'],
                        ['Penn Shoulder Score', '28/100', 'Severe dysfunction'],
                      ]}
                    />
                  </InfoBlock>
                </div>
              )}
            </div>
          )}
        </SoapSectionCard>
      </div>

      <div ref={assessmentRef} className="scroll-mt-[24px]">
        <SoapSectionCard letter="A" title="Assessment">
          {vis(SOAP_STEP.ASM_SUGGEST) && (
            <div data-soap-stream-anchor={SOAP_STEP.ASM_SUGGEST}>
              <SuggestionRow items={['Healing phase classification', 'Medicare audit readiness', 'Compliance risk flag']} />
            </div>
          )}
          <InfoBlock label="Diagnosis">M75.11, Complete rotator cuff tear, right shoulder, not specified as traumatic.</InfoBlock>
          {vis(SOAP_STEP.ASM_REHAB) && (
            <div data-soap-stream-anchor={SOAP_STEP.ASM_REHAB}>
              <InfoBlock label="Rehabilitation Potential">
                Patient presents with significant post-surgical ROM deficits and pain consistent with status post arthroscopic rotator cuff repair. Prognosis is good
                given patient motivation and absence of complicating comorbidities. Functional limitations impact ADLs and prior level of function.
              </InfoBlock>
            </div>
          )}
        </SoapSectionCard>
      </div>

      {showPlanInNav && (
        <>
          <div ref={planRef} className="scroll-mt-[24px]">
            <SoapSectionCard letter="P" title="Plan">
              {vis(SOAP_STEP.PLAN_SUGGEST) && (
                <div data-soap-stream-anchor={SOAP_STEP.PLAN_SUGGEST}>
                  <SuggestionRow items={['Healing phase classification', 'Medicare audit readiness', 'Compliance risk flag']} />
                </div>
              )}
              {vis(SOAP_STEP.PLAN_GOALS_1) && (
                <div data-soap-stream-anchor={SOAP_STEP.PLAN_GOALS_1}>
                  <InfoBlock label="Goals Established">
                    <GoalText title="Shoulder Flexion (Right ROM)">
                      Sarah will demonstrate improved active right shoulder flexion from 68° to 150° within 12 visits to allow overhead reach into kitchen cabinets and
                      return to gardening without pain limitation.
                    </GoalText>
                    <GoalText title="Shoulder Abduction (Right ROM)">
                      Sarah will demonstrate improved active right shoulder abduction from 54° to 140° within 12 visits to support bilateral overhead reaching for daily
                      household tasks.
                    </GoalText>
                    {vis(SOAP_STEP.PLAN_GOALS_2) && (
                      <div data-soap-stream-anchor={SOAP_STEP.PLAN_GOALS_2}>
                        <GoalText title="Shoulder External Rotation (Right ROM)">
                          Sarah will demonstrate improved active right shoulder external rotation from 22° to 60° within 12 visits to enable functional reaching and
                          independent dressing with her dominant arm.
                        </GoalText>
                        <GoalText title="Pain with Movement">
                          Sarah will report decreased pain with movement from 8/10 to ≤2/10 within 12 visits to allow full participation in her home exercise program and
                          daily activities.
                        </GoalText>
                        <GoalText title="DASH Score">
                          Sarah will demonstrate an improved DASH score from 72 to ≤30 within 12 visits, reflecting reduced disability and return toward prior level of
                          function for home and gardening tasks.
                        </GoalText>
                      </div>
                    )}
                    {vis(SOAP_STEP.PLAN_INTERVENTION) && (
                      <div data-soap-stream-anchor={SOAP_STEP.PLAN_INTERVENTION}>
                        <GoalText title="Functional Outcome">
                          Sarah will progress from unable to independent with overhead reaching for kitchen tasks and light gardening within 12 visits, without pain or
                          compensatory movement patterns.
                        </GoalText>
                        <GoalText title="Rotator Cuff Strength (Right)">
                          Sarah will improve right rotator cuff strength to 4+/5 or greater across all planes within 12 visits, sufficient to perform overhead reaching and
                          gardening without substitution patterns or fatigue.
                        </GoalText>
                      </div>
                    )}
                  </InfoBlock>
                </div>
              )}
              {vis(SOAP_STEP.PLAN_INTERVENTION) && (
                <>
                  <InfoBlock label="Interventions Planned">
                    Progressive ROM, posterior capsule mobilization, progressive resisted strengthening, neuromuscular re-education, HEP instruction.
                  </InfoBlock>
                  <div>
                    <p className="mb-[8px] font-['Inter',sans-serif] text-[12px] font-semibold uppercase leading-[18px] tracking-[0.08em] text-[var(--ds-text-secondary)]">
                      Visit Frequency
                    </p>
                    <div className="flex gap-[12px]">
                      <div className="rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-tertiary)] p-[12px]">
                        <p className="font-['Inter',sans-serif] text-[12px] text-[var(--ds-text-secondary)]">Frequency</p>
                        <p className="mt-[4px] font-['Inter',sans-serif] text-[14px] font-medium text-[var(--ds-text-primary)]">2x per week</p>
                      </div>
                      <div className="rounded-[var(--ds-radius-pill)] bg-[var(--ds-bg-tertiary)] p-[12px]">
                        <p className="font-['Inter',sans-serif] text-[12px] text-[var(--ds-text-secondary)]">Duration</p>
                        <p className="mt-[4px] font-['Inter',sans-serif] text-[14px] font-medium text-[var(--ds-text-primary)]">6 weeks (12 visits)</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SoapSectionCard>
          </div>

          {vis(SOAP_STEP.BILLING) && (
            <div ref={billingRef} className="scroll-mt-[24px]" data-soap-stream-anchor={SOAP_STEP.BILLING}>
              <SoapSectionCard letter="C" title="Billing">
                <ClinicalTable
                  title="Suggested CPT Codes"
                  headers={['CPT Code', 'Type', 'Description', 'Unit Duration']}
                  rows={[
                    ['97163', 'Untimed (serve-based)', 'Physical therapy evaluation, high complexity', '1 unit regardless of time'],
                    ['97163', 'Timed (15-minute units)', 'Therapeutic exercise', '1 unit per 15 minutes (minimum 8 minutes to bill 1 unit)'],
                    ['97163', 'Untimed (serve-based)', 'Physical therapy evaluation, high complexity', '1 unit regardless of time'],
                    ['97163', 'Timed (15-minute units)', 'Self care and home management training', '1 unit per 15 minutes (minimum 8 minutes to bill 1 unit)'],
                  ]}
                />
              </SoapSectionCard>
            </div>
          )}
        </>
      )}

    </div>
  );
}
