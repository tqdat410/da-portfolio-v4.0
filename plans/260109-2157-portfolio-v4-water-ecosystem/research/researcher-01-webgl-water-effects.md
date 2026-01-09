# WebGL/Three.js Water Ripple Effects Research

**Date:** 2026-01-09 | **Project:** DaPortfolio v4.0 Water Ecosystem

---

## Executive Summary

Water ripple effects in WebGL are achievable via three primary approaches: (1) **heightmap simulation** using GPGPU texture feedback, (2) **normal map distortion** for lightweight reflections/refractions, (3) **postprocessing with canvas-based ripple tracking**. React Three Fiber integrates seamlessly; performance targets of 60fps desktop / 30fps mobile are attainable with proper optimization.

---

## 1. Water Ripple Shader Techniques

### Best Approaches

**A. GPGPU Height Field Simulation (Realistic)**
- Uses `GPUComputationRenderer` (Three.js built-in utility)
- Ping-pong texture feedback: two render targets alternate per frame
- Fragment shader samples 4 neighboring texels, calculates wave propagation
- Core formula: `newHeight = (neighbors / 2.0) - prevHeight`
- Apply damping (~0.99) to simulate energy loss
- Best for: ocean-like effects, interaction-heavy water
- Cost: ~128x128 to 256x256 heightmap (GPU-side computation)

**B. Normal Map Distortion (Fast)**
- Use animated/pre-baked normal maps to distort UV coordinates
- DuDv mapping: red/green channels offset U/V texture reads
- Implements Fresnel effect via dot product (view direction vs normal)
- Optional: RGB caustics layer for caustic patterns
- Best for: subtle water surfaces, mobile, real-time reflections
- Cost: 2-3 texture lookups per fragment

**C. Postprocessing Canvas Ripple (Interactive)**
- Draw ripple circles into canvas texture via cursor/click
- Fragment shader distorts screen texture using canvas as distortion map
- Simplest to implement, no physics simulation needed
- Best for: interactive backgrounds, UI elements
- Cost: single texture lookup + canvas drawing (CPU)

### Cursor & Click Ripples

**Implementation Pattern:**
```glsl
// Height field shader receives ripple source
uniform vec2 mousePos;
uniform float mouseSize;

float rippleEffect = exp(-distance(uv, mousePos) / mouseSize);
newHeight += rippleEffect * force;
```

**Mouse tracking (JS):**
- Store mouse position in uniform
- On click: trigger ripple via temporary position uniform or texture write
- Update each frame via `requestAnimationFrame`

---

## 2. React Three Fiber Integration

### Recommended Approach

**Use `extend` + custom materials:**
```javascript
import { extend } from '@react-three/fiber'
import { ShaderMaterial } from 'three'

extend({ WaterMaterial: ShaderMaterial })
```

**Key Libraries:**
- `@react-three/drei`: provides `shaderMaterial` helper
- `three-custom-shader-material`: extend existing materials with custom shaders
- `@react-three/postprocessing`: postprocessing integration

### Performance Optimization

**Desktop (60fps):**
- Heightmap resolution: 128x128 to 256x256
- Vertex subdivisions: ~10k-20k
- Enable frustum culling on geometry
- Use `renderer.setPixelRatio(window.devicePixelRatio)` OR cap at 1 for high-DPI

**Mobile (30fps acceptable):**
- Reduce heightmap to 64x64
- Lower vertex count: ~2k subdivisions
- Use `renderer.setPixelRatio(1)` (disable HDPI scaling)
- Simplify fragment shader: reduce texture lookups, use `mediump` precision
- Pre-bake normal maps instead of real-time generation
- Consider FXAA instead of MSAA

**Shared Strategies:**
- Use RenderTarget for reflections at 1/2 or 1/4 resolution
- Lazy load water component (dynamic import)
- Disable anti-aliasing on water material when possible
- Profile with Chrome DevTools / Safari Web Inspector (target 16.67ms/frame)

---

## 3. Full Ecosystem Effects

### Ambient Particles
- Create via `THREE.Points` with `PointsMaterial` or custom ShaderMaterial
- Use Perlin/Simplex noise in vertex shader for organic drift
- Time-based animation: `sin(uTime + position.x) * amplitude`
- Soft edges: discard fragments beyond 0.5 distance from center
- ~2000-5000 particles for ambient effect

### Water Reflections
- **Real-time reflection:** Render scene to RenderTarget from water surface perspective (expensive)
- **Cheaper:** Use reflected cubemap + normal map distortion
- **Fallback:** Static environment map with fresnel blending

### Background Subtle Waves
- Animated UV scrolling: `uv += wave_animation * uTime`
- Or: low-frequency sine wave displacement on background mesh
- Use large-scale normal maps (2k or 4k at web resolution)

### Harmonic Integration
- **Time synchronization:** All effects share single `uTime` uniform
- **Color harmony:** Unified color palette across water, particles, background
- **Staggered animation:** Offset particle phases by 0.2s to avoid synchronization artifacts

---

## 4. Performance Considerations

### GPU Optimization
- **Reduce render target resolutions** (1/4 screen for reflections)
- **Use compressed textures** (ETC2, ASTC on mobile)
- **Batch draw calls** via Three.js geometry merging
- **Disable depth write** on transparent water: `depthWrite: false`
- **Frustum culling:** Three.js automatic, but ensure geometry bounds correct

