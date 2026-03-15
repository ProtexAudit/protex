// ============================================================
// PROTEX — App Root (v1.1 Enhanced)
// Added: Screenshot Scanner + Threat Dashboard
// ============================================================

import { Toaster }           from 'react-hot-toast'
import { Header }            from '@/components/Header'
import { StatCards }         from '@/components/StatCards'
import { ScanPanel }         from '@/components/ScanPanel'
import { HistoryPanel }      from '@/components/HistoryPanel'
import { ScreenshotScanner } from '@/components/ScreenshotScanner'
import { ThreatDashboard }   from '@/components/ThreatDashboard'
import { useProtexStore }    from '@/services/store'
import { motion, AnimatePresence } from 'framer-motion'
import '@/styles/globals.css'
import '@/styles/enhanced.css'

type Tab = 'scam' | 'link' | 'social' | 'screenshot' | 'dashboard' | 'history'

const TABS: Array<{ id: Tab; icon: string; label: string }> = [
  { id: 'scam',       icon: '⚠',  label: 'Scam Detect'   },
  { id: 'link',       icon: '🔗', label: 'Link Analyzer'  },
  { id: 'social',     icon: '🎭', label: 'Social Manip'   },
  { id: 'screenshot', icon: '📸', label: 'Screenshot'     },
  { id: 'dashboard',  icon: '📊', label: 'Dashboard'      },
  { id: 'history',    icon: '📋', label: 'History'        },
]

export default function App() {
  const { activeTab, setActiveTab } = useProtexStore(s => ({
    activeTab:    s.activeTab as Tab,
    setActiveTab: s.setActiveTab,
  }))

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <Header />
      <StatCards />

      {/* Tab Bar */}
      <nav className="tab-bar" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id as never)}
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

      {/* Panels */}
      <main className="panels-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'scam'       && <ScanPanel mode="scam"   />}
            {activeTab === 'link'       && <ScanPanel mode="link"   />}
            {activeTab === 'social'     && <ScanPanel mode="social" />}
            {activeTab === 'screenshot' && <ScreenshotScanner />}
            {activeTab === 'dashboard'  && <ThreatDashboard />}
            {activeTab === 'history'    && <HistoryPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <span>PROTEX v1.1 · HACKATHON BUILD</span>
        <a href="https://x.com/protex_audit" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1 }}>🐦 @protex_audit</a>
        <a href="https://protex-agent.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ts)', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1 }}>protex-agent.vercel.app</a>
      </footer>
    </div>
  )
}
