# Implementation Recommendations: Scroll-Based Storytelling UI for DaPortfolio v4.0

**Date:** 2026-01-31
**Based On:** Comprehensive research of modern scroll-triggered patterns, glassmorphism, liquid effects
**Target:** DaPortfolio v4.0 enhancement with minimal disruption to existing architecture

---

## EXECUTIVE SUMMARY

DaPortfolio v4.0 has an excellent foundation (GSAP, Three.js, accessibility-first). This document provides **concrete, prioritized implementation recommendations** organized by complexity and impact.

**Three-Tier Approach:**
1. **Quick Wins** (1-2 hours each) - Immediate visual enhancements
2. **Medium Effort** (4-8 hours each) - Core storytelling features
3. **Advanced** (2-3 days each) - Premium interactions

---

## TIER 1: QUICK WINS (Immediate Impact)

### 1.1 Mercury Metallic Gradients on Water Canvas

**What:** Add warm metallic mercury color stops to water surface shader.

**Why:** Aligns with "liquid mercury aesthetic" without adding complexity; leverages existing water effects.

**File to Modify:**
`src/shaders/water.ts`

**Code Snippet:**
```glsl
// In water.ts fragment shader

// Current: Basic water color
// vec3 waterColor = vec3(0.4, 0.6, 0.8);

// Enhanced: Mercury aesthetic
vec3 waterColor = mix(
  vec3(0.9, 0.88, 0.85),     // Warm silver (light)
  vec3(0.6, 0.58, 0.55),      // Warm mercury (mid)
  heightFromHeightMap * 0.5 + 0.5  // Mix based on wave height
);

// Add subtle specular shimmer for metallic effect
vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
float specular = pow(max(dot(normal, lightDir), 0.0), 64.0);
waterColor += specular * vec3(0.95, 0.95, 0.9) * 0.2;

gl_FragColor = vec4(waterColor, waterAlpha);
```

**Effort:** 30 minutes
**Risk:** Low (shader-only, no logic changes)
**Testing:** Visual inspection in browser

---

### 1.2 Glassmorphic Section Overlays with Performance Guard

**What:** Add glassmorphic backgrounds to About, Projects, Contact section headers.

**Why:** Elegant visual enhancement; already designed for (see `design-guidelines.md` Surface Colors).

**Files to Create:**
- `src/components/utils/glassmorphic-section-wrapper.tsx`

**Files to Modify:**
- `src/components/sections/About/About.tsx`
- `src/components/sections/Projects/Projects.tsx`
- `src/components/sections/Contact/Contact.tsx`

**Implementation:**
```typescript
// components/utils/glassmorphic-section-wrapper.tsx
import { ReactNode } from 'react';
import { usePerformanceMonitor } from '@/hooks';

interface GlassmorphicSectionWrapperProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const GlassmorphicSectionWrapper = ({
  children,
  title,
  className = '',
}: GlassmorphicSectionWrapperProps) => {
  const { effectsEnabled } = usePerformanceMonitor();

  // Fallback for low-end devices
  const baseClasses = 'rounded-2xl p-8 md:p-12 mb-12';

  if (!effectsEnabled) {
    return (
      <div className={`${baseClasses} bg-white/30 ${className}`}>
        {title && <h2 className="text-3xl font-luxurious-roman mb-6">{title}</h2>}
        {children}
      </div>
    );
  }

  // Glassmorphic version
  return (
    <div
      className={`${baseClasses} border border-white/20 ${className}`}
      style={{
        background: 'rgba(241, 245, 249, 0.1)',
        WebkitBackdropFilter: 'blur(10px)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {title && (
        <h2 className="text-3xl font-luxurious-roman mb-6 text-slate-900">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
```

**Usage in Section:**
```typescript
// In sections/About.tsx
import { GlassmorphicSectionWrapper } from '@/components/utils/glassmorphic-section-wrapper';

export const About = () => {
  return (
    <section className="py-20">
      <GlassmorphicSectionWrapper title="About Me">
        {/* Existing content */}
      </GlassmorphicSectionWrapper>
    </section>
  );
};
```

**Effort:** 1-2 hours
**Risk:** Low (component wrapper, non-invasive)
**Browser Support:** 95%+ (2025 data)

---

### 1.3 Smooth Scroll Unlock Transition

**What:** Replace instant scroll unlock with smooth easing when animations complete.

