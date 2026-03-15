// ============================================================
// PROTEX — HistoryPanel Component
// ============================================================

import { motion, AnimatePresence } from 'framer-motion'
import { useProtexStore }   from '@/services/store'
import { RiskBadge }        from './RiskBadge'
import { truncate, formatDate, exportReportAsJson } from '@/utils'
import type { HistoryEntry } from '@/types'

export function HistoryPanel() {
  const { history, clearHistory, setActiveTab } = useProtexStore(s => ({
    history:      s.history,
    clearHistory: s.clearHistory,
    setActiveTab: s.setActiveTab,
  }))

  function replayEntry(entry: HistoryEntry) {
    useProtexStore.getState().setInput(entry.request.mode, entry.request.content)
    useProtexStore.getState().setResult(entry.request.mode, entry.result)
    setActiveTab(entry.request.mode)
  }

  if (history.length === 0) {
    return (
      <div className="history-empty">
        <span className="history-empty__icon">📋</span>
        <p>No scans yet. Run an analysis to see history.</p>
      </div>
    )
  }

  return (
    <div className="history-panel">
      <div className="history-panel__toolbar">
        <span className="history-panel__count">{history.length} entries</span>
        <div className="history-panel__actions">
          <button
            className="history-btn"
            onClick={() => exportReportAsJson(history, 'protex-history')}
          >
            ↓ EXPORT ALL
          </button>
          <button className="history-btn history-btn--danger" onClick={clearHistory}>
            ✕ CLEAR
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {history.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="history-item"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => replayEntry(entry)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && replayEntry(entry)}
          >
            <span className="history-item__time">{formatDate(entry.createdAt)}</span>
            <span className="history-item__mode">{entry.request.mode.toUpperCase()}</span>
            <span className="history-item__preview">
              {truncate(entry.request.content, 60)}
            </span>
            <RiskBadge level={entry.result.riskLevel} size="sm" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
