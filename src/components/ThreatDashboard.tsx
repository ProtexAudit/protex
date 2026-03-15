// ============================================================
// PROTEX — ThreatDashboard Component
// Visual analytics: donut chart, bar chart, threat breakdown
// ============================================================

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useProtexStore } from '@/services/store'
import { getRiskColor } from '@/utils'
import type { RiskLevel } from '@/types'

// ── Donut Chart ───────────────────────────────────────────────
function DonutChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return (
    <div className="chart-empty">
      <span>No data yet</span>
    </div>
  )

  let offset = 0
  const R = 60
  const C = 2 * Math.PI * R
  const cx = 80
  const cy = 80

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {data.map((d, i) => {
        if (d.value === 0) return null
        const pct  = d.value / total
        const dash = pct * C
        const gap  = C - dash
        const rot  = offset * 360 - 90
        offset += pct

        return (
          <motion.circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={d.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            transform={`rotate(${rot} ${cx} ${cy})`}
            initial={{ strokeDasharray: `0 ${C}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
          />
        )
      })}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#F0EAD6"
        style={{ fontFamily: 'Share Tech Mono', fontSize: 22, fontWeight: 700 }}>
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#5A5240"
        style={{ fontFamily: 'Share Tech Mono', fontSize: 10 }}>
        TOTAL
      </text>
    </svg>
  )
}

// ── Bar Chart ─────────────────────────────────────────────────
function BarChart({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-chart__row">
          <span className="bar-chart__label">{d.label}</span>
          <div className="bar-chart__track">
            <motion.div
              className="bar-chart__fill"
              style={{ background: d.color }}
              initial={{ width: '0%' }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
            />
          </div>
          <span className="bar-chart__value" style={{ color: d.color }}>{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Threat Tag Cloud ──────────────────────────────────────────
function TagCloud({ tags }: { tags: Array<{ tag: string; count: number }> }) {
  if (tags.length === 0) return (
    <div className="chart-empty"><span>No threats detected yet</span></div>
  )

  const max = Math.max(...tags.map(t => t.count), 1)
  return (
    <div className="tag-cloud">
      {tags.slice(0, 12).map((t, i) => {
        const opacity = 0.4 + (t.count / max) * 0.6
        return (
          <motion.span
            key={i}
            className="tag-cloud__item"
            style={{ opacity }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity, scale: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            {t.tag} <span className="tag-cloud__count">{t.count}</span>
          </motion.span>
        )
      })}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export function ThreatDashboard() {
  const { history, stats } = useProtexStore(s => ({ history: s.history, stats: s.stats }))

  // Risk distribution
  const riskDist = useMemo(() => {
    const counts: Record<RiskLevel, number> = {
      CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, SAFE: 0,
    }
    history.forEach(h => { counts[h.result.riskLevel]++ })
    return [
      { label: 'CRITICAL', value: counts.CRITICAL, color: '#E5453A' },
      { label: 'HIGH',     value: counts.HIGH,     color: '#E89B2A' },
      { label: 'MEDIUM',   value: counts.MEDIUM,   color: '#4A9EDF' },
      { label: 'LOW',      value: counts.LOW,       color: '#3DB87A' },
      { label: 'SAFE',     value: counts.SAFE,      color: '#2A6B4A' },
    ]
  }, [history])

  // Mode distribution
  const modeDist = useMemo(() => {
    const counts = { scam: 0, link: 0, social: 0 }
    history.forEach(h => { counts[h.request.mode]++ })
    return [
      { label: 'SCAM DETECT',   value: counts.scam,   color: '#C9A84C' },
      { label: 'LINK ANALYZER', value: counts.link,   color: '#4A9EDF' },
      { label: 'SOCIAL MANIP',  value: counts.social, color: '#E5453A' },
    ]
  }, [history])

  // Top threat tags
  const topTags = useMemo(() => {
    const tagCount: Record<string, number> = {}
    history.forEach(h => {
      h.result.threats.forEach(t => {
        if (t !== 'NO_THREATS_DETECTED') {
          tagCount[t] = (tagCount[t] ?? 0) + 1
        }
      })
    })
    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [history])

  // Recent scans (last 7)
  const recentScores = useMemo(() =>
    history.slice(0, 7).reverse().map((h, i) => ({
      label: `#${i + 1}`,
      value: h.result.riskScore,
      color: getRiskColor(h.result.riskLevel),
    }))
  , [history])

  const threatRate = stats.totalScans > 0
    ? Math.round((stats.threatsDetected / stats.totalScans) * 100)
    : 0

  return (
    <div className="dashboard">

      {/* KPI Row */}
      <div className="dashboard__kpi-row">
        {[
          { label: 'Total Scans',    value: stats.totalScans,      color: '#C9A84C' },
          { label: 'Threats',        value: stats.threatsDetected, color: '#E5453A' },
          { label: 'Safe',           value: stats.safeItems,       color: '#3DB87A' },
          { label: 'Critical',       value: stats.criticalAlerts,  color: '#E5453A' },
          { label: 'Threat Rate',    value: `${threatRate}%`,      color: '#E89B2A' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            className="dashboard__kpi-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="dashboard__kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="dashboard__kpi-label">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="dashboard__charts-row">

        {/* Donut — Risk Distribution */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-title">RISK DISTRIBUTION</div>
          <div className="dashboard__chart-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DonutChart data={riskDist} />
            <div className="dashboard__legend">
              {riskDist.map((d, i) => (
                <div key={i} className="dashboard__legend-item">
                  <span className="dashboard__legend-dot" style={{ background: d.color }} />
                  <span className="dashboard__legend-label">{d.label}</span>
                  <span className="dashboard__legend-val" style={{ color: d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar — Scan Mode */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-title">SCAN TYPES</div>
          <div className="dashboard__chart-body">
            <BarChart data={modeDist} />
          </div>
        </div>

      </div>

      {/* Risk Score Trend */}
      {recentScores.length > 0 && (
        <div className="dashboard__chart-card" style={{ marginTop: 14 }}>
          <div className="dashboard__chart-title">RECENT RISK SCORES</div>
          <div className="dashboard__chart-body">
            <BarChart data={recentScores} />
          </div>
        </div>
      )}

      {/* Tag Cloud */}
      <div className="dashboard__chart-card" style={{ marginTop: 14 }}>
        <div className="dashboard__chart-title">TOP THREATS</div>
        <div className="dashboard__chart-body">
          <TagCloud tags={topTags} />
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="history-empty" style={{ marginTop: 32 }}>
          <span className="history-empty__icon">📊</span>
          <p>No data yet. Run a scan to populate the dashboard.</p>
        </div>
      )}

    </div>
  )
}
