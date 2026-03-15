// ============================================================
// PROTEX — ResultCard Component
// Displays full scan analysis output
// ============================================================

import { motion } from 'framer-motion'
import { RiskBadge }  from './RiskBadge'
import { ScoreBar }   from './ScoreBar'
import { exportReportAsJson, formatTime } from '@/utils'
import type { ScanResult } from '@/types'

interface ResultCardProps {
  result: ScanResult
}

export function ResultCard({ result }: ResultCardProps) {
  const { riskLevel, riskScore, classification, threats, analysis, recommendations, metadata } = result

  return (
    <div className="result-card">
      {/* Header */}
      <div className="result-card__header">
        <span className="result-card__label">⬡ PROTEX ANALYSIS COMPLETE</span>
        <div className="result-card__meta">
          <span className="result-card__timing">{formatTime(metadata.processingMs)}</span>
          <RiskBadge level={riskLevel} />
        </div>
      </div>

      {/* Body */}
      <div className="result-card__body">
        {/* Score */}
        <ScoreBar level={riskLevel} score={riskScore} classification={classification} />

        {/* Threat Tags */}
        {threats.length > 0 && (
          <div className="threat-tags">
            {threats.map(tag => (
              <motion.span
                key={tag}
                className="threat-tag"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Analysis */}
        <div className="result-card__section">
          <h4 className="result-card__section-title">ANALYSIS</h4>
          <p className="result-card__analysis">{analysis}</p>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="result-card__section">
            <h4 className="result-card__section-title">RECOMMENDATIONS</h4>
            <ul className="result-card__recommendations">
              {recommendations.map((rec, i) => (
                <li key={i} className="result-card__rec-item">
                  <span className="result-card__rec-icon">›</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="result-card__footer">
          <span className="result-card__model">MODEL: {metadata.model.split('/').pop()?.toUpperCase()}</span>
          <span className="result-card__chars">{metadata.inputLength} chars analyzed</span>
          <button
            className="result-card__export-btn"
            onClick={() => exportReportAsJson(result, 'protex-report')}
            title="Export JSON report"
          >
            ↓ EXPORT
          </button>
        </div>
      </div>
    </div>
  )
}
