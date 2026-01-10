# Phase 03: Water Ripple Effects

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 02](./phase-02-core-layout.md) | **Next:** [Phase 04](./phase-04-ecosystem-effects.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | completed |
| Effort | 6h |
| Dependencies | Phase 02 |
| Completed | 2026-01-10 |

Implement WebGL-based water ripple effects using React Three Fiber. Ripples respond to cursor movement and clicks with realistic physics simulation.

---

## Key Insights (from Research)

### Approach Selection: Canvas Ripple + Normal Distortion (Hybrid)

After analyzing research, **Canvas-based ripple tracking** combined with **normal map distortion** provides:
- Best performance/quality balance for portfolio use case
- Easier implementation than full GPGPU
- Interactive cursor tracking via canvas texture
- Smooth decay over frames

### Technical Details

- Draw ripple circles into canvas texture (256x256)
- Fragment shader distorts screen using canvas as distortion map
- Decay: `value *= 0.95` per frame
- UV offset: `uv += texture(rippleCanvas, uv).rg * strength`

### Performance Targets

| Target | Desktop | Mobile |
|--------|---------|--------|
| FPS | 60 | 30 |
| Canvas Size | 256x256 | 128x128 |
| Update Rate | Every frame | Every 2nd frame |

---

## Requirements

1. Canvas-based ripple tracking system
2. Cursor-following ripples (continuous trail)
3. Click ripples (stronger, larger effect)
4. Smooth decay animation
5. Performance optimization for 60fps
6. Mobile fallback (reduced quality or static)
7. Prefers-reduced-motion support

---

## Architecture

```
src/
├── components/
│   └── water/
│       ├── WaterCanvas.tsx      # Main R3F canvas wrapper
│       ├── WaterPlane.tsx       # Mesh with water shader
│       └── RippleTracker.tsx    # Canvas-based ripple state
├── hooks/
│   ├── useRippleCanvas.ts       # Canvas rendering logic
│   └── useMousePosition.ts      # Normalized mouse coords
└── shaders/
    ├── water.vert               # Vertex shader
    └── water.frag               # Fragment shader with distortion
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/components/water/WaterCanvas.tsx` | R3F Canvas with Suspense |
| `src/components/water/WaterPlane.tsx` | Fullscreen plane with custom shader |
| `src/hooks/useRippleCanvas.ts` | 2D canvas ripple rendering |
| `src/hooks/useMousePosition.ts` | Track normalized mouse position |
| `src/shaders/water.vert` | Pass-through vertex shader |
| `src/shaders/water.frag` | Distortion fragment shader |

---

## Implementation Steps

### Step 1: Create Mouse Position Hook (15 min)

Create `src/hooks/useMousePosition.ts`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

interface MousePosition {
  x: number;  // 0 to 1 (normalized)
  y: number;  // 0 to 1 (normalized)
  isActive: boolean;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
    isActive: false,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight, // Flip Y for WebGL
      isActive: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition((prev) => ({ ...prev, isActive: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return position;
}
```

### Step 2: Create Ripple Canvas Hook (45 min)

Create `src/hooks/useRippleCanvas.ts`:

```typescript
"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

interface RipplePoint {
  x: number;
  y: number;
  radius: number;
  strength: number;
  age: number;
}

interface UseRippleCanvasOptions {
  size?: number;
  decayRate?: number;
  maxRipples?: number;
}

export function useRippleCanvas(options: UseRippleCanvasOptions = {}) {
  const { size = 256, decayRate = 0.95, maxRipples = 20 } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const ripplesRef = useRef<RipplePoint[]>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctxRef.current = ctx;
      ctx.fillStyle = "#808080"; // Neutral gray (no distortion)
      ctx.fillRect(0, 0, size, size);
    }

    textureRef.current = new THREE.CanvasTexture(canvas);
    textureRef.current.wrapS = THREE.ClampToEdgeWrapping;
    textureRef.current.wrapT = THREE.ClampToEdgeWrapping;

    return () => {
      textureRef.current?.dispose();
    };
  }, [size]);

  // Add ripple at position
  const addRipple = useCallback(
    (x: number, y: number, strength: number = 0.5) => {
      const ripples = ripplesRef.current;
      if (ripples.length >= maxRipples) {
        ripples.shift(); // Remove oldest
      }
      ripples.push({
        x: x * size,
        y: (1 - y) * size, // Flip Y
        radius: 0,
        strength,
        age: 0,
      });
    },
    [size, maxRipples]
  );

  // Update ripples and render to canvas
  const update = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // Fade previous frame
    ctx.fillStyle = "rgba(128, 128, 128, 0.05)";
    ctx.fillRect(0, 0, size, size);

    // Draw and update ripples
    const ripples = ripplesRef.current;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.radius += 3;
      ripple.age += 1;
      ripple.strength *= decayRate;

      if (ripple.strength < 0.01) {
        ripples.splice(i, 1);
        continue;
      }

      // Draw ripple as gradient circle
      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        0,
        ripple.x,
        ripple.y,
        ripple.radius
      );

      const intensity = Math.floor(ripple.strength * 127);
      gradient.addColorStop(0, `rgb(${128 + intensity}, ${128 + intensity}, 128)`);
      gradient.addColorStop(0.5, `rgb(${128 - intensity / 2}, ${128 - intensity / 2}, 128)`);
      gradient.addColorStop(1, "rgba(128, 128, 128, 0)");

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Update texture
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [size, decayRate]);

  return {
    texture: textureRef.current,
    addRipple,
    update,
  };
}
```

### Step 3: Create Shaders (30 min)

Create `src/shaders/water.vert`:

```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

