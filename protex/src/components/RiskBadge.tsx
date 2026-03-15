// ============================================================
// PROTEX — RiskBadge Component
// ============================================================

import type { RiskLevel } from '@/types'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
}

const CLASS_MAP: Record<RiskLevel, string> = {
  CRITICAL: 'risk-badge--critical',
  HIGH:     'risk-badge--high',
  MEDIUM:   'risk-badge--medium',
  LOW:      'risk-badge--low',
  SAFE:     'risk-badge--safe',
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  return (
    <span className={`risk-badge risk-badge--${size} ${CLASS_MAP[level]}`}>
      {level} RISK
    </span>
  )
}
