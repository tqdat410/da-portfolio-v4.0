"use client";

import { useRef, useMemo, useEffect, useSyncExternalStore } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rainVertexShader, rainFragmentShader } from "@/shaders/rain";

interface RainParticlesProps {
  /** Rain intensity from 0 (invisible) to 1 (full) */
  intensity?: number;
  /** Whether rain is active */
  active?: boolean;
  /** Number of rain particles (desktop: 3000, mobile: 800) */
  count?: number;
  /** Rain drop color */
  color?: string;
  /** Fall speed multiplier */
  speed?: number;
  /** Horizontal wind drift */
  wind?: number;
}

// Distribution constants
const SPREAD_X = 15; // Horizontal spread
const SPREAD_Z = 8; // Depth spread
const DEPTH_OFFSET = -2;

/**
 * Seeded PRNG for deterministic particle positions
 */
function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// External store for pixel ratio (SSR-safe)
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
  return 2;
}

/**
 * GPU-based rain particle system
 * Falls vertically with slight horizontal drift
 * Intensity controls visibility and particle count
 */
export function RainParticles({
  intensity = 1,
  active = true,
  count = 3000,
  color = "#a8d5e5", // Light blue-gray for rain
  speed = 1.5,
  wind = 0.3,
}: RainParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const pixelRatio = useSyncExternalStore(
    subscribeToPixelRatio,
    getPixelRatioSnapshot,
    getPixelRatioServerSnapshot
  );

  // Generate particle geometry with positions, scales, phases, speeds
  const geometry = useMemo(() => {
    const random = seededRandom(123);
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute across viewport width and depth
      positions[i3] = (random() - 0.5) * SPREAD_X;
      positions[i3 + 1] = random() * 20 - 10; // Initial Y (will be overridden in shader)
      positions[i3 + 2] = (random() - 0.5) * SPREAD_Z + DEPTH_OFFSET;

      // Variable sizes for depth illusion (0.3 - 1.0)
      scales[i] = random() * 0.7 + 0.3;

      // Random phase for staggered start times
      phases[i] = random();

      // Variable fall speeds
      speeds[i] = random();
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    return geo;
  }, [count]);

  // Create shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: rainVertexShader,
      fragmentShader: rainFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uSize: { value: 40 },
        uIntensity: { value: intensity },
        uSpeed: { value: speed },
        uWind: { value: wind },
        uColor: { value: new THREE.Color(color) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [pixelRatio, color, speed, wind, intensity]);

  // Store material ref for animation
  useEffect(() => {
    materialRef.current = shaderMaterial;
  }, [shaderMaterial]);

  // Cleanup on unmount
  useEffect(() => {
    const geo = geometry;
    const mat = shaderMaterial;
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geometry, shaderMaterial]);

  // Animate rain
  useFrame((state) => {
    if (!materialRef.current || !active) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uIntensity.value = intensity;
  });

  // Don't render if not active or intensity is 0
  if (!active || intensity <= 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry} material={shaderMaterial} />
  );
}
