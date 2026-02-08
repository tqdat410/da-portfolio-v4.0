# Phase 1: TopToolbar - Add Certificates Link & Scroll-Aware Background

## Priority: High | Status: Pending | Effort: Small

## Overview
Add "certificates" link to TopToolbar and add a white/semi-transparent background when user scrolls past the hero section.

## Key Insights
- TopToolbar currently has 3 right-side links: download cv, projects, github
- TopToolbar is static `pointer-events-none` container with `fixed top-0` positioning
- No scroll detection logic exists - need to add `"use client"` and scroll listener
- Hero section is `#home` with `min-h-screen`

## Files to Modify
- `src/components/layout/TopToolbar.tsx` - Add certificates link + scroll-aware background

## Implementation Steps

### 1. Add "certificates" link
Add a new `ToolbarLink` between "projects" and "github":
```tsx
<ToolbarLink href="/certificates">certificates</ToolbarLink>
```

### 2. Make TopToolbar a client component
Add `"use client"` directive since we need `useState` + `useEffect` for scroll detection.

### 3. Add scroll-aware background
- Track scroll position with `useEffect` + `scroll` event listener
- Threshold: when `scrollY > window.innerHeight` (past hero section)
- When scrolled past hero: add `bg-white/80 backdrop-blur-md shadow-sm` transition
- When at hero: transparent background (current behavior)

```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

Apply conditional class on header:
```tsx
<header className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4 pointer-events-none transition-all duration-300 ${
  scrolled ? "bg-white/80 backdrop-blur-md shadow-sm pointer-events-auto" : ""
}`}>
```

**Note:** When `scrolled=true`, the entire header gets `pointer-events-auto` since the background is clickable area anyway.

## Success Criteria
- [ ] Certificates link appears in toolbar, navigates to /certificates
- [ ] Toolbar transparent on hero, white bg after scrolling past hero
- [ ] Smooth transition between states
- [ ] No layout shift during transition
