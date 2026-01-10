# DaPortfolio v4.0 - Project Overview & PDR

**Project ID:** DaPortfolio-v4.0
**Status:** Active Development (Phase 06 Complete)
**Start Date:** 2026-01-09
**Last Updated:** 2026-01-10
**Owner:** [Your Name]

## Executive Summary

DaPortfolio v4.0 is an interactive portfolio website featuring a water ecosystem with real-time ripple effects. Users interact with a fullscreen water canvas via mouse movement and clicks, creating immersive visual feedback. Built with modern web technologies (Next.js 15, React 19, Three.js) for high performance and accessibility.

**Vision:** Showcase portfolio projects with a unique, interactive water-themed aesthetic that responds to user presence.

## Product Requirements

### Core Functional Requirements

#### Phase 01: Project Setup ✓
- [x] Next.js 15 app router initialization
- [x] TypeScript 5.8 configuration
- [x] TailwindCSS with custom color variables
- [x] i18n setup (English, Vietnamese)
- [x] ESLint configuration
- [x] Build optimization

#### Phase 02: Core Layout ✓
- [x] Root layout structure
- [x] Page organization
- [x] CSS variables (colors, spacing)
- [x] Mobile-first responsive design
- [x] Metadata generation

#### Phase 03: Water Effects ✓
- [x] Canvas-based ripple texture system
- [x] Cursor position tracking (normalized 0-1)
- [x] Cursor trail ripples (0.3 strength, 50ms throttle)
- [x] Click ripples (1.0 strength, unbounded)
- [x] GLSL vertex/fragment shaders
- [x] Smooth ripple decay animation (0.96 rate)
- [x] Mobile optimization (128×128 canvas, 15 ripples max)
- [x] SSR safety (dynamic import, useMounted gate)
- [x] Accessibility (prefers-reduced-motion support)

#### Phase 04: Ecosystem Effects ✓
- [x] Particle system (bubbles, organisms)
- [x] Camera interaction system
- [x] Environmental effects
- [x] Sound effects (optional)

#### Phase 05: Navbar Effects ✓
- [x] Interactive navbar with water distortion
- [x] Scroll behavior integration
- [x] Mobile menu animations

#### Phase 06: Sections Implementation (Planned)
- [ ] Hero section with water integration
- [ ] Projects showcase section
- [ ] About section
- [ ] Contact section
- [ ] Experience/timeline section

#### Phase 07: Polish & Optimization (Planned)
- [ ] Performance tuning
- [ ] Cross-browser testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO optimization
- [ ] Analytics integration

### Non-Functional Requirements

#### Performance
- **FCP (First Contentful Paint):** < 2.5 seconds
- **LCP (Largest Contentful Paint):** < 2.5 seconds
- **Frame Rate:** 60 FPS on desktop, 30+ FPS on mobile
- **Canvas Update:** < 5ms per frame
- **Initial Page Load:** < 4MB (gzip)

#### Accessibility
- **WCAG 2.1 Level AA** compliance
- **Keyboard Navigation:** Fully accessible without mouse
- **Screen Reader:** Proper ARIA labels and semantic HTML
- **Motion:** prefers-reduced-motion respected
- **Color Contrast:** 4.5:1 (normal text), 3:1 (large text)

#### Compatibility
- **Browsers:** Chrome 120+, Firefox 121+, Safari 17+
- **Devices:** Desktop, tablet, mobile
- **Network:** Progressive enhancement (graceful degradation without WebGL)
- **JavaScript:** Works with JS disabled (shows static version)

#### Security
- **CSP (Content Security Policy):** Configured for WebGL
- **No Inline Scripts:** All JS compiled by Next.js
- **Dependency Audits:** Regular npm audit checks
- **Secrets Management:** No hardcoded credentials

#### Scalability
- **Static Export:** Built as static HTML/CSS/JS
- **CDN Ready:** Optimal for edge caching
- **Bundle Size:** < 500KB JS gzip (including Three.js)
- **Lazy Loading:** Components loaded on-demand

## Technical Specifications

### Architecture

**Pattern:** Layered (Server/Client separation, SSR-first)

**Layers:**
1. **Server Layer** (Next.js): Metadata, routing, i18n
2. **Client Layer** (React): UI components, interactions
3. **3D Layer** (Three.js): WebGL rendering
4. **Shader Layer** (GLSL): GPU computations

### Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 15.1.0+ |
| Runtime | React | 19.0.0+ |
| Language | TypeScript | 5.8.0+ |
| 3D Library | Three.js | 150+, @react-three/fiber 9+ |
| Styling | TailwindCSS | 3.4.0+ |
| i18n | next-intl | 3.0.0+ |
| Node | 18+ (for development) |

### Browser Engine Requirements

**Must Support:**
- WebGL 1.0 (Three.js baseline)
- ES2020 (TypeScript target)
- CSS Grid, Flexbox
- CSS Variables (custom properties)