**Why:** Professional feel; prevents jarring content shift after animation.

**File to Modify:**
`src/hooks/useScrollStory.ts` (or wherever scroll animations initialize)

**Code Snippet:**
```typescript
// Before: Instant unlock ❌
// document.body.style.overflow = 'auto';

// After: Smooth unlock ✅
const unlockScrollSmooth = () => {
  gsap.to(window, {
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => {
      document.body.style.overflow = 'auto';
    },
  });
};

// Call after hero animation completes
onHeroComplete(() => {
  unlockScrollSmooth();
});
```

**Effort:** 30 minutes
**Risk:** Very Low
**Testing:** Visual check during page load

---

### 1.4 Shimmer Effect on Hero Text

**What:** Add CSS-based shimmer animation to hero title/subtitle.

**Why:** Adds dynamic elegance to existing hero without JavaScript overhead.

**File to Create:**
`src/styles/shimmer-effects.css`

**CSS:**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer-text {
  background: linear-gradient(
    90deg,
    #f1f5f9,
    #ffffff 20%,
    #f1f5f9 40%,
    #f1f5f9
  );
  background-size: 1000px 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite;
}
```

**Usage:**
```tsx
<h1 className="text-5xl font-luxurious-roman shimmer-text">
  {heroContent.greeting}
</h1>
```

**Effort:** 30 minutes
**Risk:** Very Low
**Performance:** Minimal (CSS animation only)

---

## TIER 2: MEDIUM EFFORT (Core Features)

### 2.1 Scroll-Lock Hero Intro Animation (First Visit Only)

**What:** Lock viewport and play intro animation on first page visit, then unlock for normal scrolling.

**Why:** Creates premium "cinematic opening" experience; sets tone for storytelling.

**Files to Create:**
- `src/components/story/scroll-lock-hero-intro.tsx`
- `src/hooks/useFirstVisitAnimation.ts`

**Implementation:**

```typescript
// hooks/useFirstVisitAnimation.ts
import { useEffect, useState } from 'react';

const INTRO_SHOWN_KEY = 'daportofolio-intro-shown';
const INTRO_SESSION_KEY = 'daportofolio-intro-session';

export const useFirstVisitAnimation = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if intro was already shown in this session
    if (sessionStorage.getItem(INTRO_SESSION_KEY)) {
      setShowIntro(false);
      return;
    }

    // Check if first ever visit
    const wasShown = localStorage.getItem(INTRO_SHOWN_KEY);

    if (!wasShown) {
      setShowIntro(true);
      setIsAnimating(true);
    } else if (!sessionStorage.getItem(INTRO_SESSION_KEY)) {
      // Shown before, but not in this session - show abbreviated version
      setShowIntro(true);
      setIsAnimating(false);
    }
  }, []);

  const completeIntro = () => {
    localStorage.setItem(INTRO_SHOWN_KEY, 'true');
    sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    setShowIntro(false);
  };

  return { showIntro, isAnimating, completeIntro };
};
```

```typescript
// components/story/scroll-lock-hero-intro.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useFirstVisitAnimation } from '@/hooks/useFirstVisitAnimation';

