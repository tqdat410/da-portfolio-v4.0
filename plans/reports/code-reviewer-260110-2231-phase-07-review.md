## Code Review Summary

### Scope
- **Files reviewed:**
    - `src/components/water/index.tsx`
    - `next.config.ts`
    - `src/app/[locale]/layout.tsx`
    - `src/app/sitemap.ts`, `public/robots.txt`
    - `src/components/sections/Projects/ProjectModal.tsx`
    - `src/components/layout/Navbar.tsx`
    - `src/app/globals.css`
    - `src/components/layout/Section.tsx`
    - `src/app/manifest.ts`
    - `src/components/sections/About/About.tsx`, `SkillsGrid.tsx`, `Projects.tsx` (Linting)
- **Review focus:** Phase 07 (Polish & Optimization)
- **Updated plans:** `plans/260109-2157-portfolio-v4-water-ecosystem/phase-07-polish-optimization.md`

### Overall Assessment
The codebase demonstrates solid adherence to performance and accessibility standards. The "Polish & Optimization" phase has been largely successful, implementing dynamic imports, SEO metadata, PWA support, and accessibility enhancements. However, strong type safety is compromised by `any` usage in several components (`About`, `SkillsGrid`, `Projects`), which needs immediate attention.

**Score: 8/10**

### Critical Issues
None identified.

### High Priority Findings (Linting & Types)
1.  **Loose Typing (`any`)**:
    -   `src/components/sections/About/About.tsx`: Usage of `as any[]` for `education.items` and `certificates.items` bypasses type safety.
    -   `src/components/sections/About/SkillsGrid.tsx`: `t.raw` cast to `any`.
    -   `src/components/sections/Projects/Projects.tsx`: `t.raw("items") as any[]`.
    -   **Fix**: Define proper interfaces for these data structures and cast `t.raw()` results safely.

### Medium Priority Improvements
1.  **Accessibility**:
    -   `src/components/sections/Projects/ProjectModal.tsx`: The focus trap implementation manually handles `Tab` but might miss edge cases (e.g., dynamically added elements). Consider using a robust library like `react-focus-lock` or `radix-ui` primitives if complexity grows.
    -   `src/app/globals.css`: Ensure `sr-only` class is applied correctly where needed (currently defined but usage not extensively verified in this diff).
2.  **Performance**:
    -   `src/components/water/index.tsx`: The `setTimeout` delay of 100ms is a heuristic. Ensure this doesn't cause a layout shift (CLS) if the water canvas affects dimensions (it seems to be an overlay, so likely fine).
    -   `next.config.ts`: `optimizePackageImports` is experimental; monitor build stability.

### Low Priority Suggestions
1.  **Code Style**:
    -   `src/app/manifest.ts`: Hardcoded theme colors. Use CSS variables or a shared constant file for colors to ensure consistency with `globals.css` (DRY).
    -   `src/app/sitemap.ts`: Base URL is hardcoded. Move to an environment variable `NEXT_PUBLIC_BASE_URL`.

### Positive Observations
-   **Dynamic Imports**: Correctly implemented for `WaterCanvas` with `ssr: false` to avoid hydration mismatches.
-   **SEO**: Comprehensive metadata in `layout.tsx` including OpenGraph and Twitter cards.
-   **PWA**: `manifest.ts` is well-structured.
-   **Security**: Security headers in `next.config.ts` are a great proactive measure.

### Recommended Actions
1.  **Fix Type Issues**: Create `Education`, `Certificate`, `SkillCategory`, and `Project` interfaces. Replace `any` casts.
2.  **Environment Variables**: Extract `https://tranquocdat.com` to `NEXT_PUBLIC_BASE_URL`.
3.  **Linting**: Run `eslint --fix` to clean up unused variables in tests.

### Metrics
-   **Linting Issues**: 6 errors (all `no-explicit-any`), 4 warnings.
-   **Type Coverage**: Needs improvement in data-driven components.
