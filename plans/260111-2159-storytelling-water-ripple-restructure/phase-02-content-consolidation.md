# Phase 02: Content Consolidation

## Context

- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** None (can run parallel to Phase 01)
- **Current i18n:** `next-intl` with `messages/en.json` and `messages/vn.json`

## Overview

| Property | Value |
|----------|-------|
| Description | Remove Vietnamese locale, consolidate content to TypeScript file |
| Priority | P2 |
| Status | pending |
| Effort | 1h |

## Key Insights

1. **Single-language site** - Portfolio targets English audience; Vietnamese adds complexity without value
2. **TypeScript content** - Type-safe, IDE autocompletion, no runtime i18n overhead
3. **Story-focused model** - New content structure supports storytelling sections
4. **URL management** - External URLs (resume, social) centralized for easy updates

## Requirements

### Functional
- R1: Remove Vietnamese content completely
- R2: Create single TypeScript content file for all portfolio data
- R3: Export typed interfaces for content sections
- R4: Support story segment content model (hero, roles, about, projects, contact)

### Non-Functional
- R5: No runtime i18n library needed after refactor
- R6: Type-safe content access throughout codebase
- R7: Easy to extend for future story sections

## Architecture

### New Content Structure
```
src/
  content/
    portfolio.ts       # All content + types
    index.ts           # Re-export
```

### Content Type Model
```typescript
interface PortfolioContent {
  hero: HeroContent;
  roles: string[];           // For horizontal scroll
  about: AboutContent;
  projects: ProjectContent[];
  contact: ContactContent;
  social: SocialLinks;
  meta: MetaContent;         // SEO, site metadata
}
```

## Related Code Files

| File | Action | Purpose |
|------|--------|---------|
| `messages/en.json` | Reference | Source content (then delete) |
| `messages/vn.json` | Delete | Remove Vietnamese |
| `src/content/portfolio.ts` | Create | New TypeScript content |
| `src/content/index.ts` | Create | Re-exports |
| `src/i18n/routing.ts` | Modify | Remove vn locale |
| `src/app/[locale]/layout.tsx` | Modify | Remove i18n provider |
| `src/components/sections/Hero/Hero.tsx` | Modify | Use direct import |
| `next.config.ts` | Modify | Remove i18n config |

## Implementation Steps

### Step 1: Create Content Types (15min)
Define TypeScript interfaces for all content sections.

```typescript
// src/content/portfolio.ts
export interface HeroContent {
  name: string;
  greeting: string;
  status: string;
  cta: string;
  downloadCv: string;
  resumeUrl: string;
}

export interface RoleContent {
  roles: string[];  // ["Software Engineer", "SAP Technical Consultant", ...]
}

export interface AboutContent {
  title: string;
  description: string;
  dob: string;
  education: EducationItem[];
  skills: SkillCategories;
  certificates: CertificateGroup[];
}

// ... (define all interfaces)
```

### Step 2: Migrate Content Data (20min)
Convert `messages/en.json` to TypeScript objects.

Key transformations:
- Extract roles as separate array for scroll animation
- Flatten nested structures where appropriate
- Remove language-switching related content

```typescript
export const content: PortfolioContent = {
  hero: {
    name: "Tran Quoc Dat",
    greeting: "Hello, I'm",
    status: "Open to work",
    cta: "View My Work",
    downloadCv: "Download CV",
    resumeUrl: "https://drive.usercontent.google.com/..."
  },
  roles: [
    "Software Engineer",
    "SAP Technical Consultant",
    "Fullstack Developer",
    "Creative Developer"
  ],
  // ...
};
```

### Step 3: Update Components (15min)
Replace `useTranslations` with direct imports.

Before:
```typescript
import { useTranslations } from "next-intl";
const t = useTranslations("Hero");
// t("name")
```

After:
```typescript
import { content } from "@/content";
// content.hero.name
```

Update affected components:
- Hero.tsx
- About.tsx (if exists)
- Projects.tsx
- Contact.tsx
- Navbar.tsx

### Step 4: Remove i18n Infrastructure (10min)

1. Delete files:
   - `messages/vn.json`
   - `src/i18n/` directory (if exists)

2. Update `next.config.ts`:
   - Remove `withNextIntl` wrapper
   - Remove i18n configuration

3. Update routing:
   - Remove `[locale]` dynamic segment if using
   - Simplify to single root layout

4. Cleanup `package.json`:
   - Remove `next-intl` dependency (optional, keep if other uses)

### Step 5: Verify Build (10min)
- Run `npm run build`
- Fix any type errors
- Verify all pages render correctly

## Todo List

- [ ] Create `src/content/portfolio.ts` with type definitions
- [ ] Migrate content from `messages/en.json`
- [ ] Update Hero component to use direct import
- [ ] Update other section components
- [ ] Remove `messages/vn.json`
- [ ] Clean up i18n routing configuration
- [ ] Update `next.config.ts`
- [ ] Run build verification
- [ ] Update any tests (if applicable)

## Success Criteria

- [ ] No Vietnamese content files exist
- [ ] `src/content/portfolio.ts` exports typed content
- [ ] All components compile without errors
- [ ] `npm run build` succeeds
- [ ] Site renders correctly with English content

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Missing content migration | Low | Medium | Diff before/after, visual comparison |
| Breaking locale routes | Medium | High | Test all routes after removal |
| Type errors in components | Medium | Low | IDE will catch immediately |

## Notes

- Keep `next-intl` dependency if used elsewhere or for potential future expansion
- Consider extracting URLs to separate constants file for easier management
- Content file can grow large; consider splitting by section if >500 lines
