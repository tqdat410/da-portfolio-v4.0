// Water Render Shader - Canvas texture distortion with specular highlights
// Uses simulation output (pressure, velocity, dx, dy) to distort content texture

export const renderVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const renderFragmentShader = /* glsl */ `
uniform sampler2D uSimulationMap;  // Simulation output (R=pressure, G=vel, B=dx, A=dy)
uniform sampler2D uContentTexture; // Canvas texture with text
uniform float uDistortionStrength; // Distortion intensity (0.3-0.5 typical)

varying vec2 vUv;

void main() {
  // Sample simulation data
  vec4 simData = texture2D(uSimulationMap, vUv);
  
  // Extract distortion from dx/dy channels (B,A)
  vec2 distortion = uDistortionStrength * simData.zw;
  
  // Apply distortion to UV coordinates before sampling content
  vec2 distortedUv = vUv + distortion;
  
  // Clamp to prevent sampling outside texture bounds
  distortedUv = clamp(distortedUv, 0.0, 1.0);
  
  // Sample the content texture (text)
  vec4 color = texture2D(uContentTexture, distortedUv);
  
  // Calculate surface normal from gradients for specular
  vec3 normal = normalize(vec3(-simData.z * 2.0, 0.5, -simData.w * 2.0));
  
  // Light direction (top-right, slightly forward)
  vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
  
  // Specular highlight on ripple peaks
  float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;
  
  // Add specular to final color
  gl_FragColor = color + vec4(vec3(specular), 0.0);
}
`;
