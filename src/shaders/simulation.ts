// GPU Fluid Simulation Shader - Pressure-Velocity Wave Equation
// 4-channel output: R=pressure, G=velocity, B=dx, A=dy
// Reference: gentlerain.ai / Shadertoy water ripple techniques

export const simulationVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const simulationFragmentShader = /* glsl */ `
uniform sampler2D uTexture;      // Previous frame state (ping-pong)
uniform vec2 uResolution;        // Texture resolution
uniform vec2 uMouse;             // Mouse position (pixel coordinates)
uniform float uMouseActive;      // 1.0 if mouse is active
uniform float uMouseStrength;    // Strength of mouse interaction
uniform int uFrame;              // Frame counter (0 = initialize)

varying vec2 vUv;

const float delta = 1.4;

void main() {
  vec2 uv = vUv;

  // Initialize on first frame
  if (uFrame == 0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Sample current state
  vec4 data = texture2D(uTexture, uv);
  float pressure = data.x;
  float pVel = data.y;

  // Texel size for neighbor sampling
  vec2 texelSize = 1.0 / uResolution;

  // Sample neighboring pressures
  float p_right = texture2D(uTexture, uv + vec2(texelSize.x, 0.0)).x;
  float p_left = texture2D(uTexture, uv - vec2(texelSize.x, 0.0)).x;
  float p_up = texture2D(uTexture, uv + vec2(0.0, texelSize.y)).x;
  float p_down = texture2D(uTexture, uv - vec2(0.0, texelSize.y)).x;

  // Boundary conditions (reflect at edges)
  if (uv.x <= texelSize.x) p_left = p_right;
  if (uv.x >= 1.0 - texelSize.x) p_right = p_left;
  if (uv.y <= texelSize.y) p_down = p_up;
  if (uv.y >= 1.0 - texelSize.y) p_up = p_down;

  // Enhanced wave equation (pressure-velocity model)
  pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
  pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;

  pressure += delta * pVel;

  // Spring force (prevents drift) - Higher for mercury tension
  pVel -= 0.008 * delta * pressure;

  // Damping (energy loss) - High damping for narrow spread (viscous)
  pVel *= 1.0 - 0.05 * delta;
  pressure *= 0.960;

  // Mouse interaction
  if (uMouseActive > 0.5) {
    vec2 mouseUV = uMouse / uResolution;

    // Correct for aspect ratio to ensure circular ripples
    float aspectRatio = uResolution.x / uResolution.y;
    vec2 aspectCorrection = vec2(aspectRatio, 1.0);

    float dist = distance(uv * aspectCorrection, mouseUV * aspectCorrection);
    float radius = 0.015; // Ripple radius

    if (dist <= radius) {
      float influence = 1.0 - dist / radius;
      pressure += uMouseStrength * influence;
    }
  }

  // Output: R=pressure, G=velocity, B=dx gradient, A=dy gradient
  gl_FragColor = vec4(
    pressure,
    pVel,
    (p_right - p_left) / 2.0,  // dx for UV distortion
    (p_up - p_down) / 2.0      // dy for UV distortion
  );
}
`;
