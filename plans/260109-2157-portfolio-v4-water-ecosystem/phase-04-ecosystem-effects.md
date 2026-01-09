# Phase 04: Ecosystem Effects

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 03](./phase-03-water-effects.md) | **Next:** [Phase 05](./phase-05-navbar-effects.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Status | pending |
| Effort | 5h |
| Dependencies | Phase 03 |

Implement ambient ecosystem effects: floating particles, subtle reflections, and background waves to create a cohesive underwater atmosphere.

---

## Key Insights (from Research)

### Ambient Particles
- Use `THREE.Points` with custom ShaderMaterial
- Perlin/Simplex noise for organic drift
- Time-based animation: `sin(uTime + position.x) * amplitude`
- 2000-5000 particles for ambient effect
- Soft edges: discard fragments beyond 0.5 from center

### Background Waves
- Animated UV scrolling: `uv += wave_animation * uTime`
- Low-frequency sine wave displacement
- Large-scale normal maps for subtle movement

### Harmonic Integration
- All effects share single `uTime` uniform
- Unified color palette
- Staggered animation phases (offset by 0.2s)

---

## Requirements

1. Floating particle system (2000-3000 particles)
2. Organic drift movement using noise
3. Particles fade near edges of viewport
4. Subtle background wave animation
5. Color harmony with water palette
6. Performance: maintain 60fps on desktop
7. Mobile: reduce to 500 particles or disable

---

## Architecture

```
src/components/
├── particles/
│   ├── AmbientParticles.tsx   # Main particle system
│   └── ParticleShader.ts      # Custom shader material
├── water/
│   └── BackgroundWaves.tsx    # Subtle wave layer
└── effects/
    └── EcosystemLayer.tsx     # Combined effects wrapper
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/components/particles/AmbientParticles.tsx` | THREE.Points particle system |
| `src/components/particles/ParticleShader.ts` | Custom vertex/fragment shaders |
| `src/components/water/BackgroundWaves.tsx` | Animated wave background |
| `src/components/effects/EcosystemLayer.tsx` | Combines all ecosystem effects |
| `src/shaders/particles.vert` | Particle vertex shader |
| `src/shaders/particles.frag` | Particle fragment shader |

---

## Implementation Steps

### Step 1: Create Particle Shader (30 min)

Create `src/shaders/particles.vert`:

```glsl
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

// Simplex noise function (simplified)
float noise(vec3 p) {
  return sin(p.x * 1.5) * cos(p.y * 1.3) * sin(p.z * 1.1);
}

void main() {
  vec3 pos = position;

  // Organic drift using noise
  float noiseX = noise(pos + vec3(uTime * 0.1, 0.0, 0.0));
  float noiseY = noise(pos + vec3(0.0, uTime * 0.15, 0.0));
  float noiseZ = noise(pos + vec3(0.0, 0.0, uTime * 0.08));

  pos.x += sin(uTime * 0.5 + aPhase) * 0.3 + noiseX * 0.5;
  pos.y += cos(uTime * 0.3 + aPhase * 1.3) * 0.2 + noiseY * 0.3;
  pos.z += sin(uTime * 0.2 + aPhase * 0.7) * 0.1 + noiseZ * 0.2;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);

  // Fade based on depth and position
  float distanceFromCenter = length(position.xy) / 10.0;
  vAlpha = smoothstep(1.0, 0.3, distanceFromCenter) * 0.6;
}
```

Create `src/shaders/particles.frag`:

```glsl
uniform vec3 uColor;

varying float vAlpha;

void main() {
  // Circular particle shape
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  if (distanceToCenter > 0.5) discard;

  // Soft edge
  float alpha = smoothstep(0.5, 0.2, distanceToCenter) * vAlpha;

  gl_FragColor = vec4(uColor, alpha);
}
```

### Step 2: Create Particle System Component (45 min)

Create `src/components/particles/AmbientParticles.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import vertexShader from "@/shaders/particles.vert";
import fragmentShader from "@/shaders/particles.frag";

interface AmbientParticlesProps {
  count?: number;
  size?: number;
  color?: string;
}

export function AmbientParticles({
  count = 2000,
  size = 30,
  color = "#81e6d9",
}: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate particle positions and attributes
  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute in a large volume
      positions[i3] = (Math.random() - 0.5) * viewport.width * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 5 - 2;

      scales[i] = Math.random() * 0.8 + 0.2;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, scales, phases };
  }, [count, viewport]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [size, color]);

  // Animate
  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={count}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}
```

### Step 3: Create Background Waves Component (30 min)

Create `src/components/water/BackgroundWaves.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const waveVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const waveFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying vec2 vUv;

  void main() {
    // Multiple wave layers
    float wave1 = sin(vUv.x * 3.0 + uTime * 0.5) * 0.5 + 0.5;
    float wave2 = sin(vUv.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
    float wave3 = sin((vUv.x + vUv.y) * 4.0 + uTime * 0.4) * 0.5 + 0.5;

    float combinedWave = (wave1 + wave2 + wave3) / 3.0;

    // Gradient from bottom to top
    float gradient = vUv.y * 0.5 + 0.3;

    vec3 color = mix(uColorA, uColorB, combinedWave * gradient);

    // Very subtle effect
    gl_FragColor = vec4(color, 0.08);
  }
`;

export function BackgroundWaves() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color("#0a0a0a") },
        uColorB: { value: new THREE.Color("#1a365d") },
      },
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]} material={material}>
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 1, 1]} />
    </mesh>
  );
}
```

### Step 4: Create Ecosystem Layer (20 min)

Create `src/components/effects/EcosystemLayer.tsx`:

```typescript
"use client";

