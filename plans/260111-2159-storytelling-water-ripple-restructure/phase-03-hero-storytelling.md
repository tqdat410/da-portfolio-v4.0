# Phase 03: Hero Section Storytelling

## Context

- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:**
  - Phase 01 (water effect) - Water ripple must work
  - Phase 02 (content) - Content must be accessible
- **Research:** [research/researcher-02-scroll-storytelling.md](./research/researcher-02-scroll-storytelling.md)

## Overview

| Property | Value |
|----------|-------|
| Description | Implement hero section with name under water and horizontal scroll roles |
| Priority | P1 |
| Status | pending |
| Effort | 2.5h |

## Key Insights

From scroll storytelling research:

1. **GSAP ScrollTrigger** best for horizontal scroll on vertical scroll (pinning, scrub)
2. **containerAnimation** pattern syncs horizontal movement with scroll position
3. **Framer Motion useTransform** simpler but less precise for complex sequences
4. **Stagger timing** 100-300ms creates natural rhythm without sluggishness
5. **Reduced motion** must disable all parallax and scroll animations

## Requirements

### Functional
- R1: Hero displays name "TRAN QUOC DAT" under water surface (from Phase 01)
- R2: On scroll down, roles text animates horizontally to the right
- R3: Roles: "Software Engineer", "SAP Technical Consultant", "Fullstack Developer", "Creative Developer"
- R4: Hero section pins during horizontal scroll animation
- R5: After roles complete, continue scrolling to next section

### Non-Functional
- R6: Smooth 60fps animation during scroll
- R7: Mobile: vertical stack instead of horizontal scroll
- R8: Reduced motion: instant display without animation

## Architecture

### Component Structure
```
src/components/story/
  HeroStory.tsx       # Main hero orchestration
  RoleCarousel.tsx    # Horizontal scroll role text
  useScrollStory.ts   # GSAP ScrollTrigger hook
```

### Scroll Behavior
```
Scroll Position    Visual State
─────────────────────────────────────
0% (top)           Name under water, roles hidden (left)
0-30%              Hero pinned, roles scroll in from left
30%                Roles centered, brief pause
30-50%             Roles continue to right, fade out
50%+               Hero unpins, scroll to About section
```

### Data Flow
```
ScrollPosition ──> useScrollStory ──> GSAP Timeline
                                         │
                                         ├──> HeroStory (pin)
                                         └──> RoleCarousel (x translate)
```

## Related Code Files

| File | Action | Purpose |
|------|--------|---------|
| `src/components/sections/Hero/Hero.tsx` | Replace | Integrate with story components |
| `src/components/story/HeroStory.tsx` | Create | Main hero with water + scroll |
| `src/components/story/RoleCarousel.tsx` | Create | Horizontal scroll roles |
| `src/hooks/useScrollStory.ts` | Create | GSAP ScrollTrigger integration |
| `src/content/portfolio.ts` | Read | Content source |

## Implementation Steps

### Step 1: Install GSAP (10min)
Add GSAP with ScrollTrigger plugin.

```bash
npm install gsap @gsap/react
```

Create GSAP registration hook:
```typescript
// src/hooks/useGSAP.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

### Step 2: Create useScrollStory Hook (30min)
Encapsulate ScrollTrigger setup for hero storytelling.

```typescript
// src/hooks/useScrollStory.ts
interface UseScrollStoryOptions {
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLElement>;
  scrollDistance: number;  // How far to scroll horizontally
  pinDuration: number;     // Scroll distance for pin
}

export function useScrollStory(options: UseScrollStoryOptions) {
  const { triggerRef, contentRef, scrollDistance, pinDuration } = options;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${pinDuration}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);
}
```

### Step 3: Create RoleCarousel Component (45min)
Horizontal scroll container for role titles.

```typescript
// src/components/story/RoleCarousel.tsx
interface RoleCarouselProps {
  roles: string[];
  className?: string;
}