export const ScrollLockHeroIntro = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const { showIntro, isAnimating, completeIntro } = useFirstVisitAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showIntro) return;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = 'auto';
        // Smooth scroll unlock
        gsap.to(window, {
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            completeIntro();
            onComplete?.();
          },
        });
      },
    });

    // Animation sequence
    if (isAnimating) {
      tl.from('.intro-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
      })
        .from(
          '.intro-subtitle',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '<0.3'
        )
        .from(
          '.intro-scroll-hint',
          {
            opacity: 0,
            y: 10,
            duration: 0.4,
          },
          '<0.3'
        )
        .to(
          '.intro-title',
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            delay: 2,
          }
        )
        .to(
          '.intro-subtitle',
          {
            opacity: 0,
            y: -20,
            duration: 0.4,
          },
          '<0.2'
        );
    } else {
      // Quick fade for returning visitors
      tl.to('.intro-title', {
        opacity: 0,
        duration: 0.4,
      }).to(
        '.intro-subtitle',
        {
          opacity: 0,
          duration: 0.3,
        },
        '<0.1'
      );
    }

    return () => {
      tl.kill();
      document.body.style.overflow = 'auto';
    };
  }, [showIntro, isAnimating, completeIntro, onComplete]);

  if (!showIntro) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-50 flex flex-col items-center justify-center z-50"
      style={{
        WebkitBackdropFilter: 'blur(5px)',
        backdropFilter: 'blur(5px)',
      }}
    >
      <h1 className="intro-title text-6xl md:text-7xl font-luxurious-roman text-slate-900 text-center px-6">
        DaPortfolio
      </h1>
      <p className="intro-subtitle text-xl md:text-2xl text-slate-600 mt-6 text-center px-6">
        A journey through digital craft
      </p>
      {isAnimating && (
        <div className="intro-scroll-hint absolute bottom-12 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-sm">Scroll to continue</span>
          <svg className="animate-bounce w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
};
```

**Integration in Layout:**
```typescript
// app/layout.tsx
import { ScrollLockHeroIntro } from '@/components/story/scroll-lock-hero-intro';

export default function RootLayout() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <html>
      <body>
        {!introComplete && (
          <ScrollLockHeroIntro onComplete={() => setIntroComplete(true)} />
        )}
        <main className={!introComplete ? 'opacity-0' : 'opacity-100'}>
          {/* Page content */}
        </main>
      </body>
    </html>
  );
}
```

**Effort:** 4-5 hours
**Risk:** Medium (session storage logic, timing sensitive)
**Testing:** Clear local/session storage, test on first visit vs. return
**Browser Support:** All modern browsers

---

### 2.2 Project Card Morphing Animation (Box → Fullscreen)

**What:** Project cards expand to fullscreen on scroll trigger, showing detailed view.

**Why:** Creates dramatic reveal effect; improves project showcase experience.

**Files to Create:**
- `src/components/sections/Projects/project-card-morphing.tsx`

**Implementation:**

```typescript
// components/sections/Projects/project-card-morphing.tsx
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ProjectItem } from '@/types/content';

interface ProjectCardMorphingProps {
  project: ProjectItem;
  index: number;
}

export const ProjectCardMorphing = ({
  project,
  index,
}: ProjectCardMorphingProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!cardRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'center 80%',
        end: 'center 20%',
        scrub: 0.5,
        pin: true,
        pinSpacing: false,
        // markers: true, // Debug
      },
    });

    // Morphing animation
    tl.to(cardRef.current, {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      duration: 1,
    })
      .to(
        cardRef.current,
        {
          left: 0,
          top: 0,
          duration: 1,
        },
        '<'
      )
      .to(
        contentRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
        },
        '<0.2'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full h-96 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      style={{
        position: 'relative',
      }}
    >
      {/* Thumbnail view */}
      <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 text-center px-4">
            <p className="text-2xl">📦</p>
            <p className="text-sm">{project.title}</p>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">
          {project.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4">{project.description}</p>
        <div className="flex gap-2 flex-wrap">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded view (hidden until morphing) */}
      <div
        ref={contentRef}
        className="absolute inset-0 bg-slate-900 text-white p-12 opacity-0 scale-95 overflow-auto"
        style={{
          pointerEvents: 'none',
        }}
      >
        <h2 className="text-5xl font-luxurious-roman mb-6">{project.title}</h2>

        {project.fullDescription && (
          <p className="text-lg text-slate-200 mb-8 max-w-2xl">
            {project.fullDescription}
          </p>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Technology Stack</h3>
          <div className="flex flex-wrap gap-3">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              style={{ pointerEvents: 'auto' }}
            >
              View Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              style={{ pointerEvents: 'auto' }}
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Effort:** 6-8 hours (includes content structure updates)
**Risk:** Medium (layout and overflow management)
**Performance:** Monitor on lower-end devices
**Enhancement:** Combine with clip-path for smoother morphing

---

### 2.3 Glassmorphic About Section Cards with Staggered Reveal

**What:** About section skills/education display in glassmorphic cards that reveal on scroll.

**Files to Modify:**
- `src/components/sections/About/About.tsx`

**Pattern:**
```typescript
// In About component
gsap.utils.toArray('.skill-card').forEach((card, index) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top center',
      end: 'center center',
      scrub: 0.5,
    },
    opacity: 0,
    y: 30,
    x: index % 2 === 0 ? -30 : 30,
    stagger: 0.1,
    duration: 0.8,
  });
});
```

**Effort:** 3-4 hours
**Risk:** Low
**Testing:** Visual alignment on different screen sizes

---

## TIER 3: ADVANCED (Premium Features)

### 3.1 Liquid Blob Animation System

**What:** Animated morphing blob shapes that respond to scroll, using CSS + GSAP.

**Why:** High visual impact; differentiates portfolio; demonstrates technical depth.

**Files to Create:**
- `src/components/effects/liquid-blob-animation.tsx`
- `src/shaders/liquid-blob.ts` (optional, for WebGL version)

**CSS-Based Implementation:**
```typescript
// components/effects/liquid-blob-animation.tsx
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '@/styles/liquid-blob.css';

export const LiquidBlobAnimation = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Morph between blob shapes
    const shapes = [
      'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      'polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)',
      'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    ];

    shapes.forEach((shape, index) => {
      gsap.to('.liquid-blob', {
        clipPath: shape,
        scrollTrigger: {
          trigger: '.portfolio-section-' + index,
          start: 'top center',
          end: 'center center',
          scrub: 0.5,
        },
        duration: 1.5,
      });
    });
  }, []);

  return (
    <div className="fixed top-12 right-12 z-10 pointer-events-none">
      <div
        className="liquid-blob w-48 h-48 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'float 4s ease-in-out infinite',
        }}
      />
    </div>
  );
};
```

**CSS Animation:**
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) scale(1.05);
    opacity: 0.8;
  }
}

