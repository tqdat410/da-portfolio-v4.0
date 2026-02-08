# Phase 3: Projects & Certificates Page - Mobile Scroll Fix

## Priority: High | Status: Pending | Effort: Small

## Overview
Projects and Certificates pages cannot scroll on mobile. Root cause: `overflow-hidden` on the mobile stacked container blocks scroll propagation.

## Root Cause Analysis
Both pages share this structure for mobile:
```tsx
<div className="block md:hidden h-full overflow-hidden bg-slate-50">
  {selectedProject ? <DetailPanel /> : <ListPanel />}
</div>
```

The `overflow-hidden` on the mobile wrapper clips all scroll. The list/detail panels inside have `overflow-y-auto` but the parent `overflow-hidden` + `h-full` chain may not resolve correctly on mobile browsers (especially iOS Safari where `h-screen` = visual viewport, not layout viewport).

Additionally, iOS Safari has known issues with `h-screen` not accounting for the address bar. `dvh` (dynamic viewport height) is the modern fix.

## Files to Modify
- `src/components/projects-page/projects-page-client.tsx`
- `src/components/certificates-page/certificates-page-client.tsx`

## Implementation Steps

### 1. Fix mobile scroll container
Change mobile wrapper from `overflow-hidden` to `overflow-y-auto`:
```tsx
// Before
<div className="block md:hidden h-full overflow-hidden bg-slate-50">

// After
<div className="block md:hidden h-full overflow-y-auto bg-slate-50">
```

### 2. Fix viewport height on mobile
Replace `h-screen` with `h-dvh` (dynamic viewport height) with `h-screen` fallback:
```tsx
// Before
<div className="h-screen flex flex-col bg-bg-primary">

// After - Use h-dvh for mobile, fallback to h-screen
<div className="h-dvh flex flex-col bg-bg-primary">
```

`h-dvh` (`100dvh`) adjusts for mobile browser chrome (address bar). Tailwind v4 supports `h-dvh` natively.

### 3. Ensure list panels can scroll
List panels already have `overflow-y-auto` and `min-h-full` - verify they work after parent fix.

### 4. Detail panel floating footer on mobile
The floating footer uses `absolute bottom-6` - on mobile with `min-w-[320px]`, this may overflow small screens.

Fix:
```tsx
// Change min-w to be responsive
<div className="... min-w-0 md:min-w-[320px] w-full md:w-auto">
```

## Success Criteria
- [ ] Projects list scrolls on mobile
- [ ] Certificates list scrolls on mobile
- [ ] Detail panels scroll independently on mobile
- [ ] Floating footer toolbar visible and not overlapping on mobile
- [ ] Works on iOS Safari (address bar consideration)
