---
title: "Storytelling Water Ripple Restructure"
description: "Restructure portfolio for storytelling with interactive water ripple effect"
status: pending
priority: P1
effort: 8h
branch: master
tags: [water-effect, storytelling, scroll, restructure]
created: 2026-01-11
---

# Storytelling Water Ripple Restructure

## Executive Summary

Transform DaPortfolio-v4.0 from a static terrarium theme to an immersive storytelling experience with:
1. **Text-under-water effect** - Name rendered via canvas texture, distorted by water ripples
2. **Horizontal scroll storytelling** - Roles scroll horizontally as user scrolls down
3. **i18n consolidation** - Remove Vietnamese, centralize English content
4. **Clean architecture** - Modular story segments, extensible for future sections

## Architecture Overview

```
src/
  content/
    portfolio.ts          # Centralized content (replaces next-intl)
  components/
    water/
      WaterCanvas.tsx     # Updated: Canvas texture + ping-pong FBO
      WaterPlane.tsx      # Updated: Render shader with distortion
      TextCanvas.ts       # NEW: Canvas 2D text renderer
    story/
      HeroStory.tsx       # NEW: Name under water + role carousel
      StorySection.tsx    # NEW: Base story segment component
      RoleCarousel.tsx    # NEW: Horizontal scroll roles
  shaders/
    simulation.ts         # Keep: Pressure-velocity wave equation
    water.ts              # Update: Du/Dv distortion + specular
  hooks/
    useFluidSimulation.ts # Keep: Ping-pong FBO logic
    useScrollStory.ts     # NEW: GSAP ScrollTrigger integration
```

## Phase Summary

| Phase | Focus | Effort | Priority |
|-------|-------|--------|----------|
| [01](./phase-01-water-effect-refactor.md) | Water ripple with canvas texture | 3h | P1 |
| [02](./phase-02-content-consolidation.md) | i18n removal, content centralization | 1h | P2 |
| [03](./phase-03-hero-storytelling.md) | Hero section with scroll storytelling | 2.5h | P1 |
| [04](./phase-04-architecture-cleanup.md) | Final structure optimization | 1.5h | P2 |

## Key Technical Decisions

1. **Reuse `useFluidSimulation`** - Existing ping-pong FBO works; add canvas texture input
2. **GSAP for horizontal scroll** - Better control than Framer Motion for container animation
3. **Canvas 2D for text** - Simpler than Three.js text geometry; renders to texture
4. **TypeScript content file** - Type-safe, no i18n complexity for single-language site

## Success Criteria

- [ ] Name "TRAN QUOC DAT" visible under water surface with ripple distortion
- [ ] Mouse interaction creates gentle ripples across hero section
- [ ] Scrolling down triggers horizontal text animation (roles)
- [ ] Vietnamese locale removed, single `portfolio.ts` content source
- [ ] Clean component separation: water, story, content

## Dependencies

- GSAP + ScrollTrigger (already available via CDN or npm)
- Three.js / R3F (existing)
- Canvas 2D API (native browser)

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Canvas texture resolution | Use devicePixelRatio scaling, test on mobile |
| ScrollTrigger SSR issues | Dynamic import, client-only rendering |
| Performance on mobile | Lower resolution (128x128), frame skip |

## References

- [research/researcher-01-water-shaders.md](./research/researcher-01-water-shaders.md)
- [research/researcher-02-scroll-storytelling.md](./research/researcher-02-scroll-storytelling.md)
- [ref-water-like-ripples/](../../../ref-water-like-ripples/) - Reference implementation

---

## Validation Summary

**Validated:** 2026-01-11
**Questions Asked:** 5

### Confirmed Decisions

| Decision | User Choice |
|----------|-------------|
| Mobile scroll behavior | Vertical stack (disable horizontal scroll below 768px) |
| i18n removal | Remove completely (delete next-intl, messages/, [locale]/) |
| Water effect scope | Hero section now, extensible to other sections later |
| Color scheme | Terrarium palette (requires research) |
| Section scope | **Rebuild ALL sections for storytelling** |

### Action Items

- [ ] **Research Terrarium color palette** - Need to define colors for name text + water background
- [ ] **Expand scope to all sections** - Plan currently covers Hero only; need additional phases for About, Projects, Contact storytelling redesign
- [ ] **Update effort estimate** - Full rebuild will exceed original 8h estimate

### Scope Expansion Note

User confirmed ALL sections should be rebuilt for storytelling, not just Hero. This significantly expands the scope:

**Original Plan:** Hero storytelling + content consolidation + cleanup = 8h
**Actual Need:** Full site storytelling redesign = ~20-24h estimated

**Recommendation:** Proceed with Phase 01-04 as planned (Hero + foundation), then create Phase 05-07 for remaining sections.
