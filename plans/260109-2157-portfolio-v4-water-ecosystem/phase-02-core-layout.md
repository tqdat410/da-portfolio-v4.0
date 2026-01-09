# Phase 02: Core Layout

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 01](./phase-01-project-setup.md) | **Next:** [Phase 03](./phase-03-water-effects.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | pending |
| Effort | 3h |
| Dependencies | Phase 01 |

Build the application shell: vertical navigation bar (left-side), section containers, and responsive layout structure.

---

## Key Insights (from Research)

- Fixed sidebar: `position: fixed; left: 0; width: 60-100px`
- **TEXT-ONLY navbar** (no icons) - validated requirement
- Top-to-bottom flow: Home → About → Projects → Contact
- Mobile: transform to bottom horizontal nav
- IntersectionObserver for active section detection (Phase 05)
- **Language switcher in Hero section** (not navbar) - validated requirement

---

## Requirements

1. Fixed vertical navbar on left side (desktop) - **TEXT-ONLY**
2. Bottom horizontal navbar (mobile < 768px)
3. Section container component with full-viewport height
4. Smooth scroll behavior
5. ~~Language switcher in navbar~~ → **Move to Hero section**
6. Section IDs matching navigation

---

## Architecture

```
src/components/
├── layout/
│   ├── Navbar.tsx           # Vertical nav (desktop) / Bottom nav (mobile)
│   ├── NavItem.tsx          # Individual nav item with icon
│   ├── Section.tsx          # Full-height section wrapper
│   └── LanguageSwitcher.tsx # EN/VN toggle
src/hooks/
└── useMediaQuery.ts         # Responsive breakpoint hook
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/components/layout/Navbar.tsx` | Main navigation component |
| `src/components/layout/NavItem.tsx` | Nav item with icon, label, active state |
| `src/components/layout/Section.tsx` | Full-viewport section wrapper |
| `src/components/layout/LanguageSwitcher.tsx` | Locale toggle button |
| `src/hooks/useMediaQuery.ts` | Detect mobile vs desktop |
| `src/app/[locale]/page.tsx` | Update with sections and navbar |

---

## Implementation Steps

### Step 1: Create useMediaQuery Hook (15 min)

Create `src/hooks/useMediaQuery.ts`:

```typescript
"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
```

### Step 2: Create NavItem Component (20 min)

Create `src/components/layout/NavItem.tsx`:

```typescript
"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  isMobile?: boolean;
}

export function NavItem({ href, icon, label, isActive, isMobile }: NavItemProps) {
  const baseClasses = `
    relative flex items-center justify-center
    transition-all duration-300 ease-out
    group
  `;

  const desktopClasses = `
    w-14 h-14 rounded-lg
    hover:bg-teal-accent/10
    ${isActive ? "text-aqua-bright" : "text-deep-ocean hover:text-teal-accent"}
  `;

  const mobileClasses = `
    flex-1 py-3
    ${isActive ? "text-aqua-bright" : "text-deep-ocean"}
  `;

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="w-6 h-6">{icon}</span>

      {/* Tooltip (desktop only) */}
      {!isMobile && (
        <span
          className="
            absolute left-full ml-3 px-2 py-1
            bg-midnight/90 text-light-aqua text-sm rounded
            opacity-0 group-hover:opacity-100
            pointer-events-none whitespace-nowrap
            transition-opacity duration-200
          "
        >
          {label}
        </span>
      )}
    </Link>
  );
}
```

### Step 3: Create Icons (15 min)

Create `src/components/icons/index.tsx`:

```typescript
export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

export function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
```

### Step 4: Create LanguageSwitcher (20 min)

Create `src/components/layout/LanguageSwitcher.tsx`:

```typescript
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "vn" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className="
        w-10 h-10 rounded-lg
        flex items-center justify-center
        text-sm font-medium uppercase
        text-deep-ocean hover:text-teal-accent
        hover:bg-teal-accent/10
        transition-colors duration-200
      "
      aria-label={`Switch to ${locale === "en" ? "Vietnamese" : "English"}`}
    >
      {locale === "en" ? "VN" : "EN"}
    </button>
  );
}
```

### Step 5: Create Navbar Component (30 min)

Create `src/components/layout/Navbar.tsx`:

```typescript
"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { NavItem } from "./NavItem";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HomeIcon, UserIcon, FolderIcon, MailIcon } from "@/components/icons";

interface NavbarProps {
  activeSection?: string;
}

const NAV_ITEMS = [
  { id: "home", icon: HomeIcon, href: "#home" },
  { id: "about", icon: UserIcon, href: "#about" },
  { id: "projects", icon: FolderIcon, href: "#projects" },
  { id: "contact", icon: MailIcon, href: "#contact" },
];

export function Navbar({ activeSection = "home" }: NavbarProps) {
  const t = useTranslations("Navigation");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          h-16 bg-midnight/95 backdrop-blur-sm
          border-t border-teal-accent/20
          flex items-center justify-around
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
        bg-midnight/80 backdrop-blur-sm
        border-r border-teal-accent/10
        flex flex-col items-center
        py-6
      "
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo placeholder */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-full bg-teal-accent/20 flex items-center justify-center">
          <span className="text-aqua-bright font-bold">D</span>
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

### Step 6: Create Section Component (15 min)

Create `src/components/layout/Section.tsx`:

```typescript
import { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`
        min-h-screen w-full
        flex items-center justify-center
        px-4 md:pl-24 md:pr-8
        py-16 md:py-0
        ${className}
      `}
    >
      {children}
    </section>
  );
}
```

### Step 7: Update Main Page (20 min)

Update `src/app/[locale]/page.tsx`:

```typescript
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <Navbar activeSection="home" />

      <main className="scroll-smooth">
        <Section id="home">
          <div className="text-center max-w-2xl">
            <p className="text-teal-accent mb-2">{t("Hero.greeting")}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-light-aqua mb-4">
              {t("Hero.name")}
            </h1>
            <p className="text-xl text-aqua-bright">{t("Hero.role")}</p>
          </div>
        </Section>

        <Section id="about">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-light-aqua">{t("About.title")}</h2>
            <p className="mt-4 text-aqua-bright max-w-xl">{t("About.description")}</p>
          </div>
        </Section>

        <Section id="projects">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-light-aqua">{t("Projects.title")}</h2>
            <p className="mt-4 text-aqua-bright">Projects will be displayed here</p>
          </div>
        </Section>

        <Section id="contact">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-light-aqua">{t("Contact.title")}</h2>
            <p className="mt-4 text-aqua-bright">{t("Contact.description")}</p>
          </div>
        </Section>
      </main>
    </>
  );
}
```

### Step 8: Add Smooth Scroll CSS (5 min)

Update `src/app/globals.css`:

```css
html {
  scroll-behavior: smooth;
}

