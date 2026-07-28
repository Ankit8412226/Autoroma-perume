# 07_THREEJS_SYSTEM.md — Three.js & 3D System Specification

> **Status**: Immutable Specification  
> **Project**: [BRAND NAME TBD] — Premium Car Fragrance E-Commerce Platform  
> **Audience**: 3D/Graphics Engineers, Frontend Engineers  
> **Last Updated**: 2026-07-27

---

## Table of Contents

1. [Scene Structure](#1-scene-structure)
2. [Lighting](#2-lighting)
3. [Camera](#3-camera)
4. [Bottle Model](#4-bottle-model)
5. [Glass Material](#5-glass-material)
6. [Environment & HDR](#6-environment--hdr)
7. [Contact Shadows](#7-contact-shadows)
8. [Post Processing](#8-post-processing)
9. [Particles](#9-particles)
10. [Smoke Effect](#10-smoke-effect)
11. [Mouse Interaction](#11-mouse-interaction)
12. [Optimization](#12-optimization)
13. [Performance Targets](#13-performance-targets)

---

## 1. Scene Structure

### Technology

| Layer | Library |
|---|---|
| WebGL Renderer | Three.js |
| React Integration | React Three Fiber (R3F) |
| Helpers & Abstractions | Drei |
| Post Processing | `@react-three/postprocessing` |

### Component Architecture

```
src/components/three/
├── BottleScene.tsx          ← Root R3F Canvas wrapper
├── BottleModel.tsx          ← GLTF model loader & material application
├── SceneLighting.tsx        ← All lights in one component
├── SceneEnvironment.tsx     ← HDR environment, background
├── ContactShadows.tsx       ← Ground shadow via Drei
├── ParticleField.tsx        ← Floating gold particles
├── SmokeEffect.tsx          ← Volumetric smoke shader
└── PostProcessing.tsx       ← Bloom, vignette, chromatic aberration
```

### Canvas Setup

```tsx
// src/components/three/BottleScene.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { BottleModel } from './BottleModel'
import { SceneLighting } from './SceneLighting'
import { SceneEnvironment } from './SceneEnvironment'
import { ParticleField } from './ParticleField'
import { PostProcessing } from './PostProcessing'
import { ContactShadows, OrbitControls } from '@react-three/drei'

export function BottleScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      dpr={[1, 2]}   // Cap at 2x dpr for performance
      shadows
    >
      <Suspense fallback={null}>
        <SceneLighting />
        <SceneEnvironment />
        <BottleModel />
        <ParticleField />
        <ContactShadows />
        <PostProcessing />
      </Suspense>
    </Canvas>
  )
}
```

---

## 2. Lighting

### Light Setup

```tsx
// src/components/three/SceneLighting.tsx
import * as THREE from 'three'
import { useRef } from 'react'

export function SceneLighting() {
  return (
    <>
      {/* Key Light — warm gold, from upper right */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={2.0}
        color="#E8C98A"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.001}
      />

      {/* Fill Light — cool blue-white, from left */}
      <directionalLight
        position={[-4, 2, -1]}
        intensity={0.4}
        color="#C8D8F0"
      />

      {/* Rim Light — warm highlight, behind model */}
      <pointLight
        position={[0, 1, -3]}
        intensity={1.5}
        color="#F7EDD8"
        distance={8}
        decay={2}
      />

      {/* Ambient — very low to preserve darkness */}
      <ambientLight intensity={0.08} color="#1A1510" />

      {/* Ground bounce — simulates surface reflection */}
      <hemisphereLight
        args={["#C9A96E", "#080808", 0.15]}
        position={[0, -1, 0]}
      />
    </>
  )
}
```

### Lighting Philosophy

The hero section of the homepage features a real-time 3D rendered car fragrance product — a premium vent clip or spray bottle — that:
- Rotates slowly on its vertical axis
- Reacts to mouse parallax with subtle rotation
- Is illuminated with cinematic studio lighting
- Sits against a dark atmospheric environment with particle bokeh effects
- Communicates premium quality and automotive identity at a glance
- **Ambient** is intentionally very low — luxury is defined by shadow as much as light
- Shadow map resolution: 2048px — crisp shadows on high-resolution displays

---

## 3. Camera

### Configuration

```typescript
// Initial camera state
position: [0, 0, 4]   // 4 units from center
fov: 35               // Narrow FOV — luxury photography feel (not wide-angle)
near: 0.1
far: 100
```

### Camera Behavior

| State | Camera Action |
|---|---|
| Idle | Slow auto-rotate: Y axis, 0.2° per second |
| Mouse move (hero) | Subtle parallax: ±0.3 units X, ±0.15 units Y |
| Product page | OrbitControls enabled (limited: polar 60°–120°, no zoom) |
| Mobile | Auto-rotate disabled, camera slightly zoomed out |

### Auto-Rotate

```tsx
// useFrame hook in BottleModel
useFrame((state, delta) => {
  if (!isInteracting) {
    modelRef.current.rotation.y += delta * 0.2
  }
})
```

---

## 4. Bottle Model

### File Specification

- **Format**: GLTF 2.0 (binary `.glb`)
- **Location**: 
// Model file: /public/models/hero-product.glb
// Acceptable fallback if no GLB: product image on a dark card
// GLB budget: < 3MB compressed
// Source: Blender export — vent clip or spray bottle hero model
// Textures: baked AO, roughness map, metallic map for product casing
- **Polygon count**: < 50,000 triangles (LOD: < 20,000 for mobile)
- **Texture resolution**: 2048×2048px (1024×1024 for mobile)
- **UV mapping**: Single UV set, no overlapping

### Loading

```tsx
// src/components/three/BottleModel.tsx
import { useGLTF, useTexture } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'

// Preload at module level
useGLTF.preload('/models/perfume-bottle.glb')

export function BottleModel() {
  const { nodes, materials } = useGLTF('/models/perfume-bottle.glb')
  const modelRef = useRef<THREE.Group>(null)

  // Entrance animation — model rises from below on mount
  useEffect(() => {
    if (!modelRef.current) return
    gsap.from(modelRef.current.position, {
      y: -2,
      duration: 1.5,
      ease: 'expo.out',
      delay: 0.3,
    })
    gsap.from(modelRef.current, {
      opacity: 0,    // via material transparency
      duration: 1.0,
      ease: 'power2.out',
    })
  }, [])

  return (
    <group ref={modelRef} dispose={null}>
      <mesh geometry={nodes.Bottle_Glass.geometry}>
        <GlassMaterial />
      </mesh>
      <mesh geometry={nodes.Bottle_Cap.geometry}>
        <GoldCapMaterial />
      </mesh>
      <mesh geometry={nodes.Bottle_Label.geometry}>
        <LabelMaterial />
      </mesh>
      <mesh geometry={nodes.Liquid.geometry}>
        <LiquidMaterial />
      </mesh>
    </group>
  )
}
```

### Model Node Structure

| Node Name | Material | Description |
|---|---|---|
| `Bottle_Glass` | Glass (custom) | Main bottle body |
| `Bottle_Cap` | Gold PBR | Metallic cap/atomizer |
| `Bottle_Label` | Label (texture) | Brand label with logo |
| `Liquid` | Liquid (custom) | Amber liquid inside bottle |
| `Bottle_Base` | Glass | Bottom of bottle |

---

## 5. Glass Material

Custom physically-based glass shader — the most critical visual element:

```tsx
// src/components/three/BottleModel.tsx — GlassMaterial component
import * as THREE from 'three'
import { useEnvironment } from '@react-three/drei'

function GlassMaterial() {
  const envMap = useEnvironment({ files: '/hdr/luxury-studio.hdr' })

  return (
    <meshPhysicalMaterial
      // Base appearance
      color="#E8D8C0"             // Very subtle warm tint
      transparent={true}
      opacity={0.15}              // Very transparent
      
      // Glass optical properties
      transmission={0.92}         // High transmission = very clear glass
      thickness={0.8}             // Glass thickness for refraction
      roughness={0.02}            // Very smooth glass surface
      metalness={0.0}             // Not metallic
      
      // IOR (Index of Refraction)
      ior={1.52}                  // Standard glass IOR
      
      // Reflections & Refraction
      reflectivity={0.9}
      envMap={envMap}
      envMapIntensity={1.2}
      
      // Physical effects
      clearcoat={1.0}             // Extra glossy coat
      clearcoatRoughness={0.0}
      attenuationColor="#C9A96E"  // Gold tint inside glass
      attenuationDistance={0.3}
      
      side={THREE.DoubleSide}
    />
  )
}
```

### Gold Cap Material

```tsx
function GoldCapMaterial() {
  return (
    <meshStandardMaterial
      color="#C9A96E"
      metalness={0.95}
      roughness={0.1}
      envMapIntensity={1.5}
    />
  )
}
```

### Liquid Material (Amber Perfume)

```tsx
function LiquidMaterial() {
  return (
    <meshPhysicalMaterial
      color="#8B4513"           // Dark amber
      transparent={true}
      opacity={0.85}
      roughness={0.0}
      metalness={0.0}
      transmission={0.5}
      thickness={1.5}
      attenuationColor="#C9703A"
      attenuationDistance={0.5}
    />
  )
}
```

---

## 6. Environment & HDR

### HDR Configuration

```tsx
// src/components/three/SceneEnvironment.tsx
import { Environment } from '@react-three/drei'

export function SceneEnvironment() {
  return (
    <Environment
      files="/hdr/luxury-studio.hdr"
      background={false}     // Don't show HDR as background
      resolution={512}       // Balance quality vs performance
      blur={0.5}            // Soft reflections
    />
  )
}
```

### HDR File

- **File**: `public/hdr/luxury-studio.hdr`
- **Description**: Studio-style HDR with warm key light, dark background
- **Source**: Polyhaven `studio_small_03` — remapped to warm golden tones
- **Resolution**: 2048×1024 for quality, downsampled to 512 in Environment component for performance

### Background

- The WebGL canvas has `alpha: true` — transparent background
- CSS background of the hero section (dark gradient) shows through
- No HDR visible as scene background — pure dark

---

## 7. Contact Shadows

Soft ground shadow beneath the bottle:

```tsx
// src/components/three/ContactShadows.tsx
import { ContactShadows } from '@react-three/drei'

export function BottleContactShadow() {
  return (
    <ContactShadows
      position={[0, -1.4, 0]}     // Just below the bottle base
      opacity={0.6}
      scale={4}
      blur={2.5}                   // Soft luxury shadow
      far={3}
      resolution={512}
      color="#080808"
    />
  )
}
```

---

## 8. Post Processing

```tsx
// src/components/three/PostProcessing.tsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Subtle bloom on specular highlights */}
      <Bloom
        luminanceThreshold={0.9}   // Only very bright areas bloom
        luminanceSmoothing={0.9}
        intensity={0.3}            // Very subtle — not sci-fi
        blendFunction={BlendFunction.ADD}
      />
      
      {/* Vignette — darkens edges for cinematic depth */}
      <Vignette
        offset={0.3}
        darkness={0.7}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Chromatic aberration — very subtle lens imperfection */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
```

### Post Processing Rules

- Bloom threshold **must** be above 0.85 — only glass specular highlights bloom
- Chromatic aberration offset **must** be below 0.001 — barely perceptible
- Vignette darkness **must not** exceed 0.8 — product must remain visible at edges
- Post processing disabled on mobile (< 768px) for performance

---

## 9. Particles

Floating gold dust particles in the scene:

```tsx
// src/components/three/ParticleField.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 6   // X: spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8   // Y: spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4   // Z: depth
      sizes[i] = Math.random() * 2 + 1
    }

    return [positions, sizes]
  }, [])

  // Slow upward drift
  useFrame((state) => {
    if (!meshRef.current) return
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 1] += 0.002   // Float upward
      if (positions[i * 3 + 1] > 4) {
        positions[i * 3 + 1] = -4     // Reset to bottom
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C9A96E"
        size={0.02}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
```

---

## 10. Smoke Effect

Volumetric smoke rising from the bottle cap on the homepage hero:

```tsx
// Uses a custom shader material with animated noise
// Technique: Animated noise texture on a plane mesh, transparent, additive blending
// Color: Very dark grey (#1A1A1A) — almost invisible against dark background
// Purpose: Adds luxury ambiance without distracting from the bottle
```

### Shader Approach

```glsl
// Fragment shader — smoke noise
uniform float uTime;
uniform sampler2D uNoiseTexture;

void main() {
  vec2 uv = vUv;
  uv.y -= uTime * 0.05;        // Rising motion
  uv.x += sin(uTime * 0.3) * 0.02;  // Gentle sway

  float noise = texture2D(uNoiseTexture, uv).r;
  float alpha = noise * (1.0 - vUv.y) * 0.15;  // Fade at top
  
  gl_FragColor = vec4(0.1, 0.1, 0.1, alpha);
}
```

---

## 11. Mouse Interaction

### Hero Scene Mouse Parallax

```tsx
// The bottle reacts to mouse movement — subtle and luxury
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function BottleModel() {
  const modelRef = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (!modelRef.current) return
    // Lerp for smooth, lag-based following
    modelRef.current.rotation.y += (mouse.current.x * 0.3 - modelRef.current.rotation.y) * 0.05
    modelRef.current.rotation.x += (mouse.current.y * 0.15 - modelRef.current.rotation.x) * 0.05
  })
}
```

### Product Page OrbitControls

```tsx
<OrbitControls
  enableZoom={false}
  enablePan={false}
  minPolarAngle={Math.PI / 3}    // 60° from top
  maxPolarAngle={Math.PI * 2/3}  // 120° from top
  autoRotate={false}
  dampingFactor={0.08}
  enableDamping={true}
/>
```

---

## 12. Optimization

### Strategy

1. **`dpr={[1, 2]}`** — Cap pixel ratio at 2× to prevent 3× on Retina displays
2. **LOD (Level of Detail)**: Use lower-poly model on mobile (`< 768px`)
3. **Texture compression**: GLTF uses KTX2 / Basis compressed textures
4. **`dispose={null}`** on GLTF — R3F manages disposal automatically
5. **`Suspense`** boundary wraps entire scene — prevents blank flash
6. **`dynamic(import)`** — BottleScene is only loaded client-side, never on server
7. **`useGLTF.preload()`** — starts loading model before component mounts

### Mobile Degradation

```typescript
// Check at component mount
const isMobile = window.innerWidth < 768
const isLowEnd = navigator.hardwareConcurrency < 4

if (isMobile || isLowEnd) {
  // Render static product image instead of 3D scene
  return <StaticProductImage src={heroImageUrl} alt={productName} />
}
```

### Frame Rate Monitoring

```typescript
// In development — log frame rate warnings
if (process.env.NODE_ENV === 'development') {
  useFrame(({ gl }) => {
    const info = gl.info
    if (info.render.calls > 100) {
      console.warn('High draw calls:', info.render.calls)
    }
  })
}
```

---

## 13. Performance Targets

| Metric | Target | Measurement |
|---|---|---|
| Frame Rate | 60fps on desktop | Chrome DevTools / Spector.js |
| Frame Rate (mobile) | Static image (no 3D) | N/A |
| Draw Calls | < 15 per frame | `gl.info.render.calls` |
| Triangle Count | < 50,000 | `gl.info.render.triangles` |
| GPU Memory | < 150MB | Chrome Task Manager |
| Time to First Render | < 1.5s (with Suspense) | Lighthouse |
| GLTF File Size | < 3MB (compressed) | Network tab |
| HDR File Size | < 1MB | Network tab |

### Texture Budget

| Texture | Resolution | Format | Max Size |
|---|---|---|---|
| Bottle albedo | 2048×2048 | KTX2 | 512KB |
| Normal map | 2048×2048 | KTX2 | 512KB |
| Roughness/Metalness | 2048×2048 | KTX2 | 256KB |
| Label texture | 1024×512 | KTX2 | 256KB |
| Noise texture (smoke) | 512×512 | PNG | 64KB |
