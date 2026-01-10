This file is a merged representation of the entire codebase, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
.gitignore
.prettierignore
.prettierrc
babel.config.json
docs/code-standards.md
docs/codebase-summary.md
docs/design-guidelines.md
docs/index.md
docs/project-overview-pdr.md
docs/project-roadmap.md
docs/system-architecture.md
eslint.config.mjs
jest.config.js
jest.setup.js
messages/en.json
messages/vn.json
next.config.ts
package.json
plans/260109-2157-portfolio-v4-water-ecosystem/phase-01-project-setup.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-02-core-layout.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-03-water-effects.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-04-ecosystem-effects.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-05-navbar-effects.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-06-sections-implementation.md
plans/260109-2157-portfolio-v4-water-ecosystem/phase-07-polish-optimization.md
plans/260109-2157-portfolio-v4-water-ecosystem/plan.md
plans/260109-2157-portfolio-v4-water-ecosystem/reports/researcher-260109-2201-water-ecosystem-summary.md
plans/260109-2157-portfolio-v4-water-ecosystem/research/README.md
plans/260109-2157-portfolio-v4-water-ecosystem/research/researcher-01-webgl-water-effects.md
plans/260109-2157-portfolio-v4-water-ecosystem/research/researcher-02-implementation-decision-matrix.md
plans/260109-2157-portfolio-v4-water-ecosystem/research/researcher-02-navbar-light-effects.md
plans/260109-2157-portfolio-v4-water-ecosystem/research/researcher-03-shader-snippets-and-libraries.md
plans/260110-1955-water-ripple-enhancement/phase-01-shader-enhancement.md
plans/260110-1955-water-ripple-enhancement/phase-02-color-scheme.md
plans/260110-1955-water-ripple-enhancement/plan.md
plans/reports/code-reviewer-260109-2330-phase01-setup.md
plans/reports/code-reviewer-260110-0912-phase02-core-layout.md
plans/reports/code-reviewer-260110-0922-phase02-fixes.md
plans/reports/code-reviewer-260110-0930-phase02-final.md
plans/reports/code-reviewer-260110-1420-phase03-water-effects.md
plans/reports/code-reviewer-260110-1940-phase04-ecosystem.md
plans/reports/code-reviewer-260110-2026-phase05-navbar.md
plans/reports/docs-manager-260110-1428-phase03-completion.md
plans/reports/INDEX-260110-1412-PHASE03-TESTS.md
plans/reports/project-manager-260110-1428-phase03-completion.md
plans/reports/tester-260109-2328-phase01-validation.md
plans/reports/tester-260110-0909-phase02-core-layout.md
plans/reports/tester-260110-0921-phase02-validation.md
plans/reports/tester-260110-1412-phase03-eslint-fixes-required.md
plans/reports/tester-260110-1412-phase03-manual-test-plan.md
plans/reports/tester-260110-1412-phase03-water-effects.md
plans/reports/tester-260110-1412-SUMMARY.md
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
src/app/[locale]/error.tsx
src/app/[locale]/layout.tsx
src/app/[locale]/loading.tsx
src/app/[locale]/page.tsx
src/app/favicon.ico
src/app/globals.css
src/components/effects/Caustics.tsx
src/components/effects/EcosystemLayer.tsx
src/components/effects/index.tsx
src/components/icons/index.tsx
src/components/layout/index.ts
src/components/layout/LanguageSwitcher.tsx
src/components/layout/Navbar.tsx
src/components/layout/NavItem.tsx
src/components/layout/Section.tsx
src/components/particles/AmbientParticles.tsx
src/components/particles/index.tsx
src/components/sections/About/About.test.tsx
src/components/sections/About/About.tsx
src/components/sections/About/SkillsGrid.test.tsx
src/components/sections/About/SkillsGrid.tsx
src/components/sections/Contact/Contact.test.tsx
src/components/sections/Contact/Contact.tsx
src/components/sections/Hero/Hero.test.tsx
src/components/sections/Hero/Hero.tsx
src/components/sections/index.ts
src/components/sections/Projects/ProjectCard.tsx
src/components/sections/Projects/ProjectModal.tsx
src/components/sections/Projects/Projects.test.tsx
src/components/sections/Projects/Projects.tsx
src/components/water/BackgroundWaves.tsx
src/components/water/index.tsx
src/components/water/WaterCanvas.tsx
src/components/water/WaterPlane.tsx
src/hooks/index.ts
src/hooks/useActiveSection.ts
src/hooks/useMediaQuery.ts
src/hooks/useMounted.ts
src/hooks/useMousePosition.ts
src/hooks/usePerformanceMonitor.ts
src/hooks/useRippleCanvas.ts
src/i18n/request.ts
src/i18n/routing.ts
src/proxy.ts
src/shaders/particles.ts
src/shaders/water.ts
src/styles/navbar.css
src/types/i18n.d.ts
tsconfig.json
</directory_structure>