'use client'

import * as React from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BottleModel() {
  const meshGroupRef = React.useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y += delta * 0.3
      meshGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08
    }
  })

  return (
    <group ref={meshGroupRef} position={[0, 0, 0]}>
      {/* Bottle Base Body — Dark Obsidian Glass Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.8, 32]} />
        <meshPhysicalMaterial
          color="#0d0d0d"
          roughness={0.1}
          metalness={0.8}
          transmission={0.4}
          ior={1.5}
          reflectivity={0.9}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Gold Accent Ring Collar */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
        <meshStandardMaterial
          color="#C9A96E"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Premium Metallic Cap / Vent Clip Top */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Emblem Inlay Front */}
      <mesh position={[0, 0, 0.71]}>
        <planeGeometry args={[0.5, 0.8]} />
        <meshStandardMaterial
          color="#C9A96E"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}
