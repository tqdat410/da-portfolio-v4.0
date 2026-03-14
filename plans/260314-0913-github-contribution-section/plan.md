---
title: "Move GitHub Calendar Into About Terminal"
description: "Replace the standalone homepage dashboard with a GitHub-like yearly contribution calendar embedded under the About terminal."
status: completed
priority: P2
effort: 3h
branch: main
tags: [about, github, graphql, ui]
created: 2026-03-14
---

# GitHub Calendar In About Plan

## Objective
Move the GitHub contribution UI into the About terminal, keep the official GraphQL source, and ship a compact yearly calendar with deterministic tests.

## Current Repo State
- The yearly contribution calendar now lives below the About terminal.
- `src/lib/github-contributions.ts` now targets the official GitHub GraphQL endpoint with year-aware ranges.
- The standalone homepage GitHub dashboard wiring has been removed.
- Obsolete dashboard files and scrape-era helpers have been removed.

## Scope
- Finalize one GraphQL yearly calendar contract and one embedded About UI implementation.
- Prefer `GITHUB_GRAPHQL_TOKEN`, fallback to `GITHUB_TOKEN`.
- Keep server-side fetch + cached revalidation behind an internal API route; no extra package.
- Preserve graceful fallback when token/API is unavailable.
- Update README and architecture/roadmap docs only for verified behavior and env requirements.

## Out of Scope
- GitHub OAuth or GitHub App installation flow.
- Private contribution support.
- Exact GitHub profile-page parity beyond the contribution calendar.
- New chart libraries or animation dependencies.

## Env / Token Requirements
- Server-only env vars:
  - `GITHUB_GRAPHQL_TOKEN` preferred
  - `GITHUB_TOKEN` accepted as fallback
- Endpoint: `https://api.github.com/graphql`
- Auth model: GitHub GraphQL requires authentication. GitHub docs state fine-grained personal access tokens include read access to public repositories, while classic personal access tokens need `public_repo` for public repository access. The optional `read:user` scope only matters if private/internal contribution visibility is needed later.
- Missing or invalid token must show fallback UI instead of breaking the About section.

## Target Files
- Data + normalization
  - `src/lib/github-contributions.ts`
  - `src/lib/github-contribution-response.ts`
- Section UI
  - `src/components/sections/About/About.tsx`
  - `src/components/sections/About/AboutGitHubContributionCalendar.tsx`
  - `src/components/sections/About/AboutGitHubContributionCalendarGrid.tsx`
- API
  - `src/app/api/github-contribution-calendar/route.ts`
- Integration
  - `src/app/page.tsx`
  - `src/components/sections/index.ts`
  - `src/components/layout/Navbar.tsx` only if nav copy/order changes
- Content/config
  - `src/content/site/contact.ts` read-only unless the GitHub profile URL changes
- Tests
  - `src/lib/github-contributions.test.ts`
  - `src/components/sections/About/About.test.tsx`
- Docs
  - `README.md`
  - `docs/system-architecture.md`
  - `docs/project-roadmap.md`

## Phases
- `completed` [Phase 01](./phase-01-implement-github-contribution-section.md) - finalized GraphQL data layer, wired one modern UI, removed duplicate legacy section files
- `completed` [Phase 02](./phase-02-validate-tests-and-docs.md) - aligned tests, ran verification, documented env/docs impact

## Expected Output
- About terminal calendar backed by official GitHub GraphQL data.
- GitHub-like yearly heatmap UI with year buttons starting from 2025.
- Deterministic tests around normalization and About render behavior.
- README/docs updated for token requirements and architecture impact.

## Notes
- Keep scope pragmatic: yearly calendar only, no dashboard chrome.
