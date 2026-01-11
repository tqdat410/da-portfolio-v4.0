# Phase 01: Remove Ambient Effects

## Context
Current implementation has multiple ambient effect layers that run continuously:
- `EcosystemLayer` (BackgroundWaves, Caustics, AmbientParticles)
- Ambient wave motion in water.ts shader (lines 70-73)
- Multiple particle systems with terrarium colors

Target: Clean slate with only mouse-triggered ripples.

## Overview
Strip all auto-animating effects. Keep core ripple infrastructure (useRippleCanvas, WaterPlane, click/hover handlers).

## Requirements
1. Remove EcosystemLayer from WaterCanvas render tree
2. Remove ambient wave calculation from water.ts fragment shader
3. Preserve ripple texture system and user interaction handlers
4. No visual effects when mouse is inactive

## Architecture

### Before
```
WaterCanvas
  ├── EcosystemLayer
  │   ├── BackgroundWaves (auto-animated)
  │   ├── Caustics (auto-animated)
  │   └── AmbientParticles x3 (auto-animated)
  └── WaterPlane
      └── Shader (ripples + ambient waves)
```

### After
```
WaterCanvas
  └── WaterPlane
      └── Shader (ripples only)
```

## Implementation Steps

### 1. WaterCanvas.tsx
- [x] Remove `EcosystemLayer` import
- [x] Remove `<EcosystemLayer ... />` from WaterScene JSX
- [x] Remove `reducedEffects` prop from WaterScene (no longer needed)
- [x] Remove `usePerformanceMonitor` import if only used for EcosystemLayer
- [x] Keep: useRippleCanvas, useMousePosition, click handler, cursor trail

### 2. water.ts (Fragment Shader)
- [x] Remove ambient wave lines 70-73:
  ```glsl
  // DELETED:
  float wave1 = sin(uv.x * 5.0 + uTime * 0.3) ...
  float wave2 = sin(uv.x * 8.0 - uTime * 0.2) ...
  float ambientWave = (wave1 + wave2 * 0.4) * 0.002;
  displacement += vec2(ambientWave, ambientWave * 0.6);
  ```
- [x] Keep `uTime` uniform (needed for ripple decay timing)
- [x] Remove any other time-based color modulation not related to ripples
- [x] Changed color palette from Aquarium to Bright Terrarium
- [x] Updated blending mode from Additive to Normal (for bright background)
- [x] Increased distortion strength (0.05 → 0.08)

### 3. Optional Cleanup
- [ ] Consider removing unused files: `BackgroundWaves.tsx`, `Caustics.tsx`, `AmbientParticles.tsx`
- [ ] Or mark as deprecated for potential future use
- [ ] Update effects/index.tsx exports if files removed

## Todo List
```markdown
- [x] Remove EcosystemLayer from WaterCanvas
- [x] Strip ambient wave shader code
- [x] Test static surface (no movement without mouse)
- [x] Verify ripple still works on hover/click
- [x] Run build, check for unused imports
```

## Success Criteria
- [x] Page loads with completely static water surface
- [x] Mouse hover creates ripple
- [x] Click creates stronger ripple
- [x] No console errors/warnings
- [x] Build passes (no unused variables)
- [x] No particle/caustic/wave artifacts visible

## Code Review
- **Date:** 2026-01-11
- **Reviewer:** code-reviewer
- **Report:** `plans/reports/code-reviewer-260111-0855-phase01-ambient-removal.md`
- **Score:** 9/10
- **Status:** ✅ Production-ready
- **Critical Issues:** None
- **Recommendations:** Update plan docs, test mobile performance

## Testing
1. Load page - surface should be static (no shimmer, no particles)
2. Move mouse - ripples appear and decay
3. Click - stronger ripple appears
4. Leave mouse idle - surface returns to static
5. Check DevTools Performance tab - lower GPU usage expected