export function RoleCarousel({ roles, className }: RoleCarouselProps) {
  return (
    <div className={cn("flex gap-16 whitespace-nowrap", className)}>
      {roles.map((role, i) => (
        <span
          key={role}
          className="text-2xl md:text-4xl font-medium text-warm-cream/80"
        >
          {role}
        </span>
      ))}
    </div>
  );
}
```

Styling considerations:
- Large gap between roles (4rem+)
- Semi-transparent text
- Serif or display font for elegance
- Total width = sum of roles + gaps

### Step 4: Create HeroStory Component (45min)
Orchestrate water effect + scroll animation.

```typescript
// src/components/story/HeroStory.tsx
export function HeroStory() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Skip scroll animation on mobile or reduced motion
  const enableScrollAnimation = !isMobile && !prefersReducedMotion;

  useScrollStory({
    triggerRef,
    contentRef: carouselRef,
    scrollDistance: 1500, // Adjust based on role text width
    pinDuration: 1000,    // Scroll pixels during pin
    enabled: enableScrollAnimation,
  });

  return (
    <section ref={triggerRef} className="relative min-h-screen">
      {/* Water effect layer - from Phase 01 */}
      <WaterEffects />

      {/* Name overlay - rendered to canvas in Phase 01 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Name text hidden (rendered in canvas) */}
      </div>

      {/* Roles carousel */}
      <div className="absolute bottom-1/4 left-0 overflow-hidden w-full">
        <div ref={carouselRef}>
          <RoleCarousel roles={content.roles} />
        </div>
      </div>
    </section>
  );
}
```

### Step 5: Mobile Fallback (20min)
Implement vertical stack for mobile devices.

```typescript
// Inside HeroStory.tsx
if (isMobile) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">{content.hero.name}</h1>
      <div className="flex flex-col gap-4 text-center">
        {content.roles.map(role => (
          <span key={role} className="text-lg text-warm-cream/70">{role}</span>
        ))}
      </div>
    </section>
  );
}
```

### Step 6: Replace Original Hero (20min)
Update main layout to use new HeroStory.

```typescript
// src/app/layout.tsx or page.tsx
import { HeroStory } from "@/components/story/HeroStory";

// Replace <Hero /> with <HeroStory />
```

### Step 7: Testing & Refinement (20min)
- Scroll behavior: verify pin/unpin timing
- Animation smoothness: check for jank
- Mobile: verify fallback renders correctly
- Reduced motion: verify static display

## Todo List

- [ ] Install GSAP and ScrollTrigger
- [ ] Create useGSAP registration wrapper
- [ ] Implement useScrollStory hook
- [ ] Create RoleCarousel component
- [ ] Create HeroStory component
- [ ] Add mobile fallback layout
- [ ] Integrate with existing layout
- [ ] Test scroll animation on desktop
- [ ] Test mobile responsiveness
- [ ] Verify reduced motion behavior
- [ ] Add scroll indicator animation

## Success Criteria

- [ ] Hero section pins during scroll
- [ ] Roles animate horizontally as user scrolls
- [ ] Animation syncs smoothly with scroll position (scrub)
- [ ] After roles complete, continues to next section
- [ ] Mobile displays vertical stack
- [ ] Reduced motion shows static content
- [ ] No jank or layout shift during animation

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ScrollTrigger SSR errors | High | Medium | Dynamic import, useLayoutEffect guard |
| Pin causes layout shift | Medium | Medium | Set explicit heights, test on multiple browsers |
| Role text too long for viewport | Medium | Low | Responsive font sizes, test different screens |
| Scroll hijacking feels wrong | Medium | High | Test with users, adjust scrub duration |

## Notes

- GSAP free tier allows commercial use but check license
- ScrollTrigger `anticipatePin: 1` helps with pin smoothness
- Consider adding opacity fade for roles as they exit viewport
- May need z-index management between water layer and text
