# Design System Quick Reference

**Quick lookup guide for common design patterns and values.**

---

## 🎨 Colors

### Most Common
```tsx
bg-white                          // White backgrounds
bg-[#fcfcfd]                      // Subtle background
bg-[#f3f4f7]                      // Input/container backgrounds
bg-[#135bec]                      // Primary brand blue
bg-[#4e37f6]                      // Primary action purple
bg-[#ebf0ff]                      // Accent background

text-[#020617]                    // Primary text
text-[#64748b]                    // Secondary/muted text
text-[rgba(0,5,29,0.45)]          // Placeholder text

border-[rgba(0,9,50,0.12)]        // Standard borders
border-[rgba(0,0,0,0.12)]         // Alternative borders
```

---

## 📏 Spacing

```tsx
gap-[4px]   gap-[6px]   gap-[8px]   gap-[12px]   gap-[16px]   gap-[20px]
p-[4px]     p-[6px]     p-[8px]     p-[12px]     p-[16px]     p-[40px]
px-[16px] py-[8px]      // Standard button padding
```

---

## 🔲 Border Radius

```tsx
rounded-[3px]         // Very small
rounded-[4px]         // Input fields
rounded-[8px]         // Buttons (compact)
rounded-[12px]        // Cards, containers, buttons
rounded-[9999px]      // Badges, pills
```

---

## 📐 Sizes

### Icons
```tsx
size-[16px]   size-[20px]   size-[24px]   size-[32px]
```

### Heights
```tsx
h-[32px]      // Standard button/input
h-[64px]      // Header
min-h-[64px]  // Flexible header
```

### Widths
```tsx
w-[64px]      // Sidebar
max-w-[640px] // Content max width
```

---

## ✍️ Typography

### Font Stack
```tsx
font-['Inter:Regular',sans-serif]     font-normal      // Body text
font-['Inter:Medium',sans-serif]      font-medium      // Labels, buttons
font-['Inter:Semi_Bold',sans-serif]   font-semibold    // Headings
```

### Font Sizes & Line Heights
```tsx
text-[12px]  leading-[18px]   // Small labels, badges
text-[14px]  leading-[20px]   // Body, buttons, inputs
text-[16px]  leading-[24px]   // Standard body, headings
text-[16px]  leading-[28px]   // Loose text, lists
leading-[1.5]                 // Proportional
```

### Complete Text Patterns
```tsx
// Button/Label
className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[#020617]"

// Body Text
className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-[#020617]"

// Muted Text
className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-[#64748b]"

// Badge Text
className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-[#64748b]"

// Heading
className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] text-[16px] text-[#020617]"
```

---

## 🏗️ Common Patterns

### Card Container
```tsx
<div className="bg-white relative rounded-[12px] shrink-0">
  <div className="content-stretch flex flex-col overflow-clip relative rounded-[inherit] size-full">
    {/* Content */}
  </div>
  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
</div>
```

### Button
```tsx
<div className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0">
  {/* Content */}
</div>
```

### Input Field
```tsx
<div className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full">
  <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
    <div className="content-stretch flex items-center px-[4px] relative size-full">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px]">
        Text
      </p>
    </div>
  </div>
  <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
</div>
```

### Badge/Pill
```tsx
<div className="bg-[#eaecf0] content-stretch flex gap-[6px] items-center min-h-[32px] px-[12px] py-[6px] relative rounded-[9999px] shrink-0">
  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-[#64748b]">
    Badge Text
  </p>
</div>
```

### Icon Container
```tsx
<div className="overflow-clip relative shrink-0 size-[20px]">
  <div className="absolute inset-[8.33%]">
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <path stroke="var(--stroke-0, #020617)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
    </svg>
  </div>
</div>
```

### Full-Width Flex
```tsx
<div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
```

### Centered Content
```tsx
<div className="content-stretch flex items-center justify-center">
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

## 🎯 SVG Icons

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
- `className="block size-full"`
- `fill="none"` for stroke-based icons
- `strokeWidth="1.25"` or `1.5`
- Always use CSS variables: `var(--stroke-0, #020617)`

---

## 🎭 Shadows

```tsx
// Card elevation
className="shadow-[0px_12px_32px_-16px_rgba(0,0,51,0.06),0px_8px_40px_0px_rgba(0,0,0,0.05)]"
```

---

## ✅ Checklist

Before committing:
- [ ] Colors from palette only
- [ ] Spacing from scale (4, 6, 8, 12, 16, 20, 40)
- [ ] Border radius matches standards
- [ ] Complete typography (font, weight, size, line-height)
- [ ] `data-name` attributes on components
- [ ] `aria-hidden="true"` on decorative overlays
- [ ] `pointer-events-none` on overlays
- [ ] Tested at 375px, 768px, 1440px

---

## 🚫 Common Mistakes

❌ Don't:
```tsx
p-[11px]                              // Use scale values only
bg-[#abc123]                          // Use palette colors only
rounded-[7px]                         // Use standard radius values
font-['Roboto',sans-serif]            // Only use Inter
text-[15px]                           // Use defined sizes (12, 14, 16)
```

✅ Do:
```tsx
p-[12px]
bg-[#135bec]
rounded-[8px]
font-['Inter:Medium',sans-serif]
text-[14px]
```

---

**See [ADR-001-DESIGN-SYSTEM.md](./ADR-001-DESIGN-SYSTEM.md) for complete documentation.**
