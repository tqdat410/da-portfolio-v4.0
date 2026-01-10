# Code Review: Phase 02 - Core Layout Implementation

**Project:** DaPortfolio v4.0
**Review Date:** 2026-01-10
**Reviewer:** Code Review Agent
**Phase:** Phase 02 - Core Layout Components

---

## Code Review Summary

### Scope
**Files reviewed:**
- `src/hooks/useMediaQuery.ts` (new, 36 lines)
- `src/components/layout/NavItem.tsx` (new, 53 lines)
- `src/components/layout/LanguageSwitcher.tsx` (new, 42 lines)
- `src/components/layout/Navbar.tsx` (new, 86 lines)
- `src/components/layout/Section.tsx` (new, 31 lines)
- `src/components/layout/index.ts` (new, 5 lines)
- `src/app/[locale]/page.tsx` (modified, 66 lines)

**Lines of code analyzed:** ~319 lines
**Review focus:** Phase 02 Core Layout implementation (new feature)
**Updated plans:** `plans/260109-2157-portfolio-v4-water-ecosystem/plan.md`

### Overall Assessment

**Score: 7.5/10**

Implementation quality is solid with proper TypeScript typing, clean component architecture, and successful build. Code adheres to YAGNI/KISS principles and validated requirements (TEXT-ONLY navbar, language switcher in Hero section).

Critical issues identified:
1. **SSR hydration risk** in useMediaQuery hook
2. **Missing CSS class** for vertical text writing mode
3. **Accessibility gaps** in navigation and language switcher

Code demonstrates good practices: proper semantic HTML, ARIA attributes, responsive design patterns, and clean separation of concerns.

---

## Critical Issues

### 1. SSR Hydration Mismatch Risk (HIGH PRIORITY)

**File:** `src/hooks/useMediaQuery.ts`
**Lines:** 10-27

**Issue:**
`useMediaQuery` hook uses `useSyncExternalStore` correctly BUT always returns `false` on server (`getServerSnapshot`). On client mount, if media query matches, value flips to `true`, causing hydration mismatch and React warnings.

**Impact:**
- React hydration warnings in console
- Potential layout shift on first render (CLS penalty)
- Navbar may flash wrong layout (mobile→desktop or vice versa)

**Evidence:**
```typescript
const getServerSnapshot = useCallback(() => {
  return false; // SSR default - ALWAYS false
}, []);
```

If user visits on mobile device where `(max-width: 767px)` = true, server renders `false`, client hydrates with `true` → mismatch.

**Recommendation:**
Use React's `useSyncExternalStore` correctly by suppressing hydration warning:

```typescript
import { useSyncExternalStore, useCallback } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

**OR** use `useEffect` approach with initial `false` state to avoid hydration issues:

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
```

This ensures SSR always renders mobile-first (false), then updates on client.

---

### 2. Missing CSS Class Definition

**File:** `src/components/layout/NavItem.tsx`
**Line:** 41

**Issue:**
Component uses undefined CSS class `writing-mode-vertical`:

```tsx
<span className="writing-mode-vertical">{label}</span>
```

Searched `src/app/globals.css` - class not found. Text will render horizontally instead of vertically on desktop navbar.

**Impact:**
- Desktop navbar displays horizontal text (UX broken)
- Violates design requirement for vertical left-side navbar

**Recommendation:**
Add to `src/app/globals.css`:

```css
.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
```

**OR** use Tailwind utility class (if supported in v4):

```tsx
<span className="[writing-mode:vertical-rl]">{label}</span>
```

---

## High Priority Findings

### 3. Accessibility Issues - Keyboard Navigation

**Files:** `NavItem.tsx`, `LanguageSwitcher.tsx`, `Navbar.tsx`

**Issues:**

**A. NavItem missing keyboard focus styles** (Line 18-32)
No visible focus indicator for keyboard users. Current hover styles won't show on keyboard focus.

