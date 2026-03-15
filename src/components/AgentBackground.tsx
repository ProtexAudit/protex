// ============================================================
// PROTEX — AgentBackground Component
// Animated canvas: falling hex/binary threat codes
// Theme: security terminal, not generic matrix
// ============================================================

import { useEffect, useRef } from 'react'

const CHARS = '0F A3 FF 00 C9 4C E5 45 3A 4A 9E DF 3D B8 7A 08 0E 11 CRITICAL HIGH SAFE THREAT XSS SQL HASH BLOCK DENY AUTH 404 200 443 SSL TLS RSA AES'
  .split(' ')

const COLS_DENSITY = 28 // px per column

export function AgentBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = window.innerWidth
    let H = window.innerHeight

    canvas.width  = W
    canvas.height = H

    const cols  = Math.floor(W / COLS_DENSITY)
    const drops = Array.from({ length: cols }, () => Math.random() * -80)
    const speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.5)
    const chars  = Array.from({ length: cols }, () => CHARS[Math.floor(Math.random() * CHARS.length)])

    // Color palette: gold for active, dark gold for trail, red for threats
    const isThreat = (c: string) => ['CRITICAL','HIGH','THREAT','XSS','SQL','DENY'].includes(c)

    function draw() {
      // Fade trail
      ctx.fillStyle = 'rgba(8, 8, 8, 0.08)'
      ctx.fillRect(0, 0, W, H)

      ctx.font = `600 11px "Share Tech Mono", monospace`

      drops.forEach((y, i) => {
        const char = chars[i]
        const x    = i * COLS_DENSITY

        // Head glow
        if (isThreat(char)) {
          ctx.shadowColor = 'rgba(229,69,58,0.6)'
          ctx.shadowBlur  = 8
          ctx.fillStyle   = `rgba(229,69,58,${0.7 + Math.random() * 0.3})`
        } else {
          ctx.shadowColor = 'rgba(201,168,76,0.4)'
          ctx.shadowBlur  = 6
          ctx.fillStyle   = `rgba(201,168,76,${0.5 + Math.random() * 0.3})`
        }

        ctx.fillText(char, x, y * COLS_DENSITY)

        // Randomly change char
        if (Math.random() > 0.92) {
          chars[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        // Reset when off screen
        if (y * COLS_DENSITY > H + 60 && Math.random() > 0.97) {
          drops[i] = -4
        }
        drops[i] += speeds[i]
      })

      ctx.shadowBlur = 0
      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:  'fixed',
        top: 0, left: 0,
        width:  '100vw',
        height: '100vh',
        zIndex: -1,
        opacity: 0.45,
        pointerEvents: 'none',
      }}
    />
  )
}
