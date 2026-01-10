"use client";

import { Suspense } from "react";
import { AmbientParticles } from "@/components/particles";
import { BackgroundWaves } from "@/components/water/BackgroundWaves";
import { Caustics } from "./Caustics";

interface EcosystemLayerProps {
  isMobile?: boolean;
  reducedEffects?: boolean;
}

/**
 * Combined ecosystem effects layer
 * Manages particles, waves, and caustics with performance scaling
 */
export function EcosystemLayer({
  isMobile = false,
  reducedEffects = false,
}: EcosystemLayerProps) {
  // Reduce effects based on device and performance
  const particleCount = reducedEffects ? 300 : isMobile ? 500 : 2000;
  const particleSize = isMobile ? 20 : 30;

  // Skip all effects if performance is too low
  if (reducedEffects && isMobile) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {/* Background wave layer - deepest */}
      <BackgroundWaves />

      {/* Caustics light pattern */}
      {!isMobile && <Caustics />}

      {/* Primary particle layer */}
      <AmbientParticles
        count={particleCount}
        size={particleSize}
        color="#9ae6b4" // Mint
      />

      {/* Secondary particle layer for depth (desktop only) */}
      {!isMobile && !reducedEffects && (
        <AmbientParticles
          count={500}
          size={15}
          color="#c6f6d5" // Light Mint
        />
      )}
    </Suspense>
  );
}
