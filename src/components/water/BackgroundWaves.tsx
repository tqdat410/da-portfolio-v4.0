"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const waveVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const waveFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;

void main() {
  // Multiple wave layers for organic movement
  float wave1 = sin(vUv.x * 3.0 + uTime * 0.5) * 0.5 + 0.5;
  float wave2 = sin(vUv.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
  float wave3 = sin((vUv.x + vUv.y) * 4.0 + uTime * 0.4) * 0.5 + 0.5;

  float combinedWave = (wave1 + wave2 + wave3) / 3.0;

  // Gradient from bottom to top
  float gradient = vUv.y * 0.5 + 0.3;

  vec3 color = mix(uColorA, uColorB, combinedWave * gradient);

  // Very subtle effect - low opacity
  gl_FragColor = vec4(color, 0.08);
}
`;

/**
 * Subtle animated wave background layer
 * Creates underwater atmosphere with gentle color shifts
 */
export function BackgroundWaves() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        // Midnight green-tint from palette
        uColorA: { value: new THREE.Color("#0a0f0a") },
        // Sea Green from palette
        uColorB: { value: new THREE.Color("#276749") },
      },
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
