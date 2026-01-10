# Phase 01: Shader Enhancement

**Context:** [Main Plan](./plan.md) | **Next:** [Phase 02](./phase-02-color-scheme.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | pending |
| Effort | 2h |
| Dependencies | None |

Rewrite water shader to use displacement mapping with dynamic normal calculation and specular lighting simulation matching Gentlerain reference.

---

## Key Insights (from Analysis)

### Gentlerain Technique
- Single expanding ring per touch point
- Displacement mapping (height-based UV offset)
- Dynamic normals from height gradient for lighting
- Specular highlights on wave peaks (overhead light)
- Ease-out expansion (~0.7-1.0s lifecycle)

### Current Implementation Gaps
- Current uses simple radial gradient on canvas
- No specular lighting simulation
- Linear expansion rate (no easing)
- Weak highlight intensity

---

## Requirements

1. Implement GPU-based displacement mapping
2. Calculate surface normals from height gradient
3. Add specular lighting simulation
4. Implement ease-out expansion curve
5. Single ring per ripple (sharper wave front)
6. Brighter, more visible highlight effect
7. Maintain 60fps performance

---

## Architecture

```
src/shaders/
├── water.ts          # Enhanced water shaders
└── particles.ts      # (existing) particle shaders

src/hooks/
└── useRippleCanvas.ts  # Updated ripple physics
```

---

## Implementation Steps

### Step 1: Update Ripple Canvas Hook
- Add `startTime` to RipplePoint for age calculation
- Implement ease-out radius calculation
- Sharper wave front (single ring gradient)
- Increase max ripple size (150-200px equivalent)

### Step 2: Enhance Water Fragment Shader
- Calculate displacement from height map
- Derive surface normals from gradient
- Add specular lighting calculation
- Implement Fresnel-like edge highlights
- Brighter, more visible effects

### Step 3: Optimize Performance
- Efficient normal calculation
- Minimize texture samples
- Profile and verify 60fps

---

## Success Criteria

1. Ripples have sharp, bright leading edge
2. Specular highlights visible on wave crests
3. Ease-out expansion feels natural
4. Effect matches Gentlerain visual quality
5. 60fps maintained on desktop
