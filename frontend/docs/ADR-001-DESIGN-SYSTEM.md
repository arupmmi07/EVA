# ADR-001: Design System Standards

**Date:** 2026-04-13  
**Status:** Active  
**Author:** Development Team

## Context

This Architecture Decision Record establishes the design system standards for all component development. All developers must follow these guidelines to ensure visual consistency, maintainability, and design coherence across the application.

---

## Design Tokens

### Color Palette

#### Primary Colors
```css
--primary-brand: #135bec;          /* Primary blue brand color */
--primary-action: #4e37f6;         /* Primary purple for CTAs */
--primary-accent: #6e56cf;         /* Accent purple for AI features */
```

#### Background Colors
```css
--background-primary: #ffffff;     /* Main background */
--background-secondary: #fcfcfd;   /* Subtle background variant */
--background-tertiary: #f3f4f7;    /* Input/container backgrounds */
--background-accent: rgba(0,64,255,0.03);  /* Accent background tint */
--background-accent-purple: #ebf0ff;       /* Purple accent background */
```

#### Text Colors
```css
--text-primary: #020617;           /* Primary text color */
--text-secondary: #64748b;         /* Secondary/muted text */
--text-muted: rgba(0,5,29,0.45);   /* Very muted text (placeholders) */
```

#### Border Colors
```css
--border-primary: rgba(0,9,50,0.12);     /* Standard borders */
--border-secondary: rgba(0,0,0,0.12);    /* Alternative borders */
--border-accent: rgba(0,55,237,0.33);    /* Accent borders */
```

#### UI Element Colors
```css
--badge-background: #eaecf0;       /* Badge/pill backgrounds */
--badge-text: #64748b;             /* Badge text color */
```

---

## Typography

### Font Family
- **Primary:** `'Inter:Regular', sans-serif`
- **Medium:** `'Inter:Medium', sans-serif`
- **Semi-Bold:** `'Inter:Semi_Bold', sans-serif`

**Rule:** Always use Inter font family. Do not introduce custom fonts without design approval.

### Font Sizes
```css
--text-xs: 12px;      /* Small labels, badges */
--text-sm: 14px;      /* Body text, buttons, inputs */
--text-base: 16px;    /* Standard body text */
--text-lg: 18px;      /* Large text (if needed) */
```

### Font Weights
```css
--font-weight-normal: 400;   /* Regular text */
--font-weight-medium: 500;   /* Medium emphasis */
--font-weight-semibold: 600; /* Strong emphasis */
```

### Line Heights
```css
--line-height-tight: 18px;   /* For 12px text */
--line-height-base: 20px;    /* For 14px text */
--line-height-relaxed: 24px; /* For 16px text */
--line-height-loose: 28px;   /* For larger text or lists */
--line-height-default: 1.5;  /* Proportional line height */
```

### Typography Usage Rules

1. **Headings:** Use `font-['Inter:Semi_Bold',sans-serif]` with `font-semibold`
2. **Body Text:** Use `font-['Inter:Regular',sans-serif]` with `font-normal`
3. **Labels/Buttons:** Use `font-['Inter:Medium',sans-serif]` with `font-medium`
4. **Always specify:** Font family, weight, line-height, and size together

**Example:**
```tsx
<p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[#020617]">
  Button Text
</p>
```

---

## Spacing System

### Padding Values
```
4px   - Minimal padding (inputs, small containers)
6px   - Small interactive elements
8px   - Compact spacing
12px  - Standard small padding
16px  - Standard medium padding (most common)
20px  - Large padding
40px  - Extra large padding (content areas)
```

### Gap Values
```
4px   - Tight spacing between related elements
6px   - Small gaps
8px   - Standard gap for closely related items
12px  - Medium gap
16px  - Large gap between sections
20px  - Extra large gap
```

### Margin Guidelines
- **Prefer gap over margin** when using flexbox/grid layouts
- Use consistent spacing from the spacing scale
- Avoid arbitrary values like `11px` or `17px`

---

## Border Radius

### Standard Radius Values
```css
--radius-xs: 3px;      /* Very small elements */
--radius-sm: 4px;      /* Small elements, inputs */
--radius-md: 8px;      /* Medium elements */
--radius-lg: 12px;     /* Cards, containers, icons */
--radius-pill: 9999px; /* Badges, pills, fully rounded */
```

### Usage Rules
- **Icons/Logos:** 12px
- **Buttons:** 12px (standard), 8px (compact)
- **Input Fields:** 4px
- **Cards/Containers:** 12px
- **Badges/Pills:** 9999px
- **Small Accents:** 3px

---

## Component Sizing

### Icon Sizes
```
16px - Small icons (in buttons, inputs)
20px - Medium icons (navigation, actions)
24px - Large icons (prominent actions)
32px - Extra large icons (logos, avatars)
```

### Button Heights
```
32px - Standard button height
36px - Large button height
```

