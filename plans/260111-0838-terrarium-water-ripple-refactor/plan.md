---
title: "Terrarium Water Ripple Refactor"
description: "Refactor water effect to match gentlerain.ai style with bright Terrarium theme - static surface, glass distortion ripples only"
status: pending
priority: P2
effort: 6h
branch: master
tags: [water-effect, shader, refactor, ui-ux]
created: 2026-01-11
---

# Terrarium Water Ripple Refactor

## Vision
Transform dark aquarium aesthetic to bright terrarium glass - static water surface reacting only to user interaction with glass distortion + circular wave ripples.

## Current State Analysis
- **EcosystemLayer**: BackgroundWaves, Caustics, AmbientParticles (3 layers)
- **WaterPlane**: Additive blending on dark palette, ambient wave motion in shader
- **Shader**: Ambient wave animation (lines 70-73), complex color mixing
- **Palette**: Dark earth tones (#0D0A08, #161A13)

## Target State (gentlerain.ai style)
- No ambient effects - static until interaction
- Glass distortion ripple on hover/click only
- Bright Terrarium palette: Soft Sage (#A3B18A), Warm Cream (#F4EEE0), Golden Sun (#E1BF7D)
- Clean, minimal visual noise

## Phases

| Phase | Scope | Effort | Files |
|-------|-------|--------|-------|
| 01 | Remove ambient effects | 1.5h | WaterCanvas, EcosystemLayer, water.ts |
| 02 | Static water + pure ripple shader | 2.5h | water.ts, WaterPlane, useRippleCanvas |
| 03 | Bright Terrarium palette | 2h | globals.css, water.ts, components |

## Key Technical Changes

### Phase 01 - Remove Ambient Effects
- Delete `EcosystemLayer` import/usage from WaterCanvas
- Remove ambient wave lines 70-73 in water.ts fragment shader
- Keep: WaterPlane, useRippleCanvas, click/hover ripple logic

### Phase 02 - Static Water + Pure Ripple
- Rewrite shader: glass refraction only, no auto-animation
- Remove `uTime` from color calculations (keep for ripple decay only)
- Simplify normal calculation for cleaner distortion
- Adjust blend mode from Additive to Normal for bright BG

### Phase 03 - Bright Palette
- CSS: --background: #A3B18A (Soft Sage)
- Shader colors: Warm Cream base, Golden Sun highlights
- Update text colors for contrast on bright BG

## Success Criteria
- [ ] No particle/caustic/wave effects visible
- [ ] Water surface static until mouse interaction
- [ ] Glass distortion + circular wave on hover/click
- [ ] Bright sage green background visible
- [ ] 60 FPS maintained
- [ ] Mobile responsive (128x128 canvas)

## Dependencies
- Phase 02 depends on Phase 01 (clean removal first)
- Phase 03 independent (can parallelize after Phase 01)

## Risks
| Risk | Mitigation |
|------|-----------|
| Bright BG contrast issues | Test text readability, adjust opacity |
| Ripple visibility on bright | Increase distortion strength |
| Performance regression | Profile after each phase |

## Out of Scope
- New ripple physics/behavior
- Additional animation effects
- Content/section changes
