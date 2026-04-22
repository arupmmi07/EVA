import { Calendar, Zap, FileText, Plus } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string | number;
  badge?: number;
  onClick?: () => void;
}

function MetricCard({ icon, title, subtitle, value, badge, onClick }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[rgba(255,255,255,0.7)] border border-[rgba(144,161,185,0.37)] rounded-3xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow text-left relative"
    >
      {badge !== undefined && (
        <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 bg-[#2e04e8] text-white text-[9px] font-medium rounded-full border border-[#e2e8f0]">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-center w-12 h-12 bg-[rgba(248,250,252,0.5)] border border-[#e2e8f0] rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-medium text-[#020617] tracking-tight">{title}</p>
        <p className="text-[14px] font-medium text-[#64748b] mt-0.5">{subtitle}</p>
      </div>
      <p className="text-[19.5px] font-medium text-[#2e04e8]">{value}</p>
    </button>
  );
}

interface QuickLinkProps {
  label: string;
}

function QuickLink({ label }: QuickLinkProps) {
  return (
    <button className="text-[11px] text-[#64748b] hover:text-[#2e04e8] transition-colors whitespace-nowrap">
      {label}
    </button>
  );
}

interface DashboardPanelProps {
  onOpenPatientSummary: () => void;
}

export function DashboardPanel({ onOpenPatientSummary }: DashboardPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-8 py-10">
      {/* Greeting */}
      <div className="text-center mb-10">
        <p className="text-[14px] text-[#90a1b9] mb-2">Good afternoon, Maya</p>
        <h1 className="text-[36px] font-medium text-[#1d293d] leading-tight">
          What is your{' '}
          <em
            className="not-italic font-medium"
            style={{
              background: 'linear-gradient(135deg, #615fff 0%, #7f22fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
            }}
          >
            focus
          </em>{' '}
          today?
        </h1>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          icon={<Calendar size={18} className="text-[#45556c]" />}
          title="Patients for today"
          subtitle="6 sessions left"
          value={14}
        />
        <MetricCard
          icon={<Zap size={18} className="text-[#45556c]" />}
          title="Action needed"
          subtitle="Needs your attention"
          value={4}
          badge={4}
          onClick={onOpenPatientSummary}
        />
        <MetricCard
          icon={<FileText size={18} className="text-[#45556c]" />}
          title="Incomplete notes"
          subtitle="Awaiting signature"
          value={3}
          badge={5}
        />
        <button className="bg-[rgba(255,255,255,0.7)] border border-[rgba(144,161,185,0.37)] rounded-3xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-center w-12 h-12 bg-[rgba(248,250,252,0.5)] border border-[#e2e8f0] rounded-2xl">
            <Plus size={18} className="text-[#45556c]" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-[#020617] tracking-tight">Add New Widget</p>
            <p className="text-[14px] font-medium text-[#64748b] mt-0.5">Customize dashboard</p>
          </div>
        </button>
      </div>

      {/* Quick links */}
      <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
        <QuickLink label="Recent ACL cases" />
        <QuickLink label="Shoulder protocols" />
        <QuickLink label="Pending authorizations" />
        <QuickLink label="Missing ROM data" />
      </div>

      {/* Footer note */}
      <p className="text-center text-[11px] text-[#94a3b8] mt-4">
        Say{' '}
        <span className="text-[#2e04e8] font-medium">Hey Clinician</span>{' '}
        to start
      </p>
    </div>
  );
}
