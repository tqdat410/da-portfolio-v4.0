# Code Review: Projects Page Refinement

**Reviewer**: code-reviewer | **Date**: 2026-02-08 | **Plan**: `plans/260208-1553-projects-page-refinement/plan.md`

## Scope

- **Files reviewed**: 9 source files + 1 config
- **Focus**: Type safety, removed-field cleanup, UI consistency, test adequacy, security
- **Changed files**:
  - `src/content/portfolio.ts` (956 lines -- content + type definitions)
  - `src/components/projects-page/project-detail-panel.tsx` (235 lines)
  - `src/components/projects-page/project-list-panel.tsx` (119 lines)
  - `src/components/projects-page/projects-page-client.tsx` (90 lines)
  - `src/components/sections/Projects/ProjectModal.tsx` (330 lines)
  - `src/components/sections/Projects/Projects.test.tsx` (54 lines)
  - `src/components/icons/link-icon.tsx` (45 lines)
  - `jest.setup.js` (53 lines)

## Overall Assessment

Solid refactoring. The interface migration from scattered fields to `tagline`/`overview`/`links[]`/`responsibilities` is clean and consistent. TypeScript compiles without errors. All 4 Projects tests pass. No references to removed fields remain in component code. The shared `LinkIcon` extraction eliminates duplication well.

**Grade: B+** -- A few medium-priority items prevent an A.

---

## Critical Issues

None found.

---

## High Priority

### H1. `portfolio.ts` exceeds 200-line limit (956 lines)

Per project rules, code files should stay under 200 lines. This file contains both type definitions (~145 lines) and content data (~810 lines). Consider splitting into:
- `src/content/types.ts` -- all interfaces and types
- `src/content/portfolio.ts` -- content data only, importing types

This is the most urgent refactoring item since it directly violates a documented codebase standard.

### H2. Status color mapping inconsistency across 3 components

The `status` field has 6 possible values: `"Live" | "Active" | "Completed" | "In Progress" | "Archived" | "Stopped"`. Each component handles status colors differently:

| Status | `ProjectListPanel` (badge) | `ProjectDetailPanel` (header) | `ProjectDetailPanel` (footer dot) | `ProjectModal` (header) | `ProjectModal` (footer dot) |
|---|---|---|---|---|---|
| Live | emerald | emerald | emerald | emerald | emerald |
| Active | emerald | emerald | emerald | emerald | emerald |
| Completed | slate | blue | blue | blue | blue |
| In Progress | blue | slate (default) | slate (default) | slate (default) | slate (default) |
| Archived | slate | slate (default) | slate (default) | slate (default) | slate (default) |
| Stopped | red | red | slate (default) | red | slate (default) |

Issues:
- **"In Progress"** gets blue in `ProjectListPanel` but falls to default slate in the detail panels -- should be blue/amber consistently.
- **"Stopped"** gets red text in the detail panel header but falls to default `bg-slate-400` in the footer dot -- inconsistent within same component.
- **"Completed"** is `text-blue-600` in headers but `bg-blue-500` in footer dots vs `text-slate-600` in list badges.

**Recommendation**: Extract a shared `getStatusColor()` utility to ensure consistency. Example:

```typescript
// src/utils/status-colors.ts
export function getStatusColor(status: string) {
  switch (status) {
    case "Live": case "Active": return { text: "text-emerald-600", bg: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    case "In Progress": return { text: "text-blue-600", bg: "bg-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200" };
    case "Completed": return { text: "text-blue-600", bg: "bg-blue-500", badge: "bg-slate-100 text-slate-600 border-slate-200" };
    case "Stopped": return { text: "text-red-600", bg: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200" };
    default: return { text: "text-slate-500", bg: "bg-slate-400", badge: "bg-slate-100 text-slate-600 border-slate-200" };
  }
}
```

### H3. Duplicated content rendering logic between ProjectModal and ProjectDetailPanel

`ProjectModal.tsx` (330 lines) and `project-detail-panel.tsx` (235 lines) render nearly identical content sections:
- Overview, Timeline, Key Features, Role & Responsibilities, Architecture, Technologies, Results, Learning, Resources, History

The structure, section ordering, and even CSS classes are copy-pasted. This violates DRY. If a field is added to `ProjectItem`, both must be updated in sync.

**Recommendation**: Extract shared section components (e.g., `ProjectOverviewSection`, `ProjectResourcesSection`, `ProjectHistorySection`) into a shared module like `src/components/projects/project-sections.tsx`. Both modal and detail panel import and compose these sections with different wrappers.

---

## Medium Priority

### M1. Resources section only shows `github` and `docs` links -- "external"/"demo" links invisible in resources

Line 146 in `project-detail-panel.tsx` and line 240 in `ProjectModal.tsx`:
```tsx
project.links.filter(l => l.icon === "github" || l.icon === "docs").map(...)
```

The "Resources" heading renders only github/docs links. The "external" and "demo" links are only accessible via the floating footer button. However, the footer only renders when `externalLink` is found. This means:
- `video` links are never rendered anywhere
- If a project has multiple external links, only the first is shown in the footer

Currently no projects use `video` links, but the interface supports it. Document or remove unused icon types.

### M2. Double spacer in ProjectDetailPanel

`project-detail-panel.tsx` has two bottom spacers:
- Line 202: `<div className="pb-24"></div>` (inside the content div)
- Line 62: `pb-24` class on the parent content wrapper

