# Phase 03 Water Effects - ESLint Fixes Required
**Test Date:** 2026-01-10 14:12
**Status:** 4 CRITICAL BLOCKING ERRORS

---

## Summary

ESLint validation failed with 4 errors related to React Hooks best practices. These must be fixed before production deployment as they violate React semantics and cause performance issues.

---

## Issue 1: setState Synchronously in Effect (WaterCanvas.tsx:29)

**File:** `src/components/water/WaterCanvas.tsx`
**Line:** 29
**Error:** `react-hooks/set-state-in-effect`

### Current Code (PROBLEMATIC)
```typescript
// Line 23-31
const [currentTexture, setCurrentTexture] = useState<THREE.CanvasTexture | null>(null);

// Line 27-31
useEffect(() => {
  if (texture && !currentTexture) {
    setCurrentTexture(texture);  // ← PROBLEM: setState in effect
  }
}, [texture, currentTexture]);
```

### Problems
1. Cascading render: Component renders → effect runs → setState → re-render
2. Dependency array includes state being set (circular dependency)
3. Texture ref from useRippleCanvas already handles this
4. Violates React 18+ concurrent rendering

### Fix Options

**Option A: Remove Unnecessary State (RECOMMENDED)**
```typescript
// Line 62 in WaterScene component
return <WaterPlane rippleTexture={texture} />;

// Just pass texture directly from hook
// No need for currentTexture state at all
```

**Option B: Use useCallback Pattern**
```typescript
const handleTextureReady = useCallback(() => {
  // Effect can set state in callbacks from external events
  // But this pattern is not ideal for texture initialization
}, []);
```

### Recommended Fix
**Delete lines 23-31** - The texture is already available from `useRippleCanvas` hook. WaterPlane component accepts `rippleTexture` prop directly, so no intermediate state is needed.

---

## Issue 2: setState in Effect for SSR Mount Check (WaterCanvas.tsx:75)

**File:** `src/components/water/WaterCanvas.tsx`
**Line:** 75
**Error:** `react-hooks/set-state-in-effect`

### Current Code (PROBLEMATIC)
```typescript
// Line 69-79
const [mounted, setMounted] = useState(false);
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
const isMobile = useIsMobile();

// Line 74-79
useEffect(() => {
  setMounted(true);  // ← PROBLEM: setState in effect
  setPrefersReducedMotion(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}, []);
```

### Problems
1. Causes double render on mount (SSR hydration flicker)
2. `useMounted()` hook already exists and does this correctly
3. `useMediaQuery()` hook already handles media queries with SSR defaults
4. Redundant implementation

### Fix (RECOMMENDED)
```typescript
// Import existing hooks
import { useMounted } from "@/hooks/useMounted";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function WaterCanvas() {
  const isMobile = useIsMobile();
  const mounted = useMounted();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Remove useEffect entirely!
  // Remove useState for mounted and prefersReducedMotion

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        frameloop={isMobile ? "demand" : "always"}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <WaterScene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

### Changes
1. Delete `useState(false)` for `mounted` (use `useMounted()`)
2. Delete `useState(false)` for `prefersReducedMotion` (use `useMediaQuery()`)
3. Delete entire `useEffect()` block
4. Import `useMounted` from hooks
5. Use `useMediaQuery("(prefers-reduced-motion: reduce)")` instead

### Why This Works
- `useMounted()` uses `useSyncExternalStore` (no setState in effect)
- `useMediaQuery()` handles SSR with server snapshot
- No cascading renders
- No double-render on hydration
- Consistent with existing hook patterns in codebase

---

## Issue 3: Cannot Access Refs During Render (useRippleCanvas.ts:136)

**File:** `src/hooks/useRippleCanvas.ts`
**Line:** 136
**Error:** `react-hooks/refs`

### Current Code (PROBLEMATIC)
```typescript
// Line 135-140
return {
  texture: textureRef.current,  // ← PROBLEM: accessing ref during render
  addRipple,
  update,
};
```

### Problems
1. Refs should only be accessed in effects or event handlers, not during render
2. `textureRef.current` may be null on first render
3. Breaks React ref semantics
4. May cause runtime errors when texture is null

### Fix (RECOMMENDED)

**Option A: Initialize and Return State (BEST)**
```typescript
// Add state after useEffect that initializes canvas
const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

