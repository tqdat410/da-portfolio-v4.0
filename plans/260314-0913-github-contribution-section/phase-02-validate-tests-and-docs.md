## Context Links
- [Plan Overview](./plan.md)
- [GitHub Data Tests](../../src/lib/github-contributions.test.ts)
- [About Section Tests](../../src/components/sections/About/About.test.tsx)
- [README](../../README.md)
- [System Architecture](../../docs/system-architecture.md)
- [Project Roadmap](../../docs/project-roadmap.md)

## Overview
- Priority: P2
- Current status: completed
- Brief description: Align tests to the yearly calendar flow, verify the About integration, and sync docs to the new embedded UI.

## Key Insights
- The test surface now centers on `About` because the standalone dashboard was removed.
- Docs impact is real because the calendar moved from a homepage section into the About terminal.
- `.env.example` now exists, so README can document the local setup flow directly.

## Requirements
- Functional requirements:
  1. Cover the final GraphQL normalization path with deterministic fixture-based tests.
  2. Cover the final About render path for success and year switching states.
  3. Verify lint, tests, and production build against the chosen final file path.
  4. Document env/token requirements and architecture impact.
- Non-functional requirements:
  1. No live network calls in tests.
  2. Docs updates must match verified behavior only.
  3. Verification blockers must be recorded concretely if the toolchain cannot run.

## Architecture
- Mock `fetch` in tests and use local GraphQL-shaped fixtures only.
- Keep render tests focused on the About integration and user-visible year filter behavior.
- Update docs to describe the official GraphQL source, server-side token requirement, and the About terminal placement.

## Related Code Files
- Files to modify:
  - `src/lib/github-contributions.test.ts`
  - `src/components/sections/About/About.test.tsx`
  - `README.md`
  - `docs/system-architecture.md`
  - `docs/project-roadmap.md`
- Verification commands:
  - `npm run lint`
  - `npm test -- --runInBand`
  - `npm run build`

## Implementation Steps
1. Update utility tests to match the final exported GraphQL helpers and snapshot shape.
2. Update About render tests to match the embedded yearly calendar UI and year buttons.
3. Run lint, tests, and build; fix any breakage caused by the GraphQL migration or UI consolidation.
4. Update README with:
   - required env var names
   - token preference order
   - brief note that the section falls back cleanly when the token is absent
5. Update architecture/roadmap docs only where the refactor changes documented behavior or section composition.

## Todo List
- [x] Align GraphQL utility tests
- [x] Align About render tests
- [x] Run lint
- [x] Run test suite
- [x] Run production build
- [x] Update README env guidance
- [x] Update system architecture docs
- [x] Update roadmap wording if needed

## Success Criteria
- GraphQL utility tests pass using local fixtures only.
- About render tests cover success and year switching behavior.
- `npm run lint`, `npm test -- --runInBand`, and `npm run build` pass, or blockers are documented precisely.
- README and docs reflect the token-backed GraphQL architecture without overstating unsupported features.

## Risk Assessment
- Potential issues:
  - Verification commands may fail because of unrelated worktree issues or tool/runtime blockers.
  - Tests may still point at pre-refactor symbol names.
  - Docs may drift if updated before behavior is verified.
- Mitigation strategies:
  - Fix test imports after the canonical UI path is chosen.
  - Treat verification as the source of truth before doc edits.
  - If commands cannot run, record the exact blocker in the final implementation notes.

## Security Considerations
- Do not commit tokens or example secret values.
- Keep docs limited to env variable names and permission guidance.
- Avoid suggesting client-side GitHub API calls.

## Next Steps
- Phase 02 complete. Future enhancements should be tracked as separate work, not under this migration plan.