This results in 96px + 96px = 192px of bottom padding, which may cause excessive empty space below the content. The footer floating bar only needs ~80px clearance.

### M3. `ProjectModal.tsx` exceeds 200-line limit (330 lines)

This file is over the 200-line guideline. The content rendering section (lines 129-297) could be extracted as mentioned in H3.

### M4. Test coverage is thin

Only 4 tests exist, all for the `Projects` showcase section (homepage bento grid). No tests for:
- `ProjectModal` -- focus trap, escape key, body scroll lock, link rendering
- `ProjectDetailPanel` -- rendering all sections, conditional sections (architecture, results, history)
- `ProjectListPanel` -- category grouping, selection state, status badge colors
- `ProjectsPageClient` -- URL query param parsing, mobile vs desktop layout switching

The current tests only verify that showcase items render. They do not test the actual project detail UIs that were the focus of this refactoring.

### M5. `jest.setup.js` mocks `next/navigation` globally but missing `useSearchParams`

`jest.setup.js` mocks `usePathname` and `useRouter` but not `useSearchParams`. `ProjectsPageClient` uses `useSearchParams()`. If tests are added for that component, they will fail without this mock.

---

## Low Priority

### L1. `aria-current` value should be `"page"` or `"true"` string on list items

In `project-list-panel.tsx` line 91:
```tsx
aria-current={isSelected ? "true" : undefined}
```
This is technically valid but `aria-current="true"` is less semantic than `aria-current="location"` for a selected item in a list context. Minor accessibility improvement.

### L2. Inconsistent text color classes

`ProjectDetailPanel` uses `text-text-body` for list content while `ProjectModal` uses `text-accent-shadow` for the same sections (role description, key features, responsibilities). Should be consistent.

### L3. History version key could collide

Both components use `version.version` as the React key for history items. This is fine if version strings are unique per project (they are -- v1, v2, v3), but not enforced by the type.

---

## Edge Cases Found by Scout

1. **Empty `links` array**: `Custom Notification Center` has `links: []`. The Resources section guard `project.links.length > 0` correctly handles this. The footer check `externalLink && (...)` also handles it. No issues.

2. **Missing `listImage`**: Only `Da'Portfolio` provides `listImage`. `project-list-panel.tsx` line 96 falls back to `project.image` correctly.

3. **Empty certificate URLs**: Two certificates have `url: ""`. Not directly related to the projects refactoring but worth noting -- these would render as broken `<a href="">` links on the certificates page.

4. **URL query param matching**: `ProjectsPageClient` matches projects by exact title string via `searchParams.get("project")`. Titles with special characters (apostrophes like "Da'Portfolio") work because `encodeURIComponent` is used in `ProjectCard.tsx` line 154 and the browser decodes it on read.

5. **No `teamSize` rendering**: The `teamSize` field was added to the interface and all projects have values (1-6), but neither `ProjectDetailPanel` nor `ProjectModal` render it anywhere. Either render it (e.g., next to role) or remove the field.

---

## Positive Observations

1. Clean interface design -- `ProjectLink` with typed `icon` discriminant is well-structured
2. `rel="noopener noreferrer"` on all external links -- correct security practice
3. `target="_blank"` consistently applied to external links
4. Focus trap implementation in `ProjectModal` is thorough (Tab cycling, Escape handling, initial focus)
5. Body scroll lock on modal open with proper cleanup
6. `encodeURIComponent` used for URL query params
7. No `dangerouslySetInnerHTML` anywhere -- all content rendered as text nodes, eliminating XSS risk
8. Barrel export pattern via `src/content/index.ts` is clean

---

## Security Assessment

**No vulnerabilities found.**

- All user-facing links use `rel="noopener noreferrer"` and `target="_blank"`
- No `dangerouslySetInnerHTML` or innerHTML usage
- Content is static TypeScript -- no user-generated content injection vectors
- No API calls or dynamic data fetching in the reviewed components
- Image sources use Cloudinary URLs with proper Next.js Image optimization
- No secrets or credentials exposed in content data

---

## Recommended Actions (Prioritized)

1. **[H1]** Split `portfolio.ts` into types + data files to comply with 200-line rule
2. **[H2]** Extract shared `getStatusColor()` utility for consistent status rendering
3. **[H3]** Extract shared project section components to DRY up Modal vs DetailPanel
4. **[M1]** Document or handle `video` icon type; consider rendering all link types in Resources
5. **[M2]** Remove duplicate bottom spacer in `ProjectDetailPanel`
6. **[M4]** Add tests for `ProjectModal`, `ProjectDetailPanel`, and `ProjectListPanel`
7. **[M5]** Add `useSearchParams` mock to `jest.setup.js`
8. **[Edge#5]** Either render `teamSize` in the UI or remove from interface

---

## Metrics

- **TypeScript Compilation**: Clean (0 errors)
- **Lint Issues**: Not checked (build passes, no reported lint errors)
- **Test Coverage**: 4/4 pass (Projects section only -- no coverage for modal/detail/list components)
- **Files Over 200 Lines**: 2 (`portfolio.ts` at 956, `ProjectModal.tsx` at 330)

---

## Unresolved Questions

1. Should `teamSize` be rendered in the detail views? It is defined on all projects but never displayed.
2. Should the `video` icon type be removed from `ProjectLink["icon"]` since no projects use it?
3. Are the pre-existing About/Contact test failures tracked elsewhere? They were mentioned as known issues but should not be left indefinitely.
