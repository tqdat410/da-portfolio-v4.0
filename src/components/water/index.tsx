"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const WaterCanvasLazy = dynamic(() => import("./WaterCanvas").then((mod) => mod.WaterCanvas), {
  ssr: false,
  loading: () => null,
});

const AnimatedWaterCanvasLazy = dynamic(
  () => import("./AnimatedWaterCanvas").then((mod) => mod.AnimatedWaterCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

interface WaterEffectsProps {
  text?: string;
}

/**
 * Dynamic import wrapper for WaterCanvas
 * Prevents SSR issues with WebGL/Three.js and delays loading for performance
 */
export function WaterEffects({ text = "TrầnQuốcĐạt" }: WaterEffectsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading by 100ms to allow critical content to paint first
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return <WaterCanvasLazy text={text} />;
}

interface AnimatedWaterEffectsProps {
  name: string;
  roles: string[];
  scrollProgress: number;
  bgColor?: string;
  nameColor?: string;
  roleColor?: string;
  /** Rain intensity 0-1, activates rain particles */
  rainIntensity?: number;
}

/**
 * Dynamic import wrapper for AnimatedWaterCanvas
 * Scroll-driven text animations with water ripple effect
 */
export function AnimatedWaterEffects({
  name,
  roles,
  scrollProgress,
  bgColor,
  nameColor,
  roleColor,
  rainIntensity,
}: AnimatedWaterEffectsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return (
    <AnimatedWaterCanvasLazy
      name={name}
      roles={roles}
      scrollProgress={scrollProgress}
      bgColor={bgColor}
      nameColor={nameColor}
      roleColor={roleColor}
      rainIntensity={rainIntensity}
    />
  );
}
