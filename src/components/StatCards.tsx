// ============================================================
// PROTEX — StatCards Component
// Live agent performance counters
// ============================================================

import { motion } from 'framer-motion'
import { useProtexStore } from '@/services/store'
import { formatTime } from '@/utils'

export function StatCards() {
  const stats = useProtexStore(s => s.stats)

  const cards = [
    { label: 'Scans Run',       value: stats.totalScans,      suffix: '' },
    { label: 'Threats Found',   value: stats.threatsDetected, suffix: '' },
    { label: 'Safe Items',      value: stats.safeItems,       suffix: '' },
    { label: 'Critical Alerts', value: stats.criticalAlerts,  suffix: '' },
    { label: 'Avg Response',    value: stats.avgResponseMs > 0 ? formatTime(stats.avgResponseMs) : '—', suffix: '', raw: true },
  ]

  return (
    <div className="stat-cards">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="stat-card__value">
            {card.raw ? card.value : (
              <motion.span
                key={String(card.value)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {card.value}
              </motion.span>
            )}
          </div>
          <div className="stat-card__label">{card.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
