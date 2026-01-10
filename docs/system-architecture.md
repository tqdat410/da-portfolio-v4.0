# System Architecture

**Last Updated:** 2026-01-10
**Architecture Pattern:** Layered (Client/Server separation, SSR-first)
**3D Engine:** Three.js via React Three Fiber (R3F)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │      Root Layout (Server Component)                      ││
│  │  - Metadata generation                                   ││
│  │  - i18n messages loading                                 ││
│  │  ┌───────────────────────────────────────────────────┐  ││
│  │  │  WaterEffects (Client Component - Dynamic)        │  ││
│  │  │  ┌─────────────────────────────────────────────┐  │  ││
│  │  │  │  Canvas (R3F)                                │  │  ││
│  │  │  │  ├── WaterScene                             │  │  ││
│  │  │  │  │   └── WaterPlane (Shader material)       │  │  ││
│  │  │  │  └── useRippleCanvas (texture mgmt)         │  │  ││
│  │  │  └─────────────────────────────────────────────┘  │  ││
│  │  │  Hooks:                                            │  ││
│  │  │  - useMousePosition (cursor tracking)             │  ││
│  │  │  - useMediaQuery (mobile detection)               │  ││
│  │  │  - useMounted (SSR safety)                        │  ││
│  │  │  - useSyncExternalStore (motion preference)       │  ││
│  │  └───────────────────────────────────────────────────┘  ││
│  │  ┌───────────────────────────────────────────────────┐  ││
│  │  │  NextIntlClientProvider (i18n wrapper)           │  ││
│  │  │  └── children (rest of app)                      │  ││
│  │  └───────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Layer Breakdown

### 1. Server Layer (Next.js App Router)

**Responsibility:** Metadata, routing, static generation, i18n setup

**Files:**
- `src/app/[locale]/layout.tsx` - Root server component
- `src/app/[locale]/page.tsx` - Home page
- `src/i18n/routing.ts` - Locale configuration
- `src/i18n/request.ts` - i18n request handler

**Characteristics:**
- Server Components (no hooks/state)
- generateStaticParams for static export
- generateMetadata for SEO
- Minimal JS shipped to client
- Messages pre-fetched on server

### 2. Client Layer

#### A. Dynamic Wrapper (`components/water/index.tsx`)

**Responsibility:** SSR-safe import, lazy loading

**Pattern:**
```tsx
next/dynamic
  └── loads WaterCanvas only on client
      └── no loading UI (returns null)
```

**Why:** Prevents Three.js/WebGL from running on server

#### B. Canvas Orchestrator (`components/water/WaterCanvas.tsx`)

**Responsibility:** Setup, config, event handling, state coordination

**Key Logic:**
- SSR check (`mounted` gate)
- Accessibility check (`prefers-reduced-motion`)
- Mobile detection (`isMobile`)
- Click ripple event listener
- Cursor trail throttling
- R3F Canvas configuration
- Suspense boundary

**Data Flow:**
```
useMousePosition()  → normalized (x, y, isActive)
    │
    ├─→ WaterScene (useFrame)
    │   │
    │   ├─ Cursor trail ripples (throttled)
    │   └─ Canvas texture update
    │
click listener → addRipple(x, y, 1.0) → RipplePoint[]
```

#### C. Geometry & Material (`components/water/WaterPlane.tsx`)

**Responsibility:** Three.js mesh, shader material, uniform management

**Structure:**
```
PlaneGeometry
  ├── Resolution: 1×1 (no vertex data, just UVs)
  └── Size: full viewport

ShaderMaterial
  ├── Uniforms:
  │   ├── uRippleMap (texture from canvas)
  │   ├── uDistortionStrength (0.02)
  │   └── uTime (animation)
  ├── Vertex: passthrough (position + UV)
  └── Fragment: ripple distortion + water color
```

### 3. Hook Layer

#### useMousePosition

**Dependency Chain:**
```
useMousePosition()
  ├── useState (position state)
  ├── useCallback (event handlers)
  └── useEffect (listener management)
        └── Returns cleanup function
```

