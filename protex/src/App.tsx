// ============================================================
// PROTEX — App Root
// ============================================================

import { Toaster } from 'react-hot-toast'
import { Header }      from '@/components/Header'
import { StatCards }   from '@/components/StatCards'
import { TabBar }      from '@/components/TabBar'
import { ScanPanel }   from '@/components/ScanPanel'
import { HistoryPanel }from '@/components/HistoryPanel'
import { useProtexStore } from '@/services/store'
import '@/styles/globals.css'

export default function App() {
  const activeTab = useProtexStore(s => s.activeTab)

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <Header />
      <StatCards />
      <TabBar />

      <main className="panels-container">
        {activeTab === 'scam'    && <ScanPanel mode="scam"   />}
        {activeTab === 'link'    && <ScanPanel mode="link"   />}
        {activeTab === 'social'  && <ScanPanel mode="social" />}
        {activeTab === 'history' && <HistoryPanel />}
      </main>

      <footer className="app-footer">
        <span>PROTEX v1.0 · HACKATHON BUILD</span>
        <span>NEURAL THREAT ENGINE · HERMES-4-70B</span>
        <span>ENCRYPTED SESSION</span>
      </footer>
    </div>
  )
}
