// ============================================================
// PROTEX — LoadingSpinner Component
// ============================================================

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: number
  color?: string
}

export function LoadingSpinner({ size = 20, color = 'var(--gold)' }: LoadingSpinnerProps) {
  return (
    <motion.span
      style={{
        display: 'inline-block',
        width:   size,
        height:  size,
        borderRadius: '50%',
        border: `2px solid rgba(201,168,76,0.2)`,
        borderTopColor: color,
        flexShrink: 0,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
      aria-label="Loading"
    />
  )
}
