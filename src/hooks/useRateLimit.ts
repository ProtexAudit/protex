// ============================================================
// PROTEX — useRateLimit Hook
// Client-side throttle: max N requests per minute
// ============================================================

import { useRef, useCallback } from 'react'

const MAX_RPM = Number(import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE ?? 20)
const WINDOW_MS = 60_000

export function useRateLimit() {
  const timestamps = useRef<number[]>([])

  const checkLimit = useCallback((): boolean => {
    const now = Date.now()
    // Evict timestamps older than the window
    timestamps.current = timestamps.current.filter(t => now - t < WINDOW_MS)

    if (timestamps.current.length >= MAX_RPM) {
      const oldest  = timestamps.current[0]
      const waitSec = Math.ceil((WINDOW_MS - (now - oldest)) / 1000)
      console.warn(`[Protex] Rate limit reached. Wait ${waitSec}s before next scan.`)
      return false
    }

    timestamps.current.push(now)
    return true
  }, [])

  const remaining = useCallback((): number => {
    const now = Date.now()
    const active = timestamps.current.filter(t => now - t < WINDOW_MS)
    return Math.max(0, MAX_RPM - active.length)
  }, [])

  return { checkLimit, remaining }
}
