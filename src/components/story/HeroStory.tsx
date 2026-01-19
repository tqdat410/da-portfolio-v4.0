"use client";

import { useRef, useState, useCallback } from "react";
import { content } from "@/content";
import { useIsMobile } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { WaterEffects, AnimatedWaterEffects } from "@/components/water";

/**
 * Hero section with water ripple effect and scroll-animated roles
 * - Desktop: All text rendered inside water canvas with scroll animation
 * - Mobile: Static vertical layout with water effect
 * - Reduced motion: Static display
 */
export function HeroStory() {
  const triggerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Skip scroll animation on mobile or reduced motion preference
  const enableScrollAnimation = !isMobile && !prefersReducedMotion;

  // Handle scroll progress updates
  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  // Setup scroll-triggered progress tracking
  useScrollProgress({
    triggerRef,
    pinDuration: 10000, // Very slow storytelling scroll
    enabled: enableScrollAnimation,
    onProgress: handleProgress,
  });

  const hero = content.hero;
  const roles = content.roles;

  // Mobile fallback: vertical static layout
  if (isMobile) {
    return (
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center p-8 relative"
      >
        {/* Water effect background - name and roles all in water */}
        <div className="absolute inset-0 z-0">
          <AnimatedWaterEffects
            name={hero.name}
            roles={roles}
            scrollProgress={0} // Static on mobile
          />
        </div>

        {/* Content overlay - only non-text elements */}
        <div className="relative z-10 text-center">
          {/* Status Badge */}
          {/* Status Badge - REMOVED per request */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-accent/10 border border-teal-accent/30">
            <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
            <span className="text-sm text-aqua-bright">{hero.status}</span>
          </div> */}

          {/* Name and roles - screen reader only (visible in water canvas) */}
          <h1 className="sr-only">{hero.name}</h1>
          <div className="sr-only">
            {roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>

          {/* CTA Buttons */}
          {/* CTA Buttons - REMOVED per request */}
          {/* <div className="flex flex-col gap-4 mt-64">
            <a
              href="#projects"
              className="px-8 py-3 rounded-lg bg-teal-accent text-midnight font-medium hover:bg-aqua-bright transition-colors shadow-lg shadow-teal-accent/20"
            >
              {hero.cta}
            </a>
            <a
              href={hero.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg border border-teal-accent/50 text-aqua-bright hover:bg-teal-accent/10 transition-colors"
            >
              {hero.downloadCv}
            </a>
          </div> */}
        </div>

        {/* Scroll indicator */}
        {/* Scroll indicator - REMOVED per request */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
          </div>
        </div> */}
      </section>
    );
  }

  // Desktop: scroll-animated text inside water canvas
  return (
    <section
      ref={triggerRef}
      id="home"
      className="min-h-screen relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Water effect - name and roles all rendered inside water canvas */}
      <div className="absolute inset-0 z-0">
        <AnimatedWaterEffects
          name={hero.name}
          roles={roles}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Content layer - only non-text UI elements */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center pointer-events-none">
        {/* Status Badge - top center */}
        {/* Status Badge - top center - REMOVED per request */}
        {/* <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-accent/10 border border-teal-accent/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
            <span className="text-sm text-aqua-bright">{hero.status}</span>
          </div>
        </div> */}

        {/* Name and roles - screen reader only (visible in water canvas) */}
        <h1 id="hero-heading" className="sr-only">
          {hero.name}
        </h1>
        <div className="sr-only">
          {roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>

        {/* CTA Buttons - fixed position during scroll */}
        {/* CTA Buttons - fixed position during scroll - REMOVED per request */}
        {/* <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
          <a
            href="#projects"
            className="px-8 py-3 rounded-lg bg-teal-accent text-midnight font-medium hover:bg-aqua-bright transition-colors shadow-lg shadow-teal-accent/20"
          >
            {hero.cta}
          </a>
          <a
            href={hero.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg border border-teal-accent/50 text-aqua-bright hover:bg-teal-accent/10 transition-colors backdrop-blur-sm"
          >
            {hero.downloadCv}
          </a>
        </div> */}

        {/* Scroll indicator */}
        {/* Scroll indicator - REMOVED per request */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
          </div>
        </div> */}
      </div>
    </section>
  );
}
