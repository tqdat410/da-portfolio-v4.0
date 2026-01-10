# Phase 03 Water Effects - Manual Testing Procedures
**Date:** 2026-01-10
**Status:** Ready for Testing (After ESLint Fixes)

---

## Pre-Test Setup

### Prerequisites
- ESLint errors fixed (see eslint-fixes-required.md)
- `npm run build` passes
- `npm run lint` passes
- `npm run dev` server running on http://localhost:3000

### Browser Requirements
- Chrome 90+ (best for WebGL)
- Firefox 88+ (good WebGL support)
- Safari 15+ (good but may have variance)
- Mobile: iOS Safari 15+, Chrome Android 90+

### Test Environment
- Clear browser cache before each test
- Disable browser extensions
- Use incognito/private window to avoid cache
- DevTools open for console monitoring
- Network tab set to "No throttling" unless specifically testing

---

## Test Suite 1: Cursor Trail Ripples (Desktop)

### Test 1.1: Basic Cursor Movement
**Objective:** Verify ripples appear on cursor movement

**Steps:**
1. Navigate to http://localhost:3000/en
2. Open DevTools (F12) - check Console for errors
3. Move cursor over the viewport slowly
4. Observe water surface

**Expected Result:**
- Subtle ripples appear following cursor path
- Ripple trail remains visible for ~1 second
- Each ripple has a green tint
- Ripples extend from cursor position outward
- No console errors

**Failure Cases:**
- [ ] No ripples visible
- [ ] Ripples appear but frozen (not moving)
- [ ] Console shows WebGL errors
- [ ] Ripples appear in unexpected locations

### Test 1.2: Cursor Trail Density
**Objective:** Verify ripple trail is continuous and smooth

**Steps:**
1. Move cursor in a slow circle
2. Observe spacing between ripples
3. Move cursor very fast (across viewport)
4. Observe if trail is broken or gappy

**Expected Result:**
- Slow movement: Ripples appear every ~50ms (smooth trail)
- Fast movement: Ripples maintain consistent spacing
- No visible gaps in trail
- Trail follows cursor path accurately

**Failure Cases:**
- [ ] Large gaps between ripples (throttling too aggressive)
- [ ] Ripples clump together (not enough throttling)
- [ ] Trail doesn't follow cursor path

### Test 1.3: Ripple Decay Animation
**Objective:** Verify ripples fade smoothly

**Steps:**
1. Create ripple trail by moving cursor
2. Stop moving cursor and observe
3. Watch ripples fade away
4. Measure approximate fade time

**Expected Result:**
- Ripples expand outward smoothly
- Intensity decreases gradually
- Complete fade in ~1 second
- No sudden pop/disappear
- Smooth exponential decay visible

**Failure Cases:**
- [ ] Ripples disappear suddenly
- [ ] Ripples fade too quickly (< 0.5s)
- [ ] Ripples fade too slowly (> 2s)
- [ ] Jerky animation (not smooth)

### Test 1.4: Cursor Edge Cases
**Objective:** Test behavior when cursor leaves viewport

**Steps:**
1. Move cursor to near edge of viewport
2. Move cursor outside viewport (off-screen)
3. Move cursor back into viewport
4. Check if ripples continue

**Expected Result:**
- Ripples stop while cursor is off-screen (isActive: false)
- No ripples appear outside viewport
- Ripples resume when cursor returns
- Smooth transition (no popping)

**Failure Cases:**
- [ ] Ripples continue off-screen
- [ ] Ripples stutter when cursor returns
- [ ] isActive state is stuck

---

## Test Suite 2: Click Ripples (Desktop)

### Test 2.1: Single Click
**Objective:** Verify click creates strong ripple

**Steps:**
1. Click anywhere on viewport
2. Observe ripple immediately
3. Wait for decay

**Expected Result:**
- Large, bright ripple appears at click location
- Ripple is noticeably stronger than cursor trail (strength: 1.0)
- Ripple expands outward from click point
- Decays smoothly in ~1 second
- No double-ripples (one click = one ripple)

**Failure Cases:**
- [ ] No ripple appears
- [ ] Ripple strength same as cursor trail
- [ ] Multiple ripples from single click

### Test 2.2: Rapid Clicks
**Objective:** Verify multiple clicks create distinct ripples