### Input Heights
```
32px - Standard input height
```

### Header/Navigation
```
64px - Header height (min-height)
64px - Sidebar width
```

---

## Layout Patterns

### Container Max Widths
```css
--content-max-width: 640px;  /* Chat content, centered content */
```

### Flex Patterns

**Standard Flex Row:**
```tsx
<div className="flex flex-row items-center">
```

**Standard Flex Column:**
```tsx
<div className="flex flex-col items-start">
```

**Flex with Full Width:**
```tsx
<div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
```

**Content Stretch Pattern:**
```tsx
<div className="content-stretch flex items-center justify-center">
```

---

## Component Patterns

### 1. Card/Container Pattern
```tsx
<div className="bg-white relative rounded-[12px] shrink-0">
  <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
    {/* Content */}
  </div>
  {/* Border overlay */}
  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
</div>
```

**Rules:**
- Use `rounded-[inherit]` on inner containers
- Apply borders via `aria-hidden` overlay divs with `pointer-events-none`
- Use `overflow-clip` to contain content within borders

### 2. Button Pattern
```tsx
<div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0">
  {/* Icon or content */}
</div>
```

**Rules:**
- Standard padding: `px-[16px] py-[8px]`
- Compact padding: `p-[6px]` or `p-[9px]`
- Always include `content-stretch flex items-center justify-center`

### 3. Icon Container Pattern
```tsx
<div className="overflow-clip relative shrink-0 size-[16px]">
  <div className="absolute inset-[8.33%]">
    <div className="absolute inset-[-3.75%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {/* SVG paths */}
      </svg>
    </div>
  </div>
</div>
```

**Rules:**
- Use `overflow-clip` on outer container
- Apply `size-[Npx]` for consistent sizing
- SVG should have `className="block size-full"`

### 4. Input Field Pattern
```tsx
<div className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full">
  <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
    <div className="content-stretch flex items-center px-[4px] relative size-full">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px]">
        {/* Input text */}
      </p>
    </div>
  </div>
  <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
</div>
```

### 5. Badge/Pill Pattern
```tsx
<div className="bg-[#eaecf0] content-stretch flex gap-[6px] items-center min-h-[32px] px-[12px] py-[6px] relative rounded-[9999px] shrink-0">
  <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium leading-[0] text-[12px] text-[#64748b] tracking-[0.04px]">
    <p className="leading-[18px]">Badge Text</p>
  </div>
</div>
```

### 6. Separator Pattern
```tsx
<div className="flex flex-row items-center self-stretch">
  <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0">
    <div className="flex-none rotate-90 w-[100cqh]">
      <div className="h-0 relative w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 1">
            <line stroke="black" strokeOpacity="0.0901961" x2="32" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## SVG and Icon Guidelines

### SVG Styling
```tsx
<svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 W H">
  <path 
    stroke="var(--stroke-0, #020617)" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="1.25"
  />
