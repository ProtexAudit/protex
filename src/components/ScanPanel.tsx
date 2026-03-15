// ============================================================
// PROTEX — ScanPanel Component
// Main interaction panel for each scan mode
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScan }         from '@/hooks/useScan'
import { useProtexStore }  from '@/services/store'
import { ResultCard }      from './ResultCard'
import { LoadingSpinner }  from './LoadingSpinner'
import { getPresetsForMode } from '@/utils/presets'
import type { ScanMode } from '@/types'

const PLACEHOLDERS: Record<ScanMode, string> = {
  scam:   'Paste email, SMS, or DM text here for threat analysis...',
  link:   'Paste a URL, link, or domain to analyze...\n\ne.g. http://secure-paypal-login.xyz/verify',
  social: 'Paste WhatsApp message, DM, or email to detect manipulation tactics...',
}

const BUTTON_LABELS: Record<ScanMode, string> = {
  scam:   '⬡ SCAN MESSAGE',
  link:   '⬡ ANALYZE LINK',
  social: '⬡ DETECT TACTICS',
}

interface ScanPanelProps {
  mode: ScanMode
}

export function ScanPanel({ mode }: ScanPanelProps) {
  const [input, setInput] = useState('')
  const { scan, isScanning, result, error } = useScan(mode)
  const setStoreInput = useProtexStore(s => s.setInput)
  const presets = getPresetsForMode(mode)

  function handleInput(value: string) {
    setInput(value)
    setStoreInput(mode, value)
  }

  function handlePreset(content: string) {
    handleInput(content)
  }

  return (
    <div className="scan-panel">
      {/* Presets */}
      <div className="presets-row">
        {presets.map(preset => (
          <button
            key={preset.label}
            className="preset-chip"
            onClick={() => handlePreset(preset.content)}
          >
            {preset.icon} {preset.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="input-wrap">
        <textarea
          className="scan-textarea"
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder={PLACEHOLDERS[mode]}
          disabled={isScanning}
          maxLength={5000}
        />
      </div>

      {/* Actions */}
      <div className="btn-row">
        <span className="char-count">{input.length} / 5000</span>
        <button
          className="scan-btn"
          onClick={() => scan(input)}
          disabled={isScanning || !input.trim()}
        >
          {isScanning ? <LoadingSpinner size={16} /> : null}
          {isScanning ? 'SCANNING...' : BUTTON_LABELS[mode]}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-banner"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
