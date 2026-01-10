"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { waterVertexShader, waterFragmentShader } from "@/shaders/water";

interface WaterPlaneProps {
  rippleTexture: THREE.CanvasTexture | null;
}

/**
 * Fullscreen plane mesh with custom water distortion shader
 * Receives ripple texture from useRippleCanvas hook
 */
export function WaterPlane({ rippleTexture }: WaterPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  // Create shader material with uniforms
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uRippleMap: { value: null },
        uDistortionStrength: { value: 0.02 },
        uTime: { value: 0 },
      },
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  // Update time and ripple texture each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      if (rippleTexture) {
        materialRef.current.uniforms.uRippleMap.value = rippleTexture;
      }
    }
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
