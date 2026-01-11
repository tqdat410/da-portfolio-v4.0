"use client";

import { useLayoutEffect, RefObject } from "react";
import { gsap, ScrollTrigger } from "./useGSAP";

interface UseScrollStoryOptions {
  /** Element that triggers the scroll animation */
  triggerRef: RefObject<HTMLElement | null>;
  /** Element that moves horizontally */
  contentRef: RefObject<HTMLElement | null>;
  /** How far to scroll horizontally (pixels) */
  scrollDistance: number;
  /** Scroll distance during which section is pinned (pixels) */
  pinDuration: number;
  /** Whether animation is enabled */
  enabled?: boolean;
}


/**
 * Hook for scroll-triggered horizontal animation with pinning
 * Uses GSAP ScrollTrigger for smooth scroll-linked animation
 */
export function useScrollStory(options: UseScrollStoryOptions) {
  const { triggerRef, contentRef, scrollDistance, pinDuration, enabled = true } = options;

  useLayoutEffect(() => {
    if (!enabled || !triggerRef.current || !contentRef.current) return;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${pinDuration}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          // Debug markers (remove in production)
          // markers: true,
        },
      });
    });

    // Cleanup on unmount or when dependencies change
    return () => ctx.revert();
  }, [enabled, scrollDistance, pinDuration, triggerRef, contentRef]);

  // Refresh ScrollTrigger on resize
  useLayoutEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enabled]);
}
