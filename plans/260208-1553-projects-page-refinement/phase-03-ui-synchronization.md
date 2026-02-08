# Phase 3: UI Synchronization

## Priority: Medium
## Status: Pending

## Overview
Synchronize UI components that display project data. Remove legacy field fallbacks, extract duplicated `LinkIcon` into shared component, and ensure consistent styling between `ProjectModal` (homepage) and `ProjectDetailPanel` (projects page).

## Files to Modify
- `src/components/projects-page/project-detail-panel.tsx`
- `src/components/projects-page/project-list-panel.tsx`
- `src/components/sections/Projects/ProjectModal.tsx`
- `src/components/icons/` — new shared `LinkIcon` component

## Changes

### 1. Extract Shared `LinkIcon` Component
`LinkIcon` is duplicated identically in both `project-detail-panel.tsx` and `ProjectModal.tsx`.

**Action:** Create `src/components/icons/link-icon.tsx` with the shared component, import in both files.

### 2. Remove Legacy Field References

**In `project-detail-panel.tsx` and `ProjectModal.tsx`:**
- Remove `const overview = project.overview || project.longDescription` → just `project.overview`
- Remove entire legacy `github` rendering block (lines handling `typeof project.github === "string"`)
- Remove fallback for `project.demoUrl || project.url` in footer → use `project.links`
- Use `project.tagline` instead of `project.description` where applicable

**In `project-list-panel.tsx`:**
- Change `project.description` → `project.tagline`

### 3. Style Consistency Between Modal and Detail Panel

Current differences:
| Element | ProjectModal | ProjectDetailPanel |
|---------|-------------|-------------------|
| Tech tags | `rounded-full bg-bg-secondary text-text-primary text-sm` | `rounded-md bg-slate-100/80 text-slate-700 border border-slate-200/60 text-xs font-semibold` |
| Section headings | `<div>` wrappers | `<section>` wrappers |
| Results section | Shown | Not shown |
| Learning section | Shown | Not shown |

**Standardize to:**
- Tech tags: use design system pattern `px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/60` (both)
- Use `<section>` wrappers consistently (both)
- Show Results & Learning sections in both components
- Show Responsibilities section in both components (if data exists)

### 4. Add Missing Sections to Detail Panel
- Add **Responsibilities** section (bulleted list)
- Add **Results & Impact** section
- Add **Key Learnings** section

### 5. Placeholder Guard Update
Replace `project.keyFeatures[0] !== "<placeholder>"` checks with simple truthy length check since Phase 1 removes all placeholders.

## Success Criteria
- [ ] `LinkIcon` extracted to shared module, no duplication
- [ ] No legacy field references (`github`, `demoUrl`, `url`, `longDescription`, `description`)
- [ ] Consistent tech tag styling across both views
- [ ] Both Modal and DetailPanel show same content sections
- [ ] TypeScript compiles without errors
- [ ] Build passes (`npm run build`)
