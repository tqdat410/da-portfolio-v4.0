# Phase 1: Code Cleanup & Data Organization

**Priority:** High | **Effort:** S | **Status:** Pending

## Overview

Remove redundant code, consolidate types, clean unused components, fix stale references.

## Tasks

### 1.1 Remove duplicate types file
- Delete `src/types/content.ts` — all types already defined and exported from `src/content/portfolio.ts`
- Verify no imports reference `@/types/content`

### 1.2 Remove unused SkillsGrid component
- Delete `src/components/sections/About/SkillsGrid.tsx`
- Delete `src/components/sections/About/SkillsGrid.test.tsx`
- Skills are rendered inline in `About.tsx` — SkillsGrid is dead code

### 1.3 Fix sitemap.ts
- Remove `/en` and `/vn` routes — no i18n exists
- Add `/projects` and `/certificates` routes (after those pages are created)

### 1.4 Evaluate unused ProjectCard variants
- `FeaturedCard`, `StandardCard`, `CompactCard` — only `BentoCard` is used in `Projects.tsx`
- Keep them for now — they'll be used in `/projects` page list view
- But remove `FeaturedCard` if still unused after Phase 3

### 1.5 Clean legacy CSS aliases
- Check usage of legacy color aliases (`deep-abyss`, `neon-cyan`, `electric-blue`, etc.)
- If only used via semantic names, remove the legacy block from globals.css

### 1.6 Review `ProjectModal` usage
- Currently `ProjectModal` is imported nowhere in `Projects.tsx` — it's unused dead code
- Keep it — will be repurposed or inform the detail view in Phase 3

## Success Criteria
- [ ] No duplicate type definitions
- [ ] No unused component files
- [ ] Sitemap reflects actual routes
- [ ] Code compiles without errors
