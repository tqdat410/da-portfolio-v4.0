// Water shader - vertex and fragment shaders for ripple distortion effect
// Uses green-toned color palette from design system

export const waterVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const waterFragmentShader = /* glsl */ `
uniform sampler2D uRippleMap;
uniform float uDistortionStrength;
uniform float uTime;

varying vec2 vUv;

void main() {
  // Sample ripple map for distortion
  vec4 ripple = texture2D(uRippleMap, vUv);

  // Calculate distortion from ripple intensity (rg channels offset from 0.5)
  vec2 distortion = (ripple.rg - 0.5) * 2.0 * uDistortionStrength;

  // Add subtle ambient wave motion
  float wave = sin(vUv.x * 10.0 + uTime) * cos(vUv.y * 8.0 + uTime * 0.8) * 0.002;
  distortion += vec2(wave, wave * 0.5);

  // Apply distortion to UV coordinates
  vec2 distortedUv = vUv + distortion;

  // Water color gradient using green-toned palette
  // Midnight: #0a0f0a -> rgb(10, 15, 10) / 255 = (0.039, 0.059, 0.039)
  // Sea Green: #276749 -> rgb(39, 103, 73) / 255 = (0.153, 0.404, 0.286)
  vec3 deepColor = vec3(0.039, 0.059, 0.039);
  vec3 lightColor = vec3(0.153, 0.404, 0.286);

  float gradient = smoothstep(0.0, 1.0, distortedUv.y + wave * 10.0);
  vec3 baseColor = mix(deepColor, lightColor, gradient * 0.3);

  // Add ripple highlight using emerald color (#38a169)
  float rippleHighlight = (ripple.r - 0.5) * 2.0;
  baseColor += vec3(0.22, 0.63, 0.41) * rippleHighlight * 0.3;

  // Edge fade for softer blending
  float edgeFade = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5) * 2.0);
  edgeFade *= 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5) * 2.0);

  gl_FragColor = vec4(baseColor, 0.12 * edgeFade);
}
`;
