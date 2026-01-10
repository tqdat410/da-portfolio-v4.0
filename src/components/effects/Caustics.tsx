"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const causticsVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const causticsFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uColor2;

varying vec2 vUv;

// Enhanced procedural caustics pattern
float caustic(vec2 uv, float time) {
  vec2 p = uv * 10.0;
  float c = 0.0;

  for(float i = 1.0; i < 5.0; i++) {
    float t = time * (0.25 / i);
    vec2 offset = vec2(sin(t + i * 0.5), cos(t * 0.7 + i * 0.3)) * i;
    c += 1.0 / length(fract(p + offset) - 0.5);
  }

  return c / 4.0;
}

// Secondary caustic layer for depth
float caustic2(vec2 uv, float time) {
  vec2 p = uv * 6.0 + vec2(2.0, 1.5);
  float c = 0.0;

  for(float i = 1.0; i < 4.0; i++) {
    float t = time * (0.2 / i) + 1.5;
    vec2 offset = vec2(cos(t), sin(t * 1.3)) * i * 0.8;
    c += 1.0 / length(fract(p + offset) - 0.5);
  }

  return c / 3.0;
}

void main() {
  float c1 = caustic(vUv, uTime);
  float c2 = caustic2(vUv, uTime * 0.8);

  c1 = smoothstep(0.7, 2.2, c1);
  c2 = smoothstep(0.8, 2.0, c2);

  // Combine layers with different colors
  vec3 color = uColor * c1 + uColor2 * c2 * 0.5;

  // Brighter caustics for aquarium look
  float alpha = (c1 + c2 * 0.5) * 0.15;

  gl_FragColor = vec4(color, alpha);
}
`;

/**
 * Underwater caustics light pattern
 * Creates dappled light effect like sunlight through aquarium water
 * Updated with bright cyan/teal color scheme
 */
export function Caustics() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: causticsVertexShader,
      fragmentShader: causticsFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        // Bright Cyan - primary caustic color
        uColor: { value: new THREE.Color("#00FFFF") },
        // Light Cyan - secondary layer
        uColor2: { value: new THREE.Color("#E0FFFF") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
