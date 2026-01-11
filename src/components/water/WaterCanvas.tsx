"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WaterPlane } from "./WaterPlane";
import { createTextCanvas } from "./TextCanvas";
import { useFluidSimulation } from "@/hooks/useFluidSimulation";
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
  return false;
}

interface WaterSceneProps {
  isMobile: boolean;
  text: string;
}

/**
 * Inner scene component - GPU fluid simulation with canvas texture distortion
 */
function WaterScene({ isMobile, text }: WaterSceneProps) {
  const { getTexture, addRipple } = useFluidSimulation({
    resolution: isMobile ? 256 : 512,
  });

  const { size } = useThree();
  const [contentTexture, setContentTexture] = useState<THREE.CanvasTexture | null>(null);
  const mousePosition = useMousePosition();
  const lastRipplePosRef = useRef({ x: 0, y: 0 });


  // Create canvas texture on mount and resize
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const canvas = createTextCanvas({
      width: size.width,
      height: size.height,
      text: text,
      fontSize: isMobile ? 48 : 120,
      fontFamily: '"Style Script", cursive',
      textColor: "#1A1512", // Rich Soil (Dark for bright bg)
      bgColor: "#A3B18A", // Soft Sage (Bright Terrarium bg)
      devicePixelRatio: dpr,
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;

    setContentTexture(texture);

    return () => {
      texture.dispose();
    };
  }, [size.width, size.height, text, isMobile]);

  // Handle click ripples
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      addRipple(x, y, 1.5); // Stronger click ripple
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addRipple]);

  // Add cursor trail ripples only when mouse moves
  useFrame(() => {
    if (!mousePosition.isActive) return;

    // Calculate distance moved since last ripple
    const dx = mousePosition.x - lastRipplePosRef.current.x;
    const dy = mousePosition.y - lastRipplePosRef.current.y;
    const distSq = dx * dx + dy * dy;

    // Only add ripple if moved more than threshold (prevents static pulsing)
    // Threshold ~0.00001 roughly corresponds to noticeable pixel movement
    if (distSq > 0.00001) {
      addRipple(mousePosition.x, mousePosition.y, 0.4);
      lastRipplePosRef.current = { x: mousePosition.x, y: mousePosition.y };
    }
  });

  return <WaterPlane getSimulationTexture={getTexture} contentTexture={contentTexture} />;
}

interface WaterCanvasProps {
  text?: string;
}

/**
 * Main water effects canvas - displays text under water with ripple distortion
 */
export function WaterCanvas({ text = "TrầnQuốcĐạt" }: WaterCanvasProps) {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true" role="presentation">
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        frameloop="always"
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <WaterScene isMobile={isMobile} text={text} />
        </Suspense>
      </Canvas>
    </div>
  );
}
