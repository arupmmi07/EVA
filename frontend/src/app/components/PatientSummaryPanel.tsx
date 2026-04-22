import { User, Settings } from 'lucide-react';
import imgPatient from 'figma:asset/454e804c0c0a65927356b922ba37d88ac95d6327.png';
import imgBodyDiagram from 'figma:asset/9eeb366f3badd324b6e7f1c56be9beca3b64d9d5.png';

interface PatientSummaryPanelProps {
  onBeginSession: () => void;
}

function PainBar({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  return (
    <div className="relative h-2 rounded-full overflow-hidden bg-gradient-to-r from-[#22c55e] via-[#fbbf24] to-[#ef4444] mt-1">
      <div
        className="absolute top-0 right-0 bottom-0 bg-white/60"
        style={{ left: `${pct}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-[#94a3b8] rounded-full shadow"
        style={{ left: `calc(${pct}% - 4px)` }}
      />
    </div>
  );
}

export function PatientSummaryPanel({ onBeginSession }: PatientSummaryPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Panel header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <h2 className="text-[16px] font-semibold text-[#0f172b] mb-4">Pre-Visit Patient Summary</h2>

        {/* Patient info bar */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border border-[#f1f5f9] shadow-inner">
            <img src={imgPatient} alt="Sarah Chen" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-medium text-[#0f172b] tracking-tight">Sarah Chen</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[12px] font-medium text-[#90a1b9]">ID: #1123-K</span>
              <span className="w-1 h-1 rounded-full bg-[#e2e8f0]" />
              <span className="text-[12px] font-medium text-[#90a1b9]">Age: 42y</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-medium text-[#e17100] bg-[#fffbeb] border border-[#fef3c6] px-2.5 py-0.5 rounded-full">
                New patient
              </span>
              <span className="text-[10px] font-medium text-[#2e04e8] bg-[rgba(46,4,232,0.05)] border border-[rgba(46,4,232,0.1)] px-2.5 py-0.5 rounded-full">
                Intake evaluation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-[#2e04e8] bg-white border border-[rgba(46,4,232,0.2)] rounded-xl hover:bg-[#f0eeff] transition-colors shadow-sm">
              <User size={13} />
              Patient profile
            </button>
            <button
              onClick={onBeginSession}
              className="px-4 py-2 text-[11px] font-medium text-white bg-[#2e04e8] rounded-[10px] hover:bg-[#2502c0] transition-colors shadow-sm"
            >
              Begin session
            </button>
            <button className="flex items-center justify-center w-8 h-8 bg-white border border-[#f1f5f9] rounded-xl hover:bg-[#f8fafc] transition-colors shadow-sm">
              <Settings size={13} className="text-[#90a1b9]" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        {/* Chief Complaint + First Visit */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white border border-[#e2e8f0] rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" stroke="#2e04e8" strokeWidth="1.3" />
                <path d="M8 5v3l2 1" stroke="#2e04e8" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[11px] font-medium text-[#2e04e8]">Chief complaint</span>
            </div>
            <p className="text-[12px] text-[#1d293d] leading-relaxed">
            Intense left knee pain and restricted movement after a fall three days ago. The patient describes a sharp pain (8/10) during activities like climbing stairs and has trouble sleeping on the left side.
            </p>
          </div>
          <div className="w-[120px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#90a1b9]">First visit</span>
              <span className="text-[10px] font-medium text-[#f97316]">Today</span>
            </div>
            <p className="text-[14px] font-semibold text-[#0f172b]">Mar 10</p>
            <p className="text-[11px] text-[#0f172b]">2026</p>
            <p className="text-[10px] text-[#90a1b9] mt-1">Intake evaluation</p>
          </div>
        </div>

        {/* Referred by */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-medium text-[#1d293d]">Referred by</span>
            <button className="text-[11px] font-medium text-[#2e04e8] border border-[rgba(46,4,232,0.2)] px-3 py-1 rounded-lg hover:bg-[#f0eeff] transition-colors">
              View Referral Document
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] text-[#90a1b9] mb-1">Provider</p>
              <p className="text-[12px] font-medium text-[#1d293d]">Dr. Samantha Wickram, MD</p>
            </div>
            <div>
              <p className="text-[10px] text-[#90a1b9] mb-1">Specialty</p>
              <p className="text-[12px] font-medium text-[#1d293d]">Orthopedic Surgery</p>
            </div>
            <div>
              <p className="text-[10px] text-[#90a1b9] mb-1">Date referred</p>
              <p className="text-[12px] font-medium text-[#1d293d]">Mar 12, 2026</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[10px] text-[#90a1b9] mb-1">Referral notes</p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 text-[12px] text-[#1d293d] leading-relaxed">
              Arthroscopic rotator cuff repair performed. Recommend conservative PT approach with reassessment in 6 weeks.
            </div>
          </div>
        </div>

        {/* Pain assessment */}
        <div>
          <p className="text-[12px] font-medium text-[#1d293d] mb-2">Pain assessment</p>
          <div className="flex gap-4">
            {/* Pain level card */}
            <div className="flex-1 bg-white border border-[#e2e8f0] rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-3">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L8 14M2 8L14 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] text-[#90a1b9]">Current pain level</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[42px] font-bold text-[#ef4444] leading-none">8</span>
                <span className="text-[12px] text-[#90a1b9]">out of 10</span>
              </div>
              <PainBar value={8} />
              <div className="flex justify-between text-[9px] text-[#94a3b8] mt-1">
                <span>no pain</span>
                <span>moderate</span>
                <span>severe</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-[10px] text-[#90a1b9]">Pain type</p>
                  <p className="text-[12px] font-medium text-[#1d293d] mt-0.5">Sharp, stabbing</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#90a1b9]">Frequency</p>
                  <p className="text-[12px] font-medium text-[#1d293d] mt-0.5">Constant</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#90a1b9]">Aggravating factors</p>
                  <p className="text-[12px] font-medium text-[#1d293d] mt-0.5">Overhead reach</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#90a1b9]">Relieving factors</p>
                  <p className="text-[12px] font-medium text-[#1d293d] mt-0.5">Rest, ice</p>
                </div>
              </div>
            </div>

            {/* Body diagram */}
            <div className="w-[200px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl p-4">
              <div className="flex items-center gap-1 mb-3">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#2e04e8" strokeWidth="1.3" />
                  <path d="M8 5v4M8 11v.5" stroke="#2e04e8" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="text-[11px] text-[#90a1b9]">Pain location</span>
              </div>
              <div className="flex items-center justify-center h-32">
                <img src={imgBodyDiagram} alt="Body diagram" className="h-full object-contain" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0" />
                <span className="text-[10px] text-[#64748b]">Right shoulder (anterior)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
