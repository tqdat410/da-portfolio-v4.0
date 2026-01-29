"use client";

import { content } from "@/content";
import { useIsMobile } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatedWaterEffects } from "@/components/water";

/**
 * Hero section with water ripple effect
 * - Simplified: Only displays "Da'portfolio" text at bottom center
 * - Water ripple effect responds to mouse interaction
 * - No scroll animations or role carousel
 */
export function HeroStory() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  const hero = content.hero;

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
      {/* Water effect with "Da'portfolio" text positioned at bottom */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaterEffects name={hero.name} nameColor="#0f172a" />
      </div>

      {/* Screen reader only text */}
      <h1 id="hero-heading" className="sr-only">
        {hero.name}
      </h1>
    </section>
  );
}
