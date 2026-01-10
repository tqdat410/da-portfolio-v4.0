# Design Guidelines - DaPortfolio v4.0

## Color Palette (Aquarium-Bright Theme)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Deep Ocean | `#0A1628` | (10, 22, 40) | Background base, darkest |
| Ocean Blue | `#1E3A5F` | (30, 58, 95) | Gradient mid-tone |
| Aqua Teal | `#00CED1` | (0, 206, 209) | Primary highlight, particles |
| Bright Cyan | `#00FFFF` | (0, 255, 255) | Ripple peaks, specular |
| Light Cyan | `#E0FFFF` | (224, 255, 255) | Specular white, sparkles |

## Water Ripple Effect

### Behavior (Gentlerain-inspired)
- **Trigger:** Mouse movement (continuous trail)
- **Click:** Strong ripple (1.0 strength)
- **Trail:** Medium ripple (0.5 strength)
- **Lifecycle:** 0.8 seconds (ease-out)
- **Max radius:** 80px desktop, 60px mobile

### Technical Implementation
- Single expanding ring (not concentric)
- Displacement mapping with dynamic normals
- Specular lighting simulation
- Ease-out exponential expansion
- Fresnel edge glow effect

## Particle System

### Desktop
- Primary layer: 2000 particles, Aqua Teal
- Secondary layer: 500 particles, Bright Cyan
- Tertiary layer: 200 particles, Light Cyan

### Mobile
- Single layer: 500 particles, Aqua Teal

## Animation Characteristics

| Property | Value |
|----------|-------|
| Frame rate | 60fps target |
| Easing | ease-out-expo (expansion) |
| Decay | ease-out-cubic (intensity) |
| Ambient waves | Dual sine layers |

## Accessibility

- Respects `prefers-reduced-motion`
- Performance monitoring with adaptive quality
- Falls back gracefully on low-end devices

## WebGL Settings

```typescript
{
  antialias: false,
  alpha: true,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: true,
}
```
