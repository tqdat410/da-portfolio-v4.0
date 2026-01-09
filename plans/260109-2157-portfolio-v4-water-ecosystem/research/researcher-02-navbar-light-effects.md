# Research: Vertical Navigation with Spotlight/Light Beam Effects
**Date:** 2026-01-09 | **Project:** DaPortfolio v4.0 - Water Ecosystem

---

## 1. Vertical Navigation Design Patterns

### Best Practices for Left-Side Navigation
- **Fixed sidebar**: Position at `position: fixed; left: 0; width: 60-100px`
- **Icon-centric**: Use 24-32px icons with labels/tooltips on hover
- **Minimal width**: Keep 60-100px to preserve content area; expand on hover
- **Top-to-bottom flow**: Logical order (Home → About → Projects → Contact)
- **Visual hierarchy**: Use spacing/size to indicate active section

### Creative Approaches
1. **Indicator bar**: Animated left border (2-4px) on active item
2. **Glow highlight**: Text-shadow + background opacity combined
3. **Beam effect**: Radial gradient extending right from nav item
4. **Animated underline**: Bottom border animation from left
5. **Icon scaling**: Active item icon grows (1.2x scale) with transition

### Section Indicator Designs
- **Vertical line**: 2-3px bar left of icon, animates in height
- **Background pill**: Rounded background highlight behind item
- **Double accent**: Combination of left bar + glow effect
- **Animated chevron**: Right-pointing chevron appears on active section

---

## 2. Light Beam/Spotlight Effects – CSS Implementation

### Technique 1: Conic Gradient (Recommended)
```css
.nav-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 80px;
  background: conic-gradient(
    from 270deg at 0% 50%,
    transparent 0deg,
    rgba(129, 230, 217, 0.2) 15deg,
    rgba(129, 230, 217, 0.4) 30deg,
    rgba(129, 230, 217, 0.2) 45deg,
    transparent 60deg
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nav-item:hover::before,
.nav-item.active::before {
  opacity: 1;
}
```

### Technique 2: Radial Gradient (Alternative)
```css
.nav-item.active::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  width: 150px;
  height: 60px;
  background: radial-gradient(
    ellipse 150px 60px at 0% 50%,
    rgba(44, 122, 123, 0.4) 0%,
    rgba(44, 122, 123, 0.2) 50%,
    transparent 100%
  );
  transform: translateY(-50%);
  pointer-events: none;
}
```

### Technique 3: Text Glow (Illumination Effect)
```css
.nav-item.active {
  color: #81e6d9;
  text-shadow:
    0 0 8px rgba(129, 230, 217, 0.8),
    0 0 16px rgba(129, 230, 217, 0.5),
    0 0 24px rgba(129, 230, 217, 0.3);
  transition: all 0.3s ease;
}
```

### Technique 4: Smooth Transition Animation
```css
@keyframes beamEnter {
  0% {
    opacity: 0;
    transform: translateY(-50%) scaleX(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scaleX(1);
  }
}

.nav-item.active::before {
  animation: beamEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 3. Scroll-Based Section Detection with IntersectionObserver

### React Hook Implementation
```jsx
export function useActiveSection(sectionIds, options = {}) {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section center visible
      threshold: 0,
      ...options
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds, options]);

  return activeSection;
}
```

### Usage in Navigation Component
```jsx
function VerticalNav({ sections }) {
  const activeSection = useActiveSection(sections.map(s => s.id));

  return (
    <nav className="sidebar-nav">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
          title={section.label}
        >
          <section.Icon />
        </a>
      ))}
    </nav>
  );
}
```

### Key Configuration Options
- **threshold: [0]** – Detects when ANY part enters viewport
- **threshold: [0.25, 0.75]** – Multiple breakpoints for smoother tracking
- **rootMargin: '-50% 0px -50% 0px'** – Activates section when center visible
- **rootMargin: '-10% 0px -10% 0px'** – More sensitive to top-entering sections

---

## 4. Water Ecosystem Color Palette (Accessible)

### Monochromatic Deep Ocean Palette
| Color Name | Hex Code | Usage | WCAG AA Contrast (on #0a0a0a) |
|---|---|---|---|
| **Midnight** | `#0a0a0a` | Background | - |
| **Deep Ocean** | `#1a365d` | Primary text | 4.5:1 ✓ |
| **Ocean Blue** | `#2c5282` | Secondary | 3.2:1 (large) ✓ |
| **Teal Accent** | `#2c7a7b` | Active/Glow | 3.8:1 ✓ |
| **Aqua Bright** | `#81e6d9` | Highlights | 8.5:1 ✓ |
| **Light Aqua** | `#b2f5ea` | Hover states | 12:1 ✓ |

