// Particle shaders - vertex and fragment for ambient floating particles
// Uses noise-based organic drift with phase offsets for natural movement

export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
attribute float aPhase;

varying float vAlpha;

// Simplified noise function for organic movement
float noise(vec3 p) {
  return sin(p.x * 1.5) * cos(p.y * 1.3) * sin(p.z * 1.1);
}

void main() {
  vec3 pos = position;

  // Organic drift using noise
  float noiseX = noise(pos + vec3(uTime * 0.1, 0.0, 0.0));
  float noiseY = noise(pos + vec3(0.0, uTime * 0.15, 0.0));
  float noiseZ = noise(pos + vec3(0.0, 0.0, uTime * 0.08));

  pos.x += sin(uTime * 0.5 + aPhase) * 0.3 + noiseX * 0.5;
  pos.y += cos(uTime * 0.3 + aPhase * 1.3) * 0.2 + noiseY * 0.3;
  pos.z += sin(uTime * 0.2 + aPhase * 0.7) * 0.1 + noiseZ * 0.2;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);

  // Fade based on distance from center
  float distanceFromCenter = length(position.xy) / 10.0;
  vAlpha = smoothstep(1.0, 0.3, distanceFromCenter) * 0.6;
}
`;

export const particleFragmentShader = /* glsl */ `
uniform vec3 uColor;

varying float vAlpha;

void main() {
  // Circular particle shape
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  if (distanceToCenter > 0.5) discard;

  // Soft edge falloff
  float alpha = smoothstep(0.5, 0.2, distanceToCenter) * vAlpha;

  gl_FragColor = vec4(uColor, alpha);
}
`;
