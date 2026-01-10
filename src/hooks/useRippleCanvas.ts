"use client";

import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import * as THREE from "three";

interface RipplePoint {
  x: number;
  y: number;
  startTime: number; // When ripple was created
  strength: number;
  maxRadius: number; // Maximum expansion radius
}

interface UseRippleCanvasOptions {
  size?: number;
  rippleDuration?: number; // Lifecycle in seconds
  maxRipples?: number;
  maxRadius?: number; // Maximum ripple radius
}

interface UseRippleCanvasReturn {
  texture: THREE.CanvasTexture | null;
  addRipple: (x: number, y: number, strength?: number) => void;
  update: () => void;
}

// Store for texture state
let textureStore: THREE.CanvasTexture | null = null;
const listeners = new Set<() => void>();

function subscribeToTexture(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getTextureSnapshot() {
  return textureStore;
}

function getTextureServerSnapshot() {
  return null;
}

function setTextureStore(texture: THREE.CanvasTexture | null) {
  textureStore = texture;
  listeners.forEach((listener) => listener());
}

/**
 * Ease-out cubic function for natural deceleration
 * Matches Gentlerain's expansion behavior
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease-out exponential for faster initial expansion
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Canvas-based ripple tracking with Gentlerain-style single ring effect
 * Features: displacement mapping, ease-out expansion, sharp wave front
 */
export function useRippleCanvas(
  options: UseRippleCanvasOptions = {}
): UseRippleCanvasReturn {
  const {
    size = 256,
    rippleDuration = 0.8, // 0.7-1.0s like Gentlerain
    maxRipples = 30,
    maxRadius = 80, // Larger radius for more visible effect
  } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const ripplesRef = useRef<RipplePoint[]>([]);
  const startTimeRef = useRef<number>(0);

  const texture = useSyncExternalStore(
    subscribeToTexture,
    getTextureSnapshot,
    getTextureServerSnapshot
  );

  // Initialize canvas and texture
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctxRef.current = ctx;
      // Neutral gray = no displacement
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, size, size);
    }

    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.wrapS = THREE.ClampToEdgeWrapping;
    newTexture.wrapT = THREE.ClampToEdgeWrapping;
    newTexture.minFilter = THREE.LinearFilter;
    newTexture.magFilter = THREE.LinearFilter;
    textureRef.current = newTexture;
    setTextureStore(newTexture);

    startTimeRef.current = performance.now();

    return () => {
      newTexture.dispose();
      textureRef.current = null;
      setTextureStore(null);
    };
  }, [size]);

  // Add ripple at normalized position (0-1)
  const addRipple = useCallback(
    (x: number, y: number, strength: number = 0.5) => {
      const ripples = ripplesRef.current;
      if (ripples.length >= maxRipples) {
        ripples.shift(); // Remove oldest
      }

      const now = (performance.now() - startTimeRef.current) / 1000;

      ripples.push({
        x: x * size,
        y: (1 - y) * size, // Flip Y to match canvas coords
        startTime: now,
        strength: Math.min(strength * 1.5, 1.0), // Boost strength
        maxRadius: maxRadius * (0.8 + Math.random() * 0.4), // Slight variation
      });
    },
    [size, maxRipples, maxRadius]
  );

  // Update ripples and render to canvas each frame
  const update = useCallback(() => {
    const ctx = ctxRef.current;
    const tex = textureRef.current;
    if (!ctx || !tex) return;

    const now = (performance.now() - startTimeRef.current) / 1000;

    // Clear to neutral gray (faster fade for cleaner effect)
    ctx.fillStyle = "rgba(128, 128, 128, 0.12)";
    ctx.fillRect(0, 0, size, size);

    const ripples = ripplesRef.current;

    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      const age = now - ripple.startTime;
      const progress = age / rippleDuration;

      // Remove expired ripples
      if (progress >= 1.0) {
        ripples.splice(i, 1);
        continue;
      }

      // Ease-out expansion (fast start, slow finish)
      const easedProgress = easeOutExpo(progress);
      const currentRadius = easedProgress * ripple.maxRadius;

      // Intensity fades over time (also ease-out)
      const fadeProgress = easeOutCubic(progress);
      const intensity = ripple.strength * (1.0 - fadeProgress);

      // Skip if too faint
      if (intensity < 0.02) continue;

      // Ring width (sharper at start, wider at end)
      const ringWidth = 8 + progress * 12;

      // Draw single ring (Gentlerain style - not filled circle)
      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        Math.max(0, currentRadius - ringWidth),
        ripple.x,
        ripple.y,
        currentRadius + ringWidth * 0.5
      );

      // Height map values: >128 = peak (bright), <128 = trough (dark)
      const peakValue = Math.floor(128 + intensity * 127);
      const troughValue = Math.floor(128 - intensity * 60);

      // Leading edge highlight (wave peak)
      gradient.addColorStop(0, "rgba(128, 128, 128, 0)");
      gradient.addColorStop(0.3, `rgb(${troughValue}, ${troughValue}, 128)`);
      gradient.addColorStop(0.5, `rgb(${peakValue}, ${peakValue}, 128)`);
      gradient.addColorStop(0.7, `rgb(${troughValue}, ${troughValue}, 128)`);
      gradient.addColorStop(1, "rgba(128, 128, 128, 0)");

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, currentRadius + ringWidth, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Mark texture for GPU upload
    tex.needsUpdate = true;
  }, [size, rippleDuration]);

  return {
    texture,
    addRipple,
    update,
  };
}