**Event Integration:**
```
window.mousemove → handleMouseMove → setPosition
document.mouseleave → handleMouseLeave → setPosition(isActive: false)
```

#### useRippleCanvas

**Dependency Chain:**
```
useRippleCanvas(options)
  ├── useRef (canvas, ctx, texture, ripples array)
  ├── useEffect (canvas init, texture creation)
  ├── useCallback (addRipple, update functions)
  └── useSyncExternalStore (external texture state)
        ├── subscribe (listener management)
        ├── getSnapshot (client value)
        └── getServerSnapshot (null on SSR)
```

**Update Loop:**
```
update() called each frame (useFrame)
  ├── Fade previous frame (rgba overlay)
  ├── For each ripple:
  │   ├── Expand radius
  │   ├── Decay strength
  │   ├── Draw radial gradient
  │   └── Remove if < 0.01 strength
  └── Mark texture for GPU sync (needsUpdate = true)
```

#### External Store Pattern

**Why Used:** Avoid prop drilling, sync texture across component tree

**Implementation:**
```
Global State: let textureStore = null
              let listeners = new Set()

subscribe(callback)
  └── add callback to listeners set
      return unsubscribe function

getSnapshot()
  └── return current textureStore value (client)

getServerSnapshot()
  └── return null (server-safe)

Component:
  const texture = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
```

### 4. Shader Layer

**Vertex Shader:**
```glsl
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**Fragment Shader (detailed):**

```glsl
uniform sampler2D uRippleMap;
uniform float uDistortionStrength;
uniform float uTime;
varying vec2 vUv;

void main() {
  // 1. Sample ripple map
  vec4 ripple = texture2D(uRippleMap, vUv);

  // 2. Distortion from ripple (RG channels offset from 0.5)
  vec2 distortion = (ripple.rg - 0.5) * 2.0 * uDistortionStrength;

  // 3. Ambient wave motion (time-based)
  float wave = sin(vUv.x * 10.0 + uTime) * cos(vUv.y * 8.0 + uTime * 0.8) * 0.002;
  distortion += vec2(wave, wave * 0.5);

  // 4. Apply distortion to UV
  vec2 distortedUv = vUv + distortion;

  // 5. Color gradient
  vec3 deepColor = vec3(0.039, 0.059, 0.039);    // #0a0f0a
  vec3 lightColor = vec3(0.153, 0.404, 0.286);   // #276749
  float gradient = smoothstep(0.0, 1.0, distortedUv.y + wave * 10.0);
  vec3 baseColor = mix(deepColor, lightColor, gradient * 0.3);

  // 6. Ripple highlights
  float rippleHighlight = (ripple.r - 0.5) * 2.0;
  baseColor += vec3(0.22, 0.63, 0.41) * rippleHighlight * 0.3;  // #38a169

  // 7. Edge fade (vignette)
  float edgeFade = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5) * 2.0);
  edgeFade *= 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5) * 2.0);

  // 8. Output (transparent green water)
  gl_FragColor = vec4(baseColor, 0.12 * edgeFade);
}
```

**Key Algorithms:**
- **Distortion:** Normalize ripple texture (0-1) → (-1 to 1) → scale by strength
- **Wave Motion:** Sine/cosine combo, time-varying for animation
- **Color Blend:** smoothstep interpolation (smooth transitions)
- **Edge Fade:** Two 1D smoothsteps → 2D vignette effect

## Data Flow Diagram

### User Interaction → Visual Output

```
User Action
  │
  ├─ Mouse Move
  │   ├─ window.mousemove event
  │   ├─ useMousePosition (normalize coords)
  │   ├─ Throttled: add ripple every 50ms (desktop) / 100ms (mobile)
  │   └─ addRipple(x, y, 0.3)  ← cursor trail
  │
  ├─ Click
  │   ├─ window.click event
  │   └─ addRipple(x, y, 1.0)  ← strong ripple
  │
  └─ useFrame (R3F render loop)
      ├─ RipplePoint[] array
      │   ├─ Expand radius
      │   ├─ Decay strength
      │   └─ Remove old ripples
      ├─ Canvas 2D context
      │   ├─ Fade previous frame
      │   └─ Draw radial gradients
      ├─ THREE.CanvasTexture
      │   └─ GPU upload (needsUpdate)
      ├─ ShaderMaterial uniforms
      │   ├── uRippleMap ← texture
      │   ├── uTime ← state.clock.elapsedTime
      │   └── uDistortionStrength ← 0.02
      └─ GPU Fragment Shader
          ├─ Sample ripple map
          ├─ Calculate distortion
          ├─ Blend colors
          └─ Render to canvas (60 FPS)
