// ============================================================
// PROTEX — useScan Hook
// Encapsulates all scan logic: API call, state updates, errors
// ============================================================

import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { scanContent } from '@/api/hermes'
import { useProtexStore } from '@/services/store'
import type { ScanMode } from '@/types'

const MAX_CHARS = Number(import.meta.env.VITE_MAX_SCAN_CHARS ?? 5000)

export function useScan(mode: ScanMode) {
  const { activePanels, setScanning, setResult, setError } = useProtexStore()
  const panel = activePanels[mode]

  const scan = useCallback(async (content: string) => {
    const trimmed = content.trim()

    if (!trimmed) {
      toast.error('Please enter content to scan.')
      return
    }

    if (trimmed.length > MAX_CHARS) {
      toast.error(`Input exceeds ${MAX_CHARS} character limit.`)
      return
    }

    setScanning(mode)

    try {
      const result = await scanContent(trimmed, mode)
      setResult(mode, result)

      const riskLabel: Record<string, string> = {
        CRITICAL: '🚨 Critical threat detected',
        HIGH:     '⚠️ High-risk content found',
        MEDIUM:   '⚡ Medium risk flagged',
        LOW:      '✔️ Low risk',
        SAFE:     '✅ Content appears safe',
      }
      toast(riskLabel[result.riskLevel] ?? 'Scan complete', {
        duration: 3000,
        style: {
          background: '#0E0E0E',
          color: '#F0EAD6',
          border: '1px solid rgba(201,168,76,0.3)',
        },
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(mode, message)
      toast.error(`Scan failed: ${message}`)
    }
  }, [mode, setScanning, setResult, setError])

  return {
    scan,
    status:     panel.status,
    result:     panel.result,
    error:      panel.error,
    isScanning: panel.status === 'scanning',
  }
}
