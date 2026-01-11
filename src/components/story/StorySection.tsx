"use client";

import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StorySectionProps {
  /** Unique ID for navigation anchors */
  id: string;
  /** Section content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to enable scroll-based animations */
  enableScrollAnimation?: boolean;
  /** ARIA label for the section */
  ariaLabel?: string;
}

/**
 * Base component for story-driven sections with scroll animation support.
 * Provides consistent structure, accessibility, and reduced motion handling.
 *
 * @example
 * ```tsx
 * <StorySection id="hero" ariaLabel="Hero introduction">
 *   <h1>Welcome</h1>
 *   <RoleCarousel roles={roles} />
 * </StorySection>
 * ```
 */
export function StorySection({
  id,
  children,
  className,
  enableScrollAnimation = true,
  ariaLabel,
}: StorySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Disable animations if user prefers reduced motion
  const shouldAnimate = enableScrollAnimation && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative min-h-screen w-full", "flex items-center justify-center", className)}
      aria-label={ariaLabel}
      data-story-section
      data-animate={shouldAnimate}
    >
      {children}
    </section>
  );
}