/* Hide scrollbar but keep functionality */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-midnight);
}

::-webkit-scrollbar-thumb {
  background: var(--color-teal-accent);
  border-radius: 4px;
}
```

---

## Todo List

- [ ] Create useMediaQuery hook for responsive detection
- [ ] Create NavItem component with tooltip
- [ ] Create icon components (Home, User, Folder, Mail)
- [ ] Create LanguageSwitcher component
- [ ] Create Navbar component (desktop vertical, mobile horizontal)
- [ ] Create Section wrapper component
- [ ] Update main page with sections and navbar
- [ ] Add smooth scroll CSS
- [ ] Test responsive behavior at 768px breakpoint
- [ ] Verify language switching works

---

## Success Criteria

1. Navbar is fixed on left side (desktop) or bottom (mobile)
2. Clicking nav items scrolls to corresponding sections
3. Language switcher toggles between EN/VN
4. Tooltips appear on hover (desktop only)
5. All sections are full viewport height
6. Mobile breakpoint triggers at 768px

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SSR hydration mismatch with useMediaQuery | Medium | Medium | Initial state matches SSR, update on mount |
| Smooth scroll not working on Safari | Low | Low | CSS scroll-behavior has good support |

---

## Security Considerations

- No user input handling
- Links are internal anchors only

---

## Next Steps

Proceed to [Phase 03 - Water Effects](./phase-03-water-effects.md) for WebGL water ripple implementation, or [Phase 05 - Navbar Effects](./phase-05-navbar-effects.md) for light beam animations (can be done in parallel).
