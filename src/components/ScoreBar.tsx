// ============================================================
// PROTEX — ScoreBar Component
// Animated threat score with progress bar
// ============================================================

import { motion } from 'framer-motion'
import { getRiskColor, getRiskBarPct } from '@/utils'
import type { RiskLevel } from '@/types'

interface ScoreBarProps {
  level:          RiskLevel
  score:          number
  classification: string
}

export function ScoreBar({ level, score, classification }: ScoreBarProps) {
  const color = getRiskColor(level)
  const pct   = getRiskBarPct(level)

  return (
    <div className="score-bar">
      <div className="score-bar__num" style={{ color }}>{score}</div>

      <div className="score-bar__details">
        <div className="score-bar__label">
          THREAT SCORE{' '}
          <span style={{ color, fontWeight: 700 }}>{score}/100</span>
        </div>

        <div className="score-bar__track">
          <motion.div
            className="score-bar__fill"
            style={{ background: color }}
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>

        <div className="score-bar__classification">
          Classification: {classification}
        </div>
      </div>
    </div>
  )
}
