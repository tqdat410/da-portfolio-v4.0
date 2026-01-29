# Design Guidelines - Da'Portfolio v4.0

> Dark Neon Water (Thủy + Kim) Theme - "Bioluminescent Abyss"
> Last updated: 2026-01-25

## Color Palette

### Core Palette (Bioluminescent Abyss)
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Deep Abyss | `#020617` | `--color-deep-abyss` | Main Background (Slate 950 - Almost Black) |
| Neon Cyan | `#06b6d4` | `--color-neon-cyan` | Main Glow/Accent (Cyan 500) |
| Electric Blue | `#3b82f6` | `--color-electric-blue` | Secondary Glow (Blue 500) |
| Bright Silver | `#e2e8f0` | `--color-bright-silver` | Main Text (Slate 200) |
| Biolum Glow | `#22d3ee` | `--color-biolum-glow` | Intense Glow (Cyan 400) |

### Surface & Accents
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Glass Surface | `rgba(15, 23, 42, 0.7)` | `--color-glass-surface` | Navbars, Cards (Slate 900 w/ Alpha) |
| Steel Dark | `#1e293b` | `--color-steel-dark` | Secondary Backgrounds (Slate 800) |
| Chrome Highlight | `#f1f5f9` | `--color-chrome-highlight` | Metal Reflections (Slate 100) |
| Abyss Shadow | `#000000` | `--color-abyss-shadow` | Deepest Shadows |

### Theme Variables
```css
--background: #020617;  /* Deep Abyss */
--foreground: #e2e8f0;  /* Bright Silver */
```

## Typography

### Fonts
- **Display/Branding**: "Style Script" (cursive) - Used for "Da'portfolio" hero text
- **Body**: "Luxurious Roman" (serif) - Default body text

### Font Classes
```css
.style-script-regular {
  font-family: "Style Script", cursive;
  font-weight: 400;
}

.luxurious-roman-regular {
  font-family: "Luxurious Roman", serif;
  font-weight: 400;
}
```

## Hero Section

### Design Principles
- **Dark & Glowing**: High contrast, mysterious, futuristic aesthetic.
- **Bioluminescent**: Neon elements glowing against deep dark water.
- **Immersive**: Fluid simulation feels like deep ocean currents.

### Implementation
- Text positioned at 80% from top (y: 0.8)
- Font size: 48px (mobile), 140px (desktop)
- Glow effect: Neon Cyan `#06b6d4` with strong 40px blur
- Background: Deep Abyss `#020617`
- Text Color: Bright Silver `#e2e8f0`

### Water Effect
- GPU-accelerated fluid simulation
- Click creates strong ripple (intensity: 1.5)
- Mouse move creates subtle trail (intensity: 0.4)
- Glowing ripples in dark water

## Navbar

### Colors
- Background: Deep Abyss `#020617` with 90% opacity (mobile) / 80% (desktop) + blur
- Borders: Thin Neon Cyan borders (`border-cyan-500/30`)
- Active items: Neon Cyan text (`text-cyan-400`)
- Inactive items: Slate 400 (`text-slate-400`)
- Hover: Cyan 300 (`text-cyan-300`) with subtle bg glow

### Animations
- **Light Beam**: Neon Cyan/Electric Blue conical gradient beam
- **Text Glow**: Pulsing Neon Cyan shadow (`drop-shadow(0 0 8px ...)`)
- **Indicator Bar**: Neon Cyan to Electric Blue gradient
- **Focus Ring**: Sharp Neon Cyan outline

## Accessibility

### Contrast Ratios
- Bright Silver on Deep Abyss: 15.4:1 ✅ (exceeds WCAG AAA)
- Neon Cyan on Deep Abyss: 8.6:1 ✅ (exceeds WCAG AAA)
- Electric Blue on Deep Abyss: 5.8:1 ✅ (exceeds WCAG AA)

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce`:
- Animations disabled
- Transitions minimized to 0.01ms
- Static fallback for hero section

### Touch Targets
- Minimum 44x44px for all interactive elements
- Mobile nav items: 48x48px minimum

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px
