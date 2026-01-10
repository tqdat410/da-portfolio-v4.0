# Code Standards & Architecture

**Last Updated:** 2026-01-10
**Framework:** Next.js 15 + React 19 + TypeScript 5.8

## File Organization

### Directory Structure Rules

```
src/
├── app/              # Next.js App Router
│   └── [locale]/    # Locale dynamic segment
├── components/       # Reusable React components
│   └── {feature}/   # Feature-grouped directories
├── hooks/            # Custom React hooks
├── shaders/          # GLSL shader files
├── i18n/             # Internationalization config
├── types/            # TypeScript interfaces/types (optional)
└── utils/            # Utility functions (optional)
```

### Component Organization

**Pattern:** Feature-based grouping within `components/`

**Example (water/feature):**
```
src/components/water/
├── index.tsx         # Barrel export (dynamic import wrapper)
├── WaterCanvas.tsx   # Main component (Canvas + logic)
├── WaterPlane.tsx    # Sub-component (Three.js mesh)
└── ...other
```

**Rules:**
- One primary component per file (when possible)
- index.tsx for barrel exports/dynamic imports
- Sub-components in same directory if tightly coupled
- Keep component file size < 200 LOC (split if larger)

## Naming Conventions

### Files & Folders

| Category | Pattern | Example |
|----------|---------|---------|
| Components | PascalCase | `WaterCanvas.tsx` |
| Hooks | camelCase, prefix with "use" | `useMousePosition.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Shaders | camelCase | `water.ts` |
| Folders | kebab-case (optional) or camelCase | `src/components/water/` |
| Config files | lowercase | `routing.ts` |

### Code Identifiers

| Category | Case | Example |
|----------|------|---------|
| Components | PascalCase | `WaterPlane`, `WaterCanvas` |
| Functions | camelCase | `useMousePosition()`, `addRipple()` |
| Variables | camelCase | `mousePosition`, `rippleTexture` |
| Constants | SCREAMING_SNAKE_CASE (if truly immutable) | `MAX_RIPPLES = 30` |
| Type/Interface | PascalCase | `MousePosition` |
| Enum | PascalCase | (if used) |
| CSS Classes (Tailwind) | kebab-case | `fixed inset-0 z-0` |

### GLSL Uniforms & Varyings

**Convention:** lowercase with `u` prefix (uniforms), `v` prefix (varyings)

```glsl
uniform sampler2D uRippleMap;
uniform float uDistortionStrength;
uniform float uTime;
varying vec2 vUv;
```

## TypeScript Practices

### Interface/Type Organization

```tsx
// Props interfaces
interface ComponentProps {
  rippleTexture: THREE.CanvasTexture | null;
}

// Internal state types
interface RipplePoint {
  x: number;
  y: number;
  radius: number;
  strength: number;
}

// Hook return types
interface UseRippleCanvasReturn {
  texture: THREE.CanvasTexture | null;
  addRipple: (x: number, y: number, strength?: number) => void;
  update: () => void;
}
```

**Rules:**
- Props interfaces named `{ComponentName}Props`
- Internal types close to usage (same file)
- Hook returns wrapped in interface (not inline unions)
- Use `null` over `undefined` for optional values
- Use `never` for impossible states (not `any`)

### Strict Type Checking

**tsconfig.json requirements:**
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**No `any` types except in edge cases (document with `// @ts-ignore` comment).**

## React 19 Patterns

### Hooks Best Practices

#### 1. Custom Hooks (useXxx pattern)

```tsx
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
    isActive: false,
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({ /* ... */ });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return position;
}
```

**Rules:**
- Only call hooks at top level (not in conditionals/loops)
- Comprehensive useEffect cleanup
- Return interfaces (not naked objects)
- Document with JSDoc comments

#### 2. useSyncExternalStore (for non-React state)

```tsx
let store = initialValue;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return store;
}

function getServerSnapshot() {
  return defaultValue; // SSR-safe
}

export function useMyStore() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return value;
}
```

**Use when:**
- Sharing state between multiple components (texture store)
- External library state (prefers-reduced-motion)
- Avoiding prop drilling
- Server-safe initialization required

#### 3. useFrame Hook (React Three Fiber)

```tsx
export function MyComponent() {
  const { viewport } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return <mesh ref={meshRef}>/* ... */</mesh>;
}
```

**Rules:**
- Only usable inside Canvas context
- Update uniforms/properties here (not in render)
- Use refs to avoid re-renders
- Keep logic lightweight (runs every frame)

### Component Structure

```tsx
"use client"; // Mark client components explicitly

import { ReactNode, useCallback, useEffect, useRef } from "react";
import type { MyType } from "@/types/my-type";

// Props interface (if applicable)
interface MyComponentProps {
  children?: ReactNode;
  value?: string;
}

/**
 * Brief description of what this component does.
 *
 * @example
 * <MyComponent value="test" />
 */
export function MyComponent({ children, value = "default" }: MyComponentProps) {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Hooks first
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [/* deps */]);

  // 2. Event handlers
  const handleClick = useCallback(() => {
    // Logic
  }, [/* deps */]);

  // 3. Render logic
  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
```

**Rules:**
- "use client" at top for client components
- Props interface before component
- JSDoc comments for public components
- Hooks early, render last
- useCallback for event handlers (avoid re-renders)

## SSR Safety

### Rules for Server Component Compatibility

**Allowed in Server Components:**
- Async operations
- Direct database access
- API secrets
- Large dependencies
- No hooks (except React built-ins)

**NOT Allowed in Server Components:**
- State (useState, useReducer)
- Effects (useEffect)
- Event listeners (onClick, onChange)
- Browser APIs (window, localStorage)

### Client Component Markers

```tsx
"use client"; // Must be at top of file

// Then component code
export function ClientComponent() {
  // Can use hooks, state, events
}
```

