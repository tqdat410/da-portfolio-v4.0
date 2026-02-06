"use client";

import { content } from "@/content";
import { useIsMobile } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedWaterEffects } from "@/components/water";

/**
 * Hero section with water ripple effect
 * - Displays "Da'portfolio" text at center
 * - Glassmorphism greeting box floating below
 * - Water ripple effect responds to mouse interaction
 */
export function HeroStory() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const hero = content.hero;

  // Glassmorphism greeting box component
  const GreetingBox = () => (
    <div
      className="
        absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-36 z-10
        min-w-140 px-10 py-5 rounded-2xl
        backdrop-blur-sm bg-white/15
        border border-white/25
        shadow-xl shadow-black/10
      "
    >
      <p className="text-text-primary text-center text-sm md:text-base font-medium">
        {hero.greeting}
      </p>
      <p className="text-text-secondary text-center text-xs md:text-sm mt-1">
        {hero.role}
      </p>
    </div>
  );

  // Reduced motion fallback: static display
  if (prefersReducedMotion) {
    return (
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-end pb-24 relative bg-bg-primary"
        aria-labelledby="hero-heading"
      >
        <h1
          id="hero-heading"
          className="text-6xl md:text-8xl font-style-script text-text-primary"
          style={{ fontFamily: '"Style Script", cursive' }}
        >
          {hero.name}
        </h1>
        <GreetingBox />
      </section>
    );
  }

  // Mobile: Simple static layout with water effect
  if (isMobile) {
    return (
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center relative"
        aria-labelledby="hero-heading"
      >
        {/* Water effect background with text inside */}
        <div className="absolute inset-0 z-0">
          <AnimatedWaterEffects name={hero.name} nameColor="#0f172a" />
        </div>

        {/* Glassmorphism greeting box */}
        <GreetingBox />

        {/* Screen reader only text */}
        <h1 id="hero-heading" className="sr-only">
          {hero.name}
        </h1>
      </section>
    );
  }

  // Desktop: Water effect with interactive ripples
  return (
    <section
      id="home"
      className="min-h-screen relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Water effect with "Da'portfolio" text positioned at center */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaterEffects name={hero.name} nameColor="#0f172a" />
      </div>

      {/* Glassmorphism greeting box */}
      <GreetingBox />

      {/* Screen reader only text */}
      <h1 id="hero-heading" className="sr-only">
        {hero.name}
      </h1>

    </section>
  );
}