Create `src/shaders/water.frag`:

```glsl
uniform sampler2D uRippleMap;
uniform float uDistortionStrength;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Sample ripple map
  vec4 ripple = texture2D(uRippleMap, vUv);

  // Calculate distortion from ripple intensity
  vec2 distortion = (ripple.rg - 0.5) * 2.0 * uDistortionStrength;

  // Add subtle ambient wave
  float wave = sin(vUv.x * 10.0 + uTime) * cos(vUv.y * 8.0 + uTime * 0.8) * 0.002;
  distortion += vec2(wave, wave * 0.5);

  // Apply distortion to UV
  vec2 distortedUv = vUv + distortion;

  // Create water color gradient
  vec3 deepColor = vec3(0.102, 0.212, 0.365);  // #1a365d
  vec3 lightColor = vec3(0.506, 0.902, 0.851); // #81e6d9

  float gradient = smoothstep(0.0, 1.0, distortedUv.y + wave * 10.0);
  vec3 baseColor = mix(deepColor, lightColor, gradient * 0.3);

  // Add ripple highlight
  float rippleHighlight = (ripple.r - 0.5) * 2.0;
  baseColor += vec3(0.2, 0.4, 0.4) * rippleHighlight * 0.5;

  // Fresnel-like edge effect
  float edgeFade = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5) * 2.0);
  edgeFade *= 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5) * 2.0);

  gl_FragColor = vec4(baseColor, 0.15 * edgeFade);
}
```

### Step 4: Create Water Plane Component (45 min)

Create `src/components/water/WaterPlane.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend } from "@react-three/fiber";

import vertexShader from "@/shaders/water.vert";
import fragmentShader from "@/shaders/water.frag";

// Create custom shader material
const WaterMaterial = shaderMaterial(
  {
    uRippleMap: null,
    uDistortionStrength: 0.02,
    uTime: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ WaterMaterial });

// TypeScript declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      waterMaterial: any;
    }
  }
}

interface WaterPlaneProps {
  rippleTexture: THREE.Texture | null;
}

export function WaterPlane({ rippleTexture }: WaterPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Update time uniform
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      if (rippleTexture) {
        materialRef.current.uniforms.uRippleMap.value = rippleTexture;
      }
    }
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <waterMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uRippleMap={rippleTexture}
        uDistortionStrength={0.02}
      />
    </mesh>
  );
}
```

