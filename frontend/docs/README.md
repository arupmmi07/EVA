# Design System Documentation

This directory contains all design system guidelines, architecture decision records, and development standards for the project.

---

## 📚 Documentation Index

### Design System

#### [ADR-001: Design System Standards](./ADR-001-DESIGN-SYSTEM.md)
**Comprehensive design system specification** - The complete reference for all design decisions, component patterns, and style guidelines.

**Use this when:**
- Creating new components from scratch
- Understanding the rationale behind design decisions
- Reviewing PRs for design consistency
- Onboarding new team members
- Planning new features

**Contains:**
- Complete color palette with usage guidelines
- Typography system (fonts, sizes, weights, line-heights)
- Spacing scale and usage rules
- Border radius standards
- Component patterns with code examples
- Layout guidelines
- SVG and icon standards
- Shadow system
- Accessibility requirements
- Code style guidelines

---

#### [Design System Quick Reference](./DESIGN-SYSTEM-QUICK-REFERENCE.md)
**Fast lookup guide** - A condensed cheat sheet for daily development work.

**Use this when:**
- You need a quick reminder of spacing values
- Looking up color codes
- Finding the right typography class
- Copying common component patterns
- Checking border radius values
- Verifying icon sizes

**Contains:**
- Color palette quick reference
- Spacing scale
- Border radius values
- Typography patterns (copy-paste ready)
- Common component patterns (copy-paste ready)
- SVG icon template
- Pre-commit checklist
- Common mistakes to avoid

---

## 🚀 Quick Start

### For New Developers

1. **Read first:** [ADR-001-DESIGN-SYSTEM.md](./ADR-001-DESIGN-SYSTEM.md) (15 min read)
   - Understand the design philosophy
   - Learn the component patterns
   - Review the decision rationale

2. **Bookmark:** [DESIGN-SYSTEM-QUICK-REFERENCE.md](./DESIGN-SYSTEM-QUICK-REFERENCE.md)
   - Keep this open while coding
   - Use for quick lookups
   - Copy-paste common patterns

3. **Practice:** Build a sample component using the patterns
   - Follow the typography guidelines
   - Use spacing from the scale
   - Apply the proper component structure

### For Experienced Developers

**Daily workflow:**
1. Open Quick Reference when starting component work
2. Copy relevant patterns
3. Customize with design tokens from the palette
4. Run through the checklist before committing

**When in doubt:**
- Check [ADR-001](./ADR-001-DESIGN-SYSTEM.md) for detailed explanations
- Look at `/src/imports/Current/Current.tsx` for reference implementations
- Ask for design review on Slack/PR

---

## 📋 Development Workflow

### Before Creating a Component

1. **Check if it exists:** Search `/src/app/components` for similar components
2. **Review patterns:** Open Quick Reference for the component type you need
3. **Copy base pattern:** Start with a proven pattern from the docs
4. **Customize:** Apply specific content and styling

### While Building

1. **Use the spacing scale:** Only 4, 6, 8, 12, 16, 20, 40px
2. **Use palette colors:** No arbitrary hex codes
3. **Follow typography:** Complete font declarations with all properties
4. **Add data-name:** Every component needs `data-name` attribute

### Before Committing

Run through the checklist in [Quick Reference](./DESIGN-SYSTEM-QUICK-REFERENCE.md):
- [ ] Colors from palette
- [ ] Spacing from scale
- [ ] Border radius standards
- [ ] Typography complete
- [ ] `data-name` attributes
- [ ] Accessibility attributes
- [ ] Responsive at common breakpoints

---

## 🎯 Common Tasks

### "I need to create a button"
→ [Quick Reference: Button Pattern](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-common-patterns)

### "What color should I use for borders?"
→ [Quick Reference: Colors](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-colors)  
→ `border-[rgba(0,9,50,0.12)]` (most common)

### "How do I add an icon?"
→ [Quick Reference: Icon Container](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-common-patterns)

### "What padding should this component have?"
→ [Quick Reference: Spacing](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-spacing)  
→ Use scale: 4, 6, 8, 12, 16, 20, 40px

### "How do I structure a card component?"
→ [Quick Reference: Card Container](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-common-patterns)

