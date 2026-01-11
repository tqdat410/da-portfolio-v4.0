"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { renderVertexShader, renderFragmentShader } from "@/shaders/water";

interface WaterPlaneProps {
  getSimulationTexture: () => THREE.Texture | null;
  contentTexture: THREE.Texture | null;
}

/**
 * Fullscreen plane mesh with water distortion shader
 * Distorts content texture based on simulation output
 */
export function WaterPlane({ getSimulationTexture, contentTexture }: WaterPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Shader material for water rendering
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSimulationMap: { value: null },
        uContentTexture: { value: null },
        uDistortionStrength: { value: 0.4 }, // Distortion intensity
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Update textures each frame
  useFrame(() => {
    if (materialRef.current) {
      const simTexture = getSimulationTexture();
      if (simTexture) {
        materialRef.current.uniforms.uSimulationMap.value = simTexture;
      }
      if (contentTexture) {
        materialRef.current.uniforms.uContentTexture.value = contentTexture;
      }
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
