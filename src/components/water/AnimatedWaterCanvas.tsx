"use client";

import { Suspense, useEffect, useRef, useState, useMemo, useSyncExternalStore } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WaterPlane } from "./WaterPlane";
import {
  createMultiTextCanvas,
  updateMultiTextCanvas,
  TextItem,
} from "./TextCanvas";
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

// CONFIG: Scroll Animation Constants
// Adjust these to change how text moves during scroll
// CONFIG: Scroll Animation Constants
// Adjust these to change how text moves during scroll
const ANIMATION_CONFIG = {
  // Name animation: Fade out in place
  name: {
    x: 0.5, // Center
    startOpacity: 1,
    endOpacity: 0,
  },
  // Roles animation: Fade in in place
  roles: {
    x: 0.5, // Center
    startY: 0.4, // Start slightly above center for the first item?
    gapY: 0.12, // Vertical gap between roles
    startOpacity: 0,
    endOpacity: 1,
  },
};

interface AnimatedSceneProps {
  isMobile: boolean;
  name: string;
  roles: string[];
  scrollProgress: number;
  bgColor: string;
  nameColor: string;
  roleColor: string;
  scale?: number;
}

/**
 * Inner scene component - GPU fluid simulation with animated canvas texture
 */
function AnimatedScene({
  isMobile,
  name,
  roles,
  scrollProgress,
  bgColor,
  nameColor,
  roleColor,
  scale = 10.0,
}: AnimatedSceneProps) {
  const { getTexture, addRipple } = useFluidSimulation({
    resolution: isMobile ? 256 : 512,
  });

  const { size } = useThree();
  const [contentTexture, setContentTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const mousePosition = useMousePosition();
  const lastRipplePosRef = useRef({ x: 0, y: 0 });

  // Memoize base text items (without animation transforms)
  const baseItems = useMemo((): TextItem[] => {
    const items: TextItem[] = [
      {
        id: "name",
        text: name,
        x: ANIMATION_CONFIG.name.x,
        y: 0.5, // Centered
        fontSize: isMobile ? 48 : 140,
        fontFamily: '"Style Script", cursive',
        color: nameColor,
        opacity: 1,
        align: "center",
        baseline: "middle",
        // CONFIG: Text Glow Effect
        glowColor: "#ffffff", // White glow
        glowBlur: 30, // Blur radius
      },
    ];

    // Story telling content - Split for mixed fonts
    // Using separate items for "my name is" and "TrầnQuốcĐạt" to allow different fonts
    const STORY_ITEMS = [
      { 
        id: "story-0",
        text: "'' my name is Trần Quốc Đạt", 
        y: 0.44, 
        x: 0.5, 
        align: "center" as CanvasTextAlign,
        size: isMobile ? 16 : 42,
        font: '"Luxurious Roman", serif',
      },
      { 
        id: "story-1",
        text: "a Software engineer", 
        y: 0.5, 
        x: 0.5, 
        align: "center" as CanvasTextAlign,
        size: isMobile ? 16 : 42,
        font: '"Luxurious Roman", serif',
      },
      { 
        id: "story-2",
        text: "& SAP tech. consultant ''", 
        y: 0.56, 
        x: 0.5, 
        align: "center" as CanvasTextAlign,
        size: isMobile ? 16 : 42,
        font: '"Luxurious Roman", serif',
      },
    ];

    // Initialize items with proper styling
    STORY_ITEMS.forEach((line) => {
      items.push({
        id: line.id,
        text: line.text,
        x: line.x,
        y: line.y,
        fontSize: line.size,
        fontFamily: line.font,
        color: nameColor,
        opacity: 0,
        align: line.align,
        baseline: "middle",
        glowColor: "#ffffff",
        glowBlur: 20, // Increased glow intensity
      });
    });

    return items;
  }, [name, isMobile, nameColor]);

  // Calculate animated positions based on scroll progress
  const getAnimatedItems = (progress: number): TextItem[] => {
    return baseItems.map((item) => {
      if (item.id === "name") {
        // Name: Fades out
        // Opacity 1 -> 0 as progress 0 -> 0.35
        const opacity = Math.max(0, 1 - progress * 2.8);
        return { ...item, opacity };
      } else if (item.id.startsWith("story-")) {
        const index = parseInt(item.id.split("-")[1] || "0");
        
        // Define timelines for each line
        // Slower animation - adjusted to fit within 0-1 progress range
        // With 3 items: 0.25→0.50, 0.47→0.72, 0.69→0.94
        const start = 0.25 + (index * 0.22);
        const end = start + 0.25;
        
        // Calculate reveal progress (0 to 1)
        const revealProgress = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        
        return { 
          ...item, 
          opacity: revealProgress > 0 ? 1 : 0, 
          revealProgress: revealProgress, 
        };
      }
      return item;
    });
  };

  // Create canvas and texture on mount/resize
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const items = getAnimatedItems(scrollProgress);

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
  }, [size.width, size.height, bgColor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update canvas texture when scroll progress changes
  useFrame(() => {
    if (!canvasRef.current || !textureRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const items = getAnimatedItems(scrollProgress);

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

  return <WaterPlane getSimulationTexture={getTexture} contentTexture={contentTexture} scale={scale} />;
}

// Easing function for smooth animation
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export interface AnimatedWaterCanvasProps {
  name: string;
  roles: string[];
  scrollProgress: number;
  bgColor?: string;
  nameColor?: string;
  roleColor?: string;
}

/**
 * Animated water canvas with scroll-driven text animations
 * All text is rendered inside the water effect
 */
export function AnimatedWaterCanvas({
  name,
  roles,
  scrollProgress,
  bgColor = "#A3B18A",
  nameColor = "#A3B18A", // Match Navbar color (Warm Cream)
  roleColor = "#d7c3ac", // Match Navbar color
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
            roles={roles}
            scrollProgress={scrollProgress}
            bgColor={bgColor}
            nameColor={nameColor}
            roleColor={roleColor}
            // CONFIG: Zoom Level - Adjust scale prop to zoom in/out (e.g. 1.25 = 125% zoom)
            scale={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
