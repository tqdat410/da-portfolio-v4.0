# Phase 2: Mobile Responsive - Navbar & TopToolbar

## Priority: High | Status: Pending | Effort: Medium

## Overview
TopToolbar and Navbar have no mobile-specific responsive adjustments. On small screens, toolbar links overflow and navbar overlaps content.

## Current Problems
1. **TopToolbar**: 4 links + email all render at `text-lg` - overflows on small screens
2. **Navbar**: Fixed `bottom-8 left-8` vertical nav takes significant screen space on mobile, overlaps with content
3. Some components' information gets hidden on mobile

## Files to Modify
- `src/components/layout/TopToolbar.tsx` - Mobile responsive toolbar
- `src/components/layout/Navbar.tsx` - Mobile responsive navbar
- `src/app/globals.css` - May need minor adjustments

## Implementation Steps

### 1. TopToolbar Mobile Responsive
On mobile (`< md`):
- Hide email on left side (save space): `hidden md:block`
- Shrink font size: `text-sm md:text-lg`
- Reduce padding: `px-2 md:px-4`
- Reduce gap: `gap-2 md:gap-4`
- Consider wrapping into a horizontal scroll or showing fewer links

Proposed mobile layout:
```
[download cv] [projects] [certificates] [github]
```
All centered or right-aligned, smaller text.

### 2. Navbar Mobile Responsive
On mobile:
- Hide the bottom-left vertical Navbar completely: `hidden md:flex`
- The TopToolbar already provides navigation to projects/certificates
- For section navigation on homepage, rely on scroll behavior
- Alternative: Convert to a minimal bottom tab bar on mobile

Recommended approach - **Hide Navbar on mobile** since:
- TopToolbar covers page navigation (projects, certificates)
- Home page sections are scrollable naturally
- Bottom navbar at `bottom-8 left-8` takes too much real estate on mobile
- The text labels overlap with section content

```tsx
<nav className="hidden md:flex fixed bottom-8 left-8 z-50 flex-col items-start -space-y-5 ...">
```

### 3. Adjust global CSS safe area
Remove the `main { padding-bottom: 64px }` mobile rule since navbar will be hidden on mobile:
```css
@media (max-width: 767px) {
  main {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}
```

## Success Criteria
- [ ] TopToolbar readable on mobile, no overflow
- [ ] Navbar hidden on mobile, visible on desktop
- [ ] No content hidden or unreachable on mobile
- [ ] Touch targets still >= 44px
