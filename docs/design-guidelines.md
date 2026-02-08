# Design Guidelines

**Project:** DaPortfolio v4.0
**Design System:** Silver Mist
**Last Updated:** 2026-02-08

## Design System Overview

Silver Mist is a modern, elegant design system built on slate tones. It emphasizes clarity, hierarchy, and accessibility while maintaining a sophisticated visual experience.

## Color Palette

### Primary Colors

| Color | Hex | CSS Variable | Use Case |
|-------|-----|-------------|----------|
| **Slate 900** | `#0f172a` | `--text-primary` | Headings, primary text |
| **Slate 800** | `#1e293b` | `--text-body` | Body text, primary content |
| **Slate 500** | `#64748b` | `--text-secondary` | Secondary text, hints |
| **Slate 100** | `#f1f5f9` | `--bg-primary` | Main background |

### Secondary Colors

| Color | Hex | CSS Variable | Use Case |
|-------|-----|-------------|----------|
| **White** | `#ffffff` | `--bg-highlight` | Highlights, surfaces |
| **Slate 400** | `#cbd5e1` | `--accent-glow` | Borders, subtle emphasis |
| **Slate 500** | `#64748b` | `--accent-shadow` | Shadows, depth |

### Surface Colors

```css
/* Semi-transparent surfaces for glass effect */
--bg-surface: rgba(241, 245, 249, 0.7);
--bg-surface-hover: rgba(241, 245, 249, 0.85);
--bg-surface-active: rgba(241, 245, 249, 0.95);
```

### Usage Examples

```jsx
// Headings - Slate 900
<h1 className="text-slate-900">Welcome to DaPortfolio</h1>

// Body text - Slate 800
<p className="text-slate-800">Detailed description here</p>

// Secondary text - Slate 500
<span className="text-slate-500">Supporting information</span>

// Background - Slate 100
<div className="bg-slate-100">Main content area</div>

// Surfaces - Semi-transparent
<div className="bg-[rgba(241,245,249,0.7)]">Card content</div>
```

## Typography

### Font Families

```css
/* Define in globals.css */
--font-luxurious-roman: 'Luxurious Roman', serif;
--font-style-script: 'Style Script', cursive;
--font-mono: 'Geist Mono', monospace;
```

### Font Hierarchy

| Level | Font | Size | Weight | Line Height | Use Case |
|-------|------|------|--------|-------------|----------|
| **H1** | Luxurious Roman | 48px | 400 | 1.2 | Page titles, hero |
| **H2** | Luxurious Roman | 36px | 400 | 1.3 | Section titles |
| **H3** | Luxurious Roman | 28px | 400 | 1.4 | Subsection titles |
| **H4** | Geist Sans | 20px | 600 | 1.5 | Card titles |
| **Body** | Geist Sans | 16px | 400 | 1.6 | Main text |
| **Small** | Geist Sans | 14px | 400 | 1.5 | Captions, labels |
| **Display** | Style Script | 64px | 400 | 1.2 | Hero tagline |
| **Code** | Geist Mono | 14px | 400 | 1.5 | Code blocks |

### Text Hierarchy Implementation

```tsx
// File: src/components/sections/About/About.tsx

export const About = () => {
  return (
    <section>
      {/* H1 - Luxurious Roman */}
      <h1 className="font-[var(--font-luxurious-roman)] text-5xl text-slate-900">
        About Me
      </h1>

      {/* H2 - Luxurious Roman */}
      <h2 className="font-[var(--font-luxurious-roman)] text-3xl mt-8 text-slate-800">
        Professional Background
      </h2>

      {/* Body - Default sans-serif */}
      <p className="text-lg text-slate-800 mt-4">
        I'm a full-stack developer with expertise in modern web technologies...
      </p>

      {/* H3 - Luxurious Roman */}
      <h3 className="font-[var(--font-luxurious-roman)] text-2xl mt-6 text-slate-900">
        Technical Skills
      </h3>

      {/* Small - Labels */}
      <span className="text-sm text-slate-500 uppercase tracking-wider">
        Proficiency Level
      </span>
    </section>
  );
};
```

### Font Weights

```css
/* Limit to two weights per font for performance */
Luxurious Roman:
  - 400 (regular) - All headings

Geist Sans:
  - 400 (regular) - Body text
  - 600 (semibold) - Emphasis, card titles

Geist Mono:
  - 400 (regular) - Code blocks
```

