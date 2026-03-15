import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__logo">
        <motion.div className="app-header__logo-wrap" animate={{ filter: ["drop-shadow(0 0 6px rgba(201,168,76,0.35))", "drop-shadow(0 0 16px rgba(201,168,76,0.7))", "drop-shadow(0 0 6px rgba(201,168,76,0.35))"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
            <path d="M23 2L44 12V28C44 36 34 43 23 46C12 43 2 36 2 28V12L23 2Z" fill="#C9A84C"/>
            <path d="M23 8L38 16V28C38 34 31 39 23 42C15 39 8 34 8 28V16L23 8Z" fill="#0E0E0E"/>
            <path d="M15 24L20 29L31 18" stroke="#F0C040" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <div>
          <div className="app-header__wordmark">PROTEX</div>
          <div className="app-header__tagline">AUTONOMOUS DIGITAL PROTECTION AGENT</div>
        </div>
      </div>
      <div className="app-header__status">
        <motion.span className="status-dot" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        AGENT ONLINE
      </div>
    </header>
  )
}
