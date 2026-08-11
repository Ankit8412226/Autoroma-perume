'use client'

import * as React from 'react'

// Polyfill ReactCurrentOwner for R3F compatibility in Next.js 15 / React 19
if (typeof window !== 'undefined') {
  const secret =
    (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
    (React as any).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
  if (secret && !secret.ReactCurrentOwner) {
    secret.ReactCurrentOwner = secret.ReactCurrentOwner || secret.A || secret.H || { current: null }
  }
}

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useAspect, useTexture } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { Mesh } from 'three'

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from 'three/tsl'

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' }
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' }

extend(THREE as any)

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number
  threshold?: number
  fullScreenEffect?: boolean
}) => {
  const { gl, scene, camera } = useThree()
  const progressRef = useRef({ value: 0 })

  const render = useMemo(() => {
    const postProcessing = new (THREE as any).PostProcessing(gl as any)
    const scenePass = pass(scene, camera)
    const scenePassColor = scenePass.getTextureNode('output')
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold)

    // Create the scanning effect uniform
    const uScanProgress = uniform(0)
    progressRef.current = uScanProgress

    // Create a red overlay that follows the scan line
    const scanPos = float(uScanProgress.value)
    const uvY = uv().y
    const scanWidth = float(0.05)
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)))
    const redOverlay = vec3(1, 0, 0).mul(oneMinus(scanLine)).mul(0.4)

    // Mix the original scene with the red overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, redOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    )

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass)

    postProcessing.outputNode = final

    return postProcessing
  }, [camera, gl, scene, strength, threshold, fullScreenEffect])

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
    render.renderAsync()
  }, 1)

  return null
}

const WIDTH = 300
const HEIGHT = 300

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])

  const meshRef = useRef<Mesh>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true)
    }
  }, [rawMap, depthMap])

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0))
    const uProgress = uniform(0)

    const strength = 0.01

    const tDepthMap = texture(depthMap)

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    )

    const aspect = float(WIDTH).div(HEIGHT)
    const tUv = vec2(uv().x.mul(aspect), uv().y)

    const tiling = vec2(120.0)
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0)

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2))

    const dist = float(tiledUv.length())
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness)

    const depth = tDepthMap

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))))

    const mask = dot.mul(flow).mul(vec3(10, 0, 0))

    const final = blendScreen(tMap, mask)

    const material = new (THREE as any).MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    })

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    }
  }, [rawMap, depthMap])

  const [w, h] = useAspect(WIDTH, HEIGHT)

  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.07
        )
      }
    }
  })

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer
  })

  const scaleFactor = 0.4
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

export const Html = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-svh bg-black" />

  return (
    <div className="h-svh relative overflow-hidden bg-black">


      <Canvas
        flat
        gl={((canvasTarget: any) => {
          const domElement =
            typeof window !== 'undefined' && canvasTarget instanceof HTMLCanvasElement
              ? canvasTarget
              : canvasTarget?.canvas || canvasTarget

          const renderer = new (THREE as any).WebGPURenderer({ canvas: domElement })

          if (!renderer.domElement) {
            renderer.domElement = domElement
          }

          if (domElement && typeof domElement.getContext === 'function') {
            if (!renderer.domElement.getContext) {
              renderer.domElement.getContext = domElement.getContext.bind(domElement)
            }
            if (!(renderer as any).getContext) {
              ;(renderer as any).getContext = domElement.getContext.bind(domElement)
            }
          }

          if (typeof renderer.init === 'function') {
            renderer.init()
          }

          return renderer
        }) as any}
      >
        <PostProcessing fullScreenEffect={true} />
        <Scene />
      </Canvas>
    </div>
  )
}

export default Html
