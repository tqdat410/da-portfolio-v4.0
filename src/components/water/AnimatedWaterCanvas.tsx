"use client";

import { Suspense, useEffect, useRef, useState, useMemo, useSyncExternalStore, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WaterPlane } from "./WaterPlane";
import { createMultiTextCanvas, updateMultiTextCanvas, TextItem } from "./TextCanvas";
import { useFluidSimulation } from "@/hooks/useFluidSimulation";
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
  fontSize?: number;
  textY?: number;
  addRippleRef: React.MutableRefObject<((x: number, y: number, intensity: number) => void) | null>;
}

/**
 * Inner scene component - GPU fluid simulation with animated canvas texture
 * Simplified: Only renders "Da'portfolio" text at bottom center
 * Shares fluid simulation with parent via addRippleRef
 */
function AnimatedScene({ isMobile, name, bgColor, nameColor, scale = 1.0, fontSize, textY = 0.5, addRippleRef }: AnimatedSceneProps) {
  const { getTexture, addRipple } = useFluidSimulation({
    resolution: isMobile ? 256 : 512,
  });

  // Expose addRipple to parent component
  useEffect(() => {
    addRippleRef.current = addRipple;
    return () => {
      addRippleRef.current = null;
    };
  }, [addRipple, addRippleRef]);

  const { size } = useThree();
  const [contentTexture, setContentTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Memoize text item - single "Da'portfolio" at bottom center
  const textItem = useMemo(
    (): TextItem => ({
      id: "name",
      text: name,
      x: 0.5, // Center horizontally
      y: textY, // Position at specified Y (default 0.5)
      fontSize: fontSize || (isMobile ? 140 : 360), // Use custom fontSize or default
      fontFamily: '"Style Script", cursive',
      color: nameColor,
      opacity: 1,
      align: "center",
      baseline: "middle",
      // Silver Mist glow effect (subtle metallic shine)
      glowColor: "#cbd5e1",
      glowBlur: 40,
    }),
    [name, isMobile, nameColor, fontSize, textY]
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

    // Ensure we are calling with correct arguments: canvas, items array, bgColor, dpr
    updateMultiTextCanvas(canvasRef.current, items, bgColor, dpr);
    textureRef.current.needsUpdate = true;
  });

  // Update canvas texture (for any future animation needs)
  useFrame(() => {
    // Only update if we have animations or if needsUpdate flag is set
    // For static text, we can optimize this, but for now keep it simple
    if (!canvasRef.current || !textureRef.current) return;
    
    // We can rely on the useEffect above for prop changes
    // useFrame is mostly for continuous animations (like scrolling text)
    // If textItem is static, we don't strictly need this every frame unless revealing
  });

  return (
    <WaterPlane getSimulationTexture={getTexture} contentTexture={contentTexture} scale={scale} />
  );
}

export interface AnimatedWaterCanvasProps {
  name: string;
  bgColor?: string;
  nameColor?: string;
  fontSize?: number;
  textY?: number;
}

/**
 * Simplified animated water canvas
 * Only displays name text at bottom with water ripple effect
 * Mouse interactions are scoped to the container bounds
 */
export function AnimatedWaterCanvas({
  name,
  bgColor = "#f1f5f9", // Silver Mist Background (Slate 100)
  nameColor = "#0f172a", // Slate 900 - Dark Text
  fontSize,
  textY,
}: AnimatedWaterCanvasProps) {
  const mounted = useMounted();
  const isMobile = useIsMobile();
  const [fontsReady, setFontsReady] = useState(false);

  // Wait for web fonts to load before rendering canvas text
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const addRippleRef = useRef<((x: number, y: number, intensity: number) => void) | null>(null);
  const lastRipplePosRef = useRef({ x: 0, y: 0 });
  const scale = 1; // No zoom for crisp text quality

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Helper to convert mouse event to section-relative UV coordinates
  const getRelativePosition = useCallback((e: MouseEvent): { x: number; y: number; inBounds: boolean } => {
    if (!containerRef.current) return { x: 0, y: 0, inBounds: false };
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Check if mouse is within bounds
    const inBounds = relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height;
    
    // Convert to UV coordinates (0-1, with Y flipped for WebGL)
    const rawX = relativeX / rect.width;
    const rawY = 1 - relativeY / rect.height;
    
    // Apply zoom transformation
    const x = (rawX - 0.5) / scale + 0.5;
    const y = (rawY - 0.5) / scale + 0.5;
    
    return { x, y, inBounds };
  }, [scale]);

  // Handle click ripples - only within container bounds
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const pos = getRelativePosition(e);
      if (!pos.inBounds || !addRippleRef.current) return;
      
      addRippleRef.current(pos.x, pos.y, 1.5);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [getRelativePosition]);

  // Handle mouse move ripples - only within container bounds
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pos = getRelativePosition(e);
      if (!pos.inBounds || !addRippleRef.current) return;
      
      const dx = pos.x - lastRipplePosRef.current.x;
      const dy = pos.y - lastRipplePosRef.current.y;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0.00001) {
        addRippleRef.current(pos.x, pos.y, 0.4);
        lastRipplePosRef.current = { x: pos.x, y: pos.y };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [getRelativePosition]);

  if (!mounted || !fontsReady || prefersReducedMotion) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0" aria-hidden="true" role="presentation">
      <Canvas
        dpr={isMobile ? 1 : [1, 2]}
        frameloop="always"
        gl={{
          antialias: true, // Enable for crisp text edges
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <AnimatedScene
            isMobile={isMobile}
            name={name}
            bgColor={bgColor}
            nameColor={nameColor}
            scale={scale}
            fontSize={fontSize}
            textY={textY}
            addRippleRef={addRippleRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

