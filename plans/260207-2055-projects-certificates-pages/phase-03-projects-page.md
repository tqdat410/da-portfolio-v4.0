# Phase 3: /projects Page

**Priority:** High | **Effort:** M | **Status:** Pending

## Overview

New page at `/projects` using the FCL layout. Left panel = project list grouped by category. Right panel = selected project detail.

## Files to Create

```
src/app/projects/
└── page.tsx                    # Next.js page route

src/components/projects-page/
├── project-list-panel.tsx      # List panel with category grouping
└── project-detail-panel.tsx    # Detail view for selected project
```

## Data Source

Reuse `content.projects.items` from `src/content/portfolio.ts`. No new data needed — all fields (`longDescription`, `role`, `learning`, `fullTechStack`, `github`, `url`, `image`, `category`, etc.) already exist.

## Implementation

### 3.1 Create page route
- `src/app/projects/page.tsx` — server component wrapper
- Metadata: `title: "Projects"`, description from content
- Renders `ProjectsPageClient` (client component for interactivity)

### 3.2 Project List Panel
- Group projects by `category` field: SAP → Startup → Educational → Personal
- Each group: category heading + list of project items
- List item: thumbnail (small), title, short description, status badge
- Click item → set selected project → detail panel appears
- Active item: highlighted bg (`bg-slate-100 border-l-2 border-slate-800`)
- Scrollable independently

### 3.3 Project Detail Panel
- Reuse structure from existing `ProjectModal` but as inline panel (not modal)
- Layout: hero image at top → title → meta (type, duration, status) → long description → role → learnings → full tech stack → links (live, github)
- Scrollable independently
- Close/back button at top to collapse detail (return to full list)

### 3.4 Page Layout
- Header bar: page title "Projects", back to portfolio link (`← Portfolio`)
- Below header: FCL layout fills remaining height
- No Navbar/TopToolbar from portfolio — clean standalone page
- Silver Mist theme colors, same fonts

### 3.5 Category Styling
Category headers use `pacifico-regular text-2xl` consistent with portfolio.

Status badges:
- Active: green dot + "Active"
- Completed: slate + "Completed"
- In Progress: blue dot + "In Progress"

## Success Criteria
- [ ] All projects from content displayed in list
- [ ] Grouped by category with clear headings
- [ ] Click project → detail panel opens with full info
- [ ] Splitter drag works to resize panels
- [ ] Mobile: stacked layout with back navigation
- [ ] Page compiles and renders without errors