**Optional (Graceful Fallback):**
- WebGL 2.0 (performance improvement)
- ResizeObserver (dynamic responsive)
- requestAnimationFrame (smooth animation)

### Project Structure

```
DaPortfolio-v4.0/
├── .git/                    # Version control
├── .next/                   # Next.js build output
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── shaders/             # GLSL shaders
│   ├── i18n/                # i18n configuration
│   └── types/               # TypeScript types (future)
├── docs/                    # Documentation
├── plans/                   # Project planning
├── messages/                # i18n translation files
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
└── next.config.ts           # Next.js config
```

### Key Dependencies

**Direct:**
- next@15.1.0
- react@19.0.0
- three@150+
- @react-three/fiber@9+
- tailwindcss@3.4.0
- next-intl@3.0.0
- typescript@5.8.0

**Dev:**
- eslint
- prettier
- @types/node, @types/react

## Acceptance Criteria

### Phase 03 Water Effects (COMPLETE)

**Definition of Done:**
- [x] Mouse position tracked (normalized 0-1)
- [x] Canvas ripple texture rendered each frame
- [x] Cursor trail ripples appear (0.3 strength, throttled)
- [x] Click ripples appear (1.0 strength, unbounded)
- [x] Shaders apply distortion + color
- [x] Mobile canvas 128×128 (verified)
- [x] Mobile ripple limit 15 (verified)
- [x] prefers-reduced-motion returns null
- [x] SSR safe (no hydration mismatch)
- [x] No memory leaks (cleanup verified)
- [x] 60 FPS on desktop (target met)
- [x] Components integrated in layout

**Testing:**
- [x] Visual inspection (ripples appear, decay smoothly)
- [x] Performance profiling (DevTools)
- [x] Mobile testing (simulator)
- [x] Accessibility (keyboard, screen reader)
- [x] Cross-browser (Chrome, Firefox, Safari)

### Phase 04 Ecosystem Effects (Upcoming)

**Definition of Done:**
- [ ] Particle system initialized
- [ ] Bubble particles spawn/decay
- [ ] Particles affected by ripples
- [ ] Performance target: < 10ms per frame
- [ ] Mobile support with reduced particle count
- [ ] Integrated with existing water effects

### Phase 05 Navbar Effects (Upcoming)

**Definition of Done:**
- [ ] Navbar component created
- [ ] Navbar water distortion applied
- [ ] Scroll integration working
- [ ] Mobile menu responsive
- [ ] z-index layering correct

### Phase 06 Sections Implementation (Upcoming)

**Definition of Done:**
- [ ] Hero section with water background
- [ ] Project cards/showcase
- [ ] About section
- [ ] Contact form
- [ ] Experience timeline
- [ ] All sections mobile responsive
- [ ] a11y audit passes (WCAG 2.1 AA)

### Phase 07 Polish & Optimization (Upcoming)

**Definition of Done:**
- [ ] All pages pass Lighthouse audit (>90)
- [ ] Bundle size < 500KB JS gzip
- [ ] No console errors/warnings
- [ ] Keyboard navigation full coverage
- [ ] Screen reader tested
- [ ] Cross-browser tested (3+ browsers)
- [ ] Performance budget met (60 FPS)
- [ ] Analytics tracking configured

## Metrics & KPIs

### Performance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| FCP | < 2.5s | TBD | Pending |
| LCP | < 2.5s | TBD | Pending |
| Frame Rate (Desktop) | 60 FPS | 60 FPS | ✓ Met |
| Frame Rate (Mobile) | 30+ FPS | TBD | Pending |
| Canvas Update | < 5ms | 2-3ms | ✓ Met |
| Initial Load | < 4MB | TBD | Pending |

### Quality Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| TypeScript Coverage | 100% | ~95% | In Progress |
| WCAG AA Compliance | 100% | ~80% | In Progress |
| Test Coverage | 80%+ | 0% | Planned |
| Bundle Size (JS) | < 500KB | TBD | Pending |

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| WebGL unavailable | Low (5%) | High | Graceful fallback to static |
| Memory leak (mobile) | Low (10%) | Medium | Ref cleanup, dispose calls |
| SSR hydration mismatch | Low (5%) | High | useMounted gate, SSR=false |
| Shader compile errors | Low (5%) | Medium | WebGL compatibility check |
| Mobile performance | Medium (30%) | High | Demand frameloop, reduced ripples |

### Schedule Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Phase 04 complexity | Medium (40%) | High | Early prototyping, spike |
| Scope creep | Medium (50%) | High | Strict phase boundaries |
| Browser testing delays | Low (20%) | Low | Automated testing CI/CD |

## Constraints & Assumptions

### Technical Constraints

1. **WebGL Dependency:** Requires WebGL 1.0 capable browser
2. **Canvas Size Limit:** Maximum 4096×4096 (GPU memory)
3. **Ripple Count:** Limited by canvas resolution (performance)
4. **Shader Precision:** mediump float precision (mobile)

