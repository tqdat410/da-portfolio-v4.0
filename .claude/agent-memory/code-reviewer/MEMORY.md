# Code Reviewer Memory - DaPortfolio v4.0

## Project Stack
- Next.js 16.1.1, React 19, Three.js, Tailwind CSS v4, TypeScript 5, Jest 30
- Content centralized in `src/content/portfolio.ts` (types + data in single file)
- Barrel export via `src/content/index.ts`

## Known Issues (as of 2026-02-08)
- `portfolio.ts` is 956 lines -- exceeds 200-line rule. Split into types + data recommended.
- `ProjectModal.tsx` is 330 lines -- also exceeds limit.
- Status color mapping inconsistent across 3 components (ProjectListPanel, ProjectDetailPanel, ProjectModal)
- `teamSize` field exists on ProjectItem interface but is never rendered in UI
- `video` icon type defined in ProjectLink but unused by any project
- About and Contact tests have pre-existing failures (not related to projects refactoring)
- Two certificate items have empty `url: ""` strings -- potential broken links

## Patterns to Watch
- ProjectModal and ProjectDetailPanel share nearly identical rendering logic (DRY violation)
- All external links correctly use `rel="noopener noreferrer"` + `target="_blank"`
- No dangerouslySetInnerHTML anywhere -- XSS-safe
- Content is static TS, no user-generated content vectors
- `jest.setup.js` mocks IntersectionObserver, ResizeObserver, matchMedia, next/navigation (but missing useSearchParams)

## Review Conventions
- Reports go to `plans/reports/` with naming: `code-reviewer-YYMMDD-HHMM-{slug}.md`
- Check `git diff --name-only` for working tree changes (unstaged) vs `HEAD~1` for last commit
- Always verify TypeScript compilation with `npx tsc --noEmit`
- Run relevant tests with `npx jest --testPathPatterns "{pattern}"`

## File Size Reference
- Under 200 lines: link-icon.tsx (45), project-list-panel.tsx (119), projects-page-client.tsx (90), Projects.test.tsx (54)
- Over 200 lines: portfolio.ts (956), ProjectModal.tsx (330), project-detail-panel.tsx (235)
