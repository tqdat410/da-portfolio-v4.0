# WebGL Water Ripple Shader Research
**Date:** 2026-01-11 | **Focus:** Ping-pong buffers, Three.js integration, distortion, performance

---

## 1. Ping-Pong Buffer Technique for Wave Simulation

### Core Concept
Ping-pong buffers solve GPU texture read-write conflict: GLSL shaders can't read AND write to same texture in one pass. Solution = alternate between two framebuffer objects (FBOs).

**Pattern:**
```glsl
// Frame N: Read from texture A → Write to texture B
// Frame N+1: Read from texture B → Write to texture A
// Continuous ping-pong allows iterative computation
```

### Wave Equation Implementation
For pressure-velocity wave simulation:

```glsl
// Simulation Fragment Shader (simplified)
uniform sampler2D uPreviousHeight;    // Previous frame height
uniform sampler2D uCurrentHeight;     // Current frame height
uniform float uDamping;               // Energy loss (0.99)
uniform float uWaveSpeed;             // Propagation speed

void main() {
  vec2 uv = vUv;
  float texelSize = 1.0 / 256.0;

  // Laplacian (neighboring heights)
  float left = texture2D(uCurrentHeight, uv - vec2(texelSize, 0.0)).r;
  float right = texture2D(uCurrentHeight, uv + vec2(texelSize, 0.0)).r;
  float up = texture2D(uCurrentHeight, uv - vec2(0.0, texelSize)).r;
  float down = texture2D(uCurrentHeight, uv + vec2(0.0, texelSize)).r;
  float center = texture2D(uCurrentHeight, uv).r;

  // Wave equation: y(t+1) = 2*y(t) - y(t-1) + c²*∇²y
  float laplacian = (left + right + up + down - 4.0 * center);
  float newHeight = 2.0 * center
                  - texture2D(uPreviousHeight, uv).r
                  + uWaveSpeed * laplacian;

  gl_FragColor = vec4(newHeight * uDamping);
}
```

### Three.js FBO Setup
```typescript
const renderTarget1 = new THREE.WebGLRenderTarget(256, 256, {
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter
});
const renderTarget2 = new THREE.WebGLRenderTarget(256, 256, {
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter
});

// Swap each frame
[renderTarget1, renderTarget2] = [renderTarget2, renderTarget1];
```

