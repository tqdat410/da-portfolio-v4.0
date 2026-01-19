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
  scale?: number;
}

/**
 * Inner scene component - GPU fluid simulation with canvas texture distortion
 */
function WaterScene({ isMobile, text, scale = 10.0 }: WaterSceneProps) {
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
      // CONFIG: Text Appearance Parameters
      fontSize: isMobile ? 48 : 120, // Adjust text size
      fontFamily: '"Style Script", cursive', // Change font family
      textColor: "#f0d1d4", // Match Navbar color (Warm Cream)
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
      const rawX = e.clientX / window.innerWidth;
      const rawY = 1 - e.clientY / window.innerHeight;

      // Apply zoom transformation to UVs to match the scaled mesh
      // Center of zoom is 0.5, 0.5
      const x = (rawX - 0.5) / scale + 0.5;
      const y = (rawY - 0.5) / scale + 0.5;

      // CONFIG: Click Ripple Intensity
      // 3rd argument is intensity (larger = stronger ripple)
      addRipple(x, y, 1.5); // Stronger click ripple
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addRipple, scale]);

  // Add cursor trail ripples only when mouse moves
  useFrame(() => {
    if (!mousePosition.isActive) return;

    // Apply zoom transformation to current mouse position
    const currentX = (mousePosition.x - 0.5) / scale + 0.5;
    const currentY = (mousePosition.y - 0.5) / scale + 0.5;

    // Calculate distance moved since last ripple (in UV space)
    const dx = currentX - lastRipplePosRef.current.x;
    const dy = currentY - lastRipplePosRef.current.y;
    const distSq = dx * dx + dy * dy;

    // Only add ripple if moved more than threshold (prevents static pulsing)
    // Threshold ~0.00001 roughly corresponds to noticeable pixel movement
    if (distSq > 0.00001) {
      // CONFIG: Mouse Move Ripple Intensity
      // 3rd argument is intensity (0.4 = subtle trail)
      addRipple(currentX, currentY, 0.4);
      lastRipplePosRef.current = { x: currentX, y: currentY };
    }
  });

  return <WaterPlane getSimulationTexture={getTexture} contentTexture={contentTexture} scale={scale} />;
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
        // CONFIG: Camera setup - Standard perspective
        camera={{ position: [0, 0, 0], fov: 50 }}
      >
        <Suspense fallback={null}>
          {/* CONFIG: Zoom Level - Adjust scale prop to zoom in/out (e.g. 1.25 = 125% zoom) */}
          <WaterScene isMobile={isMobile} text={text} scale={1.25} />
        </Suspense>
      </Canvas>
    </div>
  );
}
