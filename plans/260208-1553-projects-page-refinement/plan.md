# Projects Page Refinement Plan

## Goal
Finalize the Projects page: enrich all project content with real descriptions, standardize the data format by removing legacy/redundant fields, and synchronize UI components for consistent styling.

## Phases

| # | Phase | File | Status | Priority |
|---|-------|------|--------|----------|
| 1 | [Content Enrichment](phase-01-content-enrichment.md) | `src/content/portfolio.ts` | Complete | High |
| 2 | [Data Format Standardization](phase-02-data-format-standardization.md) | `src/content/portfolio.ts` | Complete | High |
| 3 | [UI Synchronization](phase-03-ui-synchronization.md) | `src/components/projects-page/*`, `ProjectModal.tsx` | Complete | Medium |

## Scope
- 9 projects to update content (Da'Portfolio excluded — already finalized)
- Remove legacy fields: `description`, `longDescription`, `problem`, `solution`, `context`, `github`, `demoUrl`, `url`
- Replace with: `tagline`, `overview`, `links[]`, `teamSize`, `responsibilities`
- Extract duplicated `LinkIcon` into shared component
- Standardize styling between `ProjectModal` and `ProjectDetailPanel`

## Key Decisions
- All content in English
- Da'Portfolio content unchanged
- `overview` replaces `description` + `longDescription` + `problem` + `solution`
- `tagline` = short one-liner for list views (was `description`)
- `links[]` = unified link system (replaces `github`, `demoUrl`, `url`)

## Execution Order
Phase 1 & 2 are tightly coupled (content + interface changes in same file) → execute together.
Phase 3 depends on Phase 1+2 completion.

## Cook Command
```
/cook plans/260208-1553-projects-page-refinement/plan.md
```