**References:**
- [Ping Pong Approach Observable](https://observablehq.com/@spattana/ping-pong-approach-for-progressive-rendering)
- [Conway's Game of Life – Renderbuffers in Three.js](https://tympanus.net/codrops/2022/11/25/conways-game-of-life-cellular-automata-and-renderbuffers-in-three-js/)

---

## 2. React Three Fiber + Three.js Water Shader Best Practices

### Material Declaration Pattern
Use `extend()` + declarative JSX for cleaner shader integration:

```typescript
import { useFrame, extend } from '@react-three/fiber';
import { ShaderMaterial } from 'three';

extend({ ShaderMaterial });

export function WaterMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[width, height, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uRippleMap: { value: renderTarget.texture },
          uDistortionStrength: { value: 0.05 },
          uTime: { value: 0 }
        }}
        vertexShader={vertexCode}
        fragmentShader={fragmentCode}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
```

### Post-Processing Distortion Approach
For fullscreen effects (vs. mesh-based):
- Render ripple simulation to canvas texture
- Apply canvas as distortion map in post-processing pass
- Cheaper than per-geometry calculations

**Current codebase approach:** Uses `WaterPlane` component with render target texture from canvas simulation. Effective for static surface with interactive ripples.

**References:**
- [React Three Fiber: Fluid Distortion](https://github.com/whatisjery/react-fluid-distortion)
- [Water Surface Component](https://github.com/nhtoby311/WaterSurface)

---

## 3. Canvas Texture Distortion for Text Under Water

### Refraction Mapping Technique
Du/Dv distortion maps encode x,y offsets simulating waves:

```glsl
// Render Shader Fragment
uniform sampler2D uContentTexture;    // Canvas/text underneath
uniform sampler2D uNormalMap;         // Du/Dv wave offsets
uniform float uDistortionAmount;
uniform float uTime;

void main() {
  vec2 uv = vUv;

  // Sample normal/distortion map
  vec4 normal = texture2D(uNormalMap, uv + uTime * 0.05);
  vec2 distortion = (normal.rg - 0.5) * 2.0 * uDistortionAmount;

  // Distort UVs before sampling content
  vec2 distortedUv = uv + distortion;
  vec4 content = texture2D(uContentTexture, distortedUv);

  // Fresnel blending (more reflection at edges)
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.5);

  gl_FragColor = content;
}
```

### Key Variables
- **Normal Map Resolution:** 256×256 minimum (higher = finer ripples)
- **Distortion Strength:** 0.03–0.08 (0.05 typical for subtle glass effect)
- **Damping Factor:** 0.99 (energy loss per frame)

**Caustics Enhancement:**
Multiply content by caustic pattern (animated checkerboard or perlin noise) for underwater light patterns.

**References:**
- [Advanced WebGL Refraction Simulation](https://beclamide.medium.com/advanced-realtime-glass-refraction-simulation-with-webgl-71bdce7ab825)
- [Real-time Water Caustics](https://medium.com/@martinRenou/real-time-rendering-of-water-caustics-59cda1d74aa)

---

## 4. Performance Optimization for Fullscreen Shader Effects

### Critical Optimization Strategies

**Texture Resolution Tier System:**
```typescript
// Desktop: 512×512, Mobile: 256×256, Low-end: 128×128
const resolutions = {
  desktop: 512,
  mobile: 256,
  lowEnd: 128
};

const targetResolution = isMobile ? resolutions.mobile : resolutions.desktop;
const renderTarget = new THREE.WebGLRenderTarget(
  targetResolution, targetResolution,
  { format: THREE.RGBAFormat, type: THREE.HalfFloatType } // HalfFloat saves bandwidth
);
```

**Simulation Pass Reduction:**
- Run wave simulation every 1–2 frames (skip odd frames)
- Use lower resolution for simulation (256), upscale for render
- Implement LOD based on viewport size

**Shader Optimization Checklist:**
- ✅ Use `lowp/mediump` precision on mobile (fragment shader)
- ✅ Minimize texture lookups (combine into single pass if possible)
- ✅ Avoid branching in fragment shaders
- ✅ Use `varying` instead of recalculating per-pixel
- ✅ Clamp Laplacian calculations (prevent NaN artifacts)

**Batching & Culling:**
- Disable shader on viewport exits
- Use `useFrame` with conditional updates
- Leverage Three.js frustum culling for multi-object scenes

### Benchmarks
- **256×256 simulation @ 60fps:** ~2ms GPU time (desktop)
- **512×512 with caustics @ 60fps:** ~5ms GPU time (high-end)
- **Mobile (256×256):** Target 16ms per frame (60fps)

**References:**
- [WebGL Water Tutorial](https://www.chinedufn.com/3d-webgl-basic-water-tutorial/)
- [Water Simulation Pressure-based](https://github.com/MauriceGit/Water_Simulation)

---

## Summary

| Component | Pattern | Notes |
|-----------|---------|-------|
| **Simulation** | Ping-pong FBOs + wave equation | 256×256 sufficient, downsample if needed |
| **Rendering** | Distortion shader + Fresnel | Normal map-based (Du/Dv) texture offsets |
| **Integration** | React Three Fiber `useFrame` hook | Update uniforms each frame, swap targets |
| **Canvas Distortion** | UV offset via normal sampling | 0.05 distortion strength, add fresnel |
| **Performance** | Half-float textures, LOD, frame skip | Mobile: 256×256, Desktop: 512×512 |

---

## Unresolved Questions

1. Should simulation run at fixed timestep vs. frame-dependent? (stability vs. frame-rate variance)
2. Optimal damping factor for "water" vs. "gelatin" feel? (user-specific preference)
3. How to handle caustics without additional texture pass? (combine into render shader?)