### Dynamic Imports (for WebGL/heavy components)

```tsx
import dynamic from "next/dynamic";

export const WaterEffects = dynamic(
  () => import("./WaterCanvas").then((mod) => mod.WaterCanvas),
  {
    ssr: false,           // Never render on server
    loading: () => null,  // No loading UI
  }
);
```

### Mobile Detection Hook

```tsx
// In component
const isMobile = useIsMobile();

if (!isMobile) {
  // Desktop-only render
}
```

## Three.js / WebGL Patterns

### Material Uniforms

```tsx
const shaderMaterial = useMemo(() => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRippleMap: { value: null },
      uDistortionStrength: { value: 0.02 },
      uTime: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
}, []);

// Update in useFrame
useFrame((state) => {
  materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  materialRef.current.uniforms.uRippleMap.value = rippleTexture;
});
```

### Canvas Textures

```tsx
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d");

const texture = new THREE.CanvasTexture(canvas);
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;

// Update texture
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, 256, 256);
texture.needsUpdate = true; // Mark for GPU sync
```

### Cleanup & Memory Management

```tsx
useEffect(() => {
  const texture = new THREE.CanvasTexture(canvas);

  return () => {
    texture.dispose(); // Free GPU memory
    // material.dispose() if needed
    // geometry.dispose() if needed
  };
}, []);
```

## Performance Guidelines

### Rendering

- **60 FPS target:** ~16.67ms per frame
- **Mobile demand frameloop:** Pause rendering when idle
- **useFrame over setInterval:** Synchronized with browser refresh
- **Avoid state updates in useFrame:** Use refs instead

### Memory

- **Texture pooling:** Reuse canvas texture, not recreation
- **Ripple array shifting:** Avoid array spread/concat (O(n))
- **Memoize heavy objects:** useMemo for ShaderMaterial, etc.
- **Cleanup listeners:** useEffect cleanup (event listeners, subscriptions)

### Canvas Operations

- **Avoid full clears:** Fade previous frame with low-opacity overlay
- **Batch draws:** One gradient fill per ripple instead of multiple
- **DPR optimization:** `dpr={[1, 2]}` on desktop, `dpr={1}` on mobile

## Code Review Checklist

### Before Committing

- [ ] TypeScript: `tsc --noEmit` passes
- [ ] Linting: `eslint . --fix` passes
- [ ] Props/functions have JSDoc comments
- [ ] No `any` types
- [ ] useEffect cleanup functions complete
- [ ] Mobile responsive (test on mobile view)
- [ ] prefers-reduced-motion tested
- [ ] No console.log/debugger left

### Before Merge

- [ ] Tests pass (if applicable)
- [ ] No memory leaks (DevTools profiler)
- [ ] Performance >= 60 FPS
- [ ] Accessibility check (a11y)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

## File Header Template

```tsx
"use client"; // or remove if Server Component

/**
 * [Brief description of file purpose]
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * @example
 * // Usage example here
 */

import { SomeImport } from "some-package";

// Rest of file...
```

## Import Organization

```tsx
// 1. External packages
import { useState, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// 2. Internal absolute imports
import { useMousePosition } from "@/hooks/useMousePosition";
import { WaterPlane } from "./WaterPlane";

// 3. Types
import type { MousePosition } from "@/types/mouse";

// 4. Styles (if any)
import "./component.css";
```

## Accessibility Standards

### Color Contrast

- **WCAG AA minimum:** 4.5:1 for normal text, 3:1 for large text
- Test with: https://contrastchecker.com

### Motion

```tsx
// Check prefers-reduced-motion
const prefersReducedMotion = useSyncExternalStore(
  subscribeToReducedMotion,
  getSnapshot,
  getServerSnapshot
);

if (prefersReducedMotion) {
  return null; // Return null, not visible placeholder
}
```

### ARIA Labels

```tsx
<div
  className="fixed inset-0 z-0 pointer-events-none"
  aria-hidden="true"
  role="presentation"
/>
```

## Documentation Requirements

### JSDoc for public exports

```tsx
/**
 * Tracks normalized mouse position (0-1) with WebGL Y-axis flip.
 * Returns isActive: false when cursor leaves window.
 *
 * @returns MousePosition object with x, y (0-1), isActive
 *
 * @example
 * const { x, y, isActive } = useMousePosition();
 */
export function useMousePosition(): MousePosition {
  // Implementation
}
```

### README.md in feature folders (optional)

```markdown
# Water Effects

Ripple tracking system with Three.js water shader.

## Components
- WaterCanvas: Main R3F wrapper
- WaterPlane: Shader material mesh

## Hooks
- useRippleCanvas: Texture management
- useMousePosition: Cursor tracking
```

## Version Control

### Commit Message Format

```
type: subject

Body explanation (optional)

type: feat|fix|refactor|docs|test|perf|ci
subject: < 50 chars, imperative, lowercase
body: detailed explanation, wrapped at 72 chars
```

### Branch Naming

```
feature/water-effects
fix/ripple-decay
refactor/shader-uniforms
```

## Testing Strategy

### Unit Tests (if applicable)

```tsx
describe("useMousePosition", () => {
  it("should return normalized coordinates", () => {
    // Test logic
  });
});
```

### E2E Tests

- Ripple appears on click
- Cursor trail follows mouse
- Mobile detection works
- SSR safe (no hydration mismatch)

## Performance Budgets

| Metric | Target | Monitor |
|--------|--------|---------|
| FCP (First Contentful Paint) | < 2.5s | Lighthouse |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| Frame rate | >= 60 FPS | Chrome DevTools |
| Water canvas update | < 5ms | Performance API |
| Ripple pool memory | < 2MB | Chrome DevTools Memory |
