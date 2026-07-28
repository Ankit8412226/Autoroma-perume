'use client'

import * as React from 'react'
import * as THREE from 'three'

export function DealershipCarCanvas() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(3, 2, 5)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. 3D Supercar Body Mesh (Anodized Gold & Dark Metallic)
    const carGroup = new THREE.Group()

    // Chassis Base
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.5, 1.2)
    const bodyMat = new THREE.MeshBasicMaterial({
      color: 0xc9a96e,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    bodyMesh.position.y = 0.3
    carGroup.add(bodyMesh)

    // Cabin Roof Canopy
    const cabinGeo = new THREE.BoxGeometry(1.2, 0.45, 0.9)
    const cabinMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    })
    const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat)
    cabinMesh.position.set(-0.2, 0.7, 0)
    carGroup.add(cabinMesh)

    // 4 Wheels (Gold Wireframe Cylinders)
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16)
    const wheelMat = new THREE.MeshBasicMaterial({ color: 0xc9a96e, wireframe: true })

    const wheelPositions: [number, number, number][] = [
      [0.8, 0.2, 0.65],
      [0.8, 0.2, -0.65],
      [-0.8, 0.2, 0.65],
      [-0.8, 0.2, -0.65],
    ]

    const wheels: THREE.Mesh[] = []
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat)
      wheel.rotation.x = Math.PI / 2
      wheel.position.set(...pos)
      carGroup.add(wheel)
      wheels.push(wheel)
    })

    // Glowing LED Headlight Beam Points
    const lightGeo = new THREE.SphereGeometry(0.08, 16, 16)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const leftHeadlight = new THREE.Mesh(lightGeo, lightMat)
    leftHeadlight.position.set(1.22, 0.35, 0.4)
    const rightHeadlight = new THREE.Mesh(lightGeo, lightMat)
    rightHeadlight.position.set(1.22, 0.35, -0.4)
    carGroup.add(leftHeadlight)
    carGroup.add(rightHeadlight)

    scene.add(carGroup)

    // 3. Grid Floor & Highway Speedlines
    const gridHelper = new THREE.GridHelper(20, 20, 0xc9a96e, 0x222222)
    gridHelper.position.y = 0
    scene.add(gridHelper)

    // 4. Mouse Move Acceleration / Camera Rotation
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 5. Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Car Slow Floating & Wheel Rotation
      carGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.3 + Math.PI * 0.15
      wheels.forEach((w) => {
        w.rotation.z = elapsedTime * 4
      })

      // Grid Movement (Road Motion Effect)
      gridHelper.position.z = (elapsedTime * 2) % 1

      // Mouse Parallax Lag
      camera.position.x += (3 + mouseX * 1.2 - camera.position.x) * 0.05
      camera.position.y += (2 + mouseY * 0.8 - camera.position.y) * 0.05
      camera.lookAt(0, 0.4, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 6. Resize Handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full min-h-[300px]" />
}
