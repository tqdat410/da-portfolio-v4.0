"use client";

import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import * as THREE from "three";

interface RipplePoint {
  x: number;
  y: number;
  radius: number;
  strength: number;
}

interface UseRippleCanvasOptions {
  size?: number;
  decayRate?: number;
  maxRipples?: number;
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
 * Canvas-based ripple tracking for water distortion effect
 * Renders ripple circles to a texture used by the water shader
 */
export function useRippleCanvas(
  options: UseRippleCanvasOptions = {}
): UseRippleCanvasReturn {
  const { size = 256, decayRate = 0.95, maxRipples = 20 } = options;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const ripplesRef = useRef<RipplePoint[]>([]);

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
      // Neutral gray = no distortion
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, size, size);
    }

    const newTexture = new THREE.CanvasTexture(canvas);
    newTexture.wrapS = THREE.ClampToEdgeWrapping;
    newTexture.wrapT = THREE.ClampToEdgeWrapping;
    textureRef.current = newTexture;
    setTextureStore(newTexture);

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
      ripples.push({
        x: x * size,
        y: (1 - y) * size, // Flip Y to match canvas coords
        radius: 0,
        strength,
      });
    },
    [size, maxRipples]
  );

  // Update ripples and render to canvas each frame
  const update = useCallback(() => {
    const ctx = ctxRef.current;
    const tex = textureRef.current;
    if (!ctx || !tex) return;

    // Fade previous frame toward neutral gray
    ctx.fillStyle = "rgba(128, 128, 128, 0.05)";
    ctx.fillRect(0, 0, size, size);

    const ripples = ripplesRef.current;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.radius += 3;
      ripple.strength *= decayRate;

      // Remove faded ripples
      if (ripple.strength < 0.01) {
        ripples.splice(i, 1);
        continue;
      }

      // Draw ripple as radial gradient
      const gradient = ctx.createRadialGradient(
        ripple.x,
        ripple.y,
        0,
        ripple.x,
        ripple.y,
        ripple.radius
      );

      const intensity = Math.floor(ripple.strength * 127);
      gradient.addColorStop(
        0,
        `rgb(${128 + intensity}, ${128 + intensity}, 128)`
      );
      gradient.addColorStop(
        0.5,
        `rgb(${128 - Math.floor(intensity / 2)}, ${128 - Math.floor(intensity / 2)}, 128)`
      );
      gradient.addColorStop(1, "rgba(128, 128, 128, 0)");

      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Mark texture for GPU upload
    tex.needsUpdate = true;
  }, [size, decayRate]);

  return {
    texture,
    addRipple,
    update,
  };
}
