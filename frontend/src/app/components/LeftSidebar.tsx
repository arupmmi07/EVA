import {
  LayoutDashboard,
  MessageCircle,
  Users,
  Calendar,
  FileText,
  BookOpen,
  Settings,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, key: 'home' as const },
  { icon: MessageCircle, key: 'chat' as const },
  { icon: Users, key: 'patients' as const },
  { icon: Calendar, key: 'calendar' as const },
  { icon: FileText, key: 'files' as const },
  { icon: BookOpen, key: 'book' as const },
];

const bottomItems = [{ icon: HelpCircle }, { icon: Settings }];

interface LeftSidebarProps {
  chatOpen: boolean;
  onToggleChat: () => void;
}

export function LeftSidebar({ chatOpen, onToggleChat }: LeftSidebarProps) {
  return (
    <aside className="flex flex-col items-center w-[42px] bg-white border-r border-[#f1f5f9] py-3 gap-1 shrink-0 h-full">
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ icon: Icon, key }) => {
          const isChat = key === 'chat';
          const active = isChat ? chatOpen : key === 'home';
          return (
            <button
              key={key}
              type="button"
              onClick={isChat ? onToggleChat : undefined}
              aria-pressed={isChat ? chatOpen : undefined}
              aria-label={isChat ? (chatOpen ? 'Hide AI chat' : 'Show AI chat') : undefined}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
                active
                  ? 'bg-[#f0eeff] text-[#2e04e8]'
                  : 'text-[#94a3b8] hover:text-[#475569] hover:bg-[#f8fafc]'
              }`}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1">
        {bottomItems.map(({ icon: Icon }, idx) => (
          <button
            key={idx}
            type="button"
            className="flex items-center justify-center w-7 h-7 text-[#94a3b8] hover:text-[#475569] rounded-md hover:bg-[#f8fafc] transition-colors"
          >
            <Icon size={14} />
          </button>
        ))}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2e04e8] text-white mt-1">
          <span className="text-[9px] font-semibold">AK</span>
        </div>
      </div>
    </aside>
  );
}
