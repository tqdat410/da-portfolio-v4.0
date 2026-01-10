// Enhanced water shader - displacement mapping with specular lighting
// Aquarium-bright color palette with realistic water physics

export const waterVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const waterFragmentShader = /* glsl */ `
uniform sampler2D uRippleMap;
uniform float uDistortionStrength;
uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

// Aquarium color palette
const vec3 DEEP_OCEAN = vec3(0.039, 0.086, 0.157);     // #0A1628
const vec3 OCEAN_BLUE = vec3(0.118, 0.227, 0.373);     // #1E3A5F
const vec3 AQUA_TEAL = vec3(0.0, 0.808, 0.820);        // #00CED1
const vec3 BRIGHT_CYAN = vec3(0.0, 1.0, 1.0);          // #00FFFF
const vec3 LIGHT_CYAN = vec3(0.878, 1.0, 1.0);         // #E0FFFF

// Light direction (from above-front)
const vec3 LIGHT_DIR = normalize(vec3(0.2, 0.8, 0.5));

// Calculate surface normal from height map gradient
vec3 calculateNormal(vec2 uv, float texelSize) {
  float left = texture2D(uRippleMap, uv - vec2(texelSize, 0.0)).r;
  float right = texture2D(uRippleMap, uv + vec2(texelSize, 0.0)).r;
  float top = texture2D(uRippleMap, uv - vec2(0.0, texelSize)).r;
  float bottom = texture2D(uRippleMap, uv + vec2(0.0, texelSize)).r;

  // Calculate gradient
  float dx = (right - left) * 2.0;
  float dy = (bottom - top) * 2.0;

  // Construct normal (stronger displacement effect)
  return normalize(vec3(-dx * 3.0, -dy * 3.0, 1.0));
}

// Fresnel effect for edge highlights
float fresnel(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - max(dot(normal, viewDir), 0.0), power);
}

void main() {
  vec2 uv = vUv;
  float texelSize = 1.0 / 256.0;

  // Sample ripple height map
  vec4 ripple = texture2D(uRippleMap, uv);
  float height = (ripple.r - 0.5) * 2.0; // Range -1 to 1

  // Calculate displacement from height
  vec2 displacement = vec2(0.0);

  // Calculate surface normal for lighting
  vec3 normal = calculateNormal(uv, texelSize);

  // Apply displacement to UV based on normal
  displacement = normal.xy * height * uDistortionStrength;

  // Add subtle ambient wave motion
  float wave1 = sin(uv.x * 8.0 + uTime * 0.6) * cos(uv.y * 6.0 + uTime * 0.5);
  float wave2 = sin(uv.x * 12.0 - uTime * 0.4) * cos(uv.y * 10.0 + uTime * 0.3);
  float ambientWave = (wave1 + wave2 * 0.5) * 0.003;
  displacement += vec2(ambientWave, ambientWave * 0.7);

  vec2 distortedUv = uv + displacement;

  // View direction (camera looking at screen)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  // Specular lighting calculation
  vec3 halfDir = normalize(LIGHT_DIR + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);

  // Enhanced specular for wave peaks
  float peakSpecular = pow(max(dot(normal, halfDir), 0.0), 64.0) * 2.0;

  // Fresnel effect for edge glow
  float fresnelTerm = fresnel(normal, viewDir, 2.0);

  // Base gradient (deep ocean to lighter blue)
  float gradientY = smoothstep(0.0, 1.0, distortedUv.y);
  vec3 baseColor = mix(DEEP_OCEAN, OCEAN_BLUE, gradientY * 0.6);

  // Add wave-based color variation
  float colorWave = sin(distortedUv.x * 4.0 + uTime * 0.2) * 0.5 + 0.5;
  baseColor = mix(baseColor, OCEAN_BLUE * 1.3, colorWave * 0.2);

  // Ripple highlight color (bright cyan on peaks)
  float rippleIntensity = max(height, 0.0);
  vec3 rippleColor = mix(AQUA_TEAL, BRIGHT_CYAN, rippleIntensity);

  // Add ripple color based on height
  baseColor += rippleColor * rippleIntensity * 0.8;

  // Add specular highlights
  vec3 specularColor = LIGHT_CYAN * specular * 0.6;
  specularColor += BRIGHT_CYAN * peakSpecular * 0.8;
  baseColor += specularColor;

  // Add fresnel edge glow
  baseColor += AQUA_TEAL * fresnelTerm * 0.3;

  // Caustic-like patterns from ripple interference
  float caustic = abs(sin(height * 20.0 + uTime * 2.0)) * rippleIntensity;
  baseColor += BRIGHT_CYAN * caustic * 0.15;

  // Edge fade for softer blending
  float edgeFadeX = 1.0 - smoothstep(0.35, 0.5, abs(uv.x - 0.5) * 2.0);
  float edgeFadeY = 1.0 - smoothstep(0.35, 0.5, abs(uv.y - 0.5) * 2.0);
  float edgeFade = edgeFadeX * edgeFadeY;

  // Dynamic opacity based on ripple activity
  float baseOpacity = 0.15;
  float rippleOpacity = rippleIntensity * 0.4;
  float specularOpacity = (specular + peakSpecular) * 0.3;
  float totalOpacity = (baseOpacity + rippleOpacity + specularOpacity) * edgeFade;

  gl_FragColor = vec4(baseColor, totalOpacity);
}
`;
