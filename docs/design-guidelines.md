# Design Guidelines - DaPortfolio v4.0

## Color Palette (Terrarium Theme)

A natural, organic color palette inspired by glass terrariums with warm earth tones, lush moss, and soft natural lighting. No neon, pure natural aesthetics.

### Earth & Soil Tones
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Deep Earth | `#0D0A08` | (13, 10, 8) | Background base, darkest |
| Rich Soil | `#1A1512` | (26, 21, 18) | Gradient dark |
| Forest Shadow | `#161A13` | (22, 26, 19) | Deep forest shade |
| Bark Brown | `#3D2B1F` | (61, 43, 31) | Accent dark |

### Moss & Foliage
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Moss Green | `#566B4D` | (86, 107, 77) | Primary accent, ripple highlights |
| Sage Leaf | `#889977` | (136, 153, 119) | Secondary accent |
| Fern | `#4A5D3C` | (74, 93, 60) | Scrollbar, links |
| Lichen | `#A3B18A` | (163, 177, 138) | Subtle highlights |

### Warm Natural Light
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Warm Cream | `#F4EEE0` | (244, 238, 224) | Foreground text, specular |
| Golden Sun | `#E1BF7D` | (225, 191, 125) | Caustics, dappled light |
| Terracotta | `#CC855F` | (204, 133, 95) | Warm accent |
| Amber Glow | `#D4A574` | (212, 165, 116) | Soft highlights |

## Water Ripple Effect

### Behavior (Gentlerain-inspired)
- **Trigger:** Mouse movement (continuous trail)
- **Click:** Strong ripple (1.0 strength)
- **Trail:** Medium ripple (0.5 strength)
- **Lifecycle:** 0.8 seconds (ease-out)
- **Max radius:** 80px desktop, 60px mobile

### Visual Characteristics
- Gentle, organic wave motion
- Warm specular highlights (golden sunlight through glass)
- Moss green ripple tints
- Softer opacity than neon effects
- Dappled light patterns (like light through leaves)

### Technical Implementation
- Single expanding ring (not concentric)
- Displacement mapping with dynamic normals
- Soft specular lighting (power 24-48)
- Ease-out exponential expansion
- Gentle fresnel for glass terrarium effect

## Particle System

### Desktop
- Primary layer: 2000 particles, Moss Green (floating spores)
- Secondary layer: 500 particles, Sage Leaf
- Tertiary layer: 200 particles, Golden Sun (dust motes)

### Mobile
- Single layer: 500 particles, Moss Green

## Caustics (Dappled Light)

- Primary: Golden Sun (`#E1BF7D`)
- Secondary: Warm Cream (`#F4EEE0`)
- Softer alpha (0.12) for natural effect
- Simulates sunlight filtering through leaves

## Animation Characteristics

| Property | Value |
|----------|-------|
| Frame rate | 60fps target |
| Easing | ease-out-expo (expansion) |
| Decay | ease-out-cubic (intensity) |
| Ambient waves | Slower, organic dual sine layers |
| Wave speed | 0.2-0.3x (gentler than aquarium) |

## Design Philosophy

### Natural over Neon
- Avoid bright, saturated colors
- Use muted, earthy tones
- Warm lighting instead of cool blues
- Organic movement patterns

### Inspired by
- Glass terrariums
- Forest floor moss
- Afternoon sunlight through leaves
- Natural plant ecosystems

## Accessibility

- Respects `prefers-reduced-motion`
- Performance monitoring with adaptive quality
- Falls back gracefully on low-end devices
- WCAG AA contrast compliance

## WebGL Settings

```typescript
{
  antialias: false,
  alpha: true,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: true,
}
```

## References

- [Codrops WebGL Ripple Tutorial](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/)
- [Piktochart Moss Green Palettes](https://piktochart.com/tips/moss-green-color-palette)
- [PANTONE Terrarium Moss](https://kidspattern.com/pantone/fhi-polyester-tsx/pantone-18-0416-tsx-terrarium-moss/)
