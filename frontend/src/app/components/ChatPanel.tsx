import { useEffect, useRef, useState, useMemo } from 'react';
import { Mic, Timer, SlidersHorizontal, Send, Maximize2, List, Sparkles, Wand2, History } from 'lucide-react';
import { EvaLogo } from '@/features/eva/components/icons/EvaLogo';
import { ChatMessage, DemoPhase } from '../types';
import imgPatient from 'figma:asset/454e804c0c0a65927356b922ba37d88ac95d6327.png';

export interface ChatPanelProps {
  messages: ChatMessage[];
  sessionSeconds: number;
  recordingActive: boolean;
  sessionPhase: DemoPhase;
  onAction: (action: string) => void;
  onSendMessage: (text: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onViewTranscript: () => void;
}

function EvaLabel() {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #615fff 0%, #7f22fe 100%)' }}
      >
        <EvaLogo className="h-[9px] w-[9px] text-white" decorative />
      </div>
      <span className="text-[8px] font-semibold text-[#90a1b9] tracking-widest uppercase">Eva</span>
    </div>
  );
}

function PatientCard() {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 mt-2 max-w-[420px]">
      <div className="flex items-start gap-3">
        <img src={imgPatient} alt="Sarah Chen" className="w-8 h-8 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#181818]">Sarah Chen</span>
            <span className="text-[10px] text-[#155dfc] bg-[#eff6ff] border border-[#dbeafe] px-2 py-0.5 rounded">
              Checked in
            </span>
          </div>
          <p className="text-[12px] text-[#181818] mt-0.5">
            (Brachial Plexus Injury) is ready for evaluation.
          </p>
          <div className="mt-2">
            <p className="text-[12px] font-semibold text-black">Intake flags:</p>
            <ul className="list-disc list-inside text-[12px] text-[#2c2c2c] space-y-0.5 mt-0.5">
              <li>Pain level reported: 7/10</li>
              <li>Tingling in fingers</li>
              <li>Post-surgical case (6 weeks)</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-medium text-[#e17100] bg-[#fffbeb] border border-[#fef3c6] px-2.5 py-1 rounded-full">
              New patient
            </span>
            <span className="text-[10px] font-medium text-[#2e04e8] bg-[rgba(46,4,232,0.05)] border border-[rgba(46,4,232,0.1)] px-2.5 py-1 rounded-full">
              Intake evaluation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type WidgetMode = 'idle' | 'recording' | 'stopped';

function WaveBars({ active }: { active: boolean }) {
  const heights = useMemo(() => [...Array(24)].map((_, i) => 4 + Math.abs(Math.sin(i * 0.55)) * 10), []);
  return (
    <div className="flex gap-0.5 items-end h-5 flex-1 min-w-0">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-0.5 rounded-full shrink-0 transition-all ${active ? 'bg-[#2e04e8] opacity-80' : 'bg-[#94a3b8] opacity-40'}`}
          style={{
            height: active ? `${h + (i % 3) * 2}px` : `${6 + (i % 4)}px`,
          }}
        />
      ))}
    </div>
  );
}

function SessionWidget({
  seconds,
  mode,
  onStart,
  onStop,
  onViewTranscript,
  transcriptClicked,
}: {
  seconds: number;
  mode: WidgetMode;
  onStart: () => void;
  onStop: () => void;
  onViewTranscript: () => void;
  transcriptClicked: boolean;
}) {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div
      className={`bg-white rounded-xl p-3 mt-2 max-w-[380px] border-2 ${
        mode === 'recording' ? 'border-[#a78bfa] shadow-sm' : 'border-[#e2e8f0]'
      }`}
    >
      <p className="text-[11px] font-semibold text-[#1d293d] mb-2">Session Started</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-mono text-[#1d293d] tabular-nums shrink-0">
            {mins}:{secs}
          </span>
          <WaveBars active={mode === 'recording'} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'idle' && (
            <button
              type="button"
              onClick={onStart}
              className="text-[11px] font-semibold text-white rounded-lg px-3 py-1.5"
              style={{ background: 'linear-gradient(135deg, #615fff 0%, #7f22fe 100%)' }}
            >
              Start recording
            </button>
          )}
          {mode === 'recording' && (
            <button
              type="button"
              onClick={onStop}
              className="text-[11px] font-semibold text-white bg-[#ef4444] rounded-lg px-3 py-1.5 hover:bg-[#dc2626]"
            >
              Stop recording
            </button>
          )}
          {mode === 'stopped' && (
            <button
              type="button"
              onClick={onViewTranscript}
              disabled={transcriptClicked}
              className="text-[10px] font-medium text-[#475569] border border-[#e2e8f0] px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-[#f8fafc] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              View Transcript
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatSessionClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
}

export function FloatingSessionDock({
  seconds,
  onExpandChat,
  onViewTranscript,
  onStopRecording,
  onSendMessage,
}: {
  seconds: number;
  onExpandChat: () => void;
  onViewTranscript: () => void;
  onStopRecording: () => void;
  onSendMessage: (text: string) => void;
}) {
  const [dockInput, setDockInput] = useState('');

  const handleDockSend = () => {
    const t = dockInput.trim();
    if (!t) return;
    setDockInput('');
    onSendMessage(t);
  };

  const handleDockKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDockSend();
    }
  };

  const wavePattern = [5, 12, 7, 15, 9, 13, 6, 14, 8, 11, 7, 16, 9, 12, 6, 10, 8, 14, 5, 11];

  return (
    <div className="absolute left-3 bottom-5 z-30 w-[min(440px,calc(100vw-3rem))] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-[#fdba74]/60">
      {/* Orange recording strip — sc7 reference */}
      <div
        className="relative px-4 pt-3 pb-3 text-white"
        style={{
          background: 'linear-gradient(105deg, #c2410c 0%, #ea580c 38%, #fb923c 72%, #fdba74 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold tracking-tight text-white drop-shadow-sm">
              Session - In Progress..
            </p>
            <p className="mt-1.5 text-[15px] font-mono font-medium tabular-nums tracking-[0.12em] text-white/95">
              {formatSessionClock(seconds)}
            </p>
          </div>
          <button
            type="button"
            onClick={onExpandChat}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/25 text-white hover:bg-white/25 shrink-0 transition-colors"
            aria-label="Expand chat panel"
          >
            <Maximize2 size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-3 flex items-end gap-3">
          <div className="flex-1 min-w-0 h-[22px] flex items-end justify-between gap-px">
            {wavePattern.map((base, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-white/95 shrink-0 animate-pulse shadow-sm"
                style={{
                  height: `${base + (i % 4)}px`,
                  animationDuration: '1.2s',
                  animationDelay: `${i * 45}ms`,
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onViewTranscript}
            className="flex items-center gap-1.5 shrink-0 rounded-lg bg-white/20 hover:bg-white/30 border border-white/35 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors"
          >
            <List size={14} strokeWidth={2.25} className="opacity-95" />
            View Transcript
          </button>
        </div>

        <button
          type="button"
          onClick={onStopRecording}
          className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 hover:text-white underline-offset-2 hover:underline"
        >
          Stop recording
        </button>
      </div>

      {/* Chat input strip — sc7 reference */}
      <div className="bg-white px-3 py-2.5">
        <div className="flex items-center gap-1.5 rounded-full border border-[#f5d0f5] bg-[#fefcfe] pl-1.5 pr-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <div
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(145deg, #615fff 0%, #7f22fe 100%)' }}
          >
            <Sparkles size={15} className="text-white" strokeWidth={2} />
          </div>
          <input
            type="text"
            value={dockInput}
            onChange={(e) => setDockInput(e.target.value)}
            onKeyDown={handleDockKeyDown}
            placeholder="Ask eva,,"
            className="flex-1 min-w-0 bg-transparent text-[12px] text-[#1d293d] placeholder:text-[#94a3b8] outline-none py-1.5"
          />
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-[#64748b] hover:bg-[#f1f5f9] rounded-full transition-colors"
            aria-label="Assistant"
          >
            <Wand2 size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-[#64748b] hover:bg-[#f1f5f9] rounded-full transition-colors"
            aria-label="History"
          >
            <History size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 text-[#64748b] hover:bg-[#f1f5f9] rounded-full transition-colors"
            aria-label="Settings"
          >
            <SlidersHorizontal size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={handleDockSend}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ececf0] hover:bg-[#e2e2e8] text-[#475569] shrink-0 transition-colors"
            aria-label="Send"
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  sessionSeconds,
  recordingActive,
  sessionPhase,
  onAction,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onViewTranscript,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [transcriptClicked, setTranscriptClicked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionPhase === 'sessionTranscript') setTranscriptClicked(false);
  }, [sessionPhase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const t = inputValue.trim();
    if (!t) return;
    setInputValue('');
    onSendMessage(t);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleViewTranscript = () => {
    setTranscriptClicked(true);
    onViewTranscript();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-[10px] overflow-hidden">
      <div className="flex items-center border-b border-[#f1f5f9] px-3 pt-1 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium transition-colors ${
            activeTab === 'chat' ? 'text-[#432dd7]' : 'text-[#94a3b8] hover:text-[#64748b]'
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1C2.79 1 1 2.57 1 4.5C1 5.42 1.42 6.26 2.1 6.88L1.5 9L3.84 7.88C4.21 7.96 4.6 8 5 8C7.21 8 9 6.43 9 4.5C9 2.57 7.21 1 5 1Z"
              stroke="#432DD7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          AI Chat
          {activeTab === 'chat' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4f39f6] rounded-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium transition-colors ${
            activeTab === 'history' ? 'text-[#432dd7]' : 'text-[#94a3b8] hover:text-[#64748b]'
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1z" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.5 1.5V4H4" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 3.5V6L8 7" stroke="#94A3B8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (
            msg.type === 'eva-text' ||
            msg.type === 'alert-message' ||
            msg.type === 'prefill-message' ||
            msg.type === 'session-starting' ||
            msg.type === 'tear-detail' ||
            msg.type === 'rom-captured' ||
            msg.type === 'pattern-note'
          ) {
            return (
              <div key={msg.id}>
                {(msg.type === 'eva-text' || msg.type === 'alert-message') && <EvaLabel />}
                <div
                  className="bg-white border border-[#e2e8f0] rounded-bl-[6px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] px-4 py-2.5 max-w-[90%] text-[12px] font-medium text-[#1d293d] leading-[1.6]"
                  dangerouslySetInnerHTML={{ __html: msg.content || '' }}
                />
                {msg.timestamp && <p className="text-[8px] text-[#8a8a8a] mt-1">{msg.timestamp}</p>}
              </div>
            );
          }

          if (msg.type === 'patient-card') {
            return (
              <div key={msg.id}>
                <EvaLabel />
                {msg.content && (
                  <div className="bg-white border border-[#e2e8f0] rounded-bl-[6px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px] px-4 py-2.5 max-w-[90%] text-[12px] font-medium text-[#1d293d] leading-[1.6] mb-2">
                    {msg.content}
                  </div>
                )}
                <PatientCard />
                {msg.timestamp && <p className="text-[8px] text-[#8a8a8a] mt-1">{msg.timestamp}</p>}
              </div>
            );
          }

          if (msg.type === 'user-bubble') {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div
                  className="rounded-bl-[16px] rounded-br-[6px] rounded-tl-[16px] rounded-tr-[16px] px-5 py-2.5 text-[14px] text-white"
                  style={{ background: 'linear-gradient(168deg, #615fff 0%, #7f22fe 100%)' }}
                >
                  {msg.content}
                </div>
                {msg.timestamp && <p className="text-[8px] text-[#8a8a8a] mt-1">{msg.timestamp}</p>}
              </div>
            );
          }

          if (msg.type === 'suggestion-chips') {
            return (
              <div key={msg.id} className="flex flex-wrap gap-2 pt-1">
                {msg.chips?.map((chip, chipIdx) => (
                  <button
                    key={`${msg.id}-${chipIdx}`}
                    type="button"
                    onClick={() => chip.action && onAction(chip.action)}
                    className="text-[11px] font-medium text-[#020617] bg-[#f7f9ff] border-2 border-[#7081f2] rounded-full px-3 py-1 hover:bg-[#eef0ff] transition-colors whitespace-nowrap"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            );
          }

          if (msg.type === 'session-widget') {
            const mode: WidgetMode =
              sessionPhase === 'sessionReady'
                ? 'idle'
                : sessionPhase === 'sessionRecording' && recordingActive
                  ? 'recording'
                  : 'stopped';
            const transcriptUsed = transcriptClicked && sessionPhase !== 'sessionTranscript';
            return (
              <div key={msg.id}>
                <SessionWidget
                  seconds={sessionSeconds}
                  mode={mode}
                  onStart={onStartRecording}
                  onStop={onStopRecording}
                  onViewTranscript={handleViewTranscript}
                  transcriptClicked={transcriptUsed}
                />
                {msg.timestamp && <p className="text-[8px] text-[#8a8a8a] mt-1">{msg.timestamp}</p>}
              </div>
            );
          }

          return null;
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 px-4 pb-4">
        <div className="bg-white border border-[#f7def8] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask eva about your schedule..."
              className="w-full text-[12px] text-[#1d293d] placeholder-[rgba(0,0,0,0.45)] outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center justify-end gap-1 px-2 pb-2">
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-[#646464] hover:bg-[#f8fafc] rounded-lg transition-colors"
            >
              <Mic size={14} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-[#646464] hover:bg-[#f8fafc] rounded-lg transition-colors"
            >
              <Timer size={14} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 text-[#646464] hover:bg-[#f8fafc] rounded-lg transition-colors"
            >
              <SlidersHorizontal size={14} />
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="flex items-center justify-center w-8 h-8 bg-[#f0f0f0] hover:bg-[#e0e0e0] rounded-full transition-colors"
            >
              <Send size={13} className="text-[#646464]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
