// 动态渐变背景组件
'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface AnimatedGradientProps {
  className?: string
  colors?: string[]
  speed?: 'slow' | 'normal' | 'fast'
}

export function AnimatedGradient({
  className,
  colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
  speed = 'normal',
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const speeds = {
      slow: 0.0005,
      normal: 0.001,
      fast: 0.002,
    }

    const speedMultiplier = speeds[speed]

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      time += speedMultiplier
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // 创建渐变
      const gradient = ctx.createLinearGradient(
        0,
        0,
        width,
        height
      )

      colors.forEach((color, index) => {
        const offset = (index / (colors.length - 1) + time) % 1
        gradient.addColorStop(offset, color)
      })

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors, speed])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 -z-10', className)}
    />
  )
}
