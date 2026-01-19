"use client";

import { useEffect, useRef, RefObject } from "react";
import { gsap, ScrollTrigger } from "./useGSAP";

interface UseScrollProgressOptions {
  /** Element that triggers the scroll animation */
  triggerRef: RefObject<HTMLElement | null>;
  /** Scroll distance during which section is pinned */
  pinDuration: number;
  /** Whether animation is enabled */
  enabled?: boolean;
  /** Callback for progress updates (0-1) */
  onProgress?: (progress: number) => void;
}

/**
 * Hook for scroll progress tracking with pinning
 * Returns progress value (0-1) that can be used for WebGL animations
 */
export function useScrollProgress(options: UseScrollProgressOptions) {
  const { triggerRef, pinDuration, enabled = true, onProgress } = options;
  const progressRef = useRef(0);

  useEffect(() => {
    if (!enabled || !triggerRef.current) return;

    // Create ScrollTrigger for progress tracking
    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: `+=${pinDuration}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        onProgress?.(self.progress);
      },
    });

    return () => trigger.kill();
  }, [enabled, pinDuration, triggerRef, onProgress]);

  // Refresh ScrollTrigger on resize
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enabled]);

  return progressRef;
}
