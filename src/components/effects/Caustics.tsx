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

varying vec2 vUv;

// Procedural caustics pattern
float caustic(vec2 uv, float time) {
  vec2 p = uv * 8.0;
  float c = 0.0;

  for(float i = 1.0; i < 4.0; i++) {
    float t = time * (0.3 / i);
    vec2 offset = vec2(sin(t), cos(t * 0.7)) * i;
    c += 1.0 / length(fract(p + offset) - 0.5);
  }

  return c / 3.0;
}

void main() {
  float c = caustic(vUv, uTime);
  c = smoothstep(0.8, 2.0, c);

  // Very subtle caustic light effect
  gl_FragColor = vec4(uColor * c, c * 0.1);
}
`;

/**
 * Subtle underwater caustics light pattern
 * Creates dappled light effect like sunlight through water
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
        // Mint from palette for subtle green tint
        uColor: { value: new THREE.Color("#9ae6b4") },
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