**Fix:**
```tsx
const desktopClasses = `
  w-full py-4 px-2
  hover:bg-sea-green/10 focus-visible:bg-sea-green/10
  focus-visible:outline-2 focus-visible:outline-emerald
  ${isActive ? "text-emerald bg-sea-green/10" : "text-forest-dark hover:text-mint"}
`;
```

**B. LanguageSwitcher missing focus styles** (Line 26-35)
Button lacks visible focus indicator.

**Fix:**
```tsx
className="
  px-4 py-2 rounded-lg
  flex items-center gap-2
  text-sm font-medium
  text-forest-dark hover:text-light-mint
  bg-sea-green/20 hover:bg-sea-green/40
  border border-sea-green/30 hover:border-sea-green/50
  focus-visible:outline-2 focus-visible:outline-emerald
  transition-all duration-200
"
```

**C. LanguageSwitcher aria-label incomplete** (Line 36)
Current: `aria-label={`${t("selectLanguage")}: ${targetLang}`}`
Better: Include current locale for screen readers.

**Fix:**
```tsx
aria-label={`${t("selectLanguage")}: ${t("currentLanguage")} ${locale.toUpperCase()}, ${t("switchTo")} ${targetLang}`}
```

---

### 4. Performance - Unnecessary Re-renders

**File:** `src/hooks/useMediaQuery.ts`
**Lines:** 10-25

**Issue:**
`useCallback` dependencies on `query` cause hook to recreate functions when query string changes. For static queries like `"(max-width: 767px)"`, this is unnecessary overhead.

**Impact:**
Minor performance impact (negligible for 4 nav items, but scales poorly).

**Recommendation:**
For `useIsMobile` specifically, consider memoization or static subscription:

```typescript
// Static hook for mobile detection (optimized)
const MOBILE_QUERY = "(max-width: 767px)";

export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(MOBILE_QUERY);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  );
}
```

---

### 5. Security - XSS Risk (Low, but worth noting)

**File:** `src/app/[locale]/page.tsx`
**Lines:** 20-60

**Issue:**
All translation strings (`t("Hero.greeting")`, etc.) are rendered directly without sanitization. If `messages/en.json` or `messages/vn.json` are ever modified by untrusted sources, XSS vulnerability exists.

**Current Risk:** LOW (translation files are static, committed to repo)

**Mitigation:**
- Keep translation files in source control only
- Never load translations from user input or external APIs
- If dynamic translations added later, sanitize with DOMPurify

**No immediate action required** - just awareness for future features.

---

## Medium Priority Improvements

### 6. Type Safety - Improve Translation Keys

**Files:** `Navbar.tsx`, `LanguageSwitcher.tsx`, `page.tsx`

**Issue:**
Translation keys are strings without type checking. Typos like `t("Hero.greetting")` would fail silently at runtime.

**Recommendation:**
Use `next-intl` TypeScript integration:

Create `src/types/i18n.d.ts`:
```typescript
import en from "../../messages/en.json";

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    // ...existing config
    "types": ["./src/types/i18n.d.ts"]
  }
}
```

Now `t("Hero.invalidKey")` will show TypeScript error.

---

### 7. Code Organization - Barrel Export Anti-pattern

**File:** `src/components/layout/index.ts`
**Lines:** 1-4

**Issue:**
Barrel exports (re-exporting from index.ts) can cause:
1. Larger bundle sizes (tree-shaking issues)
2. Circular dependency risks
3. Slower IDE autocomplete

**Current Impact:** Minimal (only 4 exports)

**Recommendation:**
For this small project, keep barrel exports for convenience. But if layout grows beyond 10 components, switch to direct imports:

```tsx
// Instead of: import { Navbar, Section } from "@/components/layout";
// Use:
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
```

---

### 8. Responsive Design - Magic Number Breakpoint

**Files:** `useMediaQuery.ts` (line 34), phase doc mentions 768px

**Issue:**
Hardcoded `767px` breakpoint doesn't match Tailwind's `md:` breakpoint (768px). Inconsistency can cause layout bugs.

