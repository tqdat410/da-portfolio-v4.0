"use client";

import { Suspense } from "react";
import { AmbientParticles } from "@/components/particles";
import { BackgroundWaves } from "@/components/water/BackgroundWaves";
import { Caustics } from "./Caustics";

// Terrarium natural color palette
const MOSS_GREEN = "#566B4D"; // Primary - lush moss
const SAGE_LEAF = "#889977"; // Secondary - soft sage
const GOLDEN_SUN = "#E1BF7D"; // Tertiary - warm sunlight
const LICHEN = "#A3B18A"; // Accent - natural lichen

interface EcosystemLayerProps {
  isMobile?: boolean;
  reducedEffects?: boolean;
}

/**
 * Combined ecosystem effects layer
 * Manages particles, waves, and caustics with performance scaling
 * Updated with terrarium natural color scheme
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

      {/* Primary particle layer - Moss Green (like floating spores) */}
      <AmbientParticles
        count={particleCount}
        size={particleSize}
        color={MOSS_GREEN}
      />

      {/* Secondary particle layer for depth (desktop only) - Sage Leaf */}
      {!isMobile && !reducedEffects && (
        <AmbientParticles count={500} size={15} color={SAGE_LEAF} />
      )}

      {/* Tertiary layer - Golden Sun dust motes (desktop only) */}
      {!isMobile && !reducedEffects && (
        <AmbientParticles count={200} size={10} color={GOLDEN_SUN} />
      )}
    </Suspense>
  );
}
