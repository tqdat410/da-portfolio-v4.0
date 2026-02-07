# Phase 5: Navigation Triggers & Hover Effects

**Priority:** Medium | **Effort:** S | **Status:** Pending

## Overview

Connect the portfolio page to the new `/projects` and `/certificates` pages via click triggers and hover effects.

## Tasks

### 5.1 Project image click → /projects
- In `ProjectCard` (BentoCard variant): clicking the **main image** navigates to `/projects?project={title}` (or index)
- The `/projects` page reads the query param and auto-selects that project in the detail panel
- Use Next.js `<Link>` for client-side navigation

### 5.2 Eye cursor on project image hover
- When hovering over project images in the portfolio Projects section, cursor changes to an eye icon
- Implementation: CSS `cursor: url('...'), pointer` with a custom SVG eye icon
- Or use a Tailwind custom cursor class
- Apply to the main image container in `BentoCard`

### 5.3 Toolbar "projects" link → /projects
- In `TopToolbar.tsx`: change `<ToolbarLink href="#projects">` to `<ToolbarLink href="/projects">`
- This navigates to the projects page instead of scrolling to the section
- Remove `target="_blank"` — same-tab navigation

### 5.4 Certificate items click → /certificates
- In `About.tsx`: the certification list items (under Education card) become links
- Click on a certification label → navigate to `/certificates`
- Use Next.js `<Link>` component
- Add hover effect: subtle underline or bg highlight

### 5.5 Cursor effects
- Eye cursor SVG: simple eye outline, 24x24, white/slate color
- Save as `public/cursors/eye.svg` or inline as data URI
- Apply via CSS: `.cursor-eye { cursor: url('/cursors/eye.svg') 12 12, pointer; }`

## Success Criteria
- [ ] Click project image → navigates to /projects with that project selected
- [ ] Eye cursor appears on project image hover
- [ ] Toolbar "projects" → /projects page
- [ ] Certificate items → /certificates page
- [ ] All navigation works with browser back/forward