```

## Rendering Pipeline

### Desktop (60 FPS)

```
Frame 0ms ─┬─ Check mouse position (useMousePosition)
           ├─ Maybe add ripple (throttle 50ms)
           ├─ useFrame hook fires
           │  ├─ Update ripple array (remove old, decay)
           │  ├─ Canvas 2D context updates
           │  │  ├─ Fade previous (rgba overlay)
           │  │  ├─ Draw radial gradients per ripple
           │  │  └─ Mark for GPU upload
           │  └─ Three.js WebGL draw
           │     ├─ Sample ripple texture
           │     ├─ Apply shader calculations
           │     └─ Composite to framebuffer
           ├─ React commit phase
           └─ Browser composite

Frame 16.67ms ──── (repeat)
```

**Bottlenecks:**
- Canvas update (2D context)
- Shader execution (GPU)
- Texture upload (PCI-e)

### Mobile (Demand Frameloop)

```
Frame 0ms (only if mouse active or interaction)
  ├─ Similar to desktop but:
  │  ├─ Canvas size: 128×128 (vs 256×256)
  │  ├─ Max ripples: 15 (vs 30)
  │  └─ Throttle: 100ms (vs 50ms)
  │
Frame paused (when inactive)
  └─ No rendering → battery saved
```

## State Management Architecture

### Immutable State (React)

```
WaterScene
  ├── useRippleCanvas
  │   └── internal refs
  │       ├── canvasRef
  │       ├── ctxRef
  │       ├── textureRef
  │       └── ripplesRef (RipplePoint[])
  │
  ├── useMousePosition
  │   └── [position, setPosition]
  │       └── MousePosition { x, y, isActive }
  │
  └── useFrame
      └── Updates both above per frame
```

### External State (useSyncExternalStore)

```
Global textureStore
  └── THREE.CanvasTexture | null

listeners Set
  └── React component callbacks

subscribe(callback)
  ├── Add to listeners
  └── Return unsubscribe

getSnapshot()
  └── Return current textureStore (client)

getServerSnapshot()
  └── Return null (server-safe)
```

**Why This Pattern?**
- Three.js texture is non-React (can't use useState)
- Multiple components may need texture
- Must be synchronized with React lifecycle
- SSR-safe (returns null on server)

## Performance Optimization

### Memory Management

**Canvas Texture:**
- Created once, reused forever
- Disposed on component unmount
- No recreation on updates (just needsUpdate flag)
- ~1MB per 256×256 RGBA texture

**Ripple Pool:**
- Fixed-size array (max 30 ripples)
- Shift oldest when full (circular behavior)
- No spread/concat (O(n) operation)
- ~24 bytes per RipplePoint × 30 = 720 bytes

**Total: ~1.7 MB for desktop, ~0.2 MB for mobile**

### Frame Time Budget (60 FPS = 16.67ms)

| Operation | Time | % Budget |
|-----------|------|----------|
| Ripple decay/expand (CPU) | 0.1ms | 0.6% |
| Canvas 2D rendering | 2-3ms | 18% |
| Texture GPU upload | 1-2ms | 12% |
| Shader execution | GPU-async | async |
| React commit/reconcile | < 1ms | < 6% |

### Mobile Optimizations

1. **Demand Frameloop:** `frameloop="demand"` pauses rendering when idle
2. **Canvas Resolution:** 128×128 (1/4 area vs 256×256)
3. **Ripple Limit:** 15 max (vs 30)
4. **Throttle:** 100ms between cursor ripples (vs 50ms)
5. **DPR:** Single pixel ratio (vs [1, 2])
6. **No Antialias:** Disabled for performance

## Accessibility Architecture

### Keyboard Navigation

**Current:** Canvas is `pointer-events-none` (transparent to input)

**Implication:** Doesn't interfere with any interactive elements

### Screen Readers

**Implementation:**
```tsx
<div
  aria-hidden="true"
  role="presentation"
