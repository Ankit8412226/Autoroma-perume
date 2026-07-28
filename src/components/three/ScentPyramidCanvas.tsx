'use client'

import * as React from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export function ScentPyramidCanvas() {
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
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. 3D Glass Pyramid Mesh (Tetrahedron)
    const geometry = new THREE.TetrahedronGeometry(2, 0)
    const wireframeGeo = new THREE.WireframeGeometry(geometry)
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc9a96e, // Gold
      linewidth: 2,
      transparent: true,
      opacity: 0.8,
    })
    const pyramidMesh = new THREE.LineSegments(wireframeGeo, lineMaterial)
    scene.add(pyramidMesh)

    // 3. Inner Glowing Core Glass Mesh
    const innerGeo = new THREE.OctahedronGeometry(0.8, 1)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // 4. Floating Scent Particle Field around Pyramid
    const particleCount = 120
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6
      positions[i + 1] = (Math.random() - 0.5) * 6
      positions[i + 2] = (Math.random() - 0.5) * 6
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xc9a96e, 2, 10)
    pointLight.position.set(2, 3, 4)
    scene.add(pointLight)

    // 6. Mouse Interaction Parallax
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 7. Continuous Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Continuous 3D rotation
      pyramidMesh.rotation.y = elapsedTime * 0.4
      pyramidMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2

      innerMesh.rotation.y = -elapsedTime * 0.6
      innerMesh.rotation.z = Math.cos(elapsedTime * 0.4) * 0.3

      particles.rotation.y = elapsedTime * 0.15

      // Smooth Mouse Tilt Lag
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // 8. Resize Handler
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

  return <div ref={containerRef} className="w-full h-full min-h-[350px]" />
}
