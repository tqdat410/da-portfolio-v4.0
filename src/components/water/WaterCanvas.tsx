"use client";

import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { WaterPlane } from "./WaterPlane";
import { useRippleCanvas } from "@/hooks/useRippleCanvas";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useMounted } from "@/hooks/useMounted";

// External store for reduced motion preference
function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false; // Default to no reduced motion on server
}

/**
 * Inner scene component that handles ripple logic
 * Must be inside Canvas context for useFrame
 */
function WaterScene({ isMobile }: { isMobile: boolean }) {
  const { texture, addRipple, update } = useRippleCanvas({
    size: isMobile ? 128 : 256,
    decayRate: 0.96,
    maxRipples: isMobile ? 15 : 30,
  });

  const mousePosition = useMousePosition();
  const lastAddTimeRef = useRef(0);

  // Handle click ripples
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      addRipple(x, y, 1.0); // Strong ripple on click
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addRipple]);

  // Update ripples and add cursor trail each frame
  useFrame((state) => {
    const throttleInterval = isMobile ? 0.1 : 0.05;

    // Add cursor trail ripple (throttled)
    if (
      mousePosition.isActive &&
      state.clock.elapsedTime - lastAddTimeRef.current > throttleInterval
    ) {
      addRipple(mousePosition.x, mousePosition.y, 0.3);
      lastAddTimeRef.current = state.clock.elapsedTime;
    }

    // Always update ripple canvas
    update();
  });

  return <WaterPlane rippleTexture={texture} />;
}

/**
 * Main water effects canvas with SSR safety and accessibility
 */
export function WaterCanvas() {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Skip rendering during SSR or if user prefers reduced motion
  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        frameloop={isMobile ? "demand" : "always"}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <WaterScene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