## Spacing System

### Scale

Built on 8px base unit (Tailwind convention):

```
0 = 0px
1 = 8px
2 = 16px
3 = 24px
4 = 32px
5 = 40px
6 = 48px
7 = 56px
8 = 64px
```

### Spacing Rules

```jsx
// Section padding
<section className="px-6 md:px-8 py-12 md:py-16 lg:py-20">
  {/* Large vertical spacing between sections */}
</section>

// Component spacing
<div className="mb-4">
  <h3 className="text-xl mb-2">Title</h3>
  <p className="text-slate-600">Description</p>
</div>

// Grid gaps
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Consistent gap between items */}
</div>

// Card padding
<div className="p-6 md:p-8 rounded-lg">
  {/* Proportional internal spacing */}
</div>
```

### Responsive Spacing

```
Mobile (base):     px-6 py-4
Tablet (sm):       px-8 py-6
Laptop (lg):       px-12 py-8
Desktop (xl):      px-16 py-12
```

## Layout & Grids

### Page Layout

```
Desktop:
┌─────────────────────────────────────┐
│         Navigation Navbar           │
│ (fixed, vertical, left sidebar)     │
├──────────────────────────────────┐  │
│                                  │  │
│      Main Content Area           │  │
│      (full width)                │  │
│                                  │  │
│      • Hero Section              │  │
│      • About Section             │  │
│      • Projects Section          │  │
│      • Contact Section           │  │
│                                  │  │
└──────────────────────────────────┘  │
└─────────────────────────────────────┘

Mobile:
┌──────────────────────────────────────┐
│   Top Navbar (horizontal)            │
├──────────────────────────────────────┤
│                                      │
│      Main Content (full width)       │
│                                      │
│      • Hero Section                  │
│      • About Section                 │
│      • Projects Section              │
│      • Contact Section               │
│                                      │
└──────────────────────────────────────┘
```

### Grid System

```jsx
// Projects grid - responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>

// Skills grid - 2x columns
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {skillCategories.map(category => (
    <SkillCategory key={category.id} category={category} />
  ))}
</div>

// Section layout - full width with centered content
<div className="max-w-6xl mx-auto px-6">
  {/* Content with max width constraint */}
</div>
```

## Components

### Buttons

```jsx
// Primary Button
<button className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
  Primary Action
</button>

// Secondary Button
<button className="px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
  Secondary Action
</button>

// Icon Button
<button
  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
  aria-label="Close"
>
  <XIcon />
</button>
```

### Cards

```jsx
// Standard Card
<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
  <h3 className="font-[var(--font-luxurious-roman)] text-2xl mb-2">
    Title
  </h3>
  <p className="text-slate-600">Description</p>
</div>

// Project Card
<div className="group overflow-hidden rounded-lg bg-slate-50 hover:bg-slate-100">
  <div className="aspect-video bg-slate-200 overflow-hidden">
    <img src="preview" alt="project" className="w-full h-full object-cover" />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
    <p className="text-slate-600 text-sm">{project.description}</p>
  </div>
</div>
```

### Input Fields

```jsx
// Text Input
<div className="mb-6">
  <label className="block text-sm font-semibold text-slate-900 mb-2">
    Email
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none transition-colors"
    placeholder="your@email.com"
  />
</div>

// Textarea
<textarea
  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none transition-colors"
  rows={5}
  placeholder="Your message..."
/>

// Select
<select className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none">
  <option>Select an option</option>
</select>
```

## Effects & Animations

### Micro-interactions

```css
/* Smooth transitions for interactive elements */
.interactive {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Focus states for accessibility */
button:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: 2px;
}
```

### GSAP Animations

```typescript
// Scroll-triggered fade in
gsap.to('.fade-in', {
  scrollTrigger: {
    trigger: '.fade-in',
    start: 'top center',
    end: 'center center',
    scrub: 0.5,
  },
  opacity: 1,
  y: 0,
  duration: 0.8,
});

// Parallax effect
gsap.to('.parallax', {
  scrollTrigger: {
    trigger: '.parallax',
    scrub: 1,
  },
  y: -50,
  duration: 1,
});

// Stagger children
gsap.to('.item', {
  opacity: 1,
  stagger: 0.1,
  duration: 0.5,
});
```

