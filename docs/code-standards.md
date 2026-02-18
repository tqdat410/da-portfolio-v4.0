# Code Standards & Conventions

**Project:** DaPortfolio v4.0
**Last Updated:** 2026-02-17

## Overview

This document defines coding standards, conventions, and patterns used throughout DaPortfolio v4.0. All contributors must follow these standards to ensure consistency, maintainability, and code quality.

## TypeScript Configuration

### Compiler Settings

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| **Files** | kebab-case (components: PascalCase) | `use-fluid-simulation.ts`, `WaterCanvas.tsx` |
| **Directories** | lowercase, kebab-case | `src/components/water` |
| **Components** | PascalCase | `WaterCanvas`, `RainParticles` |
| **Hooks** | camelCase, `use` prefix | `useFluidSimulation`, `useActiveSection` |
| **Functions** | camelCase | `initializeShader`, `calculateVelocity` |
| **Classes** | PascalCase | `THREE.WebGLRenderer`, `gsap.TimelineLite` |
| **Constants** | UPPER_SNAKE_CASE | `PI`, `Math.PI` |
| **Interfaces** | PascalCase | `WaterCanvasProps`, `FBOState` |
| **Type Aliases** | PascalCase | `PortfolioContent`, `ProjectItem` |
| **Enums** | PascalCase | `ProjectCategory` |
| **Private methods** | `_camelCase` or `#private` | `_updateSimulation`, `#initGPU` |

### File Organization Rules

```
src/
├── app/                 # Next.js App Router (Home, Projects)
├── components/          # React components
│   ├── {category}/     # Organize by feature
│   │   ├── {Component}.tsx
│   │   ├── {Component}.test.tsx
│   │   └── index.ts    # Barrel export
│   └── index.ts        # Root barrel export
├── hooks/              # Custom React hooks
│   ├── use{Hook}.ts
│   └── index.ts        # Barrel export
├── shaders/            # GLSL as TypeScript strings
│   ├── {shader-name}.ts
│   └── index.ts
├── content/            # Data/content files
│   ├── portfolio.ts    # Single source of truth for content
│   └── index.ts
├── lib/                # Utility functions
│   └── utils.ts
├── types/              # TypeScript definitions
│   └── content.ts
└── styles/             # Global CSS
    └── globals.css
```

**Rules:**
- One component per file (exceptions: related small components)
- Always provide `index.ts` barrel exports for directories
- Co-locate tests with components: `Component.tsx` + `Component.test.tsx`
- Keep files under 200 LOC; split if larger (Modularization principle)
- Use descriptive names for files to ensure self-documentation

## React & Next.js Patterns

### Component Structure

```typescript
// File: src/components/water/WaterCanvas.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import type { WaterCanvasProps } from '@/types/content';

/**
 * WaterCanvas - GPU-accelerated water simulation renderer
 */
export const WaterCanvas: React.FC<WaterCanvasProps> = ({
  width = 800,
  height = 600,
  onReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialization logic
  }, []);

  return (
    <Canvas ref={canvasRef}>
      {/* Content */}
    </Canvas>
  );
};

export default WaterCanvas;
```

**Component Rules:**
- Use functional components with `React.FC` type or direct prop typing
- Mark client-specific code with `'use client'`
- Always include JSDoc comments for public components
- Props typed via interfaces/types
- Separate concerns: hooks for logic, components for UI

### Hooks Pattern

```typescript
// File: src/hooks/useFluidSimulation.ts
import { useRef, useCallback, useEffect } from 'react';
import type { FluidState } from '@/types/content';

/**
 * useFluidSimulation - Manages GPU fluid dynamics state
 */
export const useFluidSimulation = (options: any = {}) => {
  const fboRef = useRef<FBOState | null>(null);

  const addRipple = useCallback((x: number, y: number) => {
    // Implementation
  }, []);

  return {
    getTexture: () => {},
    addRipple,
  };
};
```

**Hook Rules:**
- Always type return values
- Use `useRef` for mutable non-reactive values
- Include JSDoc with `@param`, `@returns`, `@example`
- Dependency arrays must be exhaustive (use ESLint rules)

## Type Definitions

- Use `interface` for component props and extensible objects
- Use `type` for unions, tuples, and primitive aliases
- Never use `any`; prefer `unknown` or specific types
- Export all common types from `src/types/content.ts`

## Animation Standards (GSAP)

- Use `@gsap/react` for React-safe GSAP implementation
- Always clean up animations via `useGSAP` or `useEffect`
- Respect user motion preferences via `useReducedMotion` hook
- Use `ScrollTrigger` for scroll-linked animations

## Performance Standards

- **FPS Goal:** 60 FPS on modern hardware
- **Monitoring:** Use `usePerformanceMonitor` to track runtime performance
- **Adaptive Quality:** Reduce particle counts and shader complexity on low-end devices
- **Bundle Size:** Keep main bundle < 400KB gzipped
- **Resource Cleanup:** Always dispose Three.js geometries, materials, and textures

## Accessibility Standards (WCAG 2.1 AA)

- **Semantic HTML:** Use correct tags (main, section, nav, button)
- **ARIA:** Provide labels for interactive elements without visible text
- **Keyboard Navigation:** All interactive elements must be reachable via Tab
- **Focus Management:** Visible focus rings, focus traps for modals
- **Reduced Motion:** Check `prefers-reduced-motion` to disable non-essential motion
- **Touch Targets:** 44px minimum for all interactive elements on mobile

## Commit Message Standards

Format: `type(scope): subject`
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `style`, `perf`, `chore`

Example: `feat(projects): add SAP-style list-detail layout`

## Documentation Requirements

- **JSDoc:** Required for public functions, components, and hooks
- **Architecture:** Document major systems in `docs/system-architecture.md`
- **Roadmap:** Track progress in `docs/project-roadmap.md`
- **Changelog:** Record significant changes (planned)
- **Comments:** Explain "Why" not "What"