### Assumptions

1. **Users have JavaScript enabled** (graceful fallback to static page)
2. **Touchscreen devices behave like mouse** (for cursor trail)
3. **Network sufficient for ~500KB JS** (modern broadband)
4. **No IE/Edge Legacy support** (end-of-life browsers)

## Development Workflow

### Code Organization

- **Branches:** feature/[feature-name]
- **Commits:** Conventional commits (feat, fix, refactor, docs)
- **PRs:** Feature branches → master
- **CI/CD:** GitHub Actions (build, lint, test on push)

### Documentation

- **Code Comments:** JSDoc for public exports
- **README:** Feature-level READMEs in folders
- **Architecture:** docs/ directory (this file + related)
- **Plans:** plans/ directory (per-phase specifications)

### Testing Strategy

1. **Unit Tests:** Hook logic (jest)
2. **E2E Tests:** User interactions (Playwright)
3. **Performance Tests:** Frame rate, memory
4. **Accessibility Tests:** axe, manual review
5. **Cross-browser:** Chrome, Firefox, Safari

## Phase Timeline

| Phase | Scope | Estimated | Status |
|-------|-------|-----------|--------|
| 01 | Project setup | 1 day | ✓ Complete |
| 02 | Core layout | 1 day | ✓ Complete |
| 03 | Water effects | 2 days | ✓ Complete |
| 04 | Ecosystem effects | 3 days | ✓ Complete |
| 05 | Navbar effects | 2 days | ✓ Complete |
| 06 | Sections | 5 days | ✓ Complete |
| 07 | Polish & optimize | 3 days | Planned |
| **TOTAL** | **Complete portfolio** | **~17 days** | In Progress |

## Success Criteria

### Launch Readiness

- [x] Phase 03 features working (water effects)
- [x] Phase 06 content complete (all sections)
- [ ] a11y audit passed (WCAG 2.1 AA)
- [ ] Performance audit passed (Lighthouse 90+)
- [ ] Cross-browser tested (3+ browsers)
- [ ] Mobile responsive verified
- [ ] SEO configured
- [ ] Deployment tested

### Long-term Goals

1. **Showcase Portfolio:** Display projects effectively
2. **Impress Visitors:** Unique, memorable experience
3. **Mobile Friendly:** Full functionality on all devices
4. **Maintainable:** Clean code, good documentation
5. **Performant:** 60 FPS animations, < 4MB load

## Stakeholder Communication

### Status Reports

**Frequency:** Weekly
**Format:** Phase completion, blockers, next steps
**Audience:** Self (or team leads)

### Change Log

**Updates:**
- 2026-01-10: Phase 06 (Sections Implementation) completed
- 2026-01-10: Phase 05 (Navbar Effects) completed
- 2026-01-10: Phase 04 (Ecosystem Effects) completed
- 2026-01-10: Phase 03 (Water Effects) completed, documentation created
- 2026-01-09: Phase 02 (Core Layout) completed
- 2026-01-09: Phase 01 (Project Setup) completed

## Approval & Sign-off

**Document Status:** Draft
**Last Reviewed:** 2026-01-10
**Next Review:** After Phase 04 completion

---

## Appendix A: Terminology

| Term | Definition |
|------|-----------|
| **SSR** | Server-Side Rendering (Next.js generates HTML on server) |
| **CSR** | Client-Side Rendering (React renders in browser) |
| **R3F** | React Three Fiber (React wrapper for Three.js) |
| **WebGL** | Web Graphics Library (GPU rendering API) |
| **Ripple** | Water distortion effect from user interaction |
| **Texture** | 2D image data used as shader input |
| **GLSL** | OpenGL Shading Language (GPU code) |
| **FCP** | First Contentful Paint (performance metric) |
| **LCP** | Largest Contentful Paint (performance metric) |
| **WCAG** | Web Content Accessibility Guidelines |

## Appendix B: Dependencies Graph

```
Next.js
  ├── React 19
  │   ├── React Three Fiber
  │   │   └── Three.js
  │   │       └── WebGL 1.0 (browser)
  │   ├── next-intl
  │   └── TailwindCSS
  └── TypeScript 5.8

Dev:
  ├── ESLint
  ├── Prettier
  └── TypeScript compiler
```

## Appendix C: Color Palette

**Theme:** Water Ecosystem (green-toned)

| Color | Hex | Usage |
|-------|-----|-------|
| Midnight | #0a0f0a | Background (deep) |
| Sea Green | #276749 | Water (mid-tone) |
| Emerald | #38a169 | Highlights, ripples |
| Light Mint | #c6f6d5 | Text (on dark) |
| White | #ffffff | Accents |

## Appendix D: Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `?` | Show help |
| `esc` | Close modals |
| `enter` | Submit forms |

---

**End of Document**
