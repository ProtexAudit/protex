import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__logo">
        <motion.div
          className="app-header__logo-wrap"
          animate={{ filter: ['drop-shadow(0 0 6px rgba(201,168,76,0.35))', 'drop-shadow(0 0 16px rgba(201,168,76,0.7))', 'drop-shadow(0 0 6px rgba(201,168,76,0.35))'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="46" height="46" viewBox="0 0 100 100" fill="none">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#C9A84C"/>
            <polygon points="50,18 82,33 82,67 50,82 18,67 18,33" fill="#0E0E0E"/>
            <polyline points="32,52 44,64 68,38" stroke="#F0C040" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
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