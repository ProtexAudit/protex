// ============================================================
// PROTEX — App Root v1.2
// Clean: no screenshot tab
// New: typing animation, live threat ticker, agent status
// ============================================================

import { useState, useEffect } from 'react'
import { Toaster }          from 'react-hot-toast'
import { Header }           from '@/components/Header'
import { StatCards }        from '@/components/StatCards'
import { ScanPanel }        from '@/components/ScanPanel'
import { HistoryPanel }     from '@/components/HistoryPanel'
import { ThreatDashboard }  from '@/components/ThreatDashboard'
import { useProtexStore }   from '@/services/store'
import { motion, AnimatePresence } from 'framer-motion'
import '@/styles/globals.css'
import '@/styles/enhanced.css'
import '@/styles/agent.css'
import { AgentBackground } from '@/components/AgentBackground'

const AGENT_MESSAGES = [
  'Neural threat engine active...',
  'Scanning for phishing patterns...',
  'Hermes-4-70B model loaded...',
  'Monitoring social manipulation...',
  'Link reputation database synced...',
  'Real-time scam detection ready...',
  'Threat intelligence updated...',
  'Agent standing by...',
]

const FEED_ITEMS = [
  { type: 'CRITICAL', label: 'CREDENTIAL_HARVESTING detected', ago: '2s ago' },
  { type: 'HIGH',     label: 'DOMAIN_SPOOFING blocked',        ago: '8s ago' },
  { type: 'SAFE',     label: 'github.com verified clean',      ago: '15s ago' },
  { type: 'CRITICAL', label: 'PHISHING email intercepted',     ago: '23s ago' },
  { type: 'HIGH',     label: 'URGENCY_TRIGGER flagged',        ago: '31s ago' },
  { type: 'SAFE',     label: 'openrouter.ai verified clean',   ago: '40s ago' },
  { type: 'CRITICAL', label: 'IMPERSONATION attempt stopped',  ago: '48s ago' },
  { type: 'HIGH',     label: 'SUSPICIOUS_TLD blocked',         ago: '55s ago' },
  { type: 'CRITICAL', label: 'ROMANCE_SCAM pattern detected',  ago: '1m ago'  },
]

function AgentStatus() {
  const stats = useProtexStore(s => s.stats)
  const [uptime, setUptime] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const fmt = (s: number) => `${Math.floor(s/60)}m ${(s%60).toString().padStart(2,'0')}s`
  return (
    <div className="agent-status">
      <div className="agent-status__row"><span className="agent-status__label">NEURAL ENGINE</span><span className="agent-status__val agent-status__val--live">● LIVE</span></div>
      <div className="agent-status__row"><span className="agent-status__label">HERMES-4-70B</span><span className="agent-status__val agent-status__val--live">● HOT</span></div>
      <div className="agent-status__row"><span className="agent-status__label">THREAT DB</span><span className="agent-status__val agent-status__val--live">● SYNC</span></div>
      <div className="agent-status__row"><span className="agent-status__label">AVG RESPONSE</span><span className="agent-status__val" style={{color:'var(--gold)'}}>{stats.avgResponseMs > 0 ? `${(stats.avgResponseMs/1000).toFixed(1)}s` : '--'}</span></div>
      <div className="agent-status__row"><span className="agent-status__label">SESSION</span><span className="agent-status__val" style={{color:'var(--ts)'}}>{fmt(uptime)}</span></div>
      <div className="agent-status__row"><span className="agent-status__label">TOTAL SCANS</span><span className="agent-status__val" style={{color:'var(--gold)'}}>{stats.totalScans}</span></div>
    </div>
  )
}

function ThreatTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FEED_ITEMS.length), 2500)
    return () => clearInterval(t)
  }, [])
  const item = FEED_ITEMS[idx]
  const color = item.type === 'CRITICAL' ? 'var(--red)' : item.type === 'HIGH' ? 'var(--warn)' : 'var(--grn)'
  return (
    <div className="threat-ticker">
      <span className="threat-ticker__label">⬡ LIVE FEED</span>
      <AnimatePresence mode="wait">
        <motion.div key={idx} className="threat-ticker__item" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.3}}>
          <span className="threat-ticker__type" style={{color}}>{item.type}</span>
          <span className="threat-ticker__text">{item.label}</span>
          <span className="threat-ticker__ago">{item.ago}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function TypingAgent() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  useEffect(() => {
    const msg = AGENT_MESSAGES[msgIdx]
    if (typing) {
      if (displayed.length < msg.length) {
        const t = setTimeout(() => setDisplayed(msg.slice(0, displayed.length + 1)), 45)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 18)
        return () => clearTimeout(t)
      } else {
        setMsgIdx(i => (i + 1) % AGENT_MESSAGES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, msgIdx])
  return (
    <div className="typing-agent">
      <span className="typing-agent__prefix">PROTEX &rsaquo;</span>
      <span className="typing-agent__text">{displayed}</span>
      <span className="typing-agent__cursor">▋</span>
    </div>
  )
}

type Tab = 'scam' | 'link' | 'social' | 'dashboard' | 'history'

const TABS: Array<{id: Tab; icon: string; label: string}> = [
  { id: 'scam',      icon: '⚠',  label: 'Scam Detect'  },
  { id: 'link',      icon: '🔗', label: 'Link Analyzer' },
  { id: 'social',    icon: '🎭', label: 'Social Manip'  },
  { id: 'dashboard', icon: '📊', label: 'Dashboard'     },
  { id: 'history',   icon: '📋', label: 'History'       },
]

export default function App() {
  const { activeTab, setActiveTab } = useProtexStore(s => ({
    activeTab:    s.activeTab as Tab,
    setActiveTab: s.setActiveTab,
  }))

  return (
    <div className="app-shell">
      <AgentBackground />
      <Toaster position="top-right" />
      <Header />
      <TypingAgent />
      <ThreatTicker />
      <StatCards />

      <div className="app-body">
        <aside className="app-sidebar">
          <div className="sidebar-title">⬡ AGENT STATUS</div>
          <AgentStatus />
        </aside>

        <div className="app-content">
          <nav className="tab-bar" role="tablist">
            {TABS.map(tab => (
              <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
                onClick={() => setActiveTab(tab.id as never)}>
                <span className="tab-btn__icon">{tab.icon}</span>
                <span className="tab-btn__label">{tab.label.toUpperCase()}</span>
                {activeTab === tab.id && (
                  <motion.div className="tab-btn__indicator" layoutId="tab-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
              </button>
            ))}
          </nav>

          <main className="panels-container">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.18}}>
                {activeTab === 'scam'      && <ScanPanel mode="scam"   />}
                {activeTab === 'link'      && <ScanPanel mode="link"   />}
                {activeTab === 'social'    && <ScanPanel mode="social" />}
                {activeTab === 'dashboard' && <ThreatDashboard />}
                {activeTab === 'history'   && <HistoryPanel />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <footer className="app-footer">
        <span>PROTEX v1.2 · HACKATHON BUILD</span>
        <span>BUILT ON HERMES-4-70B</span>
        <a href="https://x.com/protex_audit" target="_blank" rel="noopener noreferrer"
          style={{color:'var(--gold)',textDecoration:'none',fontFamily:'var(--mono)',fontSize:10,letterSpacing:1}}>
          🐦 @protex_audit
        </a>
      </footer>
    </div>
  )
}
