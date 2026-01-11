# Scroll-Based Storytelling & Horizontal Scroll Patterns Research
**Date:** 2026-01-11 | **Project:** DaPortfolio v4.0 Terrarium Theme

---

## Executive Summary
Scroll-triggered storytelling creates immersive narratives by progressively revealing content. Three primary approaches exist: GSAP ScrollTrigger (precise control, horizontal-to-vertical), Framer Motion (lightweight, Suspense-friendly), and native scroll listeners. Your terrarium theme benefits from parallax + text reveal sequences paired with water ripple interactions.

---

## 1. GSAP ScrollTrigger: Horizontal on Vertical Scroll

### Core Pattern
```typescript
// Key pattern: containerAnimation drives ScrollTrigger
const proxy = { x: 0 },
      scrollProxy = gsap.to(proxy, {
        x: 0,
        duration: 0.8,
        ease: "power1.inOut",
        overwrite: false
      }),
      maxScroll = 500, // pixels to scroll
      scrollTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          let scrollProgress = self.getVelocity() / -300;
          gsap.to(proxy, {
            x: "+=" + scrollProgress,
            duration: 0.8,
            overwrite: false
          });
        }
      });

gsap.set(".carousel", { x: () => gsap.getProperty(proxy, "x") });
ScrollTrigger.create({
  onUpdate: () => {
    gsap.set(".carousel", { x: gsap.getProperty(proxy, "x") });
  }
});
```

### Next.js Integration (useGSAP hook)
- Register ScrollTrigger plugin before use: `gsap.registerPlugin(ScrollTrigger)`
- Use `useGSAP()` hook with cleanup: `useGSAP(() => {...}, { scope: ref })`
- Pin container during horizontal motion: `pin: true`
- Synchronize with scroll: `scrub: 1` (1 = 1s lag between scroll/animation)
- **Critical:** Use `useRef` for element references, not direct DOM queries

### Best Practices
- **Linear easing required** for `containerAnimation` syncing
- **Snapping unavailable** on container-based triggers
- **Mobile consideration:** Reduce horizontal distance on smaller viewports
- Cache viewport calculations; update on resize/route change

---

## 2. Framer Motion: Scroll-Triggered Animations

### Core Hooks Pattern
```typescript
import { useScroll, useTransform, motion } from "framer-motion";

export function ParallaxText() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]); // moves 100px over 500px scroll
  const opacity = useTransform(scrollY, [0, 300], [0, 1]); // fades in over 300px

  return (
    <motion.h2 style={{ y, opacity }}>
      Narrative Text Reveals
    </motion.h2>
  );
}
```

### Advantages
- **Lightweight** (no external plugins like ScrollTrigger)
- **SSR-safe** (Suspense boundary compatible)
- **Built-in momentum** via Lenis integration
- **Staggered children:** `variants.container` + `transition.staggerChildren`

### Implementation Notes
- `useScroll()` returns `scrollX`, `scrollY` (pixel values 0-1)
- `useTransform()` maps scroll ranges to output values
- Combine with `whileInView` for viewport-triggered reveals
- Use `useMotionValueEvent()` for imperatives (debugging)

---

## 3. Storytelling Portfolio Design Patterns

### Scrollytelling (Scroll + Storytelling)
Progressive reveal of narrative elements as user scrolls:
1. **Headline enters** → waits 0.3s
2. **Supporting text fades** → waits 0.2s
3. **Image parallax shifts** → simultaneous
4. **CTA scales in** → overlaps previous

**Timing structure:** Stagger delays create rhythm without overwhelming. Use `ease-out-expo` for opens, `ease-in-cubic` for closures.

### Key Design Principles
- **Sequential hierarchy:** Title → body → imagery → interaction
- **Minimal delay:** 100-300ms stagger prevents feeling sluggish
- **Parallax depth:** Background +0 offset, mid-ground ±15px, foreground ±30px
- **Respect `prefers-reduced-motion`:** Disable parallax, keep reveals instant
- **Text on imagery:** Use backdrop blur + overlay for readability

### Implementation Example
```typescript
// Text reveal on scroll
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8 }
  })
};

<motion.p custom={0} variants={textVariants} initial="hidden" whileInView="visible">
  Story beats progress naturally.
</motion.p>
```