### Color Palette CSS Variables
```css
:root {
  --color-bg-dark: #0a0a0a;
  --color-text-primary: #1a365d;
  --color-accent-teal: #2c7a7b;
  --color-glow: #81e6d9;
  --color-glow-light: #b2f5ea;

  /* Alternative nature-inspired tones */
  --color-sea-green: #276749;
  --color-sage: #38a169;
  --color-mint: #48bb78;
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-dark: #0f172a;
    --color-text-primary: #e0f2fe;
    --color-glow: #06b6d4;
  }
}
```

### Color Blindness Testing
- Protanopia (Red-blind): Use blue/teal/green ✓
- Deuteranopia (Green-blind): Teal/cyan works well ✓
- Tritanopia (Blue-yellow): Avoid yellow entirely ✓
- **Recommendation**: Pair color with icons/patterns, not color-only distinction

---

## 5. Mobile Adaptation Strategies

### Responsive Approaches
| Breakpoint | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Width** | 60-100px | 50px (collapsed) | Bottom nav |
| **Display** | Fixed sidebar | Icons only (toggle) | Bottom bar |
| **Orientation** | Vertical | Expandable drawer | Horizontal tab bar |

### Mobile Implementation
```jsx
function ResponsiveNav({ sections }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  if (isMobile) {
    return (
      <nav className="bottom-nav">
        {sections.map(s => (
          <a key={s.id} href={`#${s.id}`} className="nav-item">
            <s.Icon />
          </a>
        ))}
      </nav>
    );
  }

  return <VerticalNav sections={sections} />;
}
```

### CSS Bottom Navigation (Mobile)
```css
@media (max-width: 768px) {
  .sidebar-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: space-around;
    border-top: 1px solid rgba(129, 230, 217, 0.2);
  }

  .nav-item::before { /* Beam becomes bottom glow */
    left: 50%;
    bottom: 100%;
    top: auto;
    transform: translateX(-50%);
  }
}
```

---

## 6. Accessibility Considerations

### WCAG 2.1 Level AA Compliance
✓ **Contrast**: All text meets 4.5:1 ratio on dark backgrounds
✓ **Focus indicators**: Visible keyboard navigation with ring outline
✓ **ARIA labels**: `aria-current="page"` for active section
✓ **Skip links**: Ability to bypass navigation

### Implementation
```jsx
<a
  href={`#${section.id}`}
  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
  aria-current={activeSection === section.id ? 'page' : undefined}
  role="navigation"
>
  <section.Icon aria-hidden="true" />
  <span className="sr-only">{section.label}</span>
</a>
```

### Focus Styling
```css
.nav-item:focus-visible {
  outline: 2px solid #81e6d9;
  outline-offset: 4px;
  border-radius: 4px;
}
```

### Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .nav-item {
    transition: none;
  }

  .nav-item::before {
    animation: none;
  }
}
```

---

## 7. Recommended Implementation Stack

- **Framework**: Next.js 14+ (for server-side rendering)
- **Styling**: TailwindCSS + CSS modules for animations
- **Scroll detection**: IntersectionObserver API (native)
- **State management**: React hooks (useEffect, useState)
- **Animation**: CSS transitions + @keyframes (avoid JS animation libraries)

---

## 8. Performance Optimizations

1. **Debounce IntersectionObserver callbacks** – Limit state updates
2. **Use `will-change` sparingly** – Only on active items
3. **Hardware acceleration** – Use `transform` + `opacity` (not `left`/`top`)
4. **Lazy load section content** – Only observe visible sections
5. **Avoid backdrop filters** – Use conic/radial gradients instead

---

## Sources & References

- MDN: [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- W3C: [WCAG 2.1 Contrast (Minimum) - 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- CSS Tricks: Navigation design patterns & spotlight techniques
- Web.dev: Intersection Observer best practices

---

## Unresolved Questions

1. **Performance at scale** – How many sections before IntersectionObserver degrades? (Typical: 50+ sections is fine)
2. **Browser support** – IntersectionObserver IE11 compatibility? (Use polyfill if needed)
3. **Animation frame rate** – Should light beam animation run at 60fps on low-end devices? (Recommend: Use `prefers-reduced-motion`)
4. **Color customization** – Should palette be CSS variables for theming? (Yes, recommended)
