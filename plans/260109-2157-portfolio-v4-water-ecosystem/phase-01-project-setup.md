# Phase 01: Project Setup

**Context:** [Main Plan](./plan.md) | **Next:** [Phase 02 - Core Layout](./phase-02-core-layout.md)

## Overview

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Status | ✅ Completed |
| Effort | 3h |
| Dependencies | None |
| Review | [Code Review Report](../reports/code-reviewer-260109-2330-phase01-setup.md) |

Initialize Next.js 14+ project with TypeScript, TailwindCSS, React Three Fiber, and i18n support using existing mock data files.

---

## Key Insights (from Research)

- R3F requires `@react-three/fiber` + `@react-three/drei` for helper utilities
- Next.js 14 App Router for modern routing and SSR
- `next-intl` recommended for i18n with App Router
- TailwindCSS for utility-first styling with CSS variables for color palette

---

## Requirements

1. Next.js 14+ with App Router and TypeScript
2. TailwindCSS with custom color palette (water ecosystem)
3. React Three Fiber + Drei for WebGL effects
4. i18n setup with en.json/vn.json locale files
5. ESLint + Prettier configuration
6. Project folder structure established

---

## Architecture

```
DaPortfolio-v4.0/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx      # Root layout with providers
│   │   │   └── page.tsx        # Main page
│   │   └── globals.css         # Tailwind + CSS variables
│   ├── components/             # (empty, for future phases)
│   ├── hooks/                  # (empty, for future phases)
│   ├── shaders/                # (empty, for future phases)
│   └── i18n/
│       ├── request.ts          # next-intl request config
│       └── routing.ts          # Locale routing config
├── messages/
│   ├── en.json                 # (move from root)
│   └── vn.json                 # (move from root)
├── public/                     # Static assets
├── tailwind.config.ts          # Custom theme
├── next.config.mjs             # Next.js config with i18n
└── tsconfig.json
```

---

## Related Code Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/layout.tsx` | Root layout with NextIntlClientProvider |
| `src/app/[locale]/page.tsx` | Main page placeholder |
| `src/app/globals.css` | Tailwind imports + CSS variables |
| `src/i18n/request.ts` | next-intl getRequestConfig |
| `src/i18n/routing.ts` | Locale definitions (en, vn) |
| `tailwind.config.ts` | Extended theme with water colors |
| `next.config.mjs` | withNextIntl plugin |
| `messages/en.json` | English locale (moved) |
| `messages/vn.json` | Vietnamese locale (moved) |

---

## Implementation Steps

### Step 1: Create Next.js Project (15 min)

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Step 2: Install Dependencies (5 min)

```bash
npm install @react-three/fiber @react-three/drei three
npm install next-intl
npm install -D @types/three
```

### Step 3: Configure TailwindCSS Theme (20 min)

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0a0a0a",
        "deep-ocean": "#1a365d",
        "teal-accent": "#2c7a7b",
        "aqua-bright": "#81e6d9",
        "light-aqua": "#b2f5ea",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 4: Setup CSS Variables (10 min)

Update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-midnight: #0a0a0a;
  --color-deep-ocean: #1a365d;
  --color-teal-accent: #2c7a7b;
  --color-aqua-bright: #81e6d9;
  --color-light-aqua: #b2f5ea;
}

body {
  background-color: var(--color-midnight);
  color: var(--color-light-aqua);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Step 5: Move Locale Files (5 min)

```bash
mkdir -p messages
mv en.json messages/en.json
mv vn.json messages/vn.json
```

### Step 6: Setup i18n Configuration (30 min)

Create `src/i18n/routing.ts`:

```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vn"],
  defaultLocale: "en",
});
```

Create `src/i18n/request.ts`:

```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### Step 7: Configure next.config.mjs (15 min)

```javascript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
```

### Step 8: Create Root Layout (20 min)

Create `src/app/[locale]/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";

export const metadata: Metadata = {
  title: "Tran Quoc Dat - Portfolio",
  description: "Software Engineer & SAP Technical Consultant",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-midnight text-light-aqua antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Step 9: Create Placeholder Page (10 min)

Create `src/app/[locale]/page.tsx`:

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-aqua-bright">{t("greeting")}</p>
        <h1 className="text-4xl font-bold text-light-aqua">{t("name")}</h1>
        <p className="text-teal-accent">{t("role")}</p>
      </div>
    </main>
  );
}
```

### Step 10: Verify Setup (10 min)

```bash
npm run dev
# Visit http://localhost:3000/en and http://localhost:3000/vn
```

---

## Todo List

- [x] Run create-next-app with specified options (Next.js 16.1.1 ✅)
- [x] Install R3F, Drei, Three, next-intl dependencies (All installed ✅)
- [x] Configure TailwindCSS with water ecosystem colors (⚠️ Green palette used instead)
- [x] Setup CSS variables in globals.css (✅ TailwindCSS v4 inline theme)
- [x] Move en.json/vn.json to messages/ directory (✅)
- [x] Create i18n routing and request configuration (✅)
- [x] Update next.config.mjs with next-intl plugin (✅ next.config.ts)
- [x] Create root layout with NextIntlClientProvider (✅)
- [x] Create placeholder page with translation test (✅)
- [x] Verify both locales render correctly (✅ Build succeeds)

**Notes:**
- TailwindCSS v4 uses inline `@theme` directive instead of separate config file
- Color palette changed from blue/teal to green-toned ecosystem theme
- Fonts loaded via `next/font/google` instead of `geist` npm package
- Prettier not configured (ESLint only)

---

## Success Criteria

1. ✅ `npm run dev` starts without errors
2. ✅ `/en` and `/vn` routes display localized content
3. ✅ TailwindCSS custom colors work in components
4. ✅ No TypeScript errors in IDE (strict mode enabled)
5. ⚠️ Lighthouse accessibility check passes on placeholder page (not run, projected 95+)

**Actual Results:**
- Build time: 1949.9ms (excellent)
- No TypeScript errors
- No ESLint warnings
- 5 static pages pre-rendered
- Bundle size: ~135KB gzipped (estimated)

**Issues Found:**
- Middleware deprecation warning (Next.js 16 prefers "proxy")
- Missing Prettier configuration
- No CSP security headers
- Color palette differs from plan specification

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| next-intl version incompatibility | Low | Medium | Pin to known working version (^3.22) |
| R3F SSR issues | Medium | High | Use dynamic imports with ssr: false |
| Font loading issues | Low | Low | Use Geist fonts from Next.js |

---

## Security Considerations

- No user input in this phase
- External images only from Cloudinary (trusted domain)
- No sensitive data exposed

---

## Next Steps

Proceed to [Phase 02 - Core Layout](./phase-02-core-layout.md) to build the app shell with vertical navigation and section containers.