</svg>
```

**Rules:**
1. Always use `className="block size-full"` on SVG elements
2. Set `fill="none"` for stroke-based icons
3. Use `preserveAspectRatio="none"` to allow proper scaling
4. Use CSS variables for colors: `var(--stroke-0, #020617)`
5. Standard stroke width: `1.25` or `1.5`
6. Use `strokeLinecap="round"` and `strokeLinejoin="round"` for smooth icons

---

## Shadow System

### Card Shadow
```css
box-shadow: 
  0px 12px 32px -16px rgba(0,0,51,0.06),
  0px 8px 40px 0px rgba(0,0,0,0.05);
```

**Usage:** Apply to elevated cards and modals

**Tailwind Class:**
```tsx
className="shadow-[0px_12px_32px_-16px_rgba(0,0,51,0.06),0px_8px_40px_0px_rgba(0,0,0,0.05)]"
```

---

## Opacity Standards

### Background Opacity
```
opacity-30 - Disabled states
rgba(0,64,255,0.03) - Subtle background tints
rgba(0,55,237,0.33) - Accent borders
```

### Stroke Opacity
```
strokeOpacity="0.0901961" - Subtle separators
```

---

## Data Attributes

### Component Identification
All components should include a `data-name` attribute for debugging and testing:

```tsx
<div data-name="ComponentName">
```

**Rules:**
- Use descriptive, PascalCase names
- Mirror component function names when possible
- Include on all major structural elements

---

## Accessibility Guidelines

### ARIA Attributes
1. **Decorative Borders:** Use `aria-hidden="true"` on border overlays
2. **Pointer Events:** Add `pointer-events-none` to overlay elements

```tsx
<div aria-hidden="true" className="absolute border ... pointer-events-none" />
```

### Interactive Elements
- All clickable elements should be semantic buttons or links
- Include proper ARIA labels when text is not visible
- Ensure sufficient color contrast (WCAG AA minimum)

---

## Code Style Guidelines

### Class Name Ordering
Follow this order for Tailwind classes:

1. **Layout:** `flex`, `grid`, `relative`, `absolute`
2. **Sizing:** `w-`, `h-`, `min-`, `max-`, `size-`
3. **Spacing:** `p-`, `m-`, `gap-`
4. **Backgrounds:** `bg-`
5. **Borders:** `border`, `rounded-`
6. **Typography:** `font-`, `text-`, `leading-`
7. **Visual:** `shadow-`, `opacity-`
8. **State:** `hover:`, `focus:`, `active:`

### Component Structure
```tsx
function ComponentName() {
  return (
    <div className="outer-container" data-name="ComponentName">
      <div className="content-wrapper">
        {/* Content */}
      </div>
      {/* Decorative overlays (borders, shadows) */}
      <div aria-hidden="true" className="overlay" />
    </div>
  );
}
```

---

## Common Patterns Reference

### Full-Width Flex Container
```tsx
<div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
```

### Centered Content
```tsx
<div className="content-stretch flex items-center justify-center">
```

### Scrollable Container
```tsx
<div className="overflow-auto size-full">
```

### Header with Border
```tsx
<div className="min-h-[64px] relative shrink-0 w-full">
  <div className="flex flex-row items-center min-h-[inherit] size-full">
    {/* Content */}
  </div>
  <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none" />
</div>
```

---

## CSS Custom Properties Usage

When using CSS variables, always provide fallback values:

```tsx
stroke="var(--stroke-0, #020617)"
fill="var(--fill-0, #020617)"
```

**Available Variables:**
- `--stroke-0`: Primary stroke color
- `--fill-0`: Primary fill color

---

## Responsive Design

### Breakpoint Strategy
- Design mobile-first when appropriate
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Test all layouts at common breakpoints: 375px, 768px, 1024px, 1440px

### Container Sizing
- Use `min-w-[240px]` for minimum content widths
- Use `max-w-[640px]` for centered content
- Use flex-grow (`flex-[1_0_0]`) for responsive sections

---

## Performance Guidelines

### Avoid
- Inline styles (use Tailwind classes)
- Unnecessary nesting (keep DOM flat when possible)
- Large SVG files (optimize and compress)

### Prefer
- Tailwind utility classes over custom CSS
- SVG icons over icon fonts
- Semantic HTML elements

---

## Design System Checklist

Before committing a new component, verify:

- [ ] Uses colors from the defined palette
- [ ] Uses spacing values from the spacing scale
- [ ] Uses correct border radius values
- [ ] Follows typography guidelines (font, weight, size, line-height)
- [ ] Includes `data-name` attributes
- [ ] Uses proper flex patterns
- [ ] Has `aria-hidden="true"` on decorative elements
- [ ] Includes `pointer-events-none` on overlay elements
- [ ] Follows component structure patterns
- [ ] Uses consistent icon sizing
- [ ] Matches existing shadow patterns (if elevated)
- [ ] Responsive at common breakpoints

---

## Non-Negotiable Rules

### ❌ DO NOT:
1. Use arbitrary color values not in the palette
2. Use arbitrary spacing (e.g., `p-[11px]`, `gap-[13px]`)
3. Use custom border radius values not defined
4. Mix font families (only use Inter)
5. Create custom shadows without approval
6. Use pixel values that don't match the scale
7. Add inline styles
8. Omit `data-name` attributes on components
9. Use deprecated Tailwind classes

### ✅ DO:
1. Reference this ADR before creating new components
2. Use the exact patterns shown above
3. Maintain consistency with existing components
4. Ask for design review if creating new patterns
5. Update this ADR when new patterns are approved
6. Use semantic HTML elements
7. Follow accessibility guidelines
8. Test components across breakpoints

---

## Decision Rationale

This design system was established based on:

1. **Consistency:** Ensures visual coherence across all features
2. **Maintainability:** Reduces decision fatigue and speeds up development
3. **Scalability:** Allows the system to grow without design drift
4. **Quality:** Enforces best practices and accessibility standards
5. **Collaboration:** Provides clear guidelines for all team members

---

## Consequences

**Positive:**
- Consistent user experience across the application
- Faster development with pre-defined patterns
- Easier onboarding for new developers
- Reduced design review cycles
- Better accessibility by default

**Negative:**
- Initial learning curve for new developers
- Requires discipline to follow guidelines
- May need updates as design evolves

---

## Review Schedule

This ADR should be reviewed:
- Quarterly for updates and refinements
- When major design changes are proposed
- When new component patterns emerge
- After user feedback indicates inconsistencies

**Last Updated:** 2026-04-13  
**Next Review:** 2026-07-13

---

## References

- `/src/imports/Current/Current.tsx` - Reference implementation
- `/src/styles/theme.css` - CSS custom properties
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Inter Font Family](https://rsms.me/inter/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
