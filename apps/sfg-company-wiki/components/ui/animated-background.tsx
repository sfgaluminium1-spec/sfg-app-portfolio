
"use client"

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle system for 3D effect
    class Particle {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      size: number

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.z = Math.random() * 1000
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.vz = (Math.random() - 0.5) * 2
        this.size = Math.random() * 2 + 1
      }

      update() {
        if (!canvas) return
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
        if (this.z < 0 || this.z > 1000) this.vz *= -1
      }

      draw() {
        if (!canvas || !ctx) return
        const scale = 1000 / (1000 + this.z)
        const x2d = this.x * scale + canvas.width / 2 * (1 - scale)
        const y2d = this.y * scale + canvas.height / 2 * (1 - scale)
        const size = this.size * scale

        const opacity = 1 - this.z / 1000
        
        // SFG Blue gradient
        const gradient = ctx!.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 2)
        gradient.addColorStop(0, `rgba(37, 99, 235, ${opacity * 0.8})`) // #2563EB
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 0.4})`) // #3B82F6
        gradient.addColorStop(1, `rgba(96, 165, 250, ${opacity * 0})`) // #60A5FA

        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(x2d, y2d, size * 2, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(canvas.width, canvas.height))
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(7, 12, 20, 0.1)' // Fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw connecting lines
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dz = p1.z - p2.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (distance < 200) {
            const scale1 = 1000 / (1000 + p1.z)
            const scale2 = 1000 / (1000 + p2.z)
            const x1 = p1.x * scale1 + canvas.width / 2 * (1 - scale1)
            const y1 = p1.y * scale1 + canvas.height / 2 * (1 - scale1)
            const x2 = p2.x * scale2 + canvas.width / 2 * (1 - scale2)
            const y2 = p2.y * scale2 + canvas.height / 2 * (1 - scale2)

            const opacity = (1 - distance / 200) * 0.3
            ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