// In useEffect after creating texture
useEffect(() => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvasRef.current = canvas;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctxRef.current = ctx;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
  }

  const canvasTexture = new THREE.CanvasTexture(canvas);
  canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
  canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
  textureRef.current = canvasTexture;
  setTexture(canvasTexture);  // ← Store in state

  return () => {
    canvasTexture.dispose();
  };
}, [size]);

// Return state instead of ref
return {
  texture,  // ← Use state, not ref
  addRipple,
  update,
};
```

**Option B: Use useCallback with Ref**
```typescript
const getTexture = useCallback(() => {
  return textureRef.current;
}, []);

return {
  texture: getTexture(),
  addRipple,
  update,
};
```

**Not Recommended:** Option B still accesses ref during render.

---

## Implementation Order

1. **First:** Fix Issue 2 (WaterCanvas.tsx:75) - Simplest, removes 1 useState and 1 useEffect
   - Effort: 10 minutes
   - Risk: Low (uses existing hooks)

2. **Second:** Fix Issue 1 (WaterCanvas.tsx:29) - Medium, removes unused state
   - Effort: 5 minutes
   - Risk: Very Low (direct removal)

3. **Third:** Fix Issue 3 (useRippleCanvas.ts:136) - Complex, adds state management
   - Effort: 30 minutes
   - Risk: Medium (requires refactoring hook return type)

---

## Files to Modify

```
src/components/water/WaterCanvas.tsx
- Remove useState(false) for mounted
- Remove useState(false) for prefersReducedMotion
- Remove useState<CanvasTexture | null> for currentTexture (if using Option 1)
- Remove useEffect blocks
- Import useMounted and useMediaQuery
- Use imported hooks instead

src/hooks/useRippleCanvas.ts
- Add useState<CanvasTexture | null>
- Call setTexture in initialization useEffect
- Return state instead of ref.current
```

---

## Verification Checklist

After applying fixes:

- [ ] `npm run lint` - All 4 errors resolved
- [ ] `npm run build` - Build completes successfully
- [ ] `npm run dev` - Dev server starts without errors
- [ ] Browser: Cursor trail appears on movement
- [ ] Browser: Click creates ripple
- [ ] Mobile: Tested on 375px viewport (useIsMobile detects true)
- [ ] Accessibility: Disable animations in OS → no ripples
- [ ] Console: No WebGL warnings or errors
- [ ] TypeScript: `npm run build` shows 0 errors

---

## Related Files (Already Correct)

These files use proper patterns:

1. **src/hooks/useMediaQuery.ts** ✓
   - Uses useSyncExternalStore (correct for SSR)
   - No setState in effects
   - Proper subscription pattern

2. **src/hooks/useMounted.ts** ✓
   - Uses useSyncExternalStore (correct for SSR)
   - No setState in effects
   - Minimal, focused implementation

3. **src/hooks/useMousePosition.ts** ✓
   - Event listeners with cleanup
   - Proper dependency array
   - No setState in effects (only in callback)

4. **src/components/water/WaterPlane.tsx** ✓
   - Memoized material creation
   - Proper useFrame usage
   - No setState violations

5. **src/components/water/index.tsx** ✓
   - Dynamic import with ssr: false
   - Proper Suspense boundary
   - No state management

---

## Expected Test Results After Fixes

```
✓ npm run lint
  0 errors, 0 warnings

✓ npm run build
  Compiled successfully
  TypeScript: 0 errors
  Routes: /_not-found, /[locale]

✓ npm run dev
  Ready in 1.2s
  Started server on http://localhost:3000

Visual Tests:
  ✓ Cursor creates continuous ripple trail
  ✓ Click creates larger ripple
  ✓ Ripples decay smoothly
  ✓ Mobile: Fewer ripples, 128px texture
  ✓ Reduced motion: No ripples
```

---

## Notes

- Fixes are **non-breaking** to functionality
- Fixes follow React 18+ best practices
- Fixes align with existing codebase patterns (useMounted, useMediaQuery)
- After fixes, recommend adding unit tests (see full test report)

---

**Critical:** These errors must be fixed before merging to main branch.
