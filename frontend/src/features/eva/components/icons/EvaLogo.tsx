import svgPaths from "../../../../imports/svg-zh624h4y1i";
type EvaLogoProps = {
  className?: string;
  /** When true, hides the icon from assistive tech (parent row already exposes “EVA”). */
  decorative?: boolean;
  /** Accessible name when not decorative. */
  title?: string;
};

/**
 * Eva product mark (vector). Replace the inner `<path>` with the SVG exported from Figma
 * (PoV file → node `1705:22360`): copy the main `<path d="...">` from Dev Mode and keep `viewBox` in sync.
 */
export function EvaLogo({ className, decorative, title = 'Eva' }: EvaLogoProps) {
  return (
    <div className="bg-[#ebf0ff] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[32px]" data-name="Icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="AI/ Logo">
        <div className="absolute inset-[0.35%_50.26%_0.3%_0.25%]">
          <div className="absolute inset-[-3.93%_-7.89%_-3.93%_-0.61%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.59297 17.146">
              <path d={svgPaths.p388a80} id="Vector 3" stroke="var(--stroke-0, #6E56CF)" strokeLinecap="round" strokeWidth="1.25" />
            </svg>
          </div>
        </div>
        <div className="absolute flex inset-[0.35%_0.22%_0.3%_49.74%] items-center justify-center" style={{ containerType: "size" }}>
          <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
            <div className="relative size-full">
              <div className="absolute inset-[-3.93%_-7.81%_-3.93%_-0.61%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.68001 17.146">
                  <path d={svgPaths.p28bd3180} id="Vector 4" stroke="var(--stroke-0, #6E56CF)" strokeLinecap="round" strokeWidth="1.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
