# Phase 05: Navbar Light Effects

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 04](./phase-04-ecosystem-effects.md) | **Next:** [Phase 06](./phase-06-sections-implementation.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | completed |
| Completed | 2026-01-10 |
| Effort | 4h |
| Dependencies | Phase 02 |

Implement light beam effect emanating from active navigation item, with text illumination and smooth transitions using IntersectionObserver for scroll-based section detection.

---

## Key Insights (from Research)

### Light Beam Technique: Conic Gradient

```css
background: conic-gradient(
  from 270deg at 0% 50%,
  transparent 0deg,
  rgba(129, 230, 217, 0.2) 15deg,
  rgba(129, 230, 217, 0.4) 30deg,
  rgba(129, 230, 217, 0.2) 45deg,
  transparent 60deg
);
```

### Text Glow Effect

```css
text-shadow:
  0 0 8px rgba(129, 230, 217, 0.8),
  0 0 16px rgba(129, 230, 217, 0.5),
  0 0 24px rgba(129, 230, 217, 0.3);
```

### IntersectionObserver Configuration

- `rootMargin: '-50% 0px -50% 0px'` - Trigger when section center is visible
- `threshold: 0` - Trigger immediately when intersecting

---

## Requirements

1. Light beam pseudo-element on active nav item
2. Text glow/illumination on active item
3. Smooth beam animation on section change
4. IntersectionObserver for automatic section detection
5. Manual click still scrolls correctly
6. Prefers-reduced-motion support
7. Mobile: bottom glow instead of side beam

---

## Architecture

```
src/
├── components/
│   └── layout/
│       ├── Navbar.tsx           # Updated with effects
│       ├── NavItem.tsx          # Updated with beam/glow
│       └── LightBeam.tsx        # Animated beam component
├── hooks/
│   └── useActiveSection.ts      # IntersectionObserver hook
└── styles/
    └── navbar.css               # Keyframe animations
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/hooks/useActiveSection.ts` | IntersectionObserver for section detection |
| `src/components/layout/NavItem.tsx` | Updated with beam and glow effects |
| `src/components/layout/Navbar.tsx` | Integrated with useActiveSection |
| `src/styles/navbar.css` | CSS animations for beam effect |

---

## Implementation Steps

### Step 1: Create useActiveSection Hook (30 min)

Create `src/hooks/useActiveSection.ts`:

```typescript
"use client";

import { useState, useEffect, useRef } from "react";

interface UseActiveSectionOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(sectionIds[0] || null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: options.rootMargin ?? "-50% 0px -50% 0px",
      threshold: options.threshold ?? 0,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(callback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionIds, options.rootMargin, options.threshold]);

  return activeSection;
}
```

### Step 2: Create Navbar CSS Animations (20 min)

Create `src/styles/navbar.css`:

```css
/* Light Beam Animation */
@keyframes beamEnter {
  0% {
    opacity: 0;
    transform: translateY(-50%) scaleX(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scaleX(1);
  }
}

@keyframes beamPulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

/* Text Glow Animation */
@keyframes glowPulse {
  0%, 100% {
    text-shadow:
      0 0 8px rgba(129, 230, 217, 0.6),
      0 0 16px rgba(129, 230, 217, 0.4),
      0 0 24px rgba(129, 230, 217, 0.2);
  }
  50% {
    text-shadow:
      0 0 12px rgba(129, 230, 217, 0.8),
      0 0 24px rgba(129, 230, 217, 0.5),
      0 0 36px rgba(129, 230, 217, 0.3);
  }
}

/* Nav Item Base */
.nav-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Light Beam (Desktop) */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 180px;
  height: 60px;
  background: conic-gradient(
    from 270deg at 0% 50%,
    transparent 0deg,
    rgba(129, 230, 217, 0.15) 12deg,
    rgba(129, 230, 217, 0.3) 25deg,
    rgba(129, 230, 217, 0.15) 38deg,
    transparent 50deg
  );
  opacity: 0;
  pointer-events: none;
  animation: beamEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             beamPulse 3s ease-in-out infinite 0.4s;
}

/* Active Text Glow */
.nav-item.active .nav-icon {
  color: #81e6d9;
  filter: drop-shadow(0 0 6px rgba(129, 230, 217, 0.6));
  animation: glowPulse 3s ease-in-out infinite;
}

/* Active Indicator Bar */
.nav-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    #81e6d9 20%,
    #81e6d9 80%,
    transparent 100%
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(129, 230, 217, 0.6);
}

/* Mobile: Bottom Glow */
@media (max-width: 767px) {
  .nav-item.active::before {
    left: 50%;
    top: auto;
    bottom: 100%;
    transform: translateX(-50%);
    width: 60px;
    height: 40px;
    background: conic-gradient(
      from 0deg at 50% 100%,
      transparent 0deg,
      rgba(129, 230, 217, 0.2) 30deg,
      rgba(129, 230, 217, 0.4) 90deg,
      rgba(129, 230, 217, 0.2) 150deg,
      transparent 180deg
    );
  }

  .nav-item.active::after {
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-item::before,
  .nav-item::after,
  .nav-item .nav-icon {
    animation: none !important;
    transition: none !important;
  }

  .nav-item.active::before {
    opacity: 1;
  }
}
```

### Step 3: Update NavItem Component (30 min)

Update `src/components/layout/NavItem.tsx`:

```typescript
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import "@/styles/navbar.css";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isMobile?: boolean;
}

export function NavItem({ href, icon, label, isActive, isMobile }: NavItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        nav-item
        relative flex items-center justify-center
        transition-all duration-300 ease-out
        group
        ${isMobile ? "flex-1 py-3" : "w-14 h-14 rounded-lg"}
        ${isActive
          ? "active text-aqua-bright"
          : "text-deep-ocean hover:text-teal-accent hover:bg-teal-accent/10"
        }
      `}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span className={`nav-icon w-6 h-6 transition-all duration-300 ${isActive ? "scale-110" : ""}`}>
        {icon}
      </span>

      {/* Tooltip (desktop only) */}
      {!isMobile && (
        <span
          className={`
            absolute left-full ml-4 px-3 py-1.5
            bg-midnight/95 text-light-aqua text-sm rounded-md
            border border-teal-accent/20
            opacity-0 group-hover:opacity-100
            pointer-events-none whitespace-nowrap
            transition-all duration-200
            ${isActive ? "border-aqua-bright/30" : ""}
          `}
        >
          {label}
        </span>
      )}
    </Link>
  );
}
```

### Step 4: Update Navbar with Active Section Detection (30 min)

Update `src/components/layout/Navbar.tsx`:

```typescript
"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NavItem } from "./NavItem";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HomeIcon, UserIcon, FolderIcon, MailIcon } from "@/components/icons";

