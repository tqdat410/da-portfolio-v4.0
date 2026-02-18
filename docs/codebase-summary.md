# DaPortfolio v4.0 - Codebase Summary

**Total Files:** 68 TypeScript/TSX files
**Total LOC:** ~5,400 lines
**Last Updated:** 2026-02-17

## Directory Structure

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   ├── projects/                  # /projects page route
│   │   └── page.tsx               # Projects page entry
│   ├── globals.css                # Design system + theme
│   ├── sitemap.ts                 # SEO sitemap
│   └── manifest.ts                # PWA manifest
│
├── components/                    # React components
│   ├── effects/                   # Visual effects components
│   │   ├── Caustics.tsx           # Underwater light patterns
│   │   ├── RainParticles.tsx      # GPU rain system
│   │   └── EcosystemLayer.tsx     # Combined effects
│   │
│   ├── water/                     # Water simulation
│   │   ├── WaterCanvas.tsx        # Main renderer
│   │   ├── WaterPlane.tsx         # Geometry
│   │   └── TextCanvas.ts          # Text-to-water
│   │
│   ├── layout/                    # Layout system
│   │   ├── Navbar.tsx             # Main navigation
│   │   ├── Section.tsx            # Content wrapper
│   │   ├── TopToolbar.tsx         # Toolbar
│   │   ├── Footer.tsx             # Site footer
│   │   └── flexible-column-layout.tsx # SAP-style FCL
│   │
│   ├── sections/                  # Portfolio sections
│   │   ├── About/About.tsx        # Bio/Skills
│   │   ├── Projects/Projects.tsx  # Landing grid
│   │   ├── Contact/Contact.tsx    # Contact form
│   │   ├── Footer/Footer.tsx      # Footer section
│   │   └── index.ts
│   │
│   ├── certificates-page/         # Certificates page components [NEW]
│   │   ├── certificate-list-panel.tsx  # Left panel
│   │   ├── certificate-detail-panel.tsx # Right panel
│   │   └── certificates-page-client.tsx # Client logic
│   │
│   ├── projects-page/             # Detailed projects components
│   │   ├── project-list-panel.tsx  # Left list panel
│   │   ├── project-detail-panel.tsx # Right detail panel
│   │   └── projects-page-client.tsx # Page client logic
│   │
│   ├── ui/ProfileCard/            # Profile card UI component (dir exists, WIP)
│   │
│   ├── story/                     # Hero story
│   │   ├── HeroStory.tsx          # Main hero
│   │   ├── RoleCarousel.tsx       # Selection carousel
│   │   └── StorySection.tsx       # Wrapper
│   │
│   ├── icons/                     # SVG icons
│   │   ├── index.tsx
│   │   └── link-icon.tsx           # Link icon [NEW]
│   │
│   └── utils/                     # Utility components
│       └── AxeReporter.tsx        # a11y testing
│
├── content/                       # Portfolio content
│   ├── portfolio.ts               # Centralized content data
│   └── index.ts                   # Export barrel
│
├── hooks/                         # Custom React hooks
│   ├── useFluidSimulation.ts      # GPU fluid dynamics
│   ├── useScrollStory.ts          # GSAP scroll timeline
│   ├── useScrollProgress.ts       # Scroll progress tracking
│   ├── useActiveSection.ts        # Intersection observer
│   ├── useGSAP.ts                 # GSAP animation setup
│   ├── useMediaQuery.ts           # Responsive breakpoints
│   ├── usePerformanceMonitor.ts   # FPS monitoring + effect reduction
│   ├── useReducedMotion.ts        # Accessibility preference
│   ├── useMounted.ts              # Client-side mount detection
│   ├── useInView.ts               # Visibility detection [NEW]
│   ├── useMousePosition.ts        # Window mouse position tracking [NEW]
│   └── index.ts                   # Export barrel
│
├── shaders/                       # GLSL shader code
│   ├── simulation.ts              # Fluid simulation
│   ├── water.ts                   # Water surface rendering
│   ├── rain.ts                    # Rain particle shader
│   ├── particles.ts               # Ambient particle shader
│   └── caustics.ts                # Underwater light patterns
│
├── lib/                           # Utility functions
│   └── utils.ts                   # cn() class name merger
│
├── styles/                        # Global styles
│   ├── globals.css                # Main CSS (in app/)
│   └── navbar.css                 # Navbar-specific
│
└── types/                         # TypeScript interfaces
    └── content.ts                 # Type definitions
```

## Key Files Reference

### Entry Points

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main landing page |
| `src/app/projects/page.tsx` | Dedicated projects explorer page |
| `src/app/certificates/page.tsx` | Certificates page [NEW] |
| `src/app/layout.tsx` | Root layout, metadata, providers |
| `src/content/portfolio.ts` | Centralized content data |

### Core Hooks (Custom React)

| Hook | Purpose |
|------|---------|
| `useFluidSimulation` | GPU fluid sim, ripple API |
| `useScrollStory` | GSAP scroll timeline setup |
| `usePerformanceMonitor` | FPS tracking, effect reduction |
| `useActiveSection` | Intersection Observer tracking |
| `useReducedMotion` | prefers-reduced-motion support |
| `useInView` | IntersectionObserver-based visibility detection |
| `useMousePosition` | Window mouse position tracking |

### Components

| Component | Type | Purpose |
|-----------|------|---------|
| `WaterCanvas` | 3D | Main water simulation renderer |
| `RainParticles` | 3D | GPU particle rain system |
| `FlexibleColumnLayout` | Layout | SAP-style list-detail layout |
| `ProjectListPanel` | UI | Side panel for project selection |
| `ProjectDetailPanel` | UI | Detailed project view with timeline |
| `CertificateListPanel` | UI | Certificate list panel [NEW] |
| `CertificateDetailPanel` | UI | Certificate detail view [NEW] |
| `Navbar` | Layout | Navigation (mobile/desktop) |
| `Footer` | Section | Author name display |

## Module Relationships

### Data Flow
```
portfolio.ts (content)
    ↓
Components (About, Projects, Contact, Footer)
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

## Testing Structure

- Test runner: Jest 30.2.0
- React testing library integration
- jsdom environment
- AxeReporter for runtime accessibility auditing

## Dependencies Summary

### Production
- next 16.1.1
- react 19.2.3
- three 0.182.0
- @react-three/fiber 9.5.0
- @react-three/drei 10.7.7
- gsap 3.14.2
- tailwindcss 4

### Development
- typescript 5
- eslint 9
- prettier 3.7.4
- jest 30.2.0
- @axe-core/react 4.11.0