**Recommendation:**
Align with Tailwind breakpoints:

```typescript
// Tailwind v4 uses 768px for 'md' breakpoint
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767.98px)"); // or "(max-width: 47.99em)"
}
```

**OR** use Tailwind's breakpoint exactly:
```typescript
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)"); // Keep current - it's correct
}
```

Actually, current implementation is correct. Tailwind `md:` applies at `≥768px`, so `<768px` = `≤767px` = mobile. No change needed.

---

### 9. Maintainability - Duplicate Color Classes

**Files:** `NavItem.tsx`, `LanguageSwitcher.tsx`, `Navbar.tsx`, `page.tsx`

**Issue:**
Color utility classes like `text-emerald`, `bg-sea-green/20` are hardcoded throughout. If color palette changes, must update 20+ locations.

**Recommendation:**
Create semantic color tokens in `globals.css`:

```css
@theme inline {
  /* Semantic tokens */
  --color-nav-text: var(--color-forest-dark);
  --color-nav-text-active: var(--color-emerald);
  --color-nav-bg-hover: rgb(39 103 73 / 0.1); /* sea-green/10 */
}
```

Then use: `text-nav-text`, `text-nav-text-active`, etc.

**Trade-off:** Adds abstraction layer. For this small project, current approach is acceptable.

---

## Low Priority Suggestions

### 10. Code Style - Inconsistent Spacing

**File:** `NavItem.tsx` line 18-32, `LanguageSwitcher.tsx` line 27-35

**Issue:**
Multi-line className strings use template literals with line breaks. Some have trailing spaces, some don't.

**Recommendation:**
Use consistent formatting (already mostly good). Consider `clsx` or `cn` utility:

```typescript
import { clsx } from "clsx";

const desktopClasses = clsx(
  "w-full py-4 px-2",
  "hover:bg-sea-green/10",
  isActive ? "text-emerald bg-sea-green/10" : "text-forest-dark hover:text-mint"
);
```

**Current code is fine** - just a stylistic preference.

---

### 11. Documentation - Missing JSDoc Comments

**Files:** All components except `Section.tsx`

**Issue:**
Components lack JSDoc comments explaining props and behavior. Makes IDE hover tooltips less helpful.

**Recommendation:**
Add JSDoc comments:

```typescript
/**
 * Language toggle button for Hero section.
 * Switches between EN/VN locales using next-intl router.
 *
 * @example
 * <LanguageSwitcher />
 */
export function LanguageSwitcher() {
  // ...
}
```

**Priority:** Low - code is self-documenting, but JSDoc helps onboarding.

---

## Positive Observations

**Excellent practices identified:**

1. ✅ **SSR-Safe Hook Design** - Uses `useSyncExternalStore` (correct approach for Next.js 13+)
2. ✅ **Semantic HTML** - Proper `<nav>`, `<section>`, `role="navigation"` attributes
3. ✅ **Accessibility Foundation** - ARIA attributes (`aria-label`, `aria-current`, `aria-hidden`)
4. ✅ **Type Safety** - Full TypeScript with proper interface definitions
5. ✅ **YAGNI Compliance** - No over-engineering, simple solutions
6. ✅ **Responsive Design** - Clean mobile/desktop separation without duplication
7. ✅ **Component Composition** - Proper separation of concerns (NavItem reused in Navbar)
8. ✅ **i18n Integration** - Proper use of `next-intl` hooks and translation keys
9. ✅ **CSS Variables** - Good use of CSS custom properties for theming
10. ✅ **Build Success** - Zero TypeScript errors, zero ESLint errors
11. ✅ **Requirements Met** - TEXT-ONLY navbar (no icons), language switcher in Hero section

---

## Recommended Actions

**Priority Order:**

