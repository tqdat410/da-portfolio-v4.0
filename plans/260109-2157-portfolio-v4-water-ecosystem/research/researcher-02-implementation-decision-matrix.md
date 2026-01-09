# Water Ripple Implementation Decision Matrix

**Focus:** Quick decision guide for selecting technical approaches

---

## Scenario-Based Recommendations

### Scenario 1: "I want highly realistic water with physics"
**Choose:** GPGPU Height Field Simulation
- Libraries: `three.js` (built-in `GPUComputationRenderer`)
- R3F wrapper: Create custom hook with `useFrame` + RenderTarget
- Complexity: HIGH | Performance: MEDIUM | Realism: HIGH
- Best case: Desktop with WebGL2 support
- Fallback: Normal map distortion on mobile

### Scenario 2: "I want fast, lightweight water that looks good"
**Choose:** Normal Map Distortion + Fresnel Blending
- Libraries: `@react-three/drei`, `three-custom-shader-material`
- Shader: 50 lines GLSL, single texture lookup
- Complexity: LOW | Performance: HIGH | Realism: MEDIUM
- Works on WebGL 1.0 and mobile equally well
- Add pre-baked caustics texture for depth

### Scenario 3: "I want interactive ripples on user input"
**Choose:** Canvas Ripple Tracker (Postprocessing)
- Libraries: `postprocessing`, canvas 2D API
- Update: Canvas in mouse/click handlers, pass to shader
- Complexity: LOW | Performance: HIGH | Realism: LOW-MEDIUM
- Best for: Background effects, UI integration
- Can layer over normal map for depth

### Scenario 4: "I want full ecosystem (water + particles + reflections)"
**Choose:** Hybrid Approach
- **Water:** GPGPU desktop, fallback to normal map mobile
- **Particles:** Custom Points shader with Perlin noise (CPU or GPU)
- **Reflections:** CubeMap + fresnel (or RenderTarget at 1/4 resolution)
- **Background:** Subtle sine-wave displacement
- Complexity: MEDIUM | Performance: MEDIUM | Realism: HIGH
- See integration patterns below

---

## Quick Selection Tree

```
Start: Which matches your priority?

├─ Visual Realism (90%+)
│  └─ Desktop only? → GPGPU Height Field
│  └─ Mobile too? → Hybrid (GPGPU/Normal Map)
│
├─ Performance First (60fps guaranteed)
│  └─ Simple effect okay? → Normal Map Distortion
│  └─ Need interactivity? → Canvas Ripple Tracker
│
├─ Ease of Implementation
│  └─ 1-2 days? → Canvas Ripple Tracker
│  └─ 3-5 days? → Normal Map Distortion + Particles
│  └─ 1-2 weeks? → Full GPGPU ecosystem
│
└─ Dev Experience
   └─ First shader project? → Canvas Ripple Tracker
   └─ Comfortable with GLSL? → Normal Map or GPGPU
   └─ Want to learn GPGPU? → GPGPU Height Field
```

---

## Technical Comparison Table

| Aspect | GPGPU Heightmap | Normal Map | Canvas Ripple | Hybrid |
|--------|---|---|---|---|
| **Realism** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Performance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Dev Time** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Mobile Ready** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **CPU Load** | LOW | VERY LOW | MEDIUM | LOW-MEDIUM |
| **GPU Load** | HIGH | LOW | VERY LOW | MEDIUM |
| **Code Complexity** | COMPLEX | SIMPLE | SIMPLE | MEDIUM |

---

## Code Snippet Decision Guide

### If you're thinking "Which do I copy-paste from?"

**Canvas Ripple (fastest start):**
```javascript
// Draw ripple on click
canvas.getContext('2d').fillStyle = 'white'
ctx.fillRect(mouseX - size, mouseY - size, size * 2, size * 2)

// Shader: uv += texture(rippleTexture, uv).rg * 0.1
```

**Normal Map Distortion (most compatible):**
```glsl
// Fragment shader
vec3 normal = texture2D(normalMap, uv).rgb;
uv += normal.rg * distortionStrength;
gl_FragColor = texture2D(sceneTexture, uv);
```

**GPGPU Heightmap (most realistic):**
```glsl
// Compute shader (very complex, see Three.js example for full code)
float neighbors = (texel(north) + texel(south) + texel(east) + texel(west)) / 2.0;
float newHeight = neighbors - prevHeight;
```

---

## Mobile Optimization Checklist

### WebGL Feature Detection
```javascript
const hasFloatTexture = gl.getExtension('OES_texture_float')
const hasHalfFloat = gl.getExtension('OES_texture_half_float')
const hasWebGL2 = !!gl.TEXTURE_2D_ARRAY // Proxy for WebGL2

// Choose approach based on capabilities
if (hasWebGL2 && hasFloatTexture) {
  // Use GPGPU (iOS 15+, Android 7+)
} else {
  // Fall back to normal map distortion
}
```

### Memory-Safe Limits
- **Heightmap:** 64x64 max on mobile (4KB), 256x256 on desktop (256KB)
- **Normal maps:** 512x512 max (1MB), scale down on bandwidth-limited
- **Particles:** 2000 max mobile (8KB positions), 5000 desktop
- **Render targets:** 1/4 screen resolution (e.g., 270x480 for 540x960)

---

## Integration with React Three Fiber

### Recommended Hook Pattern (All Approaches)

```javascript
// Hook applies to GPGPU, normal map, or canvas ripple
function useWaterEffect(type = 'normalMap') {
  const meshRef = useRef()
  const targetRef = useRef()

  useFrame((state) => {
    if (type === 'gpgpu') {
      gpuCompute.compute()
    } else if (type === 'canvas') {
      updateCanvasRipples(state.mouse)
    }
    // Update uniforms
    meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return { meshRef, targetRef }
}
```

---

## Fallback Strategy

**Graceful Degradation Path:**
1. **Try:** GPGPU (WebGL 2 + OES_texture_float)
2. **Fallback 1:** Normal map distortion (WebGL 1 + OES_texture_float)
3. **Fallback 2:** UV scroll animation (all browsers)
4. **Fallback 3:** Static mesh, CSS animation only (no WebGL)

---

## Recommended Starting Point for DaPortfolio v4.0

**Recommendation:** Hybrid approach
- **Primary:** Normal Map Distortion (instant results, mobile-safe)
- **Enhancement (Phase 2):** Canvas Ripple Tracker on top
- **Advanced (Phase 3):** GPGPU for desktop detection

**Rationale:**
- Normal map = 3-4 days implementation, 90% visual quality
- Canvas ripples = 1 day add-on, interactive delight
- GPGPU = optional polish for marketing demo (weekend project)

**Implementation order:**
1. Static normal map water plane with fresnel
2. Add animated normal scrolling
3. Add canvas ripple on mouse move
4. Add particles shader (separate from water)
5. (Optional) Add GPGPU detection + fallback

---

**Decision Matrix Version:** 1.0 | **Updated:** 2026-01-09
