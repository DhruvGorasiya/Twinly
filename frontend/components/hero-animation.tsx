"use client"

import { useEffect, useRef } from "react"

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio

      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = (Math.random() * canvas.width) / devicePixelRatio
        this.y = (Math.random() * canvas.height) / devicePixelRatio
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5

        const colors = [
          "rgba(147, 51, 234, 0.7)", // violet
          "rgba(217, 70, 239, 0.7)", // fuchsia
          "rgba(6, 182, 212, 0.7)", // cyan
          "rgba(236, 72, 153, 0.7)", // pink
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.05

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width / devicePixelRatio) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height / devicePixelRatio) this.speedY *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        // Add glow effect
        ctx.shadowBlur = 15
        ctx.shadowColor = this.color
      }
    }

    // Create particle array
    const particlesArray: Particle[] = []
    const numberOfParticles = 50

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw mockup device
      const deviceWidth = (canvas.width / devicePixelRatio) * 0.8
      const deviceHeight = deviceWidth * 0.6
      const deviceX = (canvas.width / devicePixelRatio - deviceWidth) / 2
      const deviceY = (canvas.height / devicePixelRatio - deviceHeight) / 2

      // Device frame
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(deviceX, deviceY, deviceWidth, deviceHeight, 10)
      ctx.fill()
      ctx.stroke()

      // Screen
      ctx.fillStyle = "rgba(30, 30, 30, 0.7)"
      ctx.beginPath()
      ctx.roundRect(deviceX + 10, deviceY + 10, deviceWidth - 20, deviceHeight - 20, 5)
      ctx.fill()

      // UI elements (simplified)
      // Header
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(deviceX + 20, deviceY + 20, deviceWidth - 40, 30)

      // Sidebar
      ctx.fillStyle = "rgba(147, 51, 234, 0.2)"
      ctx.fillRect(deviceX + 20, deviceY + 60, 80, deviceHeight - 80)

      // Content area - cards
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
          ctx.beginPath()
          ctx.roundRect(
            deviceX + 120 + (j * (deviceWidth - 160)) / 2,
            deviceY + 60 + i * 80,
            (deviceWidth - 160) / 2 - 10,
            70,
            5,
          )
          ctx.fill()
        }
      }

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Connect nearby particles with lines
      connectParticles()

      requestAnimationFrame(animate)
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`
            ctx.lineWidth = 1
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative aspect-video w-full max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-2xl"
        style={{ background: "rgba(0, 0, 0, 0.2)" }}
      />
    </div>
  )
}
