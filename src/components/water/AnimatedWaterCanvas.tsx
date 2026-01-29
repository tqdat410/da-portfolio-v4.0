"use client";

import { Suspense, useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WaterPlane } from "./WaterPlane";
import { createMultiTextCanvas, updateMultiTextCanvas, TextItem } from "./TextCanvas";
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

interface AnimatedSceneProps {
  isMobile: boolean;
  name: string;
  bgColor: string;
  nameColor: string;
  scale?: number;
}

/**
 * Inner scene component - GPU fluid simulation with animated canvas texture
 * Simplified: Only renders "Da'portfolio" text at bottom center
 */
function AnimatedScene({ isMobile, name, bgColor, nameColor, scale = 10.0 }: AnimatedSceneProps) {
  const { getTexture, addRipple } = useFluidSimulation({
    resolution: isMobile ? 256 : 512,
  });

  const { size } = useThree();
  const [contentTexture, setContentTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const mousePosition = useMousePosition();
  const lastRipplePosRef = useRef({ x: 0, y: 0 });

  // Memoize text item - single "Da'portfolio" at bottom center
  const textItem = useMemo(
    (): TextItem => ({
      id: "name",
      text: name,
      x: 0.5, // Center horizontally
      y: 0.5, // Position at center (0.5 = 50% from top)
      fontSize: isMobile ? 34 : 90,
      fontFamily: '"Style Script", cursive',
      color: nameColor,
      opacity: 1,
      align: "center",
      baseline: "middle",
      // Silver Mist glow effect (subtle metallic shine)
      glowColor: "#cbd5e1",
      glowBlur: 40,
    }),
    [name, isMobile, nameColor]
  );

  // Create canvas and texture on mount/resize
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const items = [textItem];

    const canvas = createMultiTextCanvas({
      width: size.width,
      height: size.height,
      items,
      bgColor,
      devicePixelRatio: dpr,
    });

    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    texture.needsUpdate = true;

    textureRef.current = texture;
    setContentTexture(texture);

    return () => {
      texture.dispose();
    };
  }, [size.width, size.height, bgColor, textItem]);

  // Update canvas texture (for any future animation needs)
  useFrame(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const items = [textItem];

    updateMultiTextCanvas(canvasRef.current, items, bgColor, dpr);
    textureRef.current.needsUpdate = true;
  });

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
      addRipple(x, y, 1.5);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [addRipple, scale]);

  // Add cursor trail ripples
  useFrame(() => {
    if (!mousePosition.isActive) return;

    // Apply zoom transformation to current mouse position
    const currentX = (mousePosition.x - 0.5) / scale + 0.5;
    const currentY = (mousePosition.y - 0.5) / scale + 0.5;

    const dx = currentX - lastRipplePosRef.current.x;
    const dy = currentY - lastRipplePosRef.current.y;
    const distSq = dx * dx + dy * dy;

    if (distSq > 0.00001) {
      // CONFIG: Mouse Move Ripple Intensity
      addRipple(currentX, currentY, 0.4);
      lastRipplePosRef.current = { x: currentX, y: currentY };
    }
  });

  return (
    <WaterPlane getSimulationTexture={getTexture} contentTexture={contentTexture} scale={scale} />
  );
}

export interface AnimatedWaterCanvasProps {
  name: string;
  bgColor?: string;
  nameColor?: string;
}

/**
 * Simplified animated water canvas
 * Only displays "Da'portfolio" text at bottom with water ripple effect
 */
export function AnimatedWaterCanvas({
  name,
  bgColor = "#f1f5f9", // Silver Mist Background (Slate 100)
  nameColor = "#0f172a", // Slate 900 - Dark Text
}: AnimatedWaterCanvasProps) {
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
        // CONFIG: Camera setup
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <AnimatedScene
            isMobile={isMobile}
            name={name}
            bgColor={bgColor}
            nameColor={nameColor}
            // CONFIG: Zoom Level - Adjust scale prop to zoom in/out (e.g. 1.25 = 125% zoom)
            scale={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
