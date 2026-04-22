import railLogo from '@/assets/sidebar-rail-logo.png';
import {
  getRailNavIcons,
  RailIconBell,
  RailIconHelp,
} from './AppRailIcons';

const navIcons = getRailNavIcons();

/** `figma-make-moment3` Sidebarv2: 64px rail, workspace surface, logo tile, 20px menu icons. */
export function AppRail() {
  return (
    <aside
      data-name="AppRail"
      className="relative flex w-16 shrink-0 flex-col items-stretch self-stretch bg-[#fcfcfd]"
      aria-label="Primary navigation"
    >
      <div className="relative flex min-h-16 w-full shrink-0 flex-col items-center px-4">
        <div className="flex min-h-[inherit] w-full flex-1 items-center justify-center">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#135bec] mt-4">
            <img src={railLogo} alt="" className="size-[18px] max-w-none object-contain" width={18} height={18} />
          </div>
        </div>
      </div>
      <nav className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto overflow-x-hidden py-4">
        {navIcons.map((Icon, index) => {
          const active = index === 0;
          return (
            <button
              key={`rail-nav-${index}`}
              type="button"
              className={`flex w-full items-center justify-center p-4 transition-colors ${
                active
                  ? 'text-[#616E7C]'
                  : 'text-[#616E7C]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-5 shrink-0" />
            </button>
          );
        })}
      </nav>
      <div className="relative flex w-full shrink-0 flex-col items-center gap-1 px-0 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-center p-4 text-[#616E7C] transition-colors"
          aria-label="Notifications"
        >
          <RailIconBell className="size-5 shrink-0" />
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center p-4 text-[#616E7C] transition-colors"
          aria-label="Help"
        >
          <RailIconHelp className="size-5 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