---

## 4. Parallax Text Movement on Scroll

### Technique A: useTransform (Framer Motion)
```typescript
const y = useTransform(scrollY, [start, end], [0, distance]);
// Smooth, GPU-accelerated, no jank

// Parallax depth layers:
// Hero text: [-100, 100] (strong movement)
// Section text: [-30, 30] (subtle movement)
// Body text: [-10, 10] (minimal movement)
```

### Technique B: GSAP ScrollTrigger
```typescript
gsap.to(".text-layer", {
  y: -50,
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    markers: true // dev only
  }
});
```

### Performance Optimization
- **Throttle:** Native scroll listeners fire 60+ times/sec. Use RAF or `scrollLinearInterpolator`
- **Transform only:** Use `y`, `x`, `opacity` (GPU-accelerated). Avoid `top`, `left`, `width`
- **Will-change:** Sparingly applied to 3-5 elements max
- **Debounce cache:** Recalculate bounds on resize with `ResizeObserver`

---

## 5. Implementation Roadmap for DaPortfolio

### Phase 1: Foundation (Week 1)
- Add GSAP + ScrollTrigger, Framer Motion to project
- Create reusable `useScrollAnimation` hook
- Test on desktop/mobile/tablet

### Phase 2: Terrarium Narrative (Week 2)
- **Hero section:** Horizontal scroll carousel (projects slide left as user scrolls down)
- **About section:** Text reveal + particle parallax (moss particles move slower)
- **Skills section:** Staggered reveal grid with ripple trigger on scroll

### Phase 3: Water Integration (Week 3)
- Scroll-triggered ripples on hero image transitions
- Parallax caustics layer shifts with scroll offset
- Text movement synced to water wave frequency (0.8s)

### Phase 4: Optimization (Week 4)
- Performance audit with DevTools throttling
- Mobile viewport adjustments
- Accessibility testing (reduced motion, keyboard navigation)

---

## Tech Stack Decision Matrix

| Feature | GSAP ScrollTrigger | Framer Motion | Native |
|---------|-------------------|---------------|--------|
| Horizontal scroll | ⭐⭐⭐ | ⭐ | ⭐ |
| Text parallax | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Ease of use | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Bundle size | +45kb | +30kb | 0kb |
| Server-safe | ✓ | ✓ | ✓ |
| Mobile perf | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation:** Hybrid approach—GSAP for hero horizontal scroll, Framer Motion for section reveals + parallax text, native listeners for caustics parallax.

---

## Best Practices Checklist

- [ ] Use `transform` properties only (GPU-accelerated)
- [ ] Implement RAF throttling or library-native optimization
- [ ] Test on actual devices (simulator != real device performance)
- [ ] Add `prefers-reduced-motion` media query handler
- [ ] Cache scroll calculations; update on resize
- [ ] Stagger timing 100-300ms for natural rhythm
- [ ] Parallax offset ranges: ±100px max for text, ±50px for subtle elements
- [ ] Monitor CLS (Cumulative Layout Shift) during animations
- [ ] Use `will-change` on max 5 elements
- [ ] Profile with DevTools Performance tab (target 60fps)

---

## Unresolved Questions

1. **Caustics parallax sync:** Should water caustics move at 1:1 scroll ratio or decoupled?
2. **Mobile breakpoint:** Disable horizontal scroll below 768px or use condensed version?
3. **Scroll speed curve:** Linear, ease-out, or acceleration-based parallax for text?
4. **Water ripple trigger:** Manual scroll or automatic ecosystem animation?
5. **Prefetch strategy:** Preload images for horizontal carousel sections?

---

## References

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Next.js + GSAP Tutorial](https://medium.com/@ccjayanti/guide-to-using-gsap-scrolltrigger-in-next-js-with-usegsap-c48d6011f04a)
- [Framer Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [Build Parallax with Framer Motion & Lenis](https://blog.olivierlarose.com/tutorials/smooth-parallax-scroll)
- [Storytelling Portfolio Examples](https://webflow.com/blog/storytelling-websites)
- [Performance Best Practices](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [React-scroll-parallax Library](https://react-scroll-parallax.damnthat.tv/docs/usage/)