### "What's the standard shadow?"
→ [Quick Reference: Shadows](./DESIGN-SYSTEM-QUICK-REFERENCE.md#-shadows)

### "Why are we doing it this way?"
→ [ADR-001: Decision Rationale](./ADR-001-DESIGN-SYSTEM.md#decision-rationale)

---

## 🔍 Reference Implementations

**Look at these files for real-world examples:**

- `/src/imports/Current/Current.tsx` - Complete UI with sidebar, header, chat
- `/src/imports/Current-1/Current.tsx` - Alternative implementation
- `/src/imports/Screen45/Screen45.tsx` - Additional screen example
- `/src/styles/theme.css` - CSS custom properties and tokens

---

## ✅ Design Review Checklist

Use this when reviewing PRs or your own code:

### Visual Consistency
- [ ] Colors match the palette (no arbitrary colors)
- [ ] Spacing uses scale values (4, 6, 8, 12, 16, 20, 40)
- [ ] Border radius matches standards (3, 4, 8, 12, 9999)
- [ ] Shadows match the standard (if applicable)

### Typography
- [ ] Font family is Inter (Regular, Medium, or Semi_Bold)
- [ ] Font size is from scale (12, 14, 16px)
- [ ] Line height is specified and correct
- [ ] Font weight matches font family

### Component Structure
- [ ] Uses flex patterns consistently
- [ ] Includes `data-name` attributes
- [ ] Border overlays have `aria-hidden="true"`
- [ ] Overlays have `pointer-events-none`
- [ ] SVGs follow the icon pattern

### Accessibility
- [ ] Semantic HTML where possible
- [ ] Proper ARIA attributes
- [ ] Sufficient color contrast
- [ ] Keyboard navigable (if interactive)

### Code Quality
- [ ] No inline styles
- [ ] Class names in proper order
- [ ] No arbitrary Tailwind values
- [ ] Follows existing patterns
- [ ] Responsive at breakpoints

---

## 🚫 Common Mistakes

### ❌ Arbitrary Values
```tsx
// Wrong
<div className="p-[13px] bg-[#abc123] rounded-[7px]">

// Correct
<div className="p-[12px] bg-[#135bec] rounded-[8px]">
```

### ❌ Incomplete Typography
```tsx
// Wrong - missing font family, weight, line-height
<p className="text-[14px]">Text</p>

// Correct - complete typography
<p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] text-[14px]">
  Text
</p>
```

### ❌ Missing Data Names
```tsx
// Wrong
<div className="flex items-center">

// Correct
<div className="flex items-center" data-name="ComponentName">
```

### ❌ Borders Without Overlays
```tsx
// Wrong - border not using overlay pattern
<div className="border border-gray-300 rounded-[12px]">

// Correct - proper border overlay
<div className="relative rounded-[12px]">
  <div className="content-stretch">Content</div>
  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.12)] inset-0 pointer-events-none rounded-[12px]" />
</div>
```

---

## 🔄 Updating the Design System

### When to Update

Update the design system documentation when:
- New component patterns are approved by design
- Color palette changes
- Spacing scale is modified
- New typography styles are introduced
- Accessibility requirements change

### How to Update

1. **Propose changes:** Create a PR with rationale
2. **Get approval:** Design team + lead developer review
3. **Update ADR-001:** Add to the main design system doc
4. **Update Quick Reference:** Add to the cheat sheet
5. **Notify team:** Announce in Slack/team meeting
6. **Update reference implementations:** Modify example components if needed

### Version History

- **v1.0.0** (2026-04-13): Initial design system established
  - Based on Figma imports
  - Comprehensive component patterns
  - Typography and spacing scales

---

## 📞 Getting Help

### Questions?

1. **Check the docs first:** Most answers are in ADR-001 or Quick Reference
2. **Search for examples:** Look at reference implementations
3. **Ask on Slack:** #design-system channel
4. **Request design review:** Tag @design-team on PR

### Found an Inconsistency?

1. Document the issue
2. Create a GitHub issue
3. Propose a solution
4. Submit a PR to update the docs

### Need a New Pattern?

1. Check if you can adapt an existing pattern
2. If truly new, create a proposal
3. Get design team approval
4. Add to the design system docs
5. Share with the team

---

## 📖 Additional Resources

- **Tailwind CSS:** https://tailwindcss.com
- **Inter Font:** https://rsms.me/inter/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*

---

## 📅 Review Schedule

- **Quarterly Review:** Every 3 months (Jan, Apr, Jul, Oct)
- **Ad-hoc Updates:** As needed when design evolves
- **Next Review:** 2026-07-13

---

**Last Updated:** 2026-04-13  
**Maintained By:** Development Team
