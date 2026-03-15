// ============================================================
// PROTEX — Header Component
// ============================================================

import { motion } from 'framer-motion'
import protexLogo from '@/assets/logo.webp'

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__logo">
        <motion.div
          className="app-header__logo-wrap"
          animate={{ filter: ['drop-shadow(0 0 6px rgba(201,168,76,0.35))', 'drop-shadow(0 0 16px rgba(201,168,76,0.7))', 'drop-shadow(0 0 6px rgba(201,168,76,0.35))'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src={protexLogo} alt="Protex Shield" className="app-header__logo-img" />
        </motion.div>
        <div>
          <div className="app-header__wordmark">PROTEX</div>
          <div className="app-header__tagline">AUTONOMOUS DIGITAL PROTECTION AGENT</div>
        </div>
      </div>

      <div className="app-header__status">
        <motion.span
          className="status-dot"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        AGENT ONLINE
      </div>
    </header>
  )
}
