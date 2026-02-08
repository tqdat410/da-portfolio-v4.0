# Toolbar Adjustments & Mobile Responsive Fixes

## Summary
Three areas of work: (1) TopToolbar enhancements, (2) Mobile navbar/toolbar responsive, (3) Projects & Certificates page scroll fix on mobile.

## Phases

| # | Phase | Status | Priority | Effort |
|---|-------|--------|----------|--------|
| 1 | TopToolbar - Add certificates link & scroll-aware background | Pending | High | Small |
| 2 | Mobile responsive - Navbar & TopToolbar | Pending | High | Medium |
| 3 | Projects & Certificates page - Mobile scroll fix | Pending | High | Small |

## Dependencies
- Phase 2 depends on Phase 1 (toolbar changes first, then responsive adjustments)
- Phase 3 is independent

## Key Files
- `src/components/layout/TopToolbar.tsx` - Toolbar component
- `src/components/layout/Navbar.tsx` - Bottom-left navbar
- `src/components/projects-page/projects-page-client.tsx` - Projects page
- `src/components/certificates-page/certificates-page-client.tsx` - Certificates page
- `src/app/globals.css` - Global styles
- `src/app/page.tsx` - Home page