const NAV_ITEMS = [
  { id: "home", icon: HomeIcon, href: "#home" },
  { id: "about", icon: UserIcon, href: "#about" },
  { id: "projects", icon: FolderIcon, href: "#projects" },
  { id: "contact", icon: MailIcon, href: "#contact" },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Navbar() {
  const t = useTranslations("Navigation");
  const isMobile = useIsMobile();
  const activeSection = useActiveSection(SECTION_IDS);

  if (isMobile) {
    return (
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          h-16 bg-midnight/95 backdrop-blur-md
          border-t border-teal-accent/20
          flex items-center justify-around
          safe-area-pb
        "
        role="navigation"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={<item.icon className="w-6 h-6" />}
            label={t(item.id)}
            isActive={activeSection === item.id}
            isMobile
          />
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="
        fixed left-0 top-0 z-50
        h-screen w-20
        bg-midnight/80 backdrop-blur-md
        border-r border-teal-accent/10
        flex flex-col items-center
        py-6
      "
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="mb-8">
        <div
          className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            transition-all duration-500
            ${activeSection === "home"
              ? "bg-teal-accent/30 shadow-lg shadow-teal-accent/20"
              : "bg-teal-accent/10"
            }
          `}
        >
          <span className="text-aqua-bright font-bold text-lg">D</span>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            href={item.href}
            icon={<item.icon className="w-6 h-6" />}
            label={t(item.id)}
            isActive={activeSection === item.id}
          />
        ))}
      </div>

      {/* Language switcher */}
      <LanguageSwitcher />
    </nav>
  );
}
```

### Step 5: Add Safe Area Support (10 min)

Update `src/app/globals.css`:

```css
/* Safe area for mobile notch/home indicator */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Ensure navbar doesn't overlap content */
@media (max-width: 767px) {
  main {
    padding-bottom: calc(64px + env(safe-area-inset-bottom, 0));
  }
}
```

### Step 6: Update Main Page (10 min)

Update `src/app/[locale]/page.tsx` to remove hardcoded activeSection:

```typescript
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
// ... other imports

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Navbar /> {/* No activeSection prop needed */}

      <main className="scroll-smooth">
        {/* Sections remain the same */}
      </main>
    </>
  );
}
```

### Step 7: Add Focus Styles (15 min)

Update `src/styles/navbar.css`:

```css
/* Keyboard Focus Styles */
.nav-item:focus-visible {
  outline: 2px solid #81e6d9;
  outline-offset: 4px;
  border-radius: 8px;
}

.nav-item:focus:not(:focus-visible) {
  outline: none;
}

/* Skip Link (Accessibility) */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: 1rem;
  background: #0a0a0a;
  color: #81e6d9;
  border: 2px solid #81e6d9;
}

.skip-link:focus {
  left: 50%;
  transform: translateX(-50%);
  top: 0;
}
```

### Step 8: Add Skip Link to Layout (10 min)

Update `src/app/[locale]/layout.tsx`:

```typescript
// In body, before other content:
<body className="bg-midnight text-light-aqua antialiased">
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <WaterEffects />
  {/* ... rest of content */}
</body>

// Update main in page.tsx:
<main id="main-content" className="scroll-smooth">
```

---

## Todo List

- [x] Create useActiveSection hook with IntersectionObserver
- [x] Create navbar.css with beam and glow animations
- [x] Update NavItem with CSS classes and effects
- [x] Update Navbar to use useActiveSection
- [x] Add smooth scroll on nav click
- [x] Add safe area support for mobile
- [x] Add focus-visible styles for keyboard navigation
- [x] Add skip link for accessibility
- [x] Test beam animation timing and smoothness
- [x] Test on mobile with bottom glow effect
- [x] Verify prefers-reduced-motion works
- [x] Test section detection accuracy while scrolling

---

## Success Criteria

1. Light beam animates from active nav item (desktop)
2. Text glows on active item
3. Active section auto-updates while scrolling
4. Click on nav item scrolls smoothly to section
5. Mobile shows bottom glow effect
6. Animations disabled with prefers-reduced-motion
7. Keyboard navigation works with visible focus

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| IntersectionObserver timing issues | Medium | Medium | Adjust rootMargin for accuracy |
| Beam animation jank | Low | Medium | Use CSS transforms only |
| Z-index conflicts with water | Medium | Low | Set explicit z-index layers |
| Safari conic-gradient issues | Low | Low | Test and provide fallback |

---

## Security Considerations

- No user input processed
- All styles are static CSS

---

## Next Steps

Proceed to [Phase 06 - Sections Implementation](./phase-06-sections-implementation.md) for building out Hero, About, Projects, and Contact sections.