/>
```

- aria-hidden: Screen readers skip element
- role="presentation": No semantic meaning

### Motion Preferences

**Implementation:**
```tsx
const prefersReducedMotion = useSyncExternalStore(
  subscribeToReducedMotion,
  getSnapshot,
  getServerSnapshot
);

if (prefersReducedMotion) {
  return null;  // Return null, not a placeholder
}
```

**Effect:** Water effects don't render for users with prefers-reduced-motion: reduce

## Error Handling Strategy

### SSR Hydration

**Potential Issue:** Server renders nothing, client renders Canvas

**Solution:**
- `useMounted()` gate: returns false on server, true on client
- Dynamic import: `ssr: false` prevents server-side rendering

**Result:** Explicit SSR/CSR boundary, no mismatch warnings

### WebGL Context Loss

**Current:** No explicit handling

**Future Consideration:**
```tsx
gl={{
  failIfMajorPerformanceCaveat: true  // Already implemented
}}
```

This will throw if WebGL isn't available, preventing silent failures.

### Memory Leaks

**Prevention:**
1. useEffect cleanup (listeners removed)
2. texture.dispose() called on unmount
3. Ref cleanup (set to null after dispose)

**Monitoring:** Chrome DevTools Memory profiler

## Integration Points

### With Routing

**Integration:** WaterEffects placed in root layout

**Effect:** Available on all pages (all locales)

**Benefit:** No duplicate water effects, consistent global aesthetic

### With i18n

**Current:** No dependency

**Potential Future:** Ripple labels/tooltips (if adding features)

### With CSS

**Uses:**
- TailwindCSS: `fixed`, `inset-0`, `z-0`, `pointer-events-none`
- No CSS conflicts (lowest z-layer, inert)

## Deployment Considerations

### Build Output

**Type:** Static export (next build → out/)

**Impact on Water Effects:**
- WaterCanvas dynamically imported (ssr: false)
- No Three.js on server
- Increases initial page size by ~200KB (Three.js)
- Loaded on demand (not render-blocking)

### Browser Compatibility

**Minimum Requirements:**
- WebGL 1.0 (Three.js baseline)
- ES2020 (TypeScript target)
- CSS Grid, Flexbox

**Tested Browsers:**
- Chrome 120+
- Firefox 121+
- Safari 17+

### Mobile Considerations

**Screen Size Detection:**
```tsx
const isMobile = useMediaQuery("(max-width: 768px)");
```

**Fallback:** If useMediaQuery unavailable, defaults to false (safe)

## Future Architecture Decisions

### Phase 04 (Ecosystem Effects)

**Expected Additions:**
- Particle system (bubbles, fish)
- Camera interaction (look-around)
- Additional shader layers

**Architecture Impact:** May need additional Canvas or post-processing

### Phase 05 (Navbar Effects)

**Expected Interaction:** Navbar overlap with water

**Architecture Decision:** Keep water at z-0, navbar at higher z-index

## Monitoring & Debugging

### Performance Profiling

```
Chrome DevTools → Performance tab
  ├── Frame rate
  ├── Canvas 2D time
  ├── Shader execution
  └── Memory growth
```

### Visual Debugging

```
Three.js Inspector:
  ├── Canvas elements
  ├── Geometry
  ├── Materials
  ├── Textures
  └── Uniforms
```

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| White screen | WebGL unavailable | Check failIfMajorPerformanceCaveat |
| Ripples not visible | Texture null | Check useRippleCanvas initialization |
| High memory | Textures not disposed | Call texture.dispose() in cleanup |
| SSR mismatch | Server renders Canvas | Add useMounted() gate |
| Poor mobile perf | Canvas 256×256 on mobile | Use isMobile branch in config |
