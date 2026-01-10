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
uniform vec3 uColorC;

varying vec2 vUv;

void main() {
  // Multiple wave layers for organic movement
  float wave1 = sin(vUv.x * 3.0 + uTime * 0.5) * 0.5 + 0.5;
  float wave2 = sin(vUv.y * 2.0 + uTime * 0.3) * 0.5 + 0.5;
  float wave3 = sin((vUv.x + vUv.y) * 4.0 + uTime * 0.4) * 0.5 + 0.5;
  float wave4 = cos(vUv.x * 5.0 - uTime * 0.6) * sin(vUv.y * 4.0 + uTime * 0.5) * 0.5 + 0.5;

  float combinedWave = (wave1 + wave2 + wave3 + wave4) / 4.0;

  // Vertical gradient
  float gradient = vUv.y * 0.6 + 0.2;

  // Three-color mix for richer aquarium look
  vec3 midColor = mix(uColorA, uColorB, gradient);
  vec3 color = mix(midColor, uColorC, combinedWave * 0.4);

  // Add shimmer effect
  float shimmer = sin(vUv.x * 20.0 + uTime * 3.0) * sin(vUv.y * 15.0 - uTime * 2.0);
  color += uColorC * shimmer * 0.05;

  // Slightly higher opacity for more visible effect
  gl_FragColor = vec4(color, 0.12);
}
`;

/**
 * Subtle animated wave background layer
 * Creates underwater aquarium atmosphere with gentle color shifts
 * Updated with aquarium-bright color palette
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
        // Deep Ocean - darkest
        uColorA: { value: new THREE.Color("#0A1628") },
        // Ocean Blue - mid tone
        uColorB: { value: new THREE.Color("#1E3A5F") },
        // Aqua Teal - highlight
        uColorC: { value: new THREE.Color("#00CED1") },
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
      <planeGeometry
        args={[viewport.width * 1.5, viewport.height * 1.5, 1, 1]}
      />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
