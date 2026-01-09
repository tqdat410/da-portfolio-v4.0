# Water Effect Shader Snippets & Library Reference

**Purpose:** Copy-paste ready code patterns and library setup guide

---

## Part 1: Shader Code Snippets

### 1A. Normal Map Water Distortion (Most Compatible)

**Vertex Shader:**
```glsl
#version 120

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**Fragment Shader:**
```glsl
#version 120

uniform sampler2D normalMap;
uniform sampler2D sceneTexture;
uniform float distortionStrength;
uniform float time;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Animate normal map
  vec2 animatedUv = vUv + time * 0.1;

  // Sample normal and offset UVs
  vec3 normal = texture2D(normalMap, animatedUv).rgb * 2.0 - 1.0;
  vec2 distortedUv = vUv + normal.rg * distortionStrength;

  // Sample scene with distortion
  vec4 color = texture2D(sceneTexture, distortedUv);

  // Fresnel effect (more reflective at grazing angles)
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0))), 2.0);
  vec3 reflection = mix(color.rgb, vec3(1.0), fresnel * 0.3);

  gl_FragColor = vec4(reflection, 1.0);
}
```

**React Three Fiber Usage:**
```jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function WaterPlane({ scene }) {
  const meshRef = useRef()
  const textureRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          normalMap: { value: new THREE.TextureLoader().load('normal.png') },
          sceneTexture: { value: textureRef.current },
          distortionStrength: { value: 0.05 },
          time: { value: 0 }
        }}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
```

---

### 1B. Canvas Ripple Tracker (Interactive)

**Canvas Setup (JavaScript):**
```javascript
class RippleCanvas {
  constructor(width = 256, height = 256) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')

    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.magFilter = THREE.LinearFilter
    this.texture.minFilter = THREE.LinearFilter
  }

  addRipple(x, y, radius = 20, strength = 1.0) {
    const ctx = this.ctx

    // Draw ripple as white circle (expands)
    ctx.fillStyle = `rgba(255, 255, 255, ${strength})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  update() {
    // Decay ripples over time
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      data[i] *= 0.98     // R decay
      data[i + 1] *= 0.98 // G decay
      data[i + 2] *= 0.98 // B decay
    }

    this.ctx.putImageData(imageData, 0, 0)
    this.texture.needsUpdate = true
  }
}

// Usage
const rippleCanvas = new RippleCanvas()

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * rippleCanvas.canvas.width
  const y = (e.clientY / window.innerHeight) * rippleCanvas.canvas.height
  rippleCanvas.addRipple(x, y, 15, 0.8)
})

document.addEventListener('click', (e) => {
  const x = (e.clientX / window.innerWidth) * rippleCanvas.canvas.width
  const y = (e.clientY / window.innerHeight) * rippleCanvas.canvas.height
  rippleCanvas.addRipple(x, y, 30, 1.0)
})
```

**Fragment Shader (Distortion):**
```glsl
uniform sampler2D rippleTexture;
uniform float rippleStrength;

void main() {
  // Sample ripple data and distort UVs
  vec4 ripple = texture2D(rippleTexture, vUv);
  vec2 distortion = (ripple.rg - 0.5) * 2.0 * rippleStrength;
  vec2 distortedUv = vUv + distortion;

  // Apply to scene
  vec3 color = texture2D(sceneTexture, distortedUv).rgb;
  gl_FragColor = vec4(color, 1.0);
}
```

---

### 1C. Ambient Floating Particles

**Particle Vertex Shader:**
```glsl
uniform float uTime;
uniform float uSize;

// Perlin noise approximation (3D)
float noise(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

void main() {
  vec3 pos = position;

  // Organic drift using time + position
  pos.x += sin(uTime * 0.3 + pos.z) * 0.2;
  pos.y += cos(uTime * 0.2 + pos.x) * 0.1;
  pos.z += sin(uTime * 0.25 + pos.y) * 0.15;

  // Size based on depth
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize / -mvPosition.z;

  gl_Position = projectionMatrix * mvPosition;
}
```

**Particle Fragment Shader:**
```glsl
void main() {
  // Soft circular particles
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;

  // Gradient alpha
  float alpha = 1.0 - dist * 2.0;
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.4);
}
```

**React Three Fiber Particles:**
```jsx
export function FloatingParticles({ count = 3000 }) {
  const particlesRef = useRef()

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20
    positions[i + 1] = (Math.random() - 0.5) * 20
    positions[i + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uSize: { value: 20 }
        }}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
```

---

## Part 2: React Three Fiber + Library Setup

### Recommended Dependencies

```json
{
  "dependencies": {
    "three": "^r128",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.99.0",
    "postprocessing": "^6.35.0",
    "react-use-gesture": "^10.3.0"
  }
}
```

### Install Command
```bash
npm install three @react-three/fiber @react-three/drei postprocessing react-use-gesture
```

---

### Basic R3F Canvas Setup

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export function PortfolioScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
      {/* Lighting */}
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      {/* Scene components */}
      <WaterPlane />
      <FloatingParticles count={2000} />
      <BackgroundWaves />

      {/* Controls */}
      <OrbitControls />
    </Canvas>
  )
}
```

---

### Advanced: Custom Hook for Water Effect

```javascript
// hooks/useWaterEffect.js
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function useWaterEffect(type = 'normalMap') {
  const meshRef = useRef()
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uMousePos: { value: [0, 0] },
    uDistortionStrength: { value: 0.05 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      uniformsRef.current.uTime.value = state.clock.elapsedTime
      // Track mouse position
      uniformsRef.current.uMousePos.value = [
        state.mouse.x,
        state.mouse.y
      ]
    }
  })

  return { meshRef, uniforms: uniformsRef.current }
}

