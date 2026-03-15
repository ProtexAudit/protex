// ============================================================
// PROTEX — TabBar Component
// ============================================================

import { motion } from 'framer-motion'
import { useProtexStore } from '@/services/store'
import type { AppState } from '@/types'

type Tab = AppState['activeTab']

const TABS: Array<{ id: Tab; icon: string; label: string }> = [
  { id: 'scam',    icon: '⚠',  label: 'Scam Detect'  },
  { id: 'link',    icon: '🔗', label: 'Link Analyzer' },
  { id: 'social',  icon: '🎭', label: 'Social Manip'  },
  { id: 'history', icon: '📋', label: 'History'       },
]

export function TabBar() {
  const { activeTab, setActiveTab } = useProtexStore(s => ({
    activeTab:    s.activeTab,
    setActiveTab: s.setActiveTab,
  }))

  return (
    <nav className="tab-bar" role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-btn__icon">{tab.icon}</span>
          <span className="tab-btn__label">{tab.label.toUpperCase()}</span>
          {activeTab === tab.id && (
            <motion.div
              className="tab-btn__indicator"
              layoutId="tab-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
