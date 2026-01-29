# DaPortfolio v4.0 - Codebase Summary

**Total Files:** 56 TypeScript/TSX files
**Total LOC:** ~4,400 lines
**Last Updated:** 2026-01-29

## Directory Structure

```
src/
├── app/                           # Next.js App Router (5 files, ~300 LOC)
│   ├── page.tsx                   # Root page / dashboard
│   ├── layout.tsx                 # Root layout with globals CSS
│   ├── globals.css                # 197 LOC - Design system + theme
│   ├── sitemap.ts                 # SEO sitemap generation
│   └── manifest.ts                # PWA manifest
│
├── components/                    # React components (30+ files, ~2,000 LOC)
│   ├── effects/                   # Visual effects components
│   │   ├── Caustics.tsx           # Underwater light patterns shader
│   │   ├── RainParticles.tsx      # GPU rain particle system
│   │   └── EcosystemLayer.tsx     # Combined effects renderer
│   │
│   ├── water/                     # Water simulation components
│   │   ├── WaterCanvas.tsx        # Main water renderer
│   │   ├── WaterPlane.tsx         # Water surface geometry
│   │   └── TextCanvas.ts          # Text-based water canvas
│   │
│   ├── particles/                 # Particle system components
│   │   └── AmbientParticles.tsx   # Floating noise-driven particles
│   │
│   ├── layout/                    # Layout system
│   │   ├── Navbar.tsx             # Navigation bar (mobile/desktop)
│   │   ├── Section.tsx            # Content section wrapper
│   │   ├── TopToolbar.tsx         # Toolbar component
│   │   └── navbar.css             # Navbar-specific styles
│   │
│   ├── sections/                  # Portfolio sections
│   │   ├── About/About.tsx        # About/skills section
│   │   ├── Projects/Projects.tsx  # Projects grid
│   │   ├── Contact/Contact.tsx    # Contact form
│   │   └── index.ts               # Export barrel
│   │
│   ├── story/                     # Hero story components
│   │   ├── HeroStory.tsx          # Main hero component
│   │   ├── RoleCarousel.tsx       # Role selection carousel
│   │   ├── StorySection.tsx       # Story display wrapper
│   │   └── index.ts               # Export barrel
│   │
│   ├── icons/                     # SVG icon components
│   │   ├── ArrowIcon.tsx
│   │   ├── GitHubIcon.tsx
│   │   └── ... (11 total icons)
│   │
│   └── utils/                     # Utility components
│       └── AxeReporter.tsx        # Accessibility testing wrapper
│
├── content/                       # Portfolio content (2 files, ~725 LOC)
│   ├── portfolio.ts               # 725 LOC - Centralized content data
│   │   ├── Navigation labels
│   │   ├── Hero content
│   │   ├── About section
│   │   ├── Education items
│   │   ├── Skills (5 categories)
│   │   ├── Certificates
│   │   ├── 10 Projects
│   │   └── Contact info (11 socials)
│   └── index.ts                   # Export barrel
│
├── hooks/                         # Custom React hooks (10 files, ~800 LOC)
│   ├── useFluidSimulation.ts      # GPU fluid dynamics (ping-pong FBO)
│   ├── useScrollStory.ts          # GSAP scroll timeline
│   ├── useScrollProgress.ts       # Scroll progress tracking
│   ├── useActiveSection.ts        # Intersection observer
│   ├── useGSAP.ts                 # GSAP animation setup
│   ├── useMediaQuery.ts           # Responsive breakpoints
│   ├── useIsMobile.ts             # Mobile detection (not found yet)
│   ├── usePerformanceMonitor.ts   # FPS monitoring + effect reduction
│   ├── useReducedMotion.ts        # Accessibility preference
│   ├── useMounted.ts              # Client-side mount detection
│   ├── useMousePosition.ts        # Mouse tracking
│   └── index.ts                   # Export barrel
│
├── shaders/                       # GLSL shader code (5 files, ~600 LOC)
│   ├── simulation.ts              # Fluid simulation vertex/fragment
│   ├── water.ts                   # Water surface rendering
│   ├── rain.ts                    # Rain particle shader
│   ├── particles.ts               # Ambient particle shader
│   └── caustics.ts                # Underwater light patterns (if exists)
│
├── lib/                           # Utility functions (1 file, ~30 LOC)
│   └── utils.ts                   # cn() class name merger
│
├── styles/                        # Global styles (2 files, ~250 LOC)
│   ├── globals.css                # 197 LOC (in app/)
│   └── navbar.css                 # Navbar-specific styles
│
└── types/                         # TypeScript interfaces (1 file, ~100 LOC)
    └── content.ts                 # Type definitions for portfolio.ts
```

## Key Files Reference

### Entry Points

| File | LOC | Purpose |
|------|-----|---------|
| `src/app/page.tsx` | ~150 | Main page, layout integration |
| `src/app/layout.tsx` | ~100 | Root layout, metadata, providers |
| `src/content/portfolio.ts` | 725 | Centralized content data |

### Core Hooks (Custom React)

