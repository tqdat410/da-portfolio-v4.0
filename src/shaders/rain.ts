/**
 * Rain particle shaders for GPU-based rain effect
 * Creates vertically falling rain drops with slight horizontal drift
 * Designed for use with THREE.Points and BufferGeometry
 */

export const rainVertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uIntensity;
uniform float uSpeed;
uniform float uWind;

attribute float aScale;
attribute float aPhase;
attribute float aSpeed;

varying float vAlpha;
varying float vStretch;

void main() {
  vec3 pos = position;

  // Calculate fall progress with individual speed variation
  float fallSpeed = uSpeed * (0.8 + aSpeed * 0.4);
  float fallProgress = mod(uTime * fallSpeed + aPhase, 1.0);

  // Move from top to bottom (Y: 10 to -10 in world space)
  pos.y = 10.0 - fallProgress * 20.0;

  // Add horizontal wind drift
  pos.x += sin(uTime * 0.5 + aPhase * 2.0) * uWind;
  pos.x += uWind * fallProgress * 0.5;

  // Small random horizontal wobble
  pos.x += sin(uTime * 3.0 + aPhase * 10.0) * 0.02;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Size with depth scaling and intensity control
  float baseSize = uSize * aScale * uPixelRatio;
  float depthScale = 1.0 / -viewPosition.z;
  gl_PointSize = baseSize * depthScale * uIntensity;

  // Alpha based on intensity and position
  // Fade in at top, fade out at bottom
  float fadeIn = smoothstep(0.0, 0.1, fallProgress);
  float fadeOut = smoothstep(1.0, 0.9, fallProgress);
  vAlpha = fadeIn * fadeOut * uIntensity * 0.8;

  // Pass stretch factor for elongated drop shape
  vStretch = fallSpeed * 0.5;
}
`;

export const rainFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;

varying float vAlpha;
varying float vStretch;

void main() {
  // Create elongated rain drop shape (stretched vertically)
  vec2 coord = gl_PointCoord - vec2(0.5);

  // Stretch vertically for rain drop appearance
  coord.y *= 0.4; // Make drops taller than wide

  float dist = length(coord);

  // Discard pixels outside drop shape
  if (dist > 0.5) discard;

  // Soft edge with slight glow
  float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;

  // Brighter core for glass-like appearance
  float core = smoothstep(0.3, 0.0, dist);
  vec3 finalColor = uColor + vec3(core * 0.4);

  gl_FragColor = vec4(finalColor, alpha);
}
`;
