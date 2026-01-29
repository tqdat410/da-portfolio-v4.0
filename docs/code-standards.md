# Code Standards & Conventions

**Project:** DaPortfolio v4.0
**Last Updated:** 2026-01-29

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
| **Classes** | PascalCase | `FluidSimulation`, `ParticleSystem` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_PARTICLES`, `SHADER_TIMEOUT_MS` |
| **Interfaces** | PascalCase | `WaterCanvasProps`, `FluidState` |
| **Type Aliases** | PascalCase | `FluidForces`, `Vector2D` |
| **Enums** | PascalCase | `ParticleType`, `AnimationState` |
| **Private methods** | `_camelCase` or `#private` | `_updateSimulation`, `#initGPU` |

### File Organization Rules

```
src/
├── components/          # React components only
│   ├── {category}/     # Organize by feature
│   │   ├── {Component}.tsx
│   │   ├── {Component}.test.tsx
│   │   └── index.ts    # Always provide barrel export
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
- Keep files under 200 LOC; split if larger

## React & Next.js Patterns

### Component Structure

```typescript
// File: src/components/water/WaterCanvas.tsx
import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import type { WaterCanvasProps } from '@/types/content';

/**
 * WaterCanvas - GPU-accelerated water simulation renderer
 *
 * Renders a Three.js scene with fluid simulation using ping-pong FBOs.
 * Responds to mouse movement via global ref.
 */
export const WaterCanvas: React.FC<WaterCanvasProps> = ({
  width = 800,
  height = 600,
  onReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Setup effects
  useEffect(() => {
    // Initialize
    // Cleanup
  }, []);

  return (
    <Canvas ref={canvasRef} {...props}>
      {/* Render tree */}
    </Canvas>
  );
};

export default WaterCanvas;
```

**Component Rules:**
- Use functional components with React.FC type
- Always include JSDoc comments for components
- Props typed via interfaces/types (not inline)
- Separate concerns: hooks for logic, components for UI
- Use `const` for component declarations
- Export named export + default export

### Hooks Pattern

```typescript
// File: src/hooks/useFluidSimulation.ts
import { useRef, useCallback, useEffect } from 'react';
import type { FluidState } from '@/types/content';

/**
 * useFluidSimulation - Manages GPU fluid dynamics state
 *
 * @param resolution - Simulation resolution (power of 2)
 * @param damping - Velocity damping per frame (0-1)
 * @returns {FluidSimulation} Object with state and mutation methods
 *
 * @example
 * const fluid = useFluidSimulation(256, 0.99);
 * fluid.addForce(x, y, vx, vy); // Add velocity at position
 */
export const useFluidSimulation = (
  resolution: number = 256,
  damping: number = 0.99
) => {
  const stateRef = useRef<FluidState>({
    // Initial state
  });

  const addForce = useCallback((x: number, y: number, vx: number, vy: number) => {
    // Implementation
  }, []);

  useEffect(() => {
    // Setup/cleanup
  }, [resolution]);

  return {
    state: stateRef.current,
    addForce,
  };
};
```

**Hook Rules:**
- Always typed return values
- Use useRef for mutable values, useState for reactive
- Include JSDoc with @param, @returns, @example
- Dependency arrays must be exhaustive
- Cleanup functions required for event listeners

### Server vs Client Components

```typescript
// File: src/app/layout.tsx (Server Component by default)
import { ReactNode } from 'react';
import { Navbar } from '@/components/layout';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Navbar /> {/* Client component - will be hydrated */}
        {children}
      </body>
    </html>
  );
}
```

```typescript
// File: src/components/water/WaterCanvas.tsx (Client Component)
'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';

export const WaterCanvas = () => {
  // Client-only logic
};
```

**Rules:**
- Server components by default (faster, no JS overhead)
- Mark client components with `'use client'` directive
- Isolate client components to leaf nodes
- Use server actions for data mutations

## Type Definitions

### Content Types

```typescript
// File: src/types/content.ts

// Always use `interface` for extensible types
export interface WaterCanvasProps {
  width?: number;
  height?: number;
  onReady?: () => void;
  /** Enable ripple animations on scroll */
  interactive?: boolean;
}

