"use client";

import { useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  particleVertexShader,
  particleFragmentShader,
} from "@/shaders/particles";

interface AmbientParticlesProps {
  count?: number;
  size?: number;
  color?: string;
}

// Constants for particle distribution
const DISTRIBUTION_SCALE = 20; // Fixed scale for particle spread
const DEPTH_RANGE = 5;
const DEPTH_OFFSET = -2;

/**
 * Simple seeded PRNG for deterministic random values
 * Produces consistent particle positions across renders
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// External store for pixel ratio
function subscribeToPixelRatio(callback: () => void) {
  const mediaQuery = window.matchMedia(
    `(resolution: ${window.devicePixelRatio}dppx)`
  );
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getPixelRatioSnapshot() {
  return Math.min(window.devicePixelRatio, 2);
}

function getPixelRatioServerSnapshot() {
  return 2; // Default for SSR
}

/**
 * Floating ambient particles with organic drift movement
 * Uses THREE.Points for efficient GPU-based rendering
 */
export function AmbientParticles({
  count = 2000,
  size = 30,
  color = "#9ae6b4", // Mint from palette
}: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  useThree(); // Access R3F context

  const pixelRatio = useSyncExternalStore(
    subscribeToPixelRatio,
    getPixelRatioSnapshot,
    getPixelRatioServerSnapshot
  );

  // Generate particle geometry - only depends on count, not viewport
  // Using fixed scale prevents regeneration on window resize
  const geometry = useMemo(() => {
    const random = seededRandom(42); // Fixed seed for deterministic output
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute in a large fixed volume (not viewport-dependent)
      positions[i3] = (random() - 0.5) * DISTRIBUTION_SCALE;
      positions[i3 + 1] = (random() - 0.5) * DISTRIBUTION_SCALE;
      positions[i3 + 2] = (random() - 0.5) * DEPTH_RANGE + DEPTH_OFFSET;

      scales[i] = random() * 0.8 + 0.2;
      phases[i] = random() * Math.PI * 2;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    return geo;
  }, [count]);

  // Create shader material with current pixel ratio
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uSize: { value: size },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [size, color, pixelRatio]);

  // Store material in ref for animation updates
  useEffect(() => {
    materialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  // Dispose geometry and material on unmount to prevent GPU memory leak
  useEffect(() => {
    const geo = geometry;
    const mat = shaderMaterial;
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geometry, shaderMaterial]);

  // Animate particles
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
  );
}