// Usage
const { meshRef, uniforms } = useWaterEffect('normalMap')
```

---

## Part 3: Library Ecosystem

### @react-three/drei Utilities

```javascript
// Import helpers for water effects
import {
  RenderTexture,    // Render scene to texture
  shaderMaterial,    // Declarative shader material
  useTexture,        // Load textures
  useAspect,         // Responsive sizing
  Plane,             // Pre-configured plane
} from '@react-three/drei'

// Example: Render texture for reflections
function ReflectedWater() {
  const [scene] = useState(new THREE.Scene())

  return (
    <RenderTexture attach="map" args={[1024, 1024]} scene={scene} camera={<camera />} />
  )
}
```

### postprocessing Integration

```javascript
import { EffectComposer, Effect, RenderPass, EffectPass } from 'postprocessing'

class WaterRippleEffect extends Effect {
  constructor(rippleTexture) {
    super('WaterRippleEffect', fragmentShader, {
      uniforms: new Map([
        ['rippleMap', new THREE.Uniform(rippleTexture)]
      ])
    })
  }
}

// In R3F: use @react-three/postprocessing for easier integration
import { EffectComposer, Blur } from '@react-three/postprocessing'
```

---

### three-custom-shader-material (Optional)

```javascript
import CustomShaderMaterial from 'three-custom-shader-material'
import { MeshStandardMaterial } from 'three'

// Extend Three.js material with custom shaders
// Preserves lighting, shadows, fog automatically
const waterMaterial = new CustomShaderMaterial({
  baseMaterial: MeshStandardMaterial,
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      csm_DiffuseColor = vec4(vec3(vUv, 1.0), 1.0);
    }
  `,
  uniforms: {
    uTime: { value: 0 }
  }
})
```

---

## Part 4: Performance Profiling Helpers

### FPS Counter Hook

```javascript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function useFpsMonitor() {
  const fpsRef = useRef({ fps: 60, frames: 0, lastTime: Date.now() })

  useFrame(() => {
    const now = Date.now()
    const delta = now - fpsRef.current.lastTime

    fpsRef.current.frames++

    if (delta >= 1000) {
      fpsRef.current.fps = fpsRef.current.frames
      fpsRef.current.frames = 0
      fpsRef.current.lastTime = now
      console.log(`FPS: ${fpsRef.current.fps}`)
    }
  })

  return fpsRef.current
}
```

### Memory Usage Monitor

```javascript
function checkMemory() {
  if (performance.memory) {
    console.log(`Used: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`)
    console.log(`Limit: ${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`)
  }
}

// Run in useEffect
useEffect(() => {
  const interval = setInterval(checkMemory, 2000)
  return () => clearInterval(interval)
}, [])
```

---

## Part 5: Mobile Feature Detection

```javascript
export function getWebGLCapabilities() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  const capabilities = {
    webgl2: !!canvas.getContext('webgl2'),
    floatTexture: !!gl.getExtension('OES_texture_float'),
    halfFloatTexture: !!gl.getExtension('OES_texture_half_float'),
    linearHalfFloat: !!gl.getExtension('OES_texture_half_float_linear'),
    maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
    maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
  }

  return capabilities
}

// Usage in component
const caps = getWebGLCapabilities()
const canUseGPGPU = caps.webgl2 && caps.floatTexture
```

---

## Part 6: Quick Import Template

```javascript
// Complete imports for water ecosystem
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RenderTexture, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'

// Your components
import { WaterPlane } from './components/WaterPlane'
import { FloatingParticles } from './components/FloatingParticles'
import { BackgroundWaves } from './components/BackgroundWaves'
```

---

**Snippet Version:** 1.0 | **Last Updated:** 2026-01-09
