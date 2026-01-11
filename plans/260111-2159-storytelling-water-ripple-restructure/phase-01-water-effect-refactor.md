# Phase 01: Water Ripple Effect Refactor

## Context

- **Parent Plan:** [plan.md](./plan.md)
- **Dependencies:** None (foundation phase)
- **Design Guidelines:** [docs/design-guidelines.md](../../docs/design-guidelines.md)
- **Reference:** [ref-water-like-ripples/](../../ref-water-like-ripples/)

## Overview

| Property | Value |
|----------|-------|
| Description | Replace glass distortion with canvas-texture water ripple effect |
| Priority | P1 |
| Status | pending |
| Effort | 3h |

## Key Insights

From research and reference implementation analysis:

1. **Reference approach** uses 4-channel simulation (pressure, velocity, dx, dy) vs current 1-channel (height only)
2. **Du/Dv distortion** stored in z,w channels enables direct UV offset without computing normals
3. **Canvas texture** renders text underneath; shader distorts UVs when sampling
4. **Two-pass rendering** - simulation pass (ping-pong FBO) + render pass (distort canvas texture)

## Requirements

### Functional
- R1: Display "TRAN QUOC DAT" name under water surface
- R2: Mouse interaction creates visible ripples distorting the text
- R3: Click produces stronger ripple than hover
- R4: Fullscreen coverage in hero section viewport

### Non-Functional
- R5: 60fps on desktop, 30fps acceptable on mobile
- R6: Respect `prefers-reduced-motion`
- R7: Graceful fallback if WebGL unavailable

## Architecture

### Data Flow
```
CanvasTexture (name text) ─────────────────────────────────┐
                                                           v
Mouse Position ──> useFluidSimulation ──> SimulationFBO ──> WaterPlane (render shader)
                   (ping-pong buffers)   (pressure,vel,dx,dy)   ──> Screen
```

### Shader Strategy

**Simulation Shader** (update existing `src/shaders/simulation.ts`):
- Store 4 channels: pressure (R), velocity (G), dx (B), dy (A)
- dx/dy = gradient of pressure field for distortion
- Boundary conditions at edges

**Render Shader** (update `src/shaders/water.ts`):
- Sample distortion from simulation texture (z,w channels)
- Apply distortion to UV before sampling canvas texture
- Add specular highlights on ripple peaks

## Related Code Files

| File | Action | Purpose |
|------|--------|---------|
| `src/shaders/simulation.ts` | Modify | Add dx/dy channels to output |
| `src/shaders/water.ts` | Replace | New render shader with canvas distortion |
| `src/hooks/useFluidSimulation.ts` | Keep | Existing ping-pong FBO works |
| `src/components/water/WaterCanvas.tsx` | Modify | Add canvas texture creation |
| `src/components/water/WaterPlane.tsx` | Modify | Pass canvas texture to shader |
| `src/components/water/TextCanvas.ts` | Create | Canvas 2D text renderer utility |

## Implementation Steps

### Step 1: Create TextCanvas Utility (30min)
Create utility class for rendering text to canvas texture.

```typescript
// src/components/water/TextCanvas.ts
export function createTextCanvas(text: string, options: TextCanvasOptions): HTMLCanvasElement
```

Options:
- `width`, `height` - canvas dimensions
- `fontSize` - scaled by devicePixelRatio
- `fontFamily` - default "Inter, sans-serif"
- `fillStyle` - text color (Warm Cream #F4EEE0)
- `bgColor` - background (Deep Earth #0D0A08)

### Step 2: Update Simulation Shader (45min)
Modify `src/shaders/simulation.ts` to output 4 channels.

```glsl
// Output: R=pressure, G=velocity, B=dx, A=dy
gl_FragColor = vec4(
  pressure,
  pVel,
  (p_right - p_left) / 2.0,  // dx gradient
  (p_up - p_down) / 2.0      // dy gradient
);
```

Update uniforms:
- Change `uPrevTexture`/`uCurrentTexture` to match reference naming
- Add `frame` uniform for initialization check

### Step 3: Create New Render Shader (45min)
Replace `src/shaders/water.ts` with canvas distortion shader.

```glsl
uniform sampler2D uSimulationMap;  // Ping-pong result
uniform sampler2D uContentTexture; // Canvas with text

void main() {
  vec4 sim = texture2D(uSimulationMap, vUv);
  vec2 distortion = 0.3 * sim.zw;  // dx/dy distortion
  vec4 color = texture2D(uContentTexture, vUv + distortion);

  // Specular highlight
  vec3 normal = normalize(vec3(-sim.z * 2.0, 0.5, -sim.w * 2.0));
  vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
  float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

  gl_FragColor = color + vec4(specular);
}
```

### Step 4: Update WaterCanvas Component (30min)
Modify to create and manage canvas texture.

Key changes:
- Create canvas texture on mount with text content
- Pass texture to WaterPlane
- Handle resize (recreate canvas texture)

### Step 5: Update WaterPlane Component (20min)
Accept canvas texture prop and update material uniforms.

Key changes:
- Add `contentTexture` prop
- Update shader material uniforms
- Rename `uRippleMap` to `uSimulationMap`

### Step 6: Testing & Optimization (30min)
- Verify ripple effect distorts text visibly
- Test on mobile (reduce resolution)
- Performance profiling with DevTools
- Verify reduced motion fallback

## Todo List

- [ ] Create `TextCanvas.ts` utility with devicePixelRatio scaling
- [ ] Update simulation shader to output 4 channels (pressure, vel, dx, dy)
- [ ] Create new render shader with canvas texture distortion
- [ ] Modify `WaterCanvas.tsx` to create/manage canvas texture
- [ ] Update `WaterPlane.tsx` to accept content texture
- [ ] Add resize handler for canvas texture recreation
- [ ] Test ripple distortion on desktop Chrome
- [ ] Test performance on mobile (Safari iOS)
- [ ] Verify reduced motion fallback

## Success Criteria

- [ ] Text "TRAN QUOC DAT" visible and readable when no ripples
- [ ] Mouse movement creates visible ripple distortion of text
- [ ] Click creates stronger, more pronounced ripple
- [ ] No visual artifacts at canvas edges
- [ ] 60fps on desktop, 30fps+ on mobile
- [ ] Reduced motion users see static text (no animation)

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Canvas text blurry on high-DPI | Medium | Medium | Use devicePixelRatio scaling |
| Ripple simulation unstable | Low | High | Clamp values, add edge damping |
| Mobile performance issues | Medium | Medium | Reduce resolution to 128x128 |
| Safari WebGL compatibility | Low | Medium | Test HalfFloatType support, fallback to FloatType |

## Notes

- Current simulation uses `HalfFloatType` - verify Safari iOS support
- Reference uses full-resolution FBOs; consider downscaling for perf
- Text should be centered and prominent for hero section
