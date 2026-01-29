# DaPortfolio v4.0

Personal portfolio website built with Next.js 16, React 19, Three.js, and advanced GPU-accelerated visual effects.

## Features

- **GPU Water Simulation** - Ping-pong FBO technique with pressure-velocity wave equation
- **Rain Particle System** - GPU-based falling particles with wind drift
- **Ambient Particles** - Floating organic particles with Perlin noise
- **Caustics Effect** - Underwater light patterns via shader
- **GSAP Scroll Animations** - ScrollTrigger-powered section transitions
- **Accessibility First** - Skip links, reduced motion support, focus management, axe-core compliance
- **Silver Mist Design** - Elegant slate color palette with serif typography

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.1 | App Router, SSR, optimization |
| React | 19.2.3 | UI framework |
| Three.js | 0.182.0 | 3D graphics |
| React Three Fiber | 9.5.0 | React renderer for Three.js |
| React Three Drei | 10.7.7 | Reusable 3D components |
| GSAP | 3.14.2 | Scroll animations |
| Tailwind CSS | v4 | Utility styling |
| TypeScript | 5 | Type safety |
| Jest | 30.2.0 | Unit testing |

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── effects/        # Visual effects (Caustics, Rain, etc.)
│   ├── water/          # Water simulation components
│   ├── particles/      # Particle system components
│   ├── layout/         # Layout components (Navbar, Section)
│   ├── sections/       # Portfolio sections (About, Projects, Contact)
│   ├── story/          # Hero story components
│   └── icons/          # SVG icons
├── content/            # Portfolio content data (portfolio.ts)
├── hooks/              # Custom React hooks
├── shaders/            # GLSL shader code
├── lib/                # Utility functions
├── styles/             # Global CSS
└── types/              # TypeScript interfaces
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run Jest tests
npm run test:coverage    # Test coverage report
npm run format           # Format code with Prettier
npm run analyze          # Bundle size analysis
```

## Key Technologies Explained

### Water Simulation
Uses GPU-accelerated fluid dynamics with ping-pong framebuffer objects (FBOs). Implements pressure-velocity wave equation for realistic ripple propagation.

### Particle Systems
- **Rain**: GPU-based falling particles with wind drift and collision
- **Ambient**: Floating particles driven by Perlin noise for organic motion

### Shader Pipeline
Custom GLSL shaders for:
- Water surface simulation and rendering
- Particle updates and rendering
- Caustics light patterns
- Bloom and post-processing effects

### Animation Framework
GSAP ScrollTrigger manages scroll-based animations with performance monitoring and reduced motion support.

## Styling & Design

- **Design System**: Silver Mist (slate-based palette)
- **Typography**: Luxurious Roman (serif), Style Script (display)
- **Layout**: Responsive grid system via Tailwind CSS v4
- **Accessibility**: WCAG 2.1 AA compliance, high contrast ratios

## Documentation

Complete documentation available in `/docs`:
- `project-overview-pdr.md` - Project requirements and goals
- `codebase-summary.md` - Technical overview
- `code-standards.md` - Coding conventions
- `system-architecture.md` - Component architecture
- `design-guidelines.md` - Design system details
- `project-roadmap.md` - Development roadmap

## Performance

- Target: 60 FPS on modern hardware
- Performance monitoring via `usePerformanceMonitor` hook
- Automatic effect reduction on low-end devices
- Optimized shader compilation and texture management

## Accessibility

- Skip to main content links
- Full keyboard navigation
- Screen reader support
- Reduced motion preferences respected
- Focus management and visible focus rings
- 44px+ touch targets on mobile

## Browser Support

- Chrome/Edge 120+
- Firefox 122+
- Safari 16+
- Mobile browsers (iOS Safari 16+, Chrome Android)

## Contributing

Follow standards in `./docs/code-standards.md` before submitting PRs.

## License

Private project - all rights reserved.
