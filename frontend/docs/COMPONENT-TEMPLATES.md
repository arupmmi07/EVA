# Component Templates

Copy-paste templates for common component types. All templates follow the design system standards.

---

## 🔘 Button Components

### Primary Button
```tsx
function PrimaryButton() {
  return (
    <div 
      className="bg-[#4e37f6] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0"
      data-name="PrimaryButton"
    >
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-white whitespace-nowrap">
        Button Text
      </p>
    </div>
  );
}
```

### Secondary Button (Outlined)
```tsx
function SecondaryButton() {
  return (
    <div 
      className="content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0"
      data-name="SecondaryButton"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[#020617] whitespace-nowrap">
        Button Text
      </p>
    </div>
  );
}
```

### Icon Button
```tsx
function IconButton() {
  return (
    <div 
      className="content-stretch flex items-center justify-center p-[6px] relative rounded-[12px] shrink-0 size-[32px]"
      data-name="IconButton"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="overflow-clip relative shrink-0 size-[16px]">
        {/* Icon SVG */}
      </div>
    </div>
  );
}
```

### Button with Icon
```tsx
function ButtonWithIcon() {
  return (
    <div 
      className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0"
      data-name="ButtonWithIcon"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="overflow-clip relative shrink-0 size-[16px]">
        {/* Icon SVG */}
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[#020617] whitespace-nowrap">
        Button Text
      </p>
    </div>
  );
}
```

---

## 🃏 Card Components

### Basic Card
```tsx
function BasicCard() {
  return (
    <div 
      className="bg-white relative rounded-[12px] shrink-0 w-full"
      data-name="BasicCard"
    >
      <div className="content-stretch flex flex-col overflow-clip relative rounded-[inherit] size-full p-[16px]">
        {/* Card content */}
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}
```

### Elevated Card (with shadow)
```tsx
function ElevatedCard() {
  return (
    <div 
      className="bg-white relative rounded-[12px] shrink-0 w-full"
      data-name="ElevatedCard"
    >
      <div className="content-stretch flex flex-col overflow-clip relative rounded-[inherit] size-full p-[16px]">
        {/* Card content */}
      </div>
      <div 
        aria-hidden="true" 
        className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_12px_32px_-16px_rgba(0,0,51,0.06),0px_8px_40px_0px_rgba(0,0,0,0.05)]" 
      />
    </div>
  );
}
```

### Card with Header
```tsx
function CardWithHeader() {
  return (
    <div 
      className="bg-white relative rounded-[12px] shrink-0 w-full"
      data-name="CardWithHeader"
    >
      <div className="content-stretch flex flex-col overflow-clip relative rounded-[inherit] size-full">
        {/* Header */}
        <div className="min-h-[64px] relative shrink-0 w-full">
          <div className="flex flex-row items-center min-h-[inherit] size-full px-[16px]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] text-[16px] text-[#020617]">
              Card Title
            </p>
          </div>
          <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none" />
        </div>
        
        {/* Content */}
        <div className="flex-[1_0_0] min-h-px min-w-px relative w-full p-[16px]">
          {/* Card content */}
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}
```

---

## 📝 Input Components

### Text Input
```tsx
function TextInput() {
  return (
    <div 
      className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full"
      data-name="TextInput"
    >
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[4px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[rgba(0,5,29,0.45)] min-h-px min-w-px">
            Placeholder text
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}
```

### Input with Icon
```tsx
function InputWithIcon() {
  return (
    <div 
      className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full"
      data-name="InputWithIcon"
    >
      <div className="content-stretch flex items-center gap-[8px] overflow-clip relative rounded-[inherit] size-full px-[8px]">
        <div className="overflow-clip relative shrink-0 size-[16px]">
          {/* Icon SVG */}
        </div>
        <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[rgba(0,5,29,0.45)] min-h-px min-w-px">
          Search...
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}
```

### Dropdown/Select
```tsx
function Dropdown() {
  return (
    <div 
      className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full"
      data-name="Dropdown"
    >
      <div className="content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[4px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px] text-[#020617] min-h-px min-w-px">
            Selected Option
          </p>
        </div>
        <div className="content-stretch flex items-center pl-[4px] relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]">
            {/* Chevron down icon */}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}
```

---

## 🏷️ Badge Components

### Basic Badge
```tsx
function Badge() {
  return (
    <div 
      className="bg-[#eaecf0] content-stretch flex items-center min-h-[32px] px-[12px] py-[6px] relative rounded-[9999px] shrink-0"
      data-name="Badge"
    >
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-[#64748b] whitespace-nowrap">
        Badge Text
      </p>
    </div>
  );
}
```

