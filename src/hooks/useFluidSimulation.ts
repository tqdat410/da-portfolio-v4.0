"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { simulationVertexShader, simulationFragmentShader } from "@/shaders/simulation";

interface UseFluidSimulationOptions {
  resolution?: number;
}

interface UseFluidSimulationReturn {
  getTexture: () => THREE.Texture | null;
  addRipple: (x: number, y: number, strength?: number) => void;
}

interface FBOState {
  rtA: THREE.WebGLRenderTarget;
  rtB: THREE.WebGLRenderTarget;
}

/**
 * GPU-based fluid simulation using Pressure-Velocity Wave Equation
 * Uses Ping-Pong FBO technique with 4-channel output (pressure, vel, dx, dy)
 */
export function useFluidSimulation(
  options: UseFluidSimulationOptions = {}
): UseFluidSimulationReturn {
  const { resolution = 512 } = options;

  const { gl, size } = useThree();

  // Refs for FBOs and materials
  const fboRef = useRef<FBOState | null>(null);
  const simMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const simSceneRef = useRef<THREE.Scene | null>(null);
  const simCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const frameRef = useRef(0);

  // Mouse state
  const mouseRef = useRef({ x: 0, y: 0, active: false, strength: 0 });
  const pendingRipplesRef = useRef<{ x: number; y: number; strength: number }[]>([]);

  // Calculate actual resolution based on viewport
  const width = Math.floor(
    size.width * (typeof window !== "undefined" ? window.devicePixelRatio : 1)
  );
  const height = Math.floor(
    size.height * (typeof window !== "undefined" ? window.devicePixelRatio : 1)
  );

  // Create FBOs and simulation scene
  useEffect(() => {
    const fboOptions: THREE.RenderTargetOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    const rtA = new THREE.WebGLRenderTarget(width, height, fboOptions);
    const rtB = new THREE.WebGLRenderTarget(width, height, fboOptions);

    fboRef.current = { rtA, rtB };
    frameRef.current = 0;

    // Simulation material
    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseActive: { value: 0.0 },
        uMouseStrength: { value: 0.5 },
        uFrame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
    simMaterialRef.current = simMaterial;

    // Simulation scene (fullscreen quad)
    const simScene = new THREE.Scene();
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const simGeometry = new THREE.PlaneGeometry(2, 2);
    const simMesh = new THREE.Mesh(simGeometry, simMaterial);

    simScene.add(simMesh);
    simSceneRef.current = simScene;
    simCameraRef.current = simCamera;

    return () => {
      rtA.dispose();
      rtB.dispose();
      simMaterial.dispose();
      simGeometry.dispose();
    };
  }, [gl, width, height]);

  // Add ripple at normalized position (0-1)
  const addRipple = useCallback((x: number, y: number, strength: number = 0.5) => {
    pendingRipplesRef.current.push({ x, y, strength });
  }, []);

  // Get current texture (called each frame by WaterPlane)
  const getTexture = useCallback(() => {
    return fboRef.current?.rtB.texture ?? null;
  }, []);

  // Simulation update loop
  useFrame(() => {
    if (
      !fboRef.current ||
      !simMaterialRef.current ||
      !simSceneRef.current ||
      !simCameraRef.current
    ) {
      return;
    }

    const { rtA, rtB } = fboRef.current;
    const material = simMaterialRef.current;

    // Process pending ripples
    const ripples = pendingRipplesRef.current;
    if (ripples.length > 0) {
      const ripple = ripples.shift()!;
      // Convert normalized coords to pixel coords
      mouseRef.current = {
        x: ripple.x * width,
        y: ripple.y * height,
        active: true,
        strength: ripple.strength,
      };
    } else {
      mouseRef.current.active = false;
    }

    // Update uniforms
    material.uniforms.uTexture.value = rtA.texture;
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    material.uniforms.uMouseActive.value = mouseRef.current.active ? 1.0 : 0.0;
    material.uniforms.uMouseStrength.value = mouseRef.current.strength;
    material.uniforms.uFrame.value = frameRef.current;

    // Render simulation to rtB
    gl.setRenderTarget(rtB);
    gl.render(simSceneRef.current, simCameraRef.current);
    gl.setRenderTarget(null);

    // Swap buffers (ping-pong)
    const temp = fboRef.current.rtA;
    fboRef.current.rtA = fboRef.current.rtB;
    fboRef.current.rtB = temp;

    frameRef.current++;
  });

  return {
    getTexture,
    addRipple,
  };
}
