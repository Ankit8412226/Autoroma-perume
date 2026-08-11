'use client'

import '@/lib/react-polyfill'
import * as React from 'react'
import * as THREE from 'three'

const BASE_TEXTURE_PATH = '/images/hero-perfume-base.png'
const DEPTH_TEXTURE_PATH = '/images/hero-perfume-depth.webp'

export function HeroFuturisticDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current

    let reqId: number
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const textureLoader = new THREE.TextureLoader()

    let baseTexture: THREE.Texture | null = null
    let depthTexture: THREE.Texture | null = null

    // Custom 2.5D Depth Displacement & Red Scanning Laser Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uBaseTexture: { value: null },
        uDepthTexture: { value: null },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uBaseTexture;
        uniform sampler2D uDepthTexture;
        uniform vec2 uPointer;
        uniform float uProgress;
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        // Simplex/Cell Noise for Cyber Dot Matrix Overlay
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          vec4 depthMap = texture2D(uDepthTexture, vUv);
          float depth = depthMap.r;

          // Parallax UV displacement based on depth map and pointer mouse coordinates
          vec2 offset = depth * uPointer * 0.025;
          vec2 displacedUv = clamp(vUv + offset, 0.0, 1.0);

          vec4 baseColor = texture2D(uBaseTexture, displacedUv);

          // Animated red laser scanning line moving vertically
          float scanPos = uProgress;
          float scanWidth = 0.035;
          float distToScan = abs(vUv.y - scanPos);
          float scanLine = smoothstep(scanWidth, 0.0, distToScan);

          // Cyber matrix dot grid
          vec2 gridUv = fract(vUv * 90.0);
          float gridDot = smoothstep(0.4, 0.2, length(gridUv - vec2(0.5))) * hash(floor(vUv * 90.0));
          float scanMask = smoothstep(0.01, 0.0, abs(depth - uProgress));
          vec3 redScanOverlay = vec3(1.0, 0.15, 0.15) * scanLine * 0.6 + vec3(1.0, 0.2, 0.1) * gridDot * scanMask * 2.5;

          vec3 finalColor = baseColor.rgb + redScanOverlay;

          gl_FragColor = vec4(finalColor, baseColor.a * uOpacity);
        }
      `,
      transparent: true,
    })

    const quadGeo = new THREE.PlaneGeometry(2, 2)
    const quadMesh = new THREE.Mesh(quadGeo, material)
    scene.add(quadMesh)

    // Load local textures safely
    let loadedCount = 0
    const onTextureLoad = () => {
      loadedCount++
      if (loadedCount === 2) {
        material.uniforms.uBaseTexture.value = baseTexture
        material.uniforms.uDepthTexture.value = depthTexture
        setIsLoaded(true)
      }
    }

    baseTexture = textureLoader.load(BASE_TEXTURE_PATH, onTextureLoad)
    depthTexture = textureLoader.load(DEPTH_TEXTURE_PATH, onTextureLoad)

    // Pointer mouse movement tracking for 3D depth parallax
    const targetPointer = new THREE.Vector2(0, 0)
    const currentPointer = new THREE.Vector2(0, 0)

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const x = ((clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1)

      targetPointer.set(x, y)
    }

    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('touchmove', handlePointerMove)

    const handleResize = () => {
      if (!container || !canvas || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const clock = new THREE.Clock()
    let currentOpacity = 0

    const renderLoop = () => {
      const elapsedTime = clock.getElapsedTime()

      // Smooth pointer lerp
      currentPointer.lerp(targetPointer, 0.08)
      material.uniforms.uPointer.value.copy(currentPointer)

      // Laser scan progress oscillation (0.0 to 1.0)
      material.uniforms.uProgress.value = Math.sin(elapsedTime * 0.7) * 0.5 + 0.5
      material.uniforms.uTime.value = elapsedTime

      // Fade-in opacity
      if (loadedCount === 2 && currentOpacity < 1) {
        currentOpacity = Math.min(1, currentOpacity + 0.05)
        material.uniforms.uOpacity.value = currentOpacity
      }

      renderer.render(scene, camera)
      reqId = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      quadGeo.dispose()
      material.dispose()
      if (baseTexture) baseTexture.dispose()
      if (depthTexture) depthTexture.dispose()
      renderer.dispose()
    }
  }, [mounted])

  if (!mounted) {
    return <div className="h-full w-full bg-black min-h-[450px]" />
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[450px] sm:min-h-[550px] lg:min-h-[620px] w-full relative overflow-hidden bg-black rounded-sm border border-white-500/20 shadow-2xl group hover:border-gold-300/60 transition-all duration-500"
    >
      {/* 2.5D Depth Scan WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 opacity-90 transition-opacity duration-700"
      />

      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-black/90 flex flex-col items-center justify-center space-y-3 text-white-300 font-inter text-xs">
          <div className="h-6 w-6 border-2 border-gold-300 border-t-transparent rounded-full animate-spin" />
          <span>Loading 3D Depth Scanner...</span>
        </div>
      )}

      {/* Cyber Corner HUD Brackets Overlay */}
      <div className="absolute top-4 left-4 z-10 text-[9px] font-inter uppercase tracking-[0.25em] text-white/70 flex items-center gap-2 pointer-events-none">
        <span className="h-2 w-2 bg-red-500 rounded-full animate-ping" />
        <span>LASER SCANNER ACTIVE · 2.5D DEPTH</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 text-[9px] font-inter uppercase tracking-[0.25em] text-gold-300/80 pointer-events-none">
        <span>MOVE CURSOR TO ROTATE PARALLAX</span>
      </div>
    </div>
  )
}

export default HeroFuturisticDemo