### Reduced Motion

```jsx
// Respect accessibility preferences
import { useReducedMotion } from '@/hooks';

export const AnimatedSection = () => {
  const prefersReduced = useReducedMotion();

  useGSAP(() => {
    if (prefersReduced) {
      // No animations
      gsap.set('.item', { opacity: 1 });
    } else {
      // Full animations
      gsap.to('.item', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
      });
    }
  }, [prefersReduced]);

  return <div className="item">Content</div>;
};
```

## Visual Effects

### Water Simulation

The water canvas provides an interactive background effect:

```jsx
<WaterCanvas
  width={800}
  height={600}
  interactive={true}
  damping={0.99}
/>
```

**Visual characteristics:**
- Subtle ripple effect on interaction
- Smooth wave propagation
- Semi-transparent overlay
- Caustics light pattern overlay
- Performance-adaptive quality

### Particle Systems

#### Rain Particles
- Falling particles with wind drift
- Collision with surfaces
- Gradual fade-out
- GPU-accelerated rendering

#### Ambient Particles
- Floating motion with Perlin noise
- Organic, natural movement
- Low opacity for subtlety
- Continuous animation

### Caustics Effect

- Animated underwater light patterns
- Scrolling effect over surfaces
- Adjustable intensity
- Creates depth perception

## Accessibility Considerations

### Color Contrast

**WCAG AA Compliance (4.5:1 minimum for text):**

```
Slate 900 on Slate 100:  Ratio 21:1 ✓
Slate 800 on Slate 100:  Ratio 12:1 ✓
Slate 500 on Slate 100:  Ratio 2.5:1 ✗ (Labels only)
White on Slate 900:      Ratio 17:1 ✓
```

**Usage:**
- Primary text: Slate 900 on Slate 100
- Body text: Slate 800 on Slate 100
- Labels: Slate 500 (use sparingly, supplement with icons)
- Avoid relying on color alone for information

### Focus Indicators

```css
/* Visible focus ring for keyboard navigation */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid var(--text-primary);
  outline-offset: 2px;
}
```

### Touch Targets

```
Mobile (touch):  44px x 44px minimum
Desktop:         40px x 40px minimum
Spacing:         8px between targets
```

### Text Sizing

```
Minimum: 14px
Body text: 16px
Headings: 20px+
Line height: 1.5-1.6 (150-160%)
Letter spacing: 0.5px for headings
```

## Responsive Breakpoints

```javascript
// Tailwind CSS breakpoints
base    0px      // Mobile-first (default)
sm      640px    // Landscape phone
md      768px    // Tablet
lg      1024px   // Small laptop
xl      1280px   // Laptop
2xl     1536px   // Desktop

// Usage in components:
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text
</div>
```

## Dark Mode (Future)

Reserved for future implementation:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1f2e;
    --text-primary: #f1f5f9;
    --text-body: #cbd5e1;
    /* ... */
  }
}
```

## Implementation Checklist

When implementing designs:

- [ ] Use CSS variables for colors
- [ ] Respect spacing scale (8px units)
- [ ] Check text contrast ratios
- [ ] Test focus states
- [ ] Verify responsive behavior (sm, md, lg)
- [ ] Use semantic HTML
- [ ] Add ARIA labels to icons
- [ ] Support reduced motion
- [ ] Test with keyboard only
- [ ] Verify on actual mobile device

## Design Assets

### Logo
- Location: `logo_full.png`
- Format: PNG with transparency
- Use: Header, favicon

### Favicon
- Location: `src/app/favicon.ico`
- Sizes: 16x16, 32x32
- Format: ICO

### SVG Icons
- Location: `src/components/icons/`
- Convention: PascalCase component
- Props: `size`, `color`, `className`

```jsx
import { GitHubIcon } from '@/components/icons';

<GitHubIcon size={24} color="currentColor" />
```

## Summary

**Design Principles:**
1. **Clarity** - Easy to understand at a glance
2. **Elegance** - Sophisticated, not overly decorated
3. **Consistency** - Predictable patterns and spacing
4. **Accessibility** - Inclusive for all users
5. **Performance** - Visual effects don't compromise speed
6. **Responsive** - Seamless across device sizes
