# Phase 07: Polish & Optimization

**Context:** [Main Plan](./plan.md) | **Prev:** [Phase 06](./phase-06-sections-implementation.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Status | pending |
| Effort | 2h |
| Dependencies | All previous phases |

Final polish: performance optimization, accessibility audit, SEO configuration, and mobile responsiveness refinement.

---

## Key Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | >= 80 | Chrome DevTools |
| Lighthouse Accessibility | >= 90 | Chrome DevTools |
| First Contentful Paint | < 1.5s | Web Vitals |
| Time to Interactive | < 3.5s | Web Vitals |
| WCAG Compliance | AA | axe DevTools |

---

## Requirements

1. **Performance**: Optimize bundle size, lazy loading, code splitting
2. **Accessibility**: WCAG AA compliance, keyboard navigation, screen reader support
3. **SEO**: Meta tags, Open Graph, structured data, sitemap
4. **Mobile**: Touch targets, viewport optimization, reduced motion
5. **PWA**: Basic manifest for add-to-home-screen

---

## Architecture

```
src/
├── app/
│   ├── manifest.ts          # PWA manifest
│   ├── sitemap.ts            # Dynamic sitemap
│   └── [locale]/
│       ├── layout.tsx        # Add meta tags
│       └── opengraph-image.tsx  # OG image generation
public/
├── robots.txt
└── favicon.ico
```

---

## Implementation Steps

### Step 1: Performance Optimization (30 min)

#### 1.1 Dynamic Imports for Heavy Components

Update `src/components/water/index.tsx`:

```typescript
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load water effects after initial render
const WaterCanvasLazy = dynamic(
  () => import("./WaterCanvas").then((mod) => mod.WaterCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

export function WaterEffects() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading water effects until after first paint
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  return <WaterCanvasLazy />;
}
```

#### 1.2 Image Optimization

Update `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei"],
  },
};
```

#### 1.3 Bundle Analysis Script

Add to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Install: `npm install @next/bundle-analyzer`

Update `next.config.mjs`:

```javascript
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
```

### Step 2: SEO Configuration (30 min)

#### 2.1 Enhanced Metadata

Update `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Hero" });

  const title = `${t("name")} | ${t("role")}`;
  const description = t("description");

  return {
    title: {
      default: title,
      template: `%s | ${t("name")}`,
    },
    description,
    keywords: [
      "software engineer",
      "portfolio",
      "SAP consultant",
      "web developer",
      "React",
      "Next.js",
      "TypeScript",
    ],
    authors: [{ name: t("name") }],
    creator: t("name"),
    metadataBase: new URL("https://tranquocdat.com"),
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        vi: "/vn",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "vn" ? "vi_VN" : "en_US",
      url: "/",
      title,
      description,
      siteName: t("name"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@trandat40",
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

#### 2.2 Sitemap

Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tranquocdat.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/vn`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
```

#### 2.3 Robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://tranquocdat.com/sitemap.xml
```

### Step 3: Accessibility Improvements (30 min)

#### 3.1 Focus Management

Update `src/components/sections/Projects/ProjectModal.tsx`:

```typescript
// Add focus trap
import { useRef, useEffect } from "react";

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (project) {
      // Focus close button when modal opens
      closeButtonRef.current?.focus();

      // Trap focus within modal
      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      };

      document.addEventListener("keydown", handleTab);
      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [project]);

  // ... rest of component
}
```

#### 3.2 ARIA Improvements

Update components with proper ARIA attributes:

```typescript
// In Navbar
<nav role="navigation" aria-label="Main navigation">

// In Section
<section aria-labelledby={`${id}-heading`}>
  <h2 id={`${id}-heading`}>{title}</h2>
</section>

// In ProjectCard
<article aria-label={`Project: ${title}`}>

// In Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">{project.title}</h2>
</div>
```

#### 3.3 Screen Reader Only Text

Add to `src/app/globals.css`:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Step 4: Mobile Refinement (20 min)

#### 4.1 Touch Targets

Ensure all interactive elements are at least 44x44px:

```css
/* In globals.css */
button,
a,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
}

@media (max-width: 767px) {
  .nav-item {
    min-height: 48px;
    min-width: 48px;
  }
}
```

#### 4.2 Viewport Meta

Ensure in layout:

```typescript
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};
```

#### 4.3 Reduced Motion

Already implemented in Phase 03-05, verify all animations respect:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Step 5: PWA Manifest (10 min)

Create `src/app/manifest.ts`:

```typescript
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tran Quoc Dat - Portfolio",
    short_name: "TQD Portfolio",
    description: "Software Engineer & SAP Technical Consultant",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#2c7a7b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

### Step 6: Final Testing Checklist (20 min)

#### Performance Tests

```bash
# Run Lighthouse
npx lighthouse https://localhost:3000 --view

# Check bundle size
npm run analyze
```

#### Accessibility Tests

```bash
# Install axe
npm install -D @axe-core/react

# Add to layout for dev only
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

#### Manual Checks

- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader announces content correctly
- [ ] Color contrast passes (use Chrome DevTools)
- [ ] Mobile touch targets are large enough
- [ ] All images have alt text
- [ ] Language switcher updates all content
- [ ] Modal focus trap works
- [ ] Reduced motion preference is respected

---

## Todo List

- [ ] Implement lazy loading for water effects
- [ ] Configure image optimization in next.config
- [ ] Add bundle analyzer
- [ ] Create enhanced metadata with OG tags
- [ ] Create sitemap.ts
- [ ] Create robots.txt
- [ ] Implement focus trap in modal
- [ ] Add ARIA attributes to all components
- [ ] Add sr-only utility class
- [ ] Ensure touch targets are 44px minimum
- [ ] Configure viewport meta
- [ ] Verify reduced motion support
- [ ] Create PWA manifest
- [ ] Run Lighthouse audit
- [ ] Run axe accessibility audit
- [ ] Complete manual testing checklist

---

## Success Criteria

1. Lighthouse Performance >= 80
2. Lighthouse Accessibility >= 90
3. All WCAG AA contrast requirements met
4. Keyboard navigation works throughout
5. Screen reader can navigate all content
6. Mobile touch targets >= 44px
7. PWA installable
8. No console errors or warnings

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Bundle size too large | Medium | Medium | Use bundle analyzer, code split |
| Accessibility issues missed | Medium | High | Use automated + manual testing |
| OG image not generating | Low | Low | Fallback to static image |

---

## Security Considerations

- CSP headers (configure in next.config)
- No inline scripts
- External resources from trusted domains only

---

## Deployment Notes

1. Build and test locally: `npm run build && npm start`
2. Run Lighthouse on production build
3. Verify all features work in production mode
4. Deploy to Cloudflare Pages or Vercel
5. Set up analytics (optional)

---

## Future Improvements (Not in Scope)

- [ ] Add blog section
- [ ] Implement contact form with backend
- [ ] Add project filtering/search
- [ ] Implement dark/light theme toggle
- [ ] Add page transitions with Framer Motion
- [ ] Implement 3D project showcases
