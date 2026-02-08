# Phase 2: Data Format Standardization

## Priority: High
## Status: Pending

## Overview
Clean up the `ProjectItem` interface and content data: remove legacy/redundant fields, standardize all projects to use `links[]` instead of `github`/`demoUrl`/`url`, remove `problem`/`solution` fields (merged into `overview`), and ensure consistent data shape.

## Files to Modify
- `src/content/portfolio.ts` — interface + content data

## Changes

### Interface Cleanup (`ProjectItem`)

**Remove fields:**
- `description` (legacy) — replaced by `overview` + `tagline`
- `problem` — merged into overview
- `solution` — merged into overview
- `context` — merged into overview
- `github` — replaced by `links[]`
- `demoUrl` — replaced by `links[]`
- `url` — replaced by `links[]`
- `longDescription` — replaced by `overview`

**Ensure required fields:**
- `overview` (required, replaces `description`/`longDescription`)
- `tagline` (required, short one-liner for list views)
- `links` (required, replaces `github`/`demoUrl`/`url`)
- `teamSize` (required)
- `responsibilities` (required)

**Updated `ProjectItem` interface:**
```typescript
export interface ProjectItem {
  category: ProjectCategory;
  title: string;
  tagline: string;
  overview: string;
  image: string;
  listImage?: string;
  type: string;
  duration: string;
  teamSize: number;
  role: string;
  techStack: string[];
  fullTechStack: string[];
  keyFeatures: string[];
  responsibilities: string[];
  architecture?: string;
  results?: string[];
  learning: string;
  history?: ProjectHistory[];
  status: "Live" | "Active" | "Completed" | "In Progress" | "Archived" | "Stopped";
  links: ProjectLink[];
}
```

### Content Data Migration

For each project item:
1. Move `description` → `tagline`
2. Move `longDescription`/`overview` → `overview` (single field)
3. Convert `github` (string|array) + `demoUrl` + `url` → `links[]`
4. Remove `problem`, `solution`, `context` fields
5. Add `teamSize` and `responsibilities` where missing

### UI References to Update
- Components using `project.description` → use `project.tagline`
- Components using `project.longDescription` → use `project.overview`
- Components using `project.github` / `project.demoUrl` / `project.url` → use `project.links`
- Remove fallback logic: `project.overview || project.longDescription`

## Success Criteria
- [ ] `ProjectItem` interface has no legacy fields
- [ ] All project data conforms to new interface
- [ ] No `<placeholder>` values remain
- [ ] TypeScript compiles without errors