// Use `type` for unions, tuples, primitives
export type ParticleEmitterType = 'rain' | 'ambient' | 'explosion';

// Generics for reusable patterns
export interface GridItem<T> {
  id: string;
  data: T;
  position: [number, number];
}

// Extend third-party types
export interface ShaderUniforms extends THREE.IUniform {
  customProperty?: number;
}
```

**Rules:**
- Use `interface` for component props
- Use `type` for unions, tuples, primitives
- Always specify optional properties with `?`
- Document complex properties with JSDoc
- Export from `src/types/content.ts`
- Never use `any`; use `unknown` + type guard

## Async Patterns

### GSAP & Animations

```typescript
// File: src/hooks/useScrollStory.ts
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollStory = () => {
  useGSAP(() => {
    gsap.to('.hero', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          console.log('Progress:', self.progress);
        },
      },
      opacity: 0.5,
      duration: 1,
    });
  }, []);
};
```

**Rules:**
- Use `useGSAP` hook from `@gsap/react`
- Register plugins via `gsap.registerPlugin()`
- Always clean up via dependency arrays
- Use ScrollTrigger for scroll-based animations

### Shader Loading

```typescript
// File: src/shaders/water.ts
export const waterVertexShader = `
  uniform sampler2D heightmap;

  void main() {
    vec3 pos = position;
    pos.z = texture2D(heightmap, uv).r * 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterFragmentShader = `
  uniform vec3 color;

  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`;
```

**Rules:**
- Shaders stored as TypeScript string exports
- Use named exports per shader type
- Add comments for complex calculations
- Version shaders if they change: `waterShaderV2`

## Error Handling

```typescript
// Try-catch for async operations
async function initializeGPU() {
  try {
    const renderer = new THREE.WebGLRenderer();
    // Setup
  } catch (error) {
    console.error('GPU initialization failed:', error);
    // Graceful fallback
  }
}

// Error boundaries for React
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WaterCanvas />
    </ErrorBoundary>
  );
}
```

**Rules:**
- Always catch GPU-related errors
- Provide user-friendly fallback UI
- Log errors with context
- Use Error Boundaries for component errors

## Testing Standards

### Unit Tests

```typescript
// File: src/components/sections/About/About.test.tsx
import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About Component', () => {
  it('renders hero section title', () => {
    render(<About />);
    expect(screen.getByText(/about me/i)).toBeInTheDocument();
  });

  it('displays skill categories', () => {
    render(<About />);
    const skillElements = screen.getAllByRole('heading', { level: 3 });
    expect(skillElements.length).toBeGreaterThan(0);
  });
});
```

**Rules:**
- File naming: `Component.test.tsx`
- Use React Testing Library (not Enzyme)
- Test user behavior, not implementation
- Aim for 70%+ code coverage
- Mock external dependencies

### Coverage Requirements

```bash
# Target: 70%+ coverage
npm run test:coverage

# File-level minimums:
# - Components: 80%
# - Hooks: 85%
# - Utilities: 90%
```

## Code Quality

### ESLint Configuration

```javascript
// File: eslint.config.mjs
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: ['node_modules', '.next', 'dist'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@next/next/no-html-link-for-pages': 'error',
    },
  },
];
```

**Rules:**
- No `console.log` in production code (use `console.warn` for warnings)
- No `var`; use `const` or `let`
- Prefer `const` over `let`
- Avoid deeply nested ternaries (max 2 levels)
- Max function parameters: 4 (use objects for more)

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

**Rules:**
- Semicolons required
- Single quotes for strings
- 2-space indentation
- 100-character line limit
- Always format before commit

## Documentation Requirements

### JSDoc Comments

```typescript
/**
 * Calculates ripple position from input coordinates
 *
 * @param x - X coordinate in canvas space (0-1)
 * @param y - Y coordinate in canvas space (0-1)
 * @param radius - Ripple propagation radius in pixels
 * @returns Ripple force vector [fx, fy]
 * @throws {Error} If coordinates out of bounds
 *
 * @example
 * const [fx, fy] = calculateRipple(0.5, 0.5, 50);
 */
export function calculateRipple(
  x: number,
  y: number,
  radius: number
): [number, number] {
  // Implementation
}
```

