# Plan: Projects & Certificates Pages + Code Cleanup

**Created:** 2026-02-07
**Status:** Draft
**Branch:** main

## Overview

4 work streams:
1. **Code cleanup** - Remove redundant code, organize data, clean unused types
2. **`/projects` page** - Flexible Column Layout (SAP Fiori-style) with list + detail + resizable splitter
3. **`/certificates` page** - Same FCL pattern for certificates
4. **Navigation triggers** - Eye cursor on project images, click-to-navigate links from portfolio sections

## Phases

| # | Phase | Status | Priority | Effort |
|---|-------|--------|----------|--------|
| 1 | [Code Cleanup & Data Org](./phase-01-code-cleanup.md) | Pending | High | S |
| 2 | [Flexible Column Layout Component](./phase-02-flexible-column-layout.md) | Pending | High | M |
| 3 | [/projects Page](./phase-03-projects-page.md) | Pending | High | M |
| 4 | [/certificates Page](./phase-04-certificates-page.md) | Pending | Medium | S |
| 5 | [Navigation Triggers & Hover Effects](./phase-05-navigation-triggers.md) | Pending | Medium | S |

## Dependencies

- Phase 2 blocks Phase 3 & 4 (shared FCL component)
- Phase 1 can run in parallel with Phase 2
- Phase 5 depends on Phase 3 & 4 (needs routes to exist)

## Key Decisions

- **FCL pattern**: CSS `resize` or custom drag splitter? → Custom drag splitter (more control, better UX)
- **Routing**: Next.js App Router `/projects` and `/certificates` as separate pages
- **Shared layout**: No heavy effects (no Three.js/water) on subpages — clean, fast, Silver Mist themed
- **Data source**: Reuse existing `content.projects.items` and `content.about.certificates.items`

## Redundant Code to Remove

1. `src/types/content.ts` — duplicates types already in `portfolio.ts`
2. `src/components/sections/About/SkillsGrid.tsx` + `SkillsGrid.test.tsx` — unused (skills rendered inline in About.tsx)
3. `sitemap.ts` references `/en` and `/vn` routes that don't exist (no i18n)
4. Legacy CSS aliases in globals.css (deep-abyss, neon-cyan etc.) — evaluate usage first
5. `ProjectCard` variants `featured`, `standard`, `compact` — unused (only `bento` used)
