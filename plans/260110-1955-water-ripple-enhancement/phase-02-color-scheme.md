# Phase 02: Aquarium Color Scheme

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 01](./phase-01-shader-enhancement.md) | **Next:** [Phase 03](./phase-03-polish.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | pending |
| Effort | 1h |
| Dependencies | Phase 01 |

Transform color palette from dark green-toned to bright aquarium theme with vibrant cyan/teal highlights.

---

## Color Comparison

### Current (Dark Green)
| Name | Hex | Usage |
|------|-----|-------|
| Midnight | `#0a0f0a` | Background |
| Forest Dark | `#1a2e1a` | Primary text |
| Sea Green | `#276749` | Active/glow |
| Emerald | `#38a169` | Highlights |
| Mint | `#9ae6b4` | Hover states |

### New (Aquarium-Bright)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Deep Ocean | `#0A1628` | (10, 22, 40) | Background base |
| Ocean Blue | `#1E3A5F` | (30, 58, 95) | Gradient mid |
| Aqua Teal | `#00CED1` | (0, 206, 209) | Primary highlight |
| Bright Cyan | `#00FFFF` | (0, 255, 255) | Ripple peaks |
| Light Cyan | `#E0FFFF` | (224, 255, 255) | Specular white |

---

## Implementation Steps

### Step 1: Update Water Shader Colors
- Replace green palette with aquarium blues
- Brighter specular highlights (cyan → white)
- More vibrant gradient

### Step 2: Update Particle Colors
- Change particle color from mint to bright cyan
- Adjust glow intensity

### Step 3: Update Background Waves
- Ocean blue gradient base
- Teal wave highlights

### Step 4: Update Caustics
- Bright cyan caustic patterns
- Higher opacity for visibility

---

## Files to Update

| File | Changes |
|------|---------|
| `src/shaders/water.ts` | New color values |
| `src/shaders/particles.ts` | New particle color |
| `src/components/water/BackgroundWaves.tsx` | New wave colors |
| `src/components/effects/Caustics.tsx` | New caustic color |
| `src/components/effects/EcosystemLayer.tsx` | Color prop updates |
| `src/components/particles/AmbientParticles.tsx` | Color prop updates |

---

## Success Criteria

1. Vibrant aquarium aesthetic achieved
2. Bright cyan/teal dominant color
3. High contrast specular highlights
4. Cohesive underwater atmosphere
5. All components use new palette
