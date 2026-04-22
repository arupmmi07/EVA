import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { SOAPVariant } from '../types';
import imgPatient from 'figma:asset/454e804c0c0a65927356b922ba37d88ac95d6327.png';

interface SOAPNotePanelProps {
  variant: SOAPVariant;
  sessionSeconds: number;
  recordingActive: boolean;
}

const AI_SUGGESTIONS_SESSION = [
  'Grip Strength',
  'Sleep Position',
  'Pain Medication Use',
  'Radiation Pattern',
  'ADL Functional Screen',
];

const AI_SUGGESTIONS_TRANSCRIPT = [
  'Sleep Disturbance',
  'Pain with dressing',
  'Mechanism of injury',
  'Radiation / numbness',
];

interface SectionProps {
  color: string;
  label: string;
  count: number;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

function SOAPSection({ color, label, count, children, defaultExpanded = false }: SectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="border border-[#e2e8f0] rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[#f8fafc] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
            style={{ background: color }}
          >
            {label[0]}
          </span>
          <span className="text-[14px] font-semibold text-[#1d293d]">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#90a1b9]">{count} items</span>
          {expanded ? (
            <ChevronUp size={14} className="text-[#90a1b9]" />
          ) : (
            <ChevronDown size={14} className="text-[#90a1b9]" />
          )}
        </div>
      </button>
      {expanded && children && (
        <div className="px-5 pb-5 border-t border-[#f1f5f9]">{children}</div>
      )}
    </div>
  );
}