### Badge with Icon
```tsx
function BadgeWithIcon() {
  return (
    <div 
      className="bg-[#eaecf0] content-stretch flex gap-[6px] items-center min-h-[32px] px-[12px] py-[6px] relative rounded-[9999px] shrink-0"
      data-name="BadgeWithIcon"
    >
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-[#64748b] whitespace-nowrap">
        Badge Text
      </p>
      <div className="overflow-clip relative shrink-0 size-[16px]">
        {/* Icon SVG */}
      </div>
    </div>
  );
}
```

### Status Badge
```tsx
function StatusBadge() {
  return (
    <div 
      className="bg-[#ebf0ff] content-stretch flex items-center min-h-[24px] px-[8px] py-[4px] relative rounded-[9999px] shrink-0"
      data-name="StatusBadge"
    >
      <div className="flex items-center gap-[4px]">
        <div className="bg-[#135bec] rounded-full size-[6px]" />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] text-[12px] text-[#135bec] whitespace-nowrap">
          Active
        </p>
      </div>
    </div>
  );
}
```

---

## 🎨 Icon Components

### Icon Container (SVG)
```tsx
function Icon() {
  return (
    <div 
      className="overflow-clip relative shrink-0 size-[20px]"
      data-name="Icon"
    >
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path 
              d="M8 2L2 6v10h4V10h4v6h4V6L8 2z" 
              stroke="var(--stroke-0, #020617)" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.25" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

### Icon with Background
```tsx
function IconWithBackground() {
  return (
    <div 
      className="bg-[#ebf0ff] content-stretch flex items-center justify-center relative rounded-[12px] shrink-0 size-[32px]"
      data-name="IconWithBackground"
    >
      <div className="overflow-clip relative shrink-0 size-[16px]">
        <div className="absolute inset-[8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path 
              stroke="var(--stroke-0, #6E56CF)" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.25" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 List Components

### List Item
```tsx
function ListItem() {
  return (
    <div 
      className="relative shrink-0 w-full"
      data-name="ListItem"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center p-[16px] relative size-full gap-[12px]">
          <div className="overflow-clip relative shrink-0 size-[20px]">
            {/* Icon */}
          </div>
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-[#020617] min-h-px min-w-px">
            List item text
          </p>
        </div>
      </div>
    </div>
  );
}
```

### List with Dividers
```tsx
function ListWithDividers() {
  return (
    <div 
      className="flex flex-col w-full"
      data-name="ListWithDividers"
    >
      <div className="relative shrink-0 w-full">
        <div className="content-stretch flex items-center p-[16px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-[#020617]">
            Item 1
          </p>
        </div>
        <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none" />
      </div>
      <div className="relative shrink-0 w-full">
        <div className="content-stretch flex items-center p-[16px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-[#020617]">
            Item 2
          </p>
        </div>
        <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none" />
      </div>
    </div>
  );
}
```

---

## 🗂️ Layout Components

### Header
```tsx
function Header() {
  return (
    <div 
      className="bg-white min-h-[64px] relative shrink-0 w-full"
      data-name="Header"
    >
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between min-h-[inherit] px-[16px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] text-[16px] text-[#020617]">
            Page Title
          </p>
          {/* Actions */}
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-b border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none" />
    </div>
  );
}
```

### Sidebar
```tsx
function Sidebar() {
  return (
    <div 
      className="bg-[rgba(0,64,255,0.03)] h-full relative shrink-0 w-[64px]"
      data-name="Sidebar"
    >
      <div className="content-stretch flex flex-col items-center overflow-x-clip overflow-y-auto relative size-full">
        {/* Sidebar items */}
      </div>
      <div aria-hidden="true" className="absolute border-r border-[rgba(0,9,50,0.12)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}
```

### Content Container (Centered)
```tsx
function CenteredContent() {
  return (
    <div 
      className="flex-[1_0_0] min-h-px min-w-px relative w-full"
      data-name="CenteredContent"
    >
      <div className="overflow-auto size-full">
        <div className="content-stretch flex flex-col items-center p-[40px] relative size-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start max-w-[640px] relative shrink-0 w-full">
            {/* Content */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Two-Column Layout
```tsx
function TwoColumnLayout() {
  return (
    <div 
      className="flex flex-row gap-[16px] w-full"
      data-name="TwoColumnLayout"
    >
      {/* Left column */}
      <div className="flex-[1_0_0] min-h-px min-w-px relative">
        {/* Left content */}
      </div>
      
      {/* Right column */}
      <div className="flex-[1_0_0] min-h-px min-w-px relative">
        {/* Right content */}
      </div>
    </div>
  );
}
```

---

## 🎯 Navigation Components

### Nav Item (Active)
```tsx
function NavItemActive() {
  return (
    <div 
      className="bg-[rgba(0,64,255,0.08)] min-h-[64px] relative shrink-0 w-full"
      data-name="NavItemActive"
    >
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] px-[16px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]">
            {/* Icon */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Nav Item (Inactive)
```tsx
function NavItem() {
  return (
    <div 
      className="relative shrink-0 w-full"
      data-name="NavItem"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[16px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[20px]">
            {/* Icon */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔔 Notification Components

### Notification Badge (Dot)
```tsx
function NotificationDot() {
  return (
    <div 
      className="relative shrink-0"
      data-name="NotificationBadge"
    >
      <div className="overflow-clip relative shrink-0 size-[20px]">
        {/* Icon */}
      </div>
      {/* Notification dot */}
      <div className="absolute bg-[#4e37f6] rounded-full size-[8px] top-0 right-0" />
    </div>
  );
}
```

### Notification Bell
```tsx
function NotificationBell() {
  return (
    <div 
      className="bg-[rgba(0,64,255,0.03)] content-stretch flex items-center justify-center overflow-clip relative rounded-[3px] shrink-0 size-[24px]"
      data-name="NotificationBell"
    >
      <div className="relative shrink-0 size-[16px]">
        <div className="absolute inset-[1%_13.33%_1.67%_13.33%]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
            <path 
              clipRule="evenodd"
              d="M6 0C4.5 0 3.5 1 3.5 2.5V3C1.5 3.5 0 5 0 7v5l-1 1v1h14v-1l-1-1V7c0-2-1.5-3.5-3.5-4v-.5C8.5 1 7.5 0 6 0z"
              fill="var(--fill-0, #002BB7)"
              fillOpacity="0.772549"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,55,237,0.33)] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}
```

---

## 💬 Chat Components

### Chat Message (User)
```tsx
function UserMessage() {
  return (
    <div 
      className="flex flex-row justify-end w-full"
      data-name="UserMessage"
    >
      <div className="bg-[#4e37f6] content-stretch flex flex-col gap-[8px] items-start max-w-[640px] p-[12px] relative rounded-[12px] shrink-0">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-white">
          Message text
        </p>
      </div>
    </div>
  );
}
```

### Chat Message (System)
```tsx
function SystemMessage() {
  return (
    <div 
      className="flex flex-row justify-start w-full"
      data-name="SystemMessage"
    >
      <div className="bg-white content-stretch flex flex-col gap-[8px] items-start max-w-[640px] p-[12px] relative rounded-[12px] shrink-0">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[14px] text-[#020617]">
          Message text
        </p>
      </div>
    </div>
  );
}
```

### Chat Input
```tsx
function ChatInput() {
  return (
    <div 
      className="bg-white relative shrink-0 w-full"
      data-name="ChatInput"
    >
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[16px] pb-[16px] relative size-full">
          <div className="bg-[#f3f4f7] max-w-[640px] min-w-[240px] relative rounded-[12px] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[16px] items-center p-[16px] relative size-full">
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center px-[8px] py-[4px] relative size-full">
                    <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[24px] text-[16px] text-[#64748b] min-h-px min-w-px">
                      Type a message...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Usage Tips

### How to Use These Templates

1. **Copy the entire function**
2. **Rename the function** to match your component name
3. **Update `data-name`** attribute
4. **Replace placeholder content** (text, icons, etc.)
5. **Adjust sizing** if needed (width, height)
6. **Keep all other styling** intact

### Customization Guidelines

**✅ Safe to customize:**
- Content (text, icons, images)
- Width/height (using design system values)
- Colors (using palette colors)
- Gap/spacing (using scale values)

**⚠️ Keep unchanged:**
- Font family declarations
- Border overlay patterns
- `aria-hidden` and `pointer-events-none`
- Flex patterns (`content-stretch`, etc.)
- `data-name` attribute (update value, not attribute)

### Finding the Right Template

| Need | Template |
|------|----------|
| Clickable element | Button Components |
| Container with border | Card Components |
| User input | Input Components |
| Small label/tag | Badge Components |
| Visual indicator | Icon Components |
| Repeated items | List Components |
| Page structure | Layout Components |
| Menu/tab items | Navigation Components |
| Alerts/updates | Notification Components |
| Messages | Chat Components |

---

**See also:**
- [ADR-001-DESIGN-SYSTEM.md](./ADR-001-DESIGN-SYSTEM.md) - Complete design system
- [DESIGN-SYSTEM-QUICK-REFERENCE.md](./DESIGN-SYSTEM-QUICK-REFERENCE.md) - Quick lookup guide
- [README.md](./README.md) - Documentation overview
