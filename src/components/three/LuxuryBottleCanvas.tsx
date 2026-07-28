'use client'

import * as React from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export function LuxuryBottleCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()

    const width = container.clientWidth || 400
    const height = container.clientHeight || 500
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
    container.appendChild(renderer.domElement)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const goldMainLight = new THREE.DirectionalLight(0xF7EDD8, 2.0)
    goldMainLight.position.set(5, 5, 5)
    scene.add(goldMainLight)

    const cyanHeadlightRim = new THREE.DirectionalLight(0x4A6FA5, 1.8)
    cyanHeadlightRim.position.set(-5, -2, -2)
    scene.add(cyanHeadlightRim)

    const goldCorePoint = new THREE.PointLight(0xC9A96E, 2.5, 10)
    goldCorePoint.position.set(0, 0, 1.5)
    scene.add(goldCorePoint)

    // Main 3D Container Group
    const mainGroup = new THREE.Group()

    // -------------------------------------------------------------
    // 1. 3D WIREFRAME SPORTS CAR SILHOUETTE (BACKGROUND AUTOMOTIVE MESH)
    // -------------------------------------------------------------
    const carGroup = new THREE.Group()
    carGroup.position.set(0, -0.2, -1.8)
    carGroup.rotation.y = Math.PI / 6

    // Sleek Sports Car Body Geometry (Streamlined aerodynamic box setup)
    const carBodyGeo = new THREE.BoxGeometry(2.8, 0.6, 1.2)
    const carEdges = new THREE.EdgesGeometry(carBodyGeo)
    const carLineMat = new THREE.LineBasicMaterial({
      color: 0xC9A96E,
      transparent: true,
      opacity: 0.35,
      linewidth: 1.5,
    })
    const carBodyLine = new THREE.LineSegments(carEdges, carLineMat)
    carGroup.add(carBodyLine)

    // Car Cabin / Windshield Roof Line
    const roofGeo = new THREE.BoxGeometry(1.4, 0.5, 1.0)
    const roofEdges = new THREE.EdgesGeometry(roofGeo)
    const roofLine = new THREE.LineSegments(roofEdges, carLineMat)
    roofLine.position.set(-0.2, 0.55, 0)
    carGroup.add(roofLine)

    // 4 Metallic Wheels Wireframes
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 24)
    const wheelEdges = new THREE.EdgesGeometry(wheelGeo)
    const wheelMat = new THREE.LineBasicMaterial({ color: 0xF3E5AB, transparent: true, opacity: 0.5 })

    const wheel1 = new THREE.LineSegments(wheelEdges, wheelMat)
    wheel1.rotation.x = Math.PI / 2
    wheel1.position.set(0.9, -0.3, 0.6)
    carGroup.add(wheel1)

    const wheel2 = wheel1.clone()
    wheel2.position.set(-0.9, -0.3, 0.6)
    carGroup.add(wheel2)

    const wheel3 = wheel1.clone()
    wheel3.position.set(0.9, -0.3, -0.6)
    carGroup.add(wheel3)

    const wheel4 = wheel1.clone()
    wheel4.position.set(-0.9, -0.3, -0.6)
    carGroup.add(wheel4)

    // Glowing LED Headlights Wireframe (Front Lights)
    const lightGeo = new THREE.SphereGeometry(0.08, 16, 16)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x4A6FA5 })
    const headlightL = new THREE.Mesh(lightGeo, lightMat)
    headlightL.position.set(1.4, -0.1, 0.4)
    carGroup.add(headlightL)

    const headlightR = headlightL.clone()
    headlightR.position.set(1.4, -0.1, -0.4)
    carGroup.add(headlightR)

    mainGroup.add(carGroup)

    // -------------------------------------------------------------
    // 2. 3D LUXURY BOTTLE (FOREGROUND CAR PERFUME)
    // -------------------------------------------------------------
    const bottleGroup = new THREE.Group()

    // Obsidian Glass Bottle Body
    const bodyGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.8, 32)
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x090909,
      roughness: 0.08,
      metalness: 0.9,
      transmission: 0.4,
      ior: 1.5,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    bottleGroup.add(bodyMesh)

    // Gold Collar Ring
    const collarGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.18, 32)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xC9A96E,
      metalness: 0.95,
      roughness: 0.15,
    })
    const collarMesh = new THREE.Mesh(collarGeo, goldMat)
    collarMesh.position.y = 0.98
    bottleGroup.add(collarMesh)

    // Matte Aluminum Vent Clip Top
    const capGeo = new THREE.BoxGeometry(0.75, 0.42, 0.75)
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.85,
      roughness: 0.2,
    })
    const capMesh = new THREE.Mesh(capGeo, capMat)
    capMesh.position.y = 1.28
    bottleGroup.add(capMesh)

    // Gold Crest Emblem
    const emblemGeo = new THREE.PlaneGeometry(0.55, 0.85)
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xC9A96E,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    })
    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat)
    emblemMesh.position.set(0, 0, 0.73)
    bottleGroup.add(emblemMesh)

    mainGroup.add(bottleGroup)
    scene.add(mainGroup)

    // -------------------------------------------------------------
    // 3. HIGHWAY SPEEDLINE PARTICLES (NIGHT DRIVE ATMOSPHERE)
    // -------------------------------------------------------------
    const particleCount = 140
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      speeds[i] = 0.02 + Math.random() * 0.05
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0xC9A96E,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const speedParticles = new THREE.Points(particleGeo, particleMat)
    scene.add(speedParticles)

    // GSAP Floating Bottle Animation
    gsap.to(bottleGroup.position, {
      y: 0.12,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })

    // GSAP Gentle Car Float
    gsap.to(carGroup.rotation, {
      y: Math.PI / 4,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    // Render loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      bottleGroup.rotation.y += 0.006

      // Move speed particles along Z-axis like driving down highway
      const posAttr = speedParticles.geometry.attributes.position as THREE.BufferAttribute
      const posArr = posAttr.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 2] += speeds[i]
        if (posArr[i * 3 + 2] > 4) {
          posArr[i * 3 + 2] = -4
        }
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    // Mouse Move Parallax Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2

      gsap.to(mainGroup.rotation, {
        x: y * 0.25,
        y: x * 0.35,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize listener
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[480px] relative cursor-grab active:cursor-grabbing"
    />
  )
}