### Mobile Fallback Strategy
- Detect capability: `gl.getExtension('OES_texture_float')`
- Graceful degradation: static normal map only, no simulation
- Feature flags: low-end devices use UV scroll, high-end use GPGPU

### Profiling
- Chrome DevTools Performance tab: lock at 60fps target
- Use `THREE.Clock` + FPS counter to monitor
- Memory: watch WebGL texture memory (can exceed 100MB with large heightmaps)

---

## 5. Recommended Libraries & Examples

### Core Libraries
| Library | Purpose | Notes |
|---------|---------|-------|
| `@react-three/fiber` | React integration | Required |
| `@react-three/drei` | Helper utilities | `shaderMaterial`, `RenderTexture` |
| `three-custom-shader-material` | Material extension | Preserves lighting, shadows |
| `postprocessing` (pmndrs) | Post-processing effects | Canvas-based ripples, tone mapping |
| `@funtech-inc/use-shader-fx` | Shader utilities | Used in WaterSurface component |

### Existing Components & Examples
- **WaterSurface** (GitHub): Interactive R3F water with planar reflection
- **Official Three.js GPGPU Example**: `webgl_gpgpu_water.html` in examples folder
- **Codrops Tutorials**: Stylized water (2025), distortion effects (2019)
- **Water Simulation Demo** (Vercel): Full ecosystem with caustics, droplets

### Code Resources
- **CodeSandbox Examples:** water-shader, r3f-water-shader templates
- **GitHub PhysicsRenderer:** GPGPU utility for Three.js simulations
- **DuDv & Normal Map Techniques:** Valve Source Engine, RasterTek DirectX tutorials

---

## 6. Key Implementation Insights

**Texture Feedback Pattern** (GPGPU):
```glsl
// Heightmap update: read previous frame, compute neighbors, write new frame
float neighbors = (north + south + east + west) / 2.0;
float newHeight = neighbors - prevHeight;
gl_FragColor = vec4(newHeight, velocity, 0.0, 1.0);
```

**Normal Extraction** (Heightmap to Normal):
```glsl
// Sample 4 neighbors, compute partial derivatives
vec3 normal = normalize(vec3(
  height(uv + dx) - height(uv - dx),
  2.0,
  height(uv + dy) - height(uv - dy)
));
```

**Canvas Ripple Tracking** (Interactive):
- Store ripple positions in small canvas (~256x256)
- Decay over frames: `value *= 0.95` per frame
- Use as distortion input: `uv += texture(rippleCanvas, uv).rg * strength`

---

## 7. Performance Targets Summary

| Target | Desktop | Mobile | Notes |
|--------|---------|--------|-------|
| **FPS** | 60 | 30 | Min acceptable |
| **Heightmap Res** | 256x256 | 64x64 | GPGPU texture |
| **Vertex Count** | 20k | 2k | Plane subdivisions |
| **Texture Memory** | ~200MB | ~50MB | Estimate with all assets |
| **Frame Budget** | 16.67ms | 33ms | Per-frame time |

---

## Unresolved Questions

1. **Chromatic aberration on water refraction:** How to implement RGB separation for caustic effects while maintaining 60fps?
2. **Particle-water interaction:** Should particles sink/float based on water height field, or keep separate?
3. **Mobile WebGL2 requirement:** Will targeting WebGL 1.0 compatibility reduce effect quality significantly?
4. **Asset optimization:** Optimal normal map resolution for mobile (512x512 vs 1024x1024)?

---

## Sources

- [Codrops - Creating Stylized Water Effects with React Three Fiber](https://tympanus.net/codrops/2025/03/04/creating-stylized-water-effects-with-react-three-fiber/)
- [GitHub - WaterSurface Component](https://github.com/nhtoby311/WaterSurface)
- [Wawa Sensei - Water Shader Lesson](https://wawasensei.dev/courses/react-three-fiber/lessons/water-shader)
- [Medium - Realistic and Fast Water Waves (GPGPU)](https://franky-arkon-digital.medium.com/realistic-but-fast-water-waves-in-three-js-a48e2c9b0695)
- [Codrops - Water-like Distortion Effect](https://tympanus.net/codrops/2019/10/08/creating-a-water-like-distortion-effect-with-three-js/)
- [Medium - Interactive Effects with Shaders and R3F](https://medium.com/@alexandre.pujol/create-stunning-interactive-effects-with-shaders-and-react-three-fiber-88285ef8dffc)
- [Medium - Water Ripples with Vertex Shaders](https://medium.com/@joshmarinacci/water-ripples-with-vertex-shaders-6a9ecbdf091f)
- [Beings - Interactive Liquid Gradient Background](https://madebybeings.com/interactive-liquid-gradient-background-with-three-js-a-step-by-step-tutorial/)
- [Three.js Official Examples - GPGPU Water](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_gpgpu_water.html)
- [GitHub - pmndrs/drei](https://github.com/pmndrs/drei)
- [GitHub - pmndrs/postprocessing](https://github.com/pmndrs/postprocessing)
- [Water Simulation Demo (Vercel)](https://water-simulation.vercel.app/)
- [Valve Developer Wiki - Refract](https://developer.valvesoftware.com/wiki/Refract)
- [3D Game Shaders - Screen Space Refraction](https://lettier.github.io/3d-game-shaders-for-beginners/screen-space-refraction.html)
- [Maxime Heckel - The Study of Shaders with React Three Fiber](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/)

---

**Report Status:** ✅ Complete | Lines: 147 | Focus: Technical depth with concise execution paths