import { Suspense } from "react";
import { AmbientParticles } from "@/components/particles/AmbientParticles";
import { BackgroundWaves } from "@/components/water/BackgroundWaves";

interface EcosystemLayerProps {
  isMobile?: boolean;
}

export function EcosystemLayer({ isMobile = false }: EcosystemLayerProps) {
  // Reduce effects on mobile
  const particleCount = isMobile ? 500 : 2000;

  return (
    <Suspense fallback={null}>
      <BackgroundWaves />
      <AmbientParticles
        count={particleCount}
        size={isMobile ? 20 : 30}
        color="#81e6d9"
      />
      {/* Secondary particle layer for depth */}
      {!isMobile && (
        <AmbientParticles
          count={500}
          size={15}
          color="#b2f5ea"
        />
      )}
    </Suspense>
  );
}
```

### Step 5: Integrate with Water Canvas (20 min)

Update `src/components/water/WaterCanvas.tsx`:

```typescript
// Add import
import { EcosystemLayer } from "@/components/effects/EcosystemLayer";

// In WaterScene function, add after WaterPlane:
function WaterScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // ... existing ripple code ...

  return (
    <>
      <EcosystemLayer isMobile={isMobile} />
      <WaterPlane rippleTexture={texture} />
    </>
  );
}
```

### Step 6: Add Subtle Caustics Effect (Optional) (30 min)

Create `src/components/effects/Caustics.tsx`:

```typescript
"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const causticsShader = `
  uniform float uTime;
  uniform vec3 uColor;

  varying vec2 vUv;

  float caustic(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    float c = 0.0;

    for(float i = 1.0; i < 4.0; i++) {
      float t = time * (0.3 / i);
      vec2 offset = vec2(sin(t), cos(t * 0.7)) * i;
      c += 1.0 / length(fract(p + offset) - 0.5);
    }

    return c / 3.0;
  }

  void main() {
    float c = caustic(vUv, uTime);
    c = smoothstep(0.8, 2.0, c);

    gl_FragColor = vec4(uColor * c, c * 0.1);
  }
`;

export function Caustics() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={causticsShader}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#81e6d9") },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
```

### Step 7: Performance Monitoring (15 min)

Create `src/hooks/usePerformanceMonitor.ts`:

```typescript
"use client";

import { useEffect, useState } from "react";

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [shouldReduceEffects, setShouldReduceEffects] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;

    const measureFps = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const currentFps = frameCount;
        setFps(currentFps);
        frameCount = 0;
        lastTime = currentTime;

        // Track low FPS periods
        if (currentFps < 30) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            setShouldReduceEffects(true);
          }
        } else {
          lowFpsCount = Math.max(0, lowFpsCount - 1);
        }
      }

      requestAnimationFrame(measureFps);
    };

    const rafId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return { fps, shouldReduceEffects };
}
```

---

## Todo List

- [ ] Create particle vertex shader with noise-based drift
- [ ] Create particle fragment shader with soft edges
- [ ] Create AmbientParticles component
- [ ] Create BackgroundWaves component
- [ ] Create EcosystemLayer wrapper
- [ ] Integrate ecosystem effects into WaterCanvas
- [ ] Add caustics effect (optional)
- [ ] Create performance monitoring hook
- [ ] Test particle count optimization (2000 desktop, 500 mobile)
- [ ] Verify additive blending looks correct
- [ ] Test on low-end devices
- [ ] Ensure 60fps maintained with all effects

---

## Success Criteria

1. Particles float organically with smooth movement
2. Background waves create subtle underwater atmosphere
3. All effects harmonize with water ripple layer
4. Desktop maintains 60fps with 2000+ particles
5. Mobile gracefully degrades to 500 particles
6. Colors match ecosystem palette
7. No z-fighting or visual artifacts

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Too many draw calls | Medium | High | Batch particles into single Points object |
| Shader compilation slow | Low | Medium | Keep shaders simple, avoid loops |
| Memory leak from particles | Low | High | Dispose geometries/materials on unmount |
| Visual clutter | Medium | Medium | Keep opacity low (0.05-0.15) |

---

## Security Considerations

- No user input in shaders
- All assets are generated procedurally
- No external resources loaded

---

## Next Steps

Proceed to [Phase 05 - Navbar Effects](./phase-05-navbar-effects.md) for light beam animations on the navigation bar.
