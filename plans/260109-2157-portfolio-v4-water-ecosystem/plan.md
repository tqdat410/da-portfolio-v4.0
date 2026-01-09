---
title: "DaPortfolio v4.0 - Water Ecosystem Theme"
description: "Personal portfolio with WebGL water ripples, ambient particles, and vertical navbar with light beam effects"
status: pending
priority: P1
effort: 28h
branch: main
tags: [nextjs, threejs, webgl, portfolio, water-effects, r3f]
created: 2026-01-09
---

# DaPortfolio v4.0 - Water Ecosystem

Personal portfolio featuring realistic WebGL water ripple effects, ambient ecosystem particles, and a vertical navigation bar with spotlight illumination.

## Validated Requirements (2026-01-09)

- **Water Ripples**: Continuous subtle trail following cursor (not click-only)
- **Navbar**: Text-only (no icons), vertical left-side
- **Language Switcher**: In hero/header section (not in navbar)
- **Colors**: Green-toned palette (Forest/Sea Green/Emerald/Mint)
- **Projects**: Simple layout for UI testing (storytelling later)
- **Scroll**: Smooth scroll between sections
- **Hero**: Simple - Name + Role + CTA

## Research References

- [WebGL Water Effects Research](./research/researcher-01-webgl-water-effects.md) - GPGPU techniques, R3F integration, performance targets
- [Navbar Light Effects Research](./research/researcher-02-navbar-light-effects.md) - Conic gradients, IntersectionObserver, color palette

## Phase Summary

| Phase | Title | Effort | Priority | Dependencies |
|-------|-------|--------|----------|--------------|
| [01](./phase-01-project-setup.md) | Project Setup | 3h | P1 | None |
| [02](./phase-02-core-layout.md) | Core Layout | 3h | P1 | Phase 01 |
| [03](./phase-03-water-effects.md) | Water Ripple Effects | 6h | P1 | Phase 02 |
| [04](./phase-04-ecosystem-effects.md) | Ecosystem Effects | 5h | P2 | Phase 03 |
| [05](./phase-05-navbar-effects.md) | Navbar Light Effects | 4h | P1 | Phase 02 |
| [06](./phase-06-sections-implementation.md) | Sections Implementation | 5h | P1 | Phase 02, 05 |
| [07](./phase-07-polish-optimization.md) | Polish & Optimization | 2h | P2 | All phases |

## Color Palette (Green-Toned)

| Name | Hex | Usage |
|------|-----|-------|
| Midnight | `#0a0f0a` | Background (green-tint) |
| Forest Dark | `#1a2e1a` | Primary text |
| Sea Green | `#276749` | Active/glow |
| Emerald | `#38a169` | Highlights |
| Mint | `#9ae6b4` | Hover states |
| Light Mint | `#c6f6d5` | Accent |

## Key Dependencies

```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "three": "^0.160.x",
  "next": "^14.x",
  "tailwindcss": "^3.x",
  "next-intl": "^3.x"
}
```

## Project Structure (Target)

```
src/
├── app/[locale]/          # i18n routing
├── components/
│   ├── layout/            # Navbar, Section containers
│   ├── water/             # Water canvas, ripples
│   ├── particles/         # Ambient effects
│   └── sections/          # Hero, About, Projects, Contact
├── hooks/                 # useActiveSection, useWaterRipple
├── shaders/               # GLSL files
└── i18n/                  # Locale config
```

## Success Criteria

1. Water ripples respond to cursor and clicks at 60fps (desktop)
2. Vertical navbar shows active section with light beam effect
3. All sections render content from en.json/vn.json
4. Mobile gracefully degrades effects, maintains usability
5. Lighthouse performance score >= 80
