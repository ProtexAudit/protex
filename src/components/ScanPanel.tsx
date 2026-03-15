// ============================================================
// PROTEX — ScanPanel v1.2
// Added: Animated progress bar + CRITICAL glitch effect
// ============================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScan }           from '@/hooks/useScan'
import { useProtexStore }    from '@/services/store'
import { ResultCard }        from './ResultCard'
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

// ── Progress steps shown during scan ─────────────────────────
const PROGRESS_STEPS = [
  { pct: 15, label: 'Initializing neural engine...'   },
  { pct: 30, label: 'Tokenizing input patterns...'    },
  { pct: 50, label: 'Querying Hermes-4-70B...'        },
  { pct: 70, label: 'Analyzing threat vectors...'     },
  { pct: 88, label: 'Calculating risk score...'       },
  { pct: 97, label: 'Generating recommendations...'   },
]

// ── Animated Progress Bar ─────────────────────────────────────
function ScanProgress({ isScanning }: { isScanning: boolean }) {
  const [step, setStep]       = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isScanning) {
      setStep(0)
      setProgress(0)
      return
    }
    setStep(0)
    setProgress(0)

    const intervals: ReturnType<typeof setTimeout>[] = []
    PROGRESS_STEPS.forEach((s, i) => {
      const t = setTimeout(() => {
        setStep(i)
        setProgress(s.pct)
      }, i * 600)
      intervals.push(t)
    })
    return () => intervals.forEach(clearTimeout)
  }, [isScanning])

  if (!isScanning) return null

  const current = PROGRESS_STEPS[step]

  return (
    <motion.div
      className="scan-progress"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="scan-progress__header">
        <span className="scan-progress__label">{current?.label ?? 'Processing...'}</span>
        <span className="scan-progress__pct">{progress}%</span>
      </div>
      <div className="scan-progress__track">
        <motion.div
          className="scan-progress__fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <div className="scan-progress__glow" style={{ left: `${progress}%` }} />
      </div>
      <div className="scan-progress__steps">
        {PROGRESS_STEPS.map((s, i) => (
          <div
            key={i}
            className={`scan-progress__dot ${i <= step ? 'scan-progress__dot--active' : ''}`}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Main ScanPanel ────────────────────────────────────────────
interface ScanPanelProps { mode: ScanMode }

export function ScanPanel({ mode }: ScanPanelProps) {
  const [input, setInput]   = useState('')
  const { scan, isScanning, result, error } = useScan(mode)
  const setStoreInput = useProtexStore(s => s.setInput)
  const presets       = getPresetsForMode(mode)

  const isCritical = result?.riskLevel === 'CRITICAL'

  function handleInput(value: string) {
    setInput(value)
    setStoreInput(mode, value)
  }

  return (
    <div className={`scan-panel ${isCritical ? 'scan-panel--critical' : ''}`}>

      {/* CRITICAL glitch overlay */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            className="critical-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0, 0.1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Presets */}
      <div className="presets-row">
        {presets.map(preset => (
          <button key={preset.label} className="preset-chip" onClick={() => handleInput(preset.content)}>
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
          className={`scan-btn ${isScanning ? 'scan-btn--scanning' : ''}`}
          onClick={() => scan(input)}
          disabled={isScanning || !input.trim()}
        >
          {isScanning
            ? <><span className="scan-btn__pulse" />SCANNING...</>
            : BUTTON_LABELS[mode]
          }
        </button>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isScanning && <ScanProgress isScanning={isScanning} />}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div className="error-banner" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
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
            className={isCritical ? 'result-critical-wrap' : ''}
          >
            <ResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