export function SOAPNotePanel({ variant, sessionSeconds, recordingActive }: SOAPNotePanelProps) {
  const [activeSection, setActiveSection] = useState<string>('S');

  const isSessionStyle = variant === 'sessionRecording';
  const isTranscriptOrLater = variant === 'transcript' || variant === 'postRom';

  const mins = Math.floor(sessionSeconds / 60).toString().padStart(2, '0');
  const secs = (sessionSeconds % 60).toString().padStart(2, '0');

  const sectionNav = isSessionStyle ? ['S', 'O', 'I', 'H', 'A', 'P', 'C'] : ['S', 'I', 'H', 'A', 'P', 'C'];

  const intakeBanner =
    isTranscriptOrLater ? (
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3 text-[11px] text-[#1e3a5f]">
        <span className="font-semibold">From Intake</span> Injury: Post-surgical brachial plexus (C5-C6) | Pain: 7/10 |
        Symptoms: Tingling (ring + little finger)
      </div>
    ) : (
      <div className="bg-[#fffbeb] border border-[#fef3c6] rounded-xl p-3 text-[11px] text-[#92400e]">
        <span className="font-semibold">From Intake</span> Injury: Post-surgical brachial plexus (C5-C6) | Pain: 7/10 |
        Symptoms: Tingling (ring + little finger)
      </div>
    );

  const showEmrTag = variant !== 'prefill';
  const showAiRow = variant !== 'prefill';
  const aiList = isTranscriptOrLater ? AI_SUGGESTIONS_TRANSCRIPT : AI_SUGGESTIONS_SESSION;

  const chiefComplaint = isTranscriptOrLater
    ? 'Right shoulder pain radiating to upper back with tingling and numbness in ring finger and little finger.'
    : 'Pain in the right shoulder and inability to move hand for overhead activities';

  const hpiBody = isTranscriptOrLater ? (
    <>
      The patient reports a{' '}
      <span className="bg-[#fef08a] text-[#1d293d] px-0.5 rounded">
        injury due to road traffic accident (fall on right side)
      </span>{' '}
      involving a scooter approximately 3 months ago, with immediate onset of severe right shoulder pain. She underwent
      arthroscopic rotator cuff repair approximately 10 weeks prior to this evaluation. She currently reports
      difficulty with overhead reach, grooming, and carrying items. She describes{' '}
      <span className="bg-[#fef08a] text-[#1d293d] px-0.5 rounded">
        intermittent tingling in ring + little finger
      </span>{' '}
      without constant numbness. Denies neck pain, bilateral symptoms, or progressive weakness beyond the post-operative
      course.
    </>
  ) : (
    <>
      The patient reports a gradual onset of right shoulder pain over the past 3-4 months. She was diagnosed with a
      rotator cuff complete tear for which she got operated 10 weeks prior to evaluation. Following surgery, the patient
      reports incomplete recovery of shoulder function, with persistent pain and progressive difficulty in raising her
      right arm above shoulder level. She reports significant limitations in overhead activities such as reaching
      overhead for kitchen cabinets, combing her hair and unable to perform gardening activities. The pain is localized
      to the right shoulder, worsened by active abduction and forward flexion, and is associated with mild weakness in
      the right upper extremity. She denies any history of trauma, recent fall, or acute exacerbation. There is no
      associated numbness or tingling in the upper extremity. The patient presents for further evaluation and
      rehabilitation of her right shoulder function.
    </>
  );

  const subjectiveDefaultOpen = true;
  const objectiveDefaultOpen = !isTranscriptOrLater;
  const assessmentDefaultOpen = !isTranscriptOrLater;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[#f1f5f9] shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#0f172b]">SOAP Note</h2>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full bg-[#ef4444] ${recordingActive ? 'animate-pulse' : ''}`}
              />
              <span className="text-[11px] font-medium text-[#ef4444] tracking-wider">REC</span>
              <span className="text-[12px] font-mono text-[#1d293d] tabular-nums">
                {mins}:{secs}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-[#f1f5f9] shrink-0">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={imgPatient}
                alt="Sarah Chen"
                className="w-12 h-12 rounded-xl object-cover border border-[#f1f5f9]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1d293d]">Sarah Chen</h3>
                  <p className="text-[11px] text-[#90a1b9]">Age · 58 | Female</p>
                </div>
                <ChevronDown size={16} className="text-[#90a1b9] shrink-0" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[#90a1b9]">Dominance :</span>
                  <span className="text-[#16a34a] font-medium">Right hand dominant</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[#90a1b9]">Occupation :</span>
                  <span className="text-[#1d293d]">Retired schoolteacher</span>
                </div>
                <div className="flex gap-1.5 col-span-2 sm:col-span-1">
                  <span className="text-[#90a1b9]">Visit :</span>
                  <span className="text-[#1d293d]">
                    {isSessionStyle || isTranscriptOrLater ? '1 of 12 · ' : '1 · '}
                    <span className="text-[#2e04e8]">Initial Evaluation</span>
                    {isSessionStyle || isTranscriptOrLater ? ' · Week 0' : ''}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[#90a1b9]">Living situation :</span>
                  <span className="text-[#1d293d]">Lives alone</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[#90a1b9]">Payer :</span>
                  <span className="text-[#2e04e8]">Medicare Part B</span>
                </div>
                <div className="flex gap-1.5 col-span-2">
                  <span className="text-[#90a1b9]">Activity level :</span>
                  <span className="text-[#1d293d]">Moderate. Gardening, cooking, light housework.</span>
                </div>
              </div>

              <p className="text-[11px] mt-1.5">
                <span className="text-[#90a1b9]">Referring physician :</span>{' '}
                <span className="text-[#1d293d]">
                  Orthopedic surgeon. Arthroscopic rotator cuff repair performed 10 weeks prior to initia...
                </span>
              </p>
              <p className="text-[11px] mt-1">
                <span className="text-[#90a1b9]">Primary Diagnosis :</span>{' '}
                <span className="text-[#1d293d]">
                  M75.11, Complete rotator cuff tear, right shoulder, not specified as traumatic
                </span>
              </p>
              <p className="text-[11px] mt-1">
                <span className="text-[#90a1b9]">Secondary Diagnosis :</span>{' '}
                <span className="text-[#1d293d]">M79.621, Pain in right upper arm, post-surgical</span>
              </p>

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                {showEmrTag && (
                  <span className="text-[10px] font-medium text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
                    EMR Hydration — Initial
                  </span>
                )}
                <span className="text-[10px] font-medium text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
                  12 visits authorized
                </span>
                <span className="text-[10px] font-medium text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-0.5 rounded-full">
                  GP Modifier pre-loaded
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {intakeBanner}

          <SOAPSection color="#2e04e8" label="Subjective" count={isTranscriptOrLater ? 6 : 3} defaultExpanded={subjectiveDefaultOpen}>
            {showAiRow && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2 mb-4">
                  {aiList.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="flex items-center gap-1 text-[10px] font-medium text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1 rounded-full hover:border-[#2e04e8] hover:text-[#2e04e8] transition-colors"
                    >
                      <Plus size={9} />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mt-3">
              <div>
                <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">CHIEF COMPLAINT</p>
                <p className="text-[12px] text-[#1d293d] leading-relaxed">{chiefComplaint}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1 flex items-center gap-1">
                  <span className="text-[#2e04e8]">∥</span> HPI
                </p>
                <p className="text-[12px] text-[#1d293d] leading-relaxed">{hpiBody}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">PAIN PRESENTATION</p>
                <p className="text-[12px] text-[#1d293d] leading-relaxed">
                  On the Numeric Pain Rating Scale (NPRS), the patient reports 8/10 pain with movement and 6/10 at rest.
                </p>
              </div>
              {isTranscriptOrLater && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3">
                    <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">
                      PATIENT/CAREGIVER GOALS:
                    </p>
                    <p className="text-[11px] text-[#1d293d] leading-relaxed">
                      The patient desires to be able to hold and carry things well and restore shoulder strength.
                    </p>
                  </div>
                  <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3">
                    <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">
                      PAST MEDICAL HISTORY:
                    </p>
                    <p className="text-[11px] text-[#1d293d] leading-relaxed">
                      Diabetes Mellitus Type 2, Taking Metformin 500 mg daily for management.
                    </p>
                  </div>
                </div>
              )}
              {!isTranscriptOrLater && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
                    <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">
                      PATIENT/CAREGIVER GOALS:
                    </p>
                    <p className="text-[11px] text-[#1d293d] leading-relaxed">
                      The patient desires to be able to hold and carry things well and restore shoulder strength.
                    </p>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3">
                    <p className="text-[9px] font-semibold text-[#90a1b9] tracking-widest uppercase mb-1">
                      PAST MEDICAL HISTORY:
                    </p>
                    <p className="text-[11px] text-[#1d293d] leading-relaxed">
                      Diabetes Mellitus Type 2, Taking Metformin 500 mg daily for management.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SOAPSection>

          {variant === 'transcript' && (
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">Session transcript</p>
              <p className="text-[12px] text-[#1d293d] leading-relaxed">
                Clinician: How is the shoulder feeling today when you reach overhead? Patient: It still catches, and I get
                pins and needles into my ring and little finger when I hold the grocery bag for more than a minute.
                Clinician: Any numbness at rest? Patient: Mostly when I lift or carry; at rest it is more of a dull ache.
              </p>
            </div>
          )}

          <SOAPSection color="#10b981" label="Objective" count={8} defaultExpanded={objectiveDefaultOpen} />
          <SOAPSection color="#f59e0b" label="Assessment" count={7} defaultExpanded={assessmentDefaultOpen} />
          <SOAPSection color="#6366f1" label="Plan" count={5} />
        </div>
      </div>

      <div className="w-8 flex flex-col items-center py-4 border-l border-[#f1f5f9] gap-2 shrink-0 bg-white">
        {sectionNav.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setActiveSection(s)}
            className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-semibold transition-colors ${
              activeSection === s
                ? 'bg-[#2e04e8] text-white'
                : 'text-[#90a1b9] hover:text-[#2e04e8] hover:bg-[#f0eeff]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