.liquid-blob {
  filter: blur(2px);
  transition: clip-path 1s ease-in-out;
}
```

**Effort:** 8-12 hours (includes shader work if WebGL version)
**Risk:** Medium (animation complexity, performance on mobile)
**ROI:** Very High (visual impact)

---

### 3.2 Scroll-Driven Dual-Column Text Animation

**What:** Two columns of text that animate in sync with scroll, creating wave/parallax effect.

**Why:** Creates premium editorial experience; demonstrates GSAP mastery.

**Files to Create:**
- `src/components/sections/HeroStory/dual-column-scroll-text.tsx`

**Implementation:**
```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const DualColumnScrollText = ({
  leftText,
  rightText,
}: {
  leftText: string;
  rightText: string;
}) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.dual-column-container',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    // Left column: slide in from left while fading
    tl.from(leftRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
    }, 0)
    // Right column: slide in from right while fading
    .from(rightRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
    }, 0)
    // Stagger letter animation
    .from('.dual-column-letter', {
      opacity: 0.3,
      stagger: 0.02,
      duration: 0.5,
    }, 0);
  }, []);

  return (
    <div className="dual-column-container grid grid-cols-2 gap-12 py-20">
      <div ref={leftRef} className="text-lg text-slate-700 leading-relaxed">
        {leftText.split('').map((char, i) => (
          <span key={i} className="dual-column-letter">
            {char}
          </span>
        ))}
      </div>
      <div ref={rightRef} className="text-lg text-slate-700 leading-relaxed">
        {rightText.split('').map((char, i) => (
          <span key={i} className="dual-column-letter">
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};
```

**Effort:** 6-8 hours
**Risk:** Medium (performance on mobile with many text nodes)
**Recommendation:** Limit text length, batch process letters

---

### 3.3 Scroll-Triggered Water Surface Reflection Effects

**What:** Enhance water canvas with scroll-reactive distortion and reflection mapping.

**Why:** Premium visual effect; showcases WebGL/GPU capabilities.

**Files to Modify:**
`src/shaders/water.ts`

**Enhancement:**
```glsl
// Add scroll-reactive uniforms
uniform float scrollProgress;  // 0 to 1
uniform float scrollVelocity;  // delta scroll

// In fragment shader
// Modulate wave frequency based on scroll speed
float frequency = 2.0 + scrollVelocity * 3.0;

// Create reflection effect
vec3 reflected = reflect(viewDir, normal);
vec3 reflectionColor = texture(reflectionMap, reflected.xy * 0.5 + 0.5).rgb;

// Blend with water color
vec3 finalColor = mix(waterColor, reflectionColor, 0.15 + scrollProgress * 0.1);
```

**Effort:** 10-14 hours
**Risk:** High (GPU optimization required)
**Performance:** Test extensively on lower-end devices
**Benefit:** Highly differentiating visual feature

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)
- [x] Quick Wins (1.1-1.4): 2-3 hours total
- [x] Scroll-Lock Intro (2.1): 4-5 hours
- [ ] **Total:** ~7-8 hours
- [ ] **Branch:** `feature/scroll-storytelling-p1`

### Phase 2: Core Features (Week 2)
- [ ] Project Card Morphing (2.2): 6-8 hours
- [ ] About Cards Stagger (2.3): 3-4 hours
- [ ] **Total:** ~10-12 hours
- [ ] **Branch:** `feature/scroll-storytelling-p2`

### Phase 3: Premium (Week 3-4)
- [ ] Liquid Blob System (3.1): 8-12 hours
- [ ] Dual-Column Text (3.2): 6-8 hours
- [ ] Water Reflections (3.3): 10-14 hours
- [ ] **Total:** ~24-34 hours
- [ ] **Branch:** `feature/scroll-storytelling-p3`

---

## CRITICAL IMPLEMENTATION NOTES

### Performance Guardrails
1. Always check `usePerformanceMonitor` before rendering expensive effects
2. Test on iPhone 12/iPad Air 2 (baseline mobile devices)
3. Monitor FPS with DevTools Performance tab
4. Disable animations if FPS < 50

### Accessibility Integration
1. Respect `useReducedMotion` in all GSAP animations
2. Test with keyboard-only navigation
3. Ensure focus management in modals/expanded cards
4. Provide text alternatives for visual storytelling

### Browser Testing
- Chrome/Edge 120+
- Firefox 122+
- Safari 16+ (test with `-webkit-` prefixes)
- Mobile Safari iOS 16+
- Chrome Android

### Git & Commit Strategy
- One feature per branch (`feature/feature-name`)
- Atomic commits with conventional format
- Test before committing
- Review with `code-reviewer` agent after implementation

---

## DEPENDENCIES & VERSION COMPATIBILITY

| Package | Current | Notes |
|---------|---------|-------|
| GSAP | 3.14.2 | ScrollTrigger included (free post-2024) |
| React | 19.2.3 | useEffect/useRef sufficient |
| Three.js | 0.182.0 | Water shader already optimized |
| Tailwind CSS | v4 | CSS variables supported |
| TypeScript | 5 | Strict mode compatible |

---

## TESTING CHECKLIST PER FEATURE

### Before Merge:
- [ ] No TypeScript errors
- [ ] Passes ESLint
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Works on mobile (iOS Safari, Chrome Android)
- [ ] Respects `prefers-reduced-motion`
- [ ] Performance: 60 FPS on modern hardware, 30+ FPS on baseline mobile
- [ ] No console errors/warnings
- [ ] Focus management works (keyboard nav)
- [ ] Accessibility: axe-core scan passes

### Post-Deployment:
- [ ] Monitor Core Web Vitals (CLS, LCP, FID)
- [ ] Check mobile performance analytics
- [ ] Gather user feedback on scroll experience

---

## SUCCESS METRICS

### Visual
- Smooth 60 FPS scrolling (target 90% of users)
- Glassmorphism renders without flicker
- Morphing animations appear natural

### UX
- Users spend 20%+ more time on portfolio
- Click-through on projects increases 15%+
- Mobile bounce rate decreases 10%+

### Technical
- Lighthouse Performance score 85+
- First Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1

---

## UNRESOLVED QUESTIONS FOR PLANNING PHASE

1. **Content Data Structure:** Do ProjectItem types need `fullDescription`, `thumbnail`, `technologies` fields? Requires schema update.
2. **Glassmorphism Blur Value:** What blur (8px, 10px, 12px) feels right with DaPortfolio's design? A/B test recommendation.
3. **Intro Repeat Strategy:** Should intro show on every new tab? Current recommendation: once per session.
4. **Mobile Morphing:** Should project card morphing disable on mobile (< 768px) for better UX? Performance vs. experience trade-off.
5. **Water Canvas Integration:** Can liquid blob share water canvas context or needs separate renderer? Architecture question.

---

## REFERENCES & LINKS

All sources consolidated in primary research report:
`plans/reports/researcher-260131-2020-scroll-storytelling-ui-patterns.md`

Key quick links:
- GSAP Docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- DaPortfolio Architecture: `docs/system-architecture.md`
- Design System: `docs/design-guidelines.md`
- Code Standards: `docs/code-standards.md`

---

**Generated:** 2026-01-31
**Status:** Ready for Planner Phase
**Next Steps:** Planner to create detailed task breakdown and timeline