1. **[CRITICAL]** Fix SSR hydration mismatch in `useMediaQuery.ts` (use `useEffect` approach or accept `useSyncExternalStore` behavior with suppressHydrationWarning)
2. **[CRITICAL]** Add `writing-mode-vertical` CSS class to `globals.css`
3. **[HIGH]** Add keyboard focus styles to `NavItem` and `LanguageSwitcher`
4. **[HIGH]** Improve `aria-label` in `LanguageSwitcher` for better screen reader context
5. **[MEDIUM]** Add TypeScript translation key type safety (nice-to-have)
6. **[LOW]** Add JSDoc comments for better IDE support
7. **[LOW]** Consider `clsx` utility for className management (future refactor)

**Estimated Fix Time:**
- Critical fixes: 30 minutes
- High priority: 20 minutes
- Medium/Low: 1 hour (optional improvements)

---

## Metrics

- **Type Coverage:** 100% (all files use TypeScript strict mode)
- **Test Coverage:** 0% (no tests written yet - acceptable for Phase 02)
- **Linting Issues:** 0 errors, 0 warnings
- **Build Status:** ✅ Success (1.8s compile, 461ms static generation)
- **Bundle Size:** Not measured (Next.js build output doesn't show individual component sizes)
- **Accessibility Score:** Estimated 85/100 (missing keyboard focus styles)
- **Performance Impact:** Minimal (no heavy computations, efficient hooks)

---

## Plan File Update Status

**Updated:** `plans/260109-2157-portfolio-v4-water-ecosystem/plan.md`

**Changes Required:**
- Phase 02 status: `pending` → `in-review` (awaiting critical fixes)
- Add review findings to phase doc
- Update todo checklist in phase-02-core-layout.md

**Next Steps:**
1. Fix critical issues identified in this review
2. Run manual testing on mobile/desktop breakpoints
3. Test keyboard navigation and screen reader compatibility
4. Mark Phase 02 as ✅ DONE after fixes
5. Proceed to Phase 03 (Water Effects) or Phase 05 (Navbar Light Effects)

---

## Security Considerations

**OWASP Top 10 Review:**

1. ✅ **A01 Broken Access Control** - N/A (no auth/authorization in this phase)
2. ✅ **A02 Cryptographic Failures** - N/A (no sensitive data)
3. ⚠️ **A03 Injection** - Low risk (see Issue #5 - translation XSS awareness)
4. ✅ **A04 Insecure Design** - No issues (proper React patterns)
5. ✅ **A05 Security Misconfiguration** - N/A (client-side only)
6. ✅ **A06 Vulnerable Components** - Dependencies up-to-date (Next.js 16.1.1, React 19)
7. ✅ **A07 Auth Failures** - N/A (no auth in this phase)
8. ✅ **A08 Software/Data Integrity** - Translation files in source control
9. ✅ **A09 Logging Failures** - N/A (client-side component logging not applicable)
10. ✅ **A10 SSRF** - N/A (no server-side requests)

**Verdict:** No security vulnerabilities identified. Good practices followed.

---

## Unresolved Questions

1. **Vertical Text Writing Mode:** Should navbar use CSS `writing-mode: vertical-rl` or keep horizontal text? Plan doc shows vertical layout in mockups but implementation is unclear.

2. **Mobile Navbar Bottom Padding:** Current implementation has `pb-20` on mobile sections for bottom navbar clearance. Is 80px (20*4px) correct, or should it match navbar height `h-14` (56px)?

3. **Language Switcher Placement:** Currently in Hero section per requirements. Should it have a fixed position for always-visible access, or scroll with Hero section?

4. **Active Section Detection:** Navbar has `activeSection` prop hardcoded to "home". When will IntersectionObserver be implemented to update this dynamically? (Mentioned in phase doc as Phase 05 dependency)

5. **Color Palette Mismatch:** Phase doc shows "teal-accent", "aqua-bright", "deep-ocean" colors in example code, but actual implementation uses "sea-green", "emerald", "forest-dark". Intentional change or oversight?

---

**Review completed:** 2026-01-10 09:12 UTC
**Reviewer:** Code Review Agent a6fb439
**Next review:** After critical fixes applied