**Steps:**
1. Click 3-4 times in quick succession
2. Click in different locations each time
3. Observe ripple behavior

**Expected Result:**
- Each click creates separate ripple
- Ripples don't merge
- Max 30 ripples on screen (desktop)
- Oldest ripples removed when limit reached
- All ripples decay independently

**Failure Cases:**
- [ ] Ripples merge into one
- [ ] Max ripple limit not enforced
- [ ] Ripples flicker or glitch

### Test 2.3: Click + Cursor Trail Interaction
**Objective:** Verify click ripples work alongside cursor trail

**Steps:**
1. Move cursor slowly (creating trail)
2. Click while moving
3. Observe both ripples together

**Expected Result:**
- Click ripple appears separately from cursor trail
- Both animate simultaneously
- Click ripple stronger and larger
- Independent decay rates
- No visual artifacts or overlapping issues

**Failure Cases:**
- [ ] Click ripple interferes with trail
- [ ] Performance drops with both ripples
- [ ] Artifacts appear (corruption, glitches)

---

## Test Suite 3: Color & Shader Rendering

### Test 3.1: Water Color Palette
**Objective:** Verify correct color scheme from design system

**Steps:**
1. Observe water color when no ripples
2. Observe ripples (should have highlight)
3. Compare colors visually

**Expected Result:**
- Base water: Dark midnight green (#0a0f0a → rgb(10, 15, 10))
- Water gradient: Transitions to sea green (#276749)
- Ripple highlight: Emerald color (#38a169)
- Smooth blending at edges
- No oversaturation

**Failure Cases:**
- [ ] Wrong color palette used
- [ ] Color banding visible
- [ ] Highlights too bright or too dim

### Test 3.2: Shader Distortion
**Objective:** Verify distortion effect on water surface

**Steps:**
1. Look at water texture during ripples
2. Move cursor quickly to create large ripples
3. Observe texture distortion around ripples

**Expected Result:**
- Ripple center has visible distortion
- Distortion radiates outward
- Subtle (not overwhelming)
- Blends smoothly with undistorted areas

**Failure Cases:**
- [ ] No distortion visible
- [ ] Distortion too strong (unrealistic)
- [ ] Sharp edges instead of smooth blending

### Test 3.3: Ambient Wave Motion
**Objective:** Verify subtle background animation

**Steps:**
1. Keep cursor still
2. Observe water for 10+ seconds
3. Look for subtle wave motion

**Expected Result:**
- Subtle wave motion in background
- Only visible when cursor still
- Adds life without being distracting
- Motion stops when ripples cover it

**Failure Cases:**
- [ ] No wave motion visible
- [ ] Wave motion too obvious
- [ ] Waves clash with ripples

---

## Test Suite 4: Mobile & Responsive

### Test 4.1: Mobile Viewport Detection
**Objective:** Verify mobile mode activates at 767px breakpoint

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone SE (375×667)
4. Reload page
5. Check water effects

**Expected Result:**
- Canvas renders (visible water effect)
- Texture size: 128×128 (vs 256 desktop)
- DPR: 1x (no 2x variant)
- Max ripples: 15 (vs 30 desktop)
- Slower decay: 0.96 (vs 0.95 desktop)
- Frame loop: demand (vs always)

**Verification:**
- Open DevTools → Application → Canvas DOM
- Inspect canvas element dimensions
- Check texture size in WebGL context

**Failure Cases:**
- [ ] No water effect on mobile
- [ ] Desktop rendering on mobile
- [ ] FPS drops below 30 on mobile
- [ ] Battery drain obvious on mobile

### Test 4.2: Touch Interaction (Mobile)
**Objective:** Verify ripples appear on touch

**Steps:**
1. On mobile device or Chrome DevTools emulation
2. Tap screen multiple times
3. Observe ripples

**Expected Result:**
- Tap creates ripple at touch point
- Ripple similar to click ripple (strength: 1.0)
- Works with rapid taps
- Respects max ripple limit

**Failure Cases:**
- [ ] No ripples on tap
- [ ] Ripples appear at wrong location
- [ ] Touch events not tracked

### Test 4.3: Mobile Performance
**Objective:** Verify 30fps target on mobile

**Steps:**
1. Open DevTools Performance tab
2. Toggle device toolbar (iPhone 12)
3. Record while creating ripples with cursor/touch
4. Analyze FPS

**Expected Result:**
- FPS target: 30+ (stable)
- Frame time: < 33ms
- No jank or stuttering
- GPU utilization reasonable

**Measurement:**
- Chrome: DevTools → Performance → record
- Look at FPS counter (top-left)
- Check frame times (green bars)

**Failure Cases:**
- [ ] FPS below 20 (choppy)
- [ ] Frame times > 33ms (stuttering)
- [ ] Memory growing (leak suspected)

### Test 4.4: Tablet (Middle Breakpoint)
**Objective:** Verify behavior on tablets (768px+)

**Steps:**
1. Toggle device toolbar
2. Select iPad (768×1024)
3. Reload page
4. Verify desktop mode activates

**Expected Result:**
- Desktop rendering mode (256×256, 30 ripples)
- DPR: [1, 2] (scales for high-DPI)
- Frame loop: always
- Performance stable

**Failure Cases:**
- [ ] Tablet gets mobile mode (128×128)
- [ ] Desktop mode on small tablet

---

## Test Suite 5: Accessibility

### Test 5.1: Reduced Motion Preference
**Objective:** Verify animation respects prefers-reduced-motion

**Steps:**
1. Windows: Settings → Ease of Access → Display → Show animations
2. macOS: System Preferences → Accessibility → Display → Reduce motion
3. Chrome: DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion
4. Reload page

**Expected Result:**
- No water effects visible
- Component returns null
- Page still functional
- No console errors

**Failure Cases:**
- [ ] Water effects still visible (motion preference ignored)
- [ ] Page breaks without effects
- [ ] Performance issues from null component

### Test 5.2: Keyboard Navigation
**Objective:** Verify water effects don't interfere with keyboard nav

**Steps:**
1. Tab through page elements
2. Check if focus is visible
3. Verify keyboard shortcuts work
4. Check water effects don't steal focus

**Expected Result:**
- Focus outline visible on all elements
- Tab navigation works smoothly
- Water effects behind content (z-0)
- pointer-events-none prevents interaction
- ARIA attributes correct

**Expected ARIA:**
```html
<div role="presentation" aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none">
```

**Failure Cases:**
- [ ] Focus trapped in canvas
- [ ] Water effects intercept clicks
- [ ] Keyboard navigation broken

### Test 5.3: Screen Reader (NVDA/JAWS)
**Objective:** Verify screen readers ignore water effects

**Steps:**
1. Install NVDA (Windows) or JAWS
2. Enable screen reader
3. Navigate through page
4. Listen for announcements

**Expected Result:**
- Water effects not announced
- Page content announced normally
- No broken ARIA labels
- Logical reading order maintained

**Failure Cases:**
- [ ] Screen reader announces "presentation" elements
- [ ] Reading order disrupted
- [ ] Missing alt text (if any images)

### Test 5.4: Color Contrast
**Objective:** Verify water color doesn't reduce contrast

**Steps:**
1. Use WebAIM Contrast Checker
2. Check text color against water background
3. Run Lighthouse accessibility audit

**Expected Result:**
- Text contrast ratio ≥ 4.5:1 (normal)
- Contrast ratio ≥ 3:1 (large text)
- Lighthouse A11y score ≥ 90

**Measurement:**
- Chrome: DevTools → Lighthouse → Accessibility

**Failure Cases:**
- [ ] Text not readable (low contrast)
- [ ] Accessibility audit fails

---

## Test Suite 6: SSR & Hydration

### Test 6.1: Server-Side Rendering
**Objective:** Verify no hydration mismatch

**Steps:**
1. Start dev server: `npm run dev`
2. Open DevTools Console
3. Navigate to page
4. Check for hydration warnings

**Expected Result:**
- No hydration mismatch errors
- Console clean (no warnings about mismatches)
- Page interactive immediately
- Water effects load without flicker

**Hydration Mismatch Signs:**
- Warning: "Hydration failed"
- Warning: "Expected server HTML to contain..."
- Visual flicker or content shift

**Failure Cases:**
- [ ] Hydration warnings in console
- [ ] Page flicker on load
- [ ] Initial state mismatch

### Test 6.2: Production Build
**Objective:** Verify build completes and hydration works

**Steps:**
1. Run: `npm run build`
2. Run: `npm run start`
3. Navigate to http://localhost:3000/en
4. Monitor console

**Expected Result:**
- Build succeeds (0 errors)
- Server starts
- Page loads without errors
- Water effects functional
- No hydration mismatches

**Failure Cases:**
- [ ] Build fails
- [ ] Server won't start
- [ ] Page breaks in production

---

## Test Suite 7: Browser Compatibility

### Test 7.1: Chrome/Edge (Chromium)
**Objective:** Test primary browser

**Steps:**
1. Open Chrome/Edge
2. Navigate to site
3. Test all ripple functionality
4. Check DevTools warnings

**Expected Result:**
- All tests pass
- No WebGL errors
- Smooth 60fps (if throttling disabled)
- No console warnings

**Chromium Versions to Test:**
- Latest (90+)
- Current - 5 versions

### Test 7.2: Firefox
**Objective:** Test alternative browser

**Steps:**
1. Open Firefox
2. Navigate to site
3. Test ripple functionality
4. Check console (Ctrl+Shift+K)

**Expected Result:**
- Water effects visible
- Ripples functional
- Smooth animation
- No warnings or errors

**Potential Issues:**
- WebGL variance (colors may differ)
- Performance may differ

### Test 7.3: Safari (macOS/iOS)
**Objective:** Test Apple browsers

**Steps:**
1. macOS: Open Safari → Develop → Show Web Inspector
2. iOS: Open Settings → Safari → Advanced → Web Inspector
3. Navigate to site
4. Test functionality

**Expected Result:**
- Water effects render
- Ripples functional
- Smooth animation on device

**Potential Issues:**
- Canvas texture may have color variance
- WebGL performance varies
- matchMedia support

**Failure Cases:**
- [ ] WebGL not supported (blank page)
- [ ] Ripples not rendering
- [ ] Major FPS drops

---

## Test Suite 8: Performance & Optimization

### Test 8.1: FPS Measurement (Desktop)
**Objective:** Verify 60fps target

**Steps:**
1. Open DevTools → Performance
2. Click Record
3. Create ripples for 10 seconds
4. Stop recording
5. Analyze FPS

**Expected Result:**
- FPS: 58-60 (consistent)
- Frame time: < 16ms
- No dropped frames
- Smooth curve in graph

**Measurement:**
- Look at FPS counter (top-right of timeline)
- Green bars = good, red = dropped frames
- Frame times in Performance tab

**Failure Cases:**
- [ ] FPS below 50 (choppy)
- [ ] Frame times > 16ms (dropped frames)
- [ ] Dips when many ripples

### Test 8.2: Memory Usage
**Objective:** Check for memory leaks

**Steps:**
1. DevTools → Memory
2. Take heap snapshot (baseline)
3. Create many ripples (click 50+ times)
4. Wait 30 seconds
5. Garbage collection
6. Take another snapshot
7. Compare snapshots

**Expected Result:**
- Memory stable after GC
- No continuous growth
- Heap size reasonable (< 50MB increase)
- Old ripples cleaned up

**Failure Cases:**
- [ ] Heap keeps growing (leak)
- [ ] Memory > 100MB after GC
- [ ] Three.js objects not disposed

### Test 8.3: CPU Throttling
**Objective:** Test on slower devices

**Steps:**
1. DevTools → Performance → Throttle CPU (4x slowdown)
2. Create ripples
3. Monitor performance

**Expected Result:**
- Animation still smooth (degraded but playable)
- No complete freezes
- Performance acceptable at 2x-4x throttle

**Failure Cases:**
- [ ] Animation completely freezes
- [ ] Frame rate drops to 15 fps or lower

### Test 8.4: Network Throttling
**Objective:** Test loading with slow network

**Steps:**
1. DevTools → Network → Throttle (Slow 4G)
2. Hard reload page
3. Observe loading behavior

**Expected Result:**
- Page loads and becomes interactive
- Water effects appear (lazy loaded)
- No blocking network requests
- TTFB reasonable (< 1s)

**Failure Cases:**
- [ ] Page blocked waiting for water shader
- [ ] Long load time
- [ ] Assets not cached properly

---

## Test Suite 9: Error Handling

### Test 9.1: WebGL Fallback
**Objective:** Verify graceful degradation

**Steps:**
1. DevTools → Rendering → Disable WebGL
2. Reload page
3. Check if site still works

**Expected Result:**
- Page loads normally
- Water effects don't render (graceful)
- No console errors
- No "WebGL not supported" messages (just missing effect)

**Failure Cases:**
- [ ] Entire page breaks
- [ ] Console errors
- [ ] Confusing error messages

### Test 9.2: Canvas 2D Fallback
**Objective:** Test if canvas is unsupported

**Steps:**
1. Simulate canvas unavailable (if possible)
2. Check behavior

**Expected Result:**
- Fallback gracefully
- No console errors
- Page functional

### Test 9.3: Console Errors During Use
**Objective:** Monitor for runtime errors

**Steps:**
1. Open DevTools Console
2. Create ripples (cursor + clicks)
3. Test mobile/tablet views
4. Test accessibility features
5. Watch for errors

**Expected Result:**
- Console clean (no errors)
- Only info logs (if any)
- No warnings

**Failure Cases:**
- [ ] Three.js errors
- [ ] React errors
- [ ] Unhandled promise rejections

---

## Test Results Template

```markdown
# Test Results - Phase 03 Water Effects

Date: __________
Tester: __________
Browser: __________ Version: __________
Device: __________ OS: __________

## Test Suite 1: Cursor Trail Ripples
- [ ] Test 1.1 PASS/FAIL
- [ ] Test 1.2 PASS/FAIL
- [ ] Test 1.3 PASS/FAIL
- [ ] Test 1.4 PASS/FAIL

## Test Suite 2: Click Ripples
- [ ] Test 2.1 PASS/FAIL
- [ ] Test 2.2 PASS/FAIL
- [ ] Test 2.3 PASS/FAIL

## Test Suite 3: Color & Shader
- [ ] Test 3.1 PASS/FAIL
- [ ] Test 3.2 PASS/FAIL
- [ ] Test 3.3 PASS/FAIL

## Test Suite 4: Mobile & Responsive
- [ ] Test 4.1 PASS/FAIL
- [ ] Test 4.2 PASS/FAIL
- [ ] Test 4.3 PASS/FAIL
- [ ] Test 4.4 PASS/FAIL

## Test Suite 5: Accessibility
- [ ] Test 5.1 PASS/FAIL
- [ ] Test 5.2 PASS/FAIL
- [ ] Test 5.3 PASS/FAIL
- [ ] Test 5.4 PASS/FAIL

## Test Suite 6: SSR & Hydration
- [ ] Test 6.1 PASS/FAIL
- [ ] Test 6.2 PASS/FAIL

## Test Suite 7: Browser Compatibility
- [ ] Test 7.1 PASS/FAIL (Chrome)
- [ ] Test 7.2 PASS/FAIL (Firefox)
- [ ] Test 7.3 PASS/FAIL (Safari)

## Test Suite 8: Performance
- [ ] Test 8.1 PASS/FAIL (FPS)
- [ ] Test 8.2 PASS/FAIL (Memory)
- [ ] Test 8.3 PASS/FAIL (CPU)
- [ ] Test 8.4 PASS/FAIL (Network)

## Test Suite 9: Error Handling
- [ ] Test 9.1 PASS/FAIL (WebGL)
- [ ] Test 9.2 PASS/FAIL (Canvas)
- [ ] Test 9.3 PASS/FAIL (Errors)

## Overall Result
- Passed: __/66
- Failed: __/66

## Issues Found
(List any failures and bugs discovered)

## Recommendations
(Notes for improvement)
```

---

## Quick Checklist (Express Testing - 10 minutes)

```
[ ] Page loads without errors
[ ] Move cursor - ripples appear and fade
[ ] Click - strong ripple appears
[ ] Mobile (375px) - fewer ripples, smaller texture
[ ] DevTools console - no errors
[ ] npm run lint - 0 errors
[ ] npm run build - succeeds
```

---

## Notes

- Run each test on a clean page (ctrl+shift+delete cache)
- Use consistent lighting/monitor brightness
- Test in browser with max brightness for color accuracy
- Record failures with screenshots when possible
- Note any performance issues observed
- Check console before reporting issues

---

**Last Updated:** 2026-01-10
**For:** Phase 03 Water Effects Testing
