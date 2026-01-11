# Phase 04: Architecture Cleanup

## Context

- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:**
  - Phase 01 (water effect) - Complete
  - Phase 02 (content) - Complete
  - Phase 03 (hero storytelling) - Complete

## Overview

| Property | Value |
|----------|-------|
| Description | Final structure optimization, code cleanup, documentation |
| Priority | P2 |
| Status | pending |
| Effort | 1.5h |

## Key Insights

1. **Clean separation** - Water effects, story sections, content should be independent modules
2. **Extensibility** - Architecture should support future story sections easily
3. **Performance audit** - Final pass to remove unused code, optimize bundles
4. **Documentation** - Update project docs to reflect new architecture

## Requirements

### Functional
- R1: Remove deprecated/unused code from previous architecture
- R2: Ensure consistent file naming and organization
- R3: Update exports and imports for clean module boundaries

### Non-Functional
- R4: No circular dependencies
- R5: Bundle size should not increase significantly
- R6: Project documentation reflects new structure
- R7: Type exports available for external use if needed

## Architecture

### Final Directory Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout (no locale)
│   ├── page.tsx             # Home page
│   └── globals.css
├── components/
│   ├── effects/
│   │   ├── Caustics.tsx     # Keep if used
│   │   └── EcosystemLayer.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Section.tsx
│   ├── sections/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── Projects/
│   ├── story/               # NEW: Story-driven sections
│   │   ├── HeroStory.tsx
│   │   ├── RoleCarousel.tsx
│   │   ├── StorySection.tsx # Base component for story segments
│   │   └── index.ts
│   └── water/
│       ├── WaterCanvas.tsx
│       ├── WaterPlane.tsx
│       ├── TextCanvas.ts
│       └── index.tsx
├── content/
│   ├── portfolio.ts         # All content
│   └── index.ts
├── hooks/
│   ├── index.ts
│   ├── useFluidSimulation.ts
│   ├── useScrollStory.ts
│   └── useMediaQuery.ts
├── shaders/
│   ├── simulation.ts
│   └── water.ts
└── types/
    └── content.ts           # Shared type definitions
```

## Related Code Files

| File | Action | Purpose |
|------|--------|---------|
| `src/i18n/` | Delete | Remove i18n infrastructure |
| `messages/` | Delete | Remove all message files |
| `src/app/[locale]/` | Migrate | Move to root app directory |
| `src/components/sections/Hero/` | Delete | Replaced by story/HeroStory |
| Various imports | Update | Clean import paths |

## Implementation Steps

### Step 1: Remove Deprecated Files (20min)

Delete obsolete files:
```bash
# i18n infrastructure
rm -rf src/i18n/
rm -rf messages/

# Old Hero component (replaced by HeroStory)
rm -rf src/components/sections/Hero/

# Unused hooks
rm src/hooks/useRippleCanvas.ts  # If exists and unused
```

### Step 2: Consolidate App Directory (20min)

If using `[locale]` routing, migrate to simpler structure:

Before:
```
src/app/[locale]/layout.tsx
src/app/[locale]/page.tsx
```

After:
```
src/app/layout.tsx
src/app/page.tsx
```

Update layout to remove i18n provider:
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Step 3: Create Index Files (15min)

Add barrel exports for clean imports:

```typescript
// src/components/story/index.ts
export { HeroStory } from "./HeroStory";
export { RoleCarousel } from "./RoleCarousel";
export { StorySection } from "./StorySection";

// src/content/index.ts
export { content } from "./portfolio";
export type * from "./portfolio";

// src/hooks/index.ts
export { useFluidSimulation } from "./useFluidSimulation";
export { useScrollStory } from "./useScrollStory";
export { useIsMobile, useMediaQuery } from "./useMediaQuery";
```

### Step 4: Update All Imports (20min)

Search and replace import paths:

```typescript
// Before
import { useTranslations } from "next-intl";
const t = useTranslations("Hero");

// After
import { content } from "@/content";
```

Check files:
- All section components
- Layout components
- Page components

### Step 5: Create StorySection Base (15min)

Create extensible base component for future story sections:

```typescript
// src/components/story/StorySection.tsx
interface StorySectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  enableScrollAnimation?: boolean;
}

export function StorySection({
  id,
  children,
  className,
  enableScrollAnimation = true
}: StorySectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = enableScrollAnimation && !prefersReducedMotion;

  return (
    <section
      id={id}
      className={cn("relative min-h-screen", className)}
      data-story-section
    >
      {children}
    </section>
  );
}
```

### Step 6: Update Documentation (20min)

Update project documentation:

1. `docs/codebase-summary.md` - Add new structure overview
2. `docs/system-architecture.md` - Update component diagram
3. Code comments - Add JSDoc to new components

```typescript
/**
 * HeroStory - Main hero section with water ripple effect and horizontal scroll
 *
 * @description Displays name under water surface with interactive ripples.
 * On scroll, roles animate horizontally from left to right.
 *
 * @requires Phase 01 water effect implementation
 * @requires GSAP ScrollTrigger for scroll animation
 */
```

### Step 7: Cleanup & Verification (20min)

Final verification:

```bash
# Check for unused dependencies
npm prune

# Build verification
npm run build

# Type check
npm run type-check  # or tsc --noEmit

# Lint
npm run lint
```

Check for:
- No TypeScript errors
- No console warnings about missing modules
- Bundle size reasonable (< 500KB initial)
- All routes work

## Todo List

- [ ] Delete `src/i18n/` directory
- [ ] Delete `messages/` directory
- [ ] Delete old Hero component
- [ ] Migrate from `[locale]` routing to root
- [ ] Create index.ts barrel exports
- [ ] Update all import statements
- [ ] Create StorySection base component
- [ ] Update documentation files
- [ ] Run build verification
- [ ] Check for circular dependencies
- [ ] Verify bundle size
- [ ] Final visual QA

## Success Criteria

- [ ] No deprecated files remain
- [ ] Clean import paths using barrel exports
- [ ] `npm run build` succeeds without warnings
- [ ] No circular dependency errors
- [ ] Documentation reflects new architecture
- [ ] Bundle size unchanged or smaller
- [ ] All pages render correctly

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking imports | Medium | Medium | Use IDE refactoring tools |
| Missing file cleanup | Low | Low | Grep for old import paths |
| Documentation drift | Medium | Low | Update docs immediately after code |

## Notes

- Consider running `depcheck` to find unused dependencies
- May want to keep `next-intl` for future expansion
- Add `.nvmrc` or `engines` field for Node version consistency
- Consider adding `ARCHITECTURE.md` for developer onboarding