| Hook | LOC | Purpose |
|------|-----|---------|
| `useFluidSimulation` | ~180 | GPU fluid sim, ripple API |
| `useScrollStory` | ~120 | GSAP scroll timeline setup |
| `usePerformanceMonitor` | ~100 | FPS tracking, effect reduction |
| `useActiveSection` | ~80 | Intersection Observer tracking |
| `useScrollProgress` | ~70 | Scroll position percentage |
| `useMediaQuery` | ~60 | CSS media query listener |
| `useReducedMotion` | ~40 | prefers-reduced-motion support |

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| `WaterCanvas` | 3D | Main water simulation renderer |
| `RainParticles` | 3D | GPU particle rain system |
| `Caustics` | 3D | Underwater light pattern effect |
| `AmbientParticles` | 3D | Floating particles with noise |
| `Navbar` | Layout | Navigation (mobile/desktop) |
| `Section` | Layout | Content section wrapper |
| `About`, `Projects`, `Contact` | Section | Portfolio sections |
| `HeroStory` | Story | Main hero introduction |

### Shaders (GLSL)

| Shader | Type | Purpose |
|--------|------|---------|
| `simulation` | Compute | Fluid pressure-velocity update |
| `water` | Render | Surface visualization |
| `rain` | Compute+Render | Particle position + display |
| `particles` | Compute+Render | Ambient particle animation |

### Styles

| File | LOC | Scope |
|------|-----|-------|
| `globals.css` | 197 | Theme, design system, utilities |
| `navbar.css` | ~50 | Navbar-specific styles |

## Module Relationships

### Data Flow
```
portfolio.ts (content)
    ↓
Components (About, Projects, Contact)
    ↓
Next.js pages
    ↓
Browser render
```

### Effect Pipeline
```
useFluidSimulation (GPU state)
    ↓
useScrollProgress (scroll tracking)
    ↓
useScrollStory (GSAP timeline)
    ↓
Effects trigger on scroll
    ↓
Shaders render visuals
```

### Performance Management
```
usePerformanceMonitor (measures FPS)
    ↓
Checks device capability
    ↓
Conditionally reduces effects
    ↓
Updates useReducedMotion state
```

## Type Definitions

Located in `src/types/content.ts`:

```typescript
// Navigation
interface NavigationContent { ... }

// Hero section
interface HeroContent { ... }

// About section
interface AboutContent {
  basicInfo: BasicInfoContent
  education: { items: EducationItem[] }
  skills: { categories: SkillCategories }
  certificates: { items: CertificateGroup[] }
}

// Projects
interface ProjectItem { ... }

// Contact
interface ContactContent { ... }
```

## Design System Integration

### Color Palette (CSS Variables)
```css
--bg-primary: #f1f5f9        /* Slate 100 */
--text-primary: #0f172a      /* Slate 900 */
--text-body: #1e293b         /* Slate 800 */
--text-secondary: #64748b    /* Slate 500 */
--bg-surface: rgba(241, 245, 249, 0.7)
--bg-highlight: #ffffff
--accent-glow: #cbd5e1
--accent-shadow: #64748b
```

### Typography
```css
--font-luxurious-roman: "Luxurious Roman", serif
--font-style-script: "Style Script", cursive
--font-mono: "Geist Mono", monospace
```

### Tailwind v4 Theme Extension
Located in `@theme inline` block in `globals.css`:
- Semantic color tokens mapped to design system
- Custom font family definitions
- Legacy color aliases for backward compatibility

## Testing Structure

- Test runner: Jest 30.2.0
- React testing library integration
- jsdom environment
- Babel preset configuration for TypeScript/React

## Dependencies Summary

### Production
- next 16.1.1
- react 19.2.3, react-dom 19.2.3
- three 0.182.0
- @react-three/fiber 9.5.0
- @react-three/drei 10.7.7
- gsap 3.14.2, @gsap/react 2.1.2
- tailwindcss 4
- tailwind-merge 3.4.0
- clsx 2.1.1

### Development
- typescript 5 (strict mode)
- eslint 9, eslint-config-next 16.1.1
- prettier 3.7.4
- jest 30.2.0, babel-jest 30.2.0
- @testing-library/react 16.3.1
- @axe-core/react 4.11.0 (a11y)

## Performance Characteristics

- **Initial Load**: ~300KB JS (gzipped estimate)
- **GPU Memory**: ~256MB for FBO textures
- **Target FPS**: 60 on RTX 3060+, 45-50 on mid-range
- **Shader Compilation**: Async, effects disable if timeout

## Accessibility Features

- AxeReporter component for runtime testing
- Skip links in navbar
- Keyboard navigation for all controls
- Screen reader announcements via aria-live
- Reduced motion: animations disabled if prefers-reduced-motion
- Focus management: focus-ring utilities
- Touch targets: 44px minimum (48px mobile)
- Color contrast: WCAG AA compliant

## Build Outputs

- **Development**: Hot reload, source maps
- **Production**: Optimized, minified, tree-shaken
- **Sitemap**: Dynamic generation via sitemap.ts
- **Manifest**: PWA-ready via manifest.ts

## Next Steps for New Developers

1. Review `README.md` for quick setup
2. Read `code-standards.md` for conventions
3. Study `system-architecture.md` for component flow
4. Explore `src/content/portfolio.ts` to understand data structure
5. Review shader files to understand GPU rendering pipeline
6. Check `src/hooks/useFluidSimulation.ts` for advanced pattern
