# Phase 02: Static Water + Pure Ripple Shader

## Context
After Phase 01, ambient effects removed. Now refactor shader for glass distortion ripple style (gentlerain.ai-inspired) with bright background compatibility.

## Overview
Rewrite water.ts shader:
- Glass refraction/distortion effect on ripples
- No time-based ambient animation
- Blend mode change for bright backgrounds
- Cleaner, simpler visual

## Requirements
1. Shader outputs clean glass distortion (refraction-like)
2. No auto-animation - static unless ripple active
3. Blend mode compatible with bright Terrarium palette
4. Circular wave + distortion combined in ripple
5. Subtle specular highlight on ripple peaks

## Architecture

### Shader Uniforms (keep)
```glsl
uniform sampler2D uRippleMap;    // Ripple height data
uniform float uDistortionStrength; // Distortion intensity
uniform float uTime;              // For ripple decay only, not animation
uniform vec2 uResolution;         // Viewport size
```

### Shader Output Change
| Property | Before | After |
|----------|--------|-------|
| Blending | Additive | Normal (or Custom) |
| Base Opacity | 0.12 | 0.05-0.08 (more transparent) |
| Color Influence | Heavy coloring | Minimal tint, glass-like |

## Implementation Steps

### 1. water.ts - Shader Rewrite
- [ ] Remove all color constants (DEEP_EARTH, MOSS_GREEN, etc.)
- [ ] Simplify to glass distortion:
  ```glsl
  // New approach:
  vec3 normal = calculateNormal(uv, texelSize);
  vec2 distortion = normal.xy * height * uDistortionStrength;

  // Glass-like refraction color
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  vec3 glassColor = vec3(1.0) * fresnel * 0.3; // White highlight

  gl_FragColor = vec4(glassColor, fresnel * 0.15);
  ```
- [ ] Remove ambient wave displacement
- [ ] Remove dappled light patterns
- [ ] Keep edge fade for soft blending

### 2. WaterPlane.tsx - Blend Mode
- [ ] Change from `THREE.AdditiveBlending` to `THREE.NormalBlending`
- [ ] Or custom blend: `blending: THREE.CustomBlending` with src/dst factors
- [ ] Adjust `uDistortionStrength` default (0.03-0.05 for subtle effect)

### 3. useRippleCanvas.ts - Ring Clarity
- [ ] Increase ring sharpness for cleaner circular wave
- [ ] Adjust `ringWidth` calculation for thinner ring
- [ ] Possibly add secondary ring (gentlerain has dual-ring effect)

### 4. Shader Algorithm (Glass Distortion)
```glsl
void main() {
  vec2 uv = vUv;
  float texelSize = 1.0 / 256.0;

  // Ripple data
  vec4 ripple = texture2D(uRippleMap, uv);
  float height = (ripple.r - 0.5) * 2.0;

  // Surface normal
  vec3 normal = calculateNormal(uv, texelSize);

  // Glass distortion
  vec2 distortion = normal.xy * height * uDistortionStrength;

  // Fresnel for glass edge highlight
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

  // Subtle specular on ripple peaks
  vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));
  float specular = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 32.0);

  // Glass-like output (mostly transparent with edge highlight)
  vec3 color = vec3(1.0, 0.98, 0.95) * (fresnel * 0.2 + specular * 0.3);
  float alpha = (fresnel * 0.1 + specular * 0.15) * abs(height);

  // Edge fade
  float edgeFade = 1.0 - smoothstep(0.4, 0.5, length(uv - 0.5) * 2.0);

  gl_FragColor = vec4(color, alpha * edgeFade);
}
```

## Todo List
```markdown
- [ ] Backup current water.ts shader
- [ ] Rewrite fragment shader for glass distortion
- [ ] Update WaterPlane blend mode
- [ ] Test ripple visibility on bright background
- [ ] Adjust distortion strength if needed
- [ ] Verify mobile (128x128) still works
- [ ] Performance check (should be lighter)
```

## Success Criteria
- [ ] Ripple appears as glass distortion (refraction-like)
- [ ] No color tinting - just transparent distortion
- [ ] Circular wave visible in ripple
- [ ] Static surface when no interaction
- [ ] Works on bright (#A3B18A) background
- [ ] 60 FPS maintained

## Testing
1. Set body background to bright color temporarily
2. Hover - glass distortion ripple should be visible
3. Click - stronger distortion
4. Compare with gentlerain.ai ripple behavior
5. Test on dark background too (should still work)
