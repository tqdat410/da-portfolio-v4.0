"use client";

import { useRef } from "react";
import { content } from "@/content";
import { useIsMobile } from "@/hooks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollStory } from "@/hooks/useScrollStory";
import { WaterEffects } from "@/components/water";
import { RoleCarousel } from "./RoleCarousel";

/**
 * Hero section with water ripple effect and scroll-animated roles
 * - Desktop: Horizontal scroll animation for roles during pin
 * - Mobile: Static vertical layout
 * - Reduced motion: Static display
 */
export function HeroStory() {
  const triggerRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Skip scroll animation on mobile or reduced motion preference
  const enableScrollAnimation = !isMobile && !prefersReducedMotion;

  // Setup scroll-triggered horizontal animation
  useScrollStory({
    triggerRef,
    contentRef: carouselRef,
    scrollDistance: 2000, // Total horizontal scroll distance
    pinDuration: 800, // Scroll pixels during which section is pinned
    enabled: enableScrollAnimation,
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
        {/* Water effect background */}
        <div className="absolute inset-0 z-0">
          <WaterEffects text={hero.name} />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-teal-accent/10 border border-teal-accent/30">
            <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
            <span className="text-sm text-aqua-bright">{hero.status}</span>
          </div>

          {/* Name - hidden because rendered in water canvas */}
          <h1 className="sr-only">{hero.name}</h1>

          {/* Roles - vertical stack on mobile */}
          <div className="flex flex-col gap-3 mt-8">
            {roles.map((role, index) => (
              <span
                key={role}
                className={`text-lg ${
                  index % 2 === 0 ? "text-aqua-bright/80" : "text-teal-accent/70"
                }`}
              >
                {role}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 mt-8">
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
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  // Desktop: scroll-animated horizontal roles
  return (
    <section
      ref={triggerRef}
      id="home"
      className="min-h-screen relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Water effect - full screen background */}
      <div className="absolute inset-0 z-0">
        <WaterEffects text={hero.name} />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center">
        {/* Status Badge - top center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-accent/10 border border-teal-accent/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-aqua-bright animate-pulse" />
            <span className="text-sm text-aqua-bright">{hero.status}</span>
          </div>
        </div>

        {/* Name - screen reader only (visible in water canvas) */}
        <h1 id="hero-heading" className="sr-only">
          {hero.name}
        </h1>

        {/* Roles carousel - positioned at bottom third of screen */}
        <div className="absolute bottom-1/4 left-0 w-full overflow-visible">
          <div
            ref={carouselRef}
            className="pl-[100vw]" // Start from right side of viewport
          >
            <RoleCarousel roles={roles} />
          </div>
        </div>

        {/* CTA Buttons - fixed position during scroll */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-4">
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
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-teal-accent/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-aqua-bright animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