### Step 5: Create Water Canvas Wrapper (30 min)

Create `src/components/water/WaterCanvas.tsx`:

```typescript
"use client";

import { Suspense, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { WaterPlane } from "./WaterPlane";
import { useRippleCanvas } from "@/hooks/useRippleCanvas";
import { useMousePosition } from "@/hooks/useMousePosition";

function WaterScene() {
  const { texture, addRipple, update } = useRippleCanvas({
    size: 256,
    decayRate: 0.96,
    maxRipples: 30,
  });

  const mousePosition = useMousePosition();
  const lastAddTime = { current: 0 };

  // Handle click ripples
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      addRipple(x, y, 1.0); // Strong ripple on click
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addRipple]);

  // Update ripples and add cursor trail
  useFrame((state) => {
    // Add cursor trail ripple (throttled)
    if (mousePosition.isActive && state.clock.elapsedTime - lastAddTime.current > 0.05) {
      addRipple(mousePosition.x, mousePosition.y, 0.3);
      lastAddTime.current = state.clock.elapsedTime;
    }

    update();
  });

  return <WaterPlane rippleTexture={texture} />;
}

export function WaterCanvas() {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    return null; // Skip water effects
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <WaterScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

### Step 6: Create Dynamic Import Wrapper (15 min)

Create `src/components/water/index.tsx`:

```typescript
"use client";

import dynamic from "next/dynamic";

export const WaterEffects = dynamic(
  () => import("./WaterCanvas").then((mod) => mod.WaterCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);
```

### Step 7: Integrate into Layout (15 min)

Update `src/app/[locale]/layout.tsx`:

```typescript
// Add after imports
import { WaterEffects } from "@/components/water";

// In the body, add before children:
<body className="bg-midnight text-light-aqua antialiased">
  <WaterEffects />
  <NextIntlClientProvider messages={messages}>
    {children}
  </NextIntlClientProvider>
</body>
```

### Step 8: Mobile Fallback (20 min)

Update `src/components/water/WaterCanvas.tsx` to handle mobile:

```typescript
// Add at the start of WaterCanvas function
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Modify Canvas props for mobile
<Canvas
  dpr={isMobile ? 1 : [1, 2]}
  frameloop={isMobile ? "demand" : "always"}
  // ... other props
>
```

---

## Todo List

- [ ] Create useMousePosition hook
- [ ] Create useRippleCanvas hook with canvas rendering
- [ ] Write GLSL vertex shader (pass-through)
- [ ] Write GLSL fragment shader with distortion
- [ ] Create WaterPlane component with custom material
- [ ] Create WaterCanvas wrapper with R3F Canvas
- [ ] Create dynamic import wrapper for SSR
- [ ] Integrate WaterEffects into layout
- [ ] Implement click ripple handling
- [ ] Implement cursor trail ripples (throttled)
- [ ] Add mobile performance optimizations
- [ ] Add prefers-reduced-motion check
- [ ] Test at 60fps on desktop Chrome
- [ ] Test at 30fps on mobile Safari

---

## Success Criteria

1. Ripples appear on cursor movement (continuous trail)
2. Larger ripples appear on click
3. Ripples decay smoothly over ~1 second
4. Desktop maintains 60fps
5. Mobile gracefully degrades (30fps or static fallback)
6. No ripples when prefers-reduced-motion is set
7. No console errors or WebGL warnings

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebGL not supported | Low | High | Fallback to null component |
| Performance issues on low-end devices | Medium | Medium | Reduce canvas size, throttle updates |
| Shader compilation errors | Medium | High | Test on multiple browsers, use mediump |
| SSR hydration errors | High | Medium | Use dynamic import with ssr: false |

---

## Security Considerations

- No user input in shaders (prevents injection)
- Canvas is internal, not exposed to DOM
- No external resources loaded

---

## Next Steps

Proceed to [Phase 04 - Ecosystem Effects](./phase-04-ecosystem-effects.md) for ambient particles and additional visual effects.