**Rules:**
- Public functions/components require JSDoc
- Include @param, @returns, @throws
- Add @example for complex functions
- Link to related functions via {@link FunctionName}

### Inline Comments

```typescript
// Bad: obvious what the code does
const x = y + 1; // Add 1 to y

// Good: explains WHY
// Offset by 1 to account for 0-indexed arrays
const arrayIndex = y + 1;

// Complex logic requires explanation
// Ping-pong FBO technique: render to A, read from B, then swap
if (frameCount % 2 === 0) {
  this.renderToFBO(fboA, fboB);
  [this.fboRead, this.fboWrite] = [fboA, fboB];
} else {
  this.renderToFBO(fboB, fboA);
  [this.fboRead, this.fboWrite] = [fboB, fboA];
}
```

**Rules:**
- Comments explain WHY, not WHAT
- Keep comments close to code
- Update comments when code changes
- Remove dead code instead of commenting it out

## Performance Standards

### Bundle Size

Target: < 500KB gzipped

```bash
npm run analyze  # Check bundle size
```

### Rendering Performance

Target: 60 FPS on RTX 3060+

```typescript
// Use performance monitoring hook
import { usePerformanceMonitor } from '@/hooks';

export const Page = () => {
  const { fps, effectsEnabled } = usePerformanceMonitor();

  return (
    <div>
      {!effectsEnabled && <p>Effects disabled for performance</p>}
    </div>
  );
};
```

### Memory Management

```typescript
// Always clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Dispose Three.js resources
useEffect(() => {
  return () => {
    geometry?.dispose();
    material?.dispose();
    texture?.dispose();
  };
}, [geometry, material, texture]);
```

**Rules:**
- Dispose Three.js objects when unmounting
- Remove event listeners in cleanup
- Use useCallback to memoize expensive functions
- Avoid creating new objects in render

## Accessibility Standards

### ARIA & Semantic HTML

```typescript
// Bad: not semantic
<div onClick={handleClick} className="button">Click me</div>

// Good: semantic with ARIA
<button
  onClick={handleClick}
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
>
  Click me
</button>

// Lists with labels
<ul aria-label="Portfolio sections">
  <li><a href="#about">About</a></li>
  <li><a href="#projects">Projects</a></li>
</ul>
```

**Rules:**
- Use semantic HTML: button, nav, main, section
- Add aria-label for icon-only buttons
- Add aria-expanded for togglable elements
- Add aria-live for dynamic content updates

### Focus Management

```typescript
export const Modal = ({ isOpen, onClose }) => {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Move focus into modal
      firstButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      {/* Content */}
    </div>
  );
};
```

**Rules:**
- Manage focus on modal open/close
- Support Escape key to close dialogs
- Ensure focus visible ring on keyboard nav
- Don't hide focus indicators

## Commit Message Standards

Format: `type(scope): subject`

```
feat(water): implement GPU fluid simulation
fix(accessibility): improve focus ring contrast
docs(readme): update setup instructions
refactor(hooks): extract useFluidSimulation logic
test(about): add unit tests for SkillsGrid
style(navbar): align padding across breakpoints
perf(shaders): optimize particle shader compilation
```

**Types:** feat, fix, docs, refactor, test, style, perf, chore
**Scope:** Component/module affected
**Subject:** Lowercase, imperative, under 50 characters

## Security Standards

```typescript
// Validate user input
function validateProjectInput(data: unknown): ProjectItem {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid project data');
  }
  // Validate each field
  return data as ProjectItem;
}

// Sanitize HTML (if needed)
import DOMPurify from 'dompurify';
const safeHTML = DOMPurify.sanitize(userHTML);

// Environment variables
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
// Never expose secrets in public variables
```

**Rules:**
- Never trust user input
- Validate data types
- Use environment variables for secrets
- Never commit `.env` files
- Keep dependencies updated

## Summary

Follow these standards to maintain code consistency and quality:
1. **TypeScript** - Strict mode always
2. **React** - Functional components, proper hooks
3. **Testing** - 70%+ coverage
4. **Documentation** - JSDoc for public code
5. **Performance** - Monitor FPS, bundle size
6. **Accessibility** - WCAG 2.1 AA compliance
7. **Git** - Conventional commits
8. **Security** - Validate input, protect secrets
