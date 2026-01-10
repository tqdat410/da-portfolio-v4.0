"use client";

import { Suspense } from "react";
import { AmbientParticles } from "@/components/particles";
import { BackgroundWaves } from "@/components/water/BackgroundWaves";
import { Caustics } from "./Caustics";

// Aquarium-bright color palette
const AQUA_TEAL = "#00CED1";
const BRIGHT_CYAN = "#00FFFF";
const LIGHT_CYAN = "#E0FFFF";

interface EcosystemLayerProps {
  isMobile?: boolean;
  reducedEffects?: boolean;
}

/**
 * Combined ecosystem effects layer
 * Manages particles, waves, and caustics with performance scaling
 * Updated with aquarium-bright color scheme
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

      {/* Primary particle layer - Aqua Teal */}
      <AmbientParticles
        count={particleCount}
        size={particleSize}
        color={AQUA_TEAL}
      />

      {/* Secondary particle layer for depth (desktop only) - Bright Cyan */}
      {!isMobile && !reducedEffects && (
        <AmbientParticles count={500} size={15} color={BRIGHT_CYAN} />
      )}

      {/* Tertiary layer - subtle Light Cyan sparkles (desktop only) */}
      {!isMobile && !reducedEffects && (
        <AmbientParticles count={200} size={10} color={LIGHT_CYAN} />
      )}
    </Suspense>
  );
}
