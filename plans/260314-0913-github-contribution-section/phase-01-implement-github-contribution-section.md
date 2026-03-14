## Context Links
- [README](../../README.md)
- [Plan Overview](./plan.md)
- [Code Standards](../../docs/code-standards.md)
- [System Architecture](../../docs/system-architecture.md)
- [Homepage](../../src/app/page.tsx)
- [GitHub Data Utility](../../src/lib/github-contributions.ts)
- [About Section](../../src/components/sections/About/About.tsx)

## Overview
- Priority: P2
- Current status: completed
- Brief description: Replace the standalone GitHub dashboard with a GitHub-like yearly contribution calendar embedded below the About terminal.

## Key Insights
- `About.tsx` is already interaction-heavy, so the calendar should live in a child component instead of growing the terminal implementation further.
- The year selector only needs years from `2025` onward, which keeps the filter bounded and predictable.
- The About calendar should use an internal API route so the GitHub token never reaches the client bundle.
- `.env.example` now exists, so env guidance can stay simple in README.

## Requirements
- Functional requirements:
  1. Use the official GitHub GraphQL endpoint for contribution data.
  2. Resolve the username from the configured profile URL in content.
  3. Render one GitHub-like yearly contribution calendar below the About terminal.
  4. Preserve graceful fallback states for missing token, invalid profile URL, and GraphQL/API failures.
- Non-functional requirements:
  1. No new runtime dependency.
  2. Keep server-side fetch only; do not leak token client-side.
  3. Remove obsolete dashboard files after final wiring.
  4. Keep the final calendar code modular and out of the main About terminal file.

## Architecture
- Keep the data fetch in `src/lib/github-contributions.ts` and normalize GraphQL data into a render-safe yearly snapshot model.
- Use an internal API route to request the selected year while keeping the token server-side.
- Render one calendar-only UI under the About terminal via dedicated child components.
- Keep cached revalidation for server fetches and return fallback metadata instead of throwing.

## Related Code Files
- Files to modify:
  - `src/lib/github-contributions.ts`
  - `src/app/api/github-contribution-calendar/route.ts`
  - `src/components/sections/About/About.tsx`
  - `src/components/sections/About/AboutGitHubContributionCalendar.tsx`
  - `src/components/sections/About/AboutGitHubContributionCalendarGrid.tsx`
- Files to delete:
  - obsolete dashboard-only UI files in `src/components/sections/GitHubActivity/`
- Files to keep read-only unless needed:
  - `src/app/page.tsx`
  - `src/components/sections/index.ts`
  - `src/components/layout/Navbar.tsx`
  - `src/content/site/contact.ts`

## Implementation Steps
1. Confirm the final public data API for the section utility:
   - username extraction
   - token lookup order
   - section data return type
   - fallback reason contract
2. Pick the canonical UI path:
   - either keep the existing PascalCase import path and modernize inside it
   - or update imports to the new kebab-case files and remove the legacy PascalCase files
3. Add an internal API route that validates `year`, resolves the GitHub username, and returns the selected yearly calendar snapshot.
4. Render a GitHub-like contribution calendar below the About terminal with year buttons starting from `2025`.
5. Remove the standalone homepage dashboard wiring and delete obsolete dashboard files.

## Todo List
- [x] Finalize the yearly GraphQL calendar data contract
- [x] Standardize token lookup and year filter boundaries
- [x] Add the About calendar child component and internal API route
- [x] Embed the calendar below the About terminal
- [x] Remove obsolete homepage dashboard files

## Success Criteria
- No scrape-based GitHub fetch path remains in the active section code.
- The About section renders the calendar below the terminal with real GraphQL data or a controlled fallback state.
- The year selector only exposes years from `2025` onward.
- The standalone homepage GitHub dashboard path has been removed.

## Risk Assessment
- Potential issues:
  - Token missing in local/dev/preview environments.
  - GraphQL permission errors or shape mismatches.
  - Duplicate files leave stale imports behind.
- Mitigation strategies:
  - Keep explicit fallback UI for token/API failures.
  - Normalize raw GraphQL data behind a single utility boundary.
  - Remove obsolete files after the final wiring step instead of keeping both paths alive.

## Security Considerations
- Keep the GitHub token server-side only.
- Never pass the token through props or client components.
- Avoid logging full request headers or token values.
- Treat GitHub API failures as normal fallback cases, not crash paths.

## Next Steps
- Phase 01 complete. Hand off closed after Phase 02 verification passed.
