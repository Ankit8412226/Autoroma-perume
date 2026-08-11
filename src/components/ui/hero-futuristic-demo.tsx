'use client'

import '@/lib/react-polyfill'
import * as React from 'react'
import * as THREE from 'three'
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react'

export function HeroFuturisticDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // WebGL Procedural 3D Atelier Terrain & Laser Grid Animation
  React.useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current

    let reqId: number
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 15, 80)
    camera.lookAt(0, 5, 0)

    // 1. Procedural Animated Cyber Terrain Plane
    const planeGeo = new THREE.PlaneGeometry(160, 160, 64, 64)
    const planeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScanLine: { value: 0 },
        uColor1: { value: new THREE.Color('#C9A96E') }, // Luxury Gold
        uColor2: { value: new THREE.Color('#0A0A0C') }, // Dark Velvet
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          float wave1 = sin(pos.x * 0.08 + uTime * 1.5) * cos(pos.y * 0.08 + uTime * 1.5) * 4.0;
          float wave2 = sin(pos.x * 0.04 - uTime * 0.8) * 3.0;
          pos.z += wave1 + wave2;

          vElevation = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScanLine;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Grid pattern
          vec2 gridUv = fract(vUv * 40.0);
          float grid = step(0.93, gridUv.x) + step(0.93, gridUv.y);

          // Laser scan line sweep
          float scan = smoothstep(0.04, 0.0, abs(vUv.y - uScanLine));

          vec3 baseColor = mix(uColor2, uColor1 * 0.5, clamp((vElevation + 5.0) / 10.0, 0.0, 1.0));
          vec3 finalColor = mix(baseColor, uColor1, grid * 0.7);
          finalColor += vec3(1.0, 0.2, 0.2) * scan * 2.0; // Red laser beam accent

          float alpha = smoothstep(0.5, 0.1, distance(vUv, vec2(0.5))) * 0.85;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      wireframe: false,
    })

    const terrainMesh = new THREE.Mesh(planeGeo, planeMat)
    terrainMesh.rotation.x = -Math.PI / 2.5
    scene.add(terrainMesh)

    // 2. Wireframe Overlay Mesh
    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#E8C98A'),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wireMesh = new THREE.Mesh(planeGeo, wireMat)
    wireMesh.rotation.x = -Math.PI / 2.5
    wireMesh.position.z = 0.2
    scene.add(wireMesh)

    // 3. Floating Gold Particles
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3 + 0] = (Math.random() - 0.5) * 120
      particlePos[i * 3 + 1] = Math.random() * 40
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 80
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color('#F7EDD8'),
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Resize Handler
    const handleResize = () => {
      if (!container || !canvas || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Animation Loop
    const clock = new THREE.Clock()
    const renderLoop = () => {
      const elapsedTime = clock.getElapsedTime()

      planeMat.uniforms.uTime.value = elapsedTime
      planeMat.uniforms.uScanLine.value = (Math.sin(elapsedTime * 0.8) * 0.5 + 0.5)

      // Rotate particles slowly
      particles.rotation.y = elapsedTime * 0.05

      renderer.render(scene, camera)
      reqId = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      planeGeo.dispose()
      planeMat.dispose()
      wireMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [mounted])

  if (!mounted) {
    return <div className="h-full w-full bg-black min-h-[450px]" />
  }

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[450px] sm:min-h-[550px] lg:min-h-[620px] w-full relative overflow-hidden bg-black rounded-sm border border-white-500/20 shadow-2xl flex flex-col justify-between p-6 group hover:border-gold-300/60 transition-all duration-500"
    >
      {/* Background WebGL 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-90"
      />

      {/* Top Header Card Info Overlay */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-300/10 border border-gold-300/30 text-gold-300 text-[10px] font-inter uppercase tracking-[0.25em] w-fit">
          <Zap className="h-3 w-3 text-emerald-400 animate-pulse" />
          <span>3D ATELIER SHADER ENGINE</span>
        </div>

        <h3 className="font-sans text-xl sm:text-2xl font-bold text-white uppercase tracking-wider drop-shadow-md">
          Aura Véloce Bespoke Lab
        </h3>

        <p className="text-xs text-white-300 font-inter font-light max-w-sm leading-relaxed drop-shadow">
          Interactive real-time 3D scent formulation & laser-engraved casing visualizer.
        </p>
      </div>

      {/* Center Interactive Spec Badges */}
      <div className="relative z-10 grid grid-cols-2 gap-3 max-w-xs my-auto">
        <div className="bg-black/70 backdrop-blur-md border border-white-500/15 p-3 rounded-xs space-y-1">
          <span className="text-[9px] text-gold-300 uppercase tracking-widest font-inter block font-semibold">
            MATERIAL
          </span>
          <span className="text-xs text-white font-medium font-inter block">
            Anodized Aluminum
          </span>
        </div>

        <div className="bg-black/70 backdrop-blur-md border border-white-500/15 p-3 rounded-xs space-y-1">
          <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-inter block font-semibold">
            HEAT TOLERANCE
          </span>
          <span className="text-xs text-white font-medium font-inter block">
            60°C Tested (Zero Leak)
          </span>
        </div>
      </div>

      {/* Bottom Footer Ribbon */}
      <div className="relative z-10 pt-4 border-t border-white-500/20 flex items-center justify-between text-[10px] font-inter text-white-300 uppercase tracking-widest">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gold-300 animate-spin" />
          <span>REAL-TIME 60FPS SHADER</span>
        </span>
        <span className="text-white font-semibold">ATELIER ACTIVE</span>
      </div>
    </div>
  )
}

export default HeroFuturisticDemo
