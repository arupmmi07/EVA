import { Bell } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  view: AppView;
  onSaveDraft?: () => void;
  onReviewFinalize?: () => void;
}

export function Header({ view, onSaveDraft, onReviewFinalize }: HeaderProps) {
  const showActions = view === 'soapNote' || view === 'sessionActive';

  return (
    <header className="flex items-center justify-between h-[46px] px-4 bg-white border-b border-[#f1f5f9] shrink-0">
      <div className="flex items-center gap-2">
        {/* Logo avatar */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2e04e8] text-white">
          <span className="text-[9px] font-semibold">M</span>
        </div>
        <span className="text-[14px] font-semibold text-[#1d293d]">My Dashboard</span>
      </div>

      <div className="flex items-center gap-2">
        {showActions && (
          <>
            <button
              onClick={onSaveDraft}
              className="px-3 py-1.5 text-[12px] font-medium text-[#475569] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={onReviewFinalize}
              className="px-3 py-1.5 text-[12px] font-medium text-white rounded-lg transition-colors flex items-center gap-1"
              style={{ background: 'linear-gradient(135deg, #615fff 0%, #7f22fe 100%)' }}
            >
              Review &amp; Finalise →
            </button>
          </>
        )}
        {/* Notification bell */}
        <button className="flex items-center justify-center w-7 h-7 rounded-md border border-[rgba(0,55,237,0.33)] bg-[rgba(0,64,255,0.03)] text-[#002bb7] hover:bg-[rgba(0,64,255,0.07)] transition-colors">
          <Bell size={13} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
