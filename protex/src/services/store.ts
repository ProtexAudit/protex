// ============================================================
// PROTEX — Global State Store (Zustand)
// ============================================================

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type {
  AppState,
  ScanMode,
  ScanResult,
  HistoryEntry,
  PanelState,
} from '@/types'
import { generateId } from '@/utils/id'

// ── Initial Panel State ───────────────────────────────────────
const defaultPanel = (): PanelState => ({
  status: 'idle',
  result: null,
  error: null,
  inputValue: '',
})

// ── Store Interface ───────────────────────────────────────────
interface ProtexStore extends AppState {
  // Panel actions
  setInput:   (mode: ScanMode, value: string) => void
  setScanning:(mode: ScanMode) => void
  setResult:  (mode: ScanMode, result: ScanResult) => void
  setError:   (mode: ScanMode, error: string) => void
  resetPanel: (mode: ScanMode) => void

  // Tab
  setActiveTab: (tab: AppState['activeTab']) => void

  // History
  clearHistory: () => void

  // Stats
  resetStats: () => void
}

// ── Store ─────────────────────────────────────────────────────
export const useProtexStore = create<ProtexStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Initial State ──────────────────────────────────────
        activeTab: 'scam',
        activePanels: {
          scam:   defaultPanel(),
          link:   defaultPanel(),
          social: defaultPanel(),
        },
        history: [],
        stats: {
          totalScans:    0,
          threatsDetected: 0,
          safeItems:     0,
          criticalAlerts: 0,
          avgResponseMs: 0,
        },

        // ── Panel Actions ─────────────────────────────────────
        setInput: (mode, value) =>
          set(s => ({
            activePanels: {
              ...s.activePanels,
              [mode]: { ...s.activePanels[mode], inputValue: value },
            },
          })),

        setScanning: (mode) =>
          set(s => ({
            activePanels: {
              ...s.activePanels,
              [mode]: { ...s.activePanels[mode], status: 'scanning', error: null },
            },
          })),

        setResult: (mode, result) => {
          const state = get()
          const isThreat = ['CRITICAL', 'HIGH', 'MEDIUM'].includes(result.riskLevel)
          const prevAvg  = state.stats.avgResponseMs
          const prevTotal = state.stats.totalScans
          const newAvg = prevTotal === 0
            ? result.metadata.processingMs
            : Math.round((prevAvg * prevTotal + result.metadata.processingMs) / (prevTotal + 1))

          const entry: HistoryEntry = {
            id:        generateId(),
            request:   { content: state.activePanels[mode].inputValue, mode },
            result,
            createdAt: Date.now(),
          }

          set(s => ({
            activePanels: {
              ...s.activePanels,
              [mode]: { ...s.activePanels[mode], status: 'done', result, error: null },
            },
            history: [entry, ...s.history].slice(0, 50),
            stats: {
              totalScans:      s.stats.totalScans + 1,
              threatsDetected: s.stats.threatsDetected + (isThreat ? 1 : 0),
              safeItems:       s.stats.safeItems      + (isThreat ? 0 : 1),
              criticalAlerts:  s.stats.criticalAlerts + (result.riskLevel === 'CRITICAL' ? 1 : 0),
              avgResponseMs:   newAvg,
            },
          }))
        },

        setError: (mode, error) =>
          set(s => ({
            activePanels: {
              ...s.activePanels,
              [mode]: { ...s.activePanels[mode], status: 'error', error },
            },
          })),

        resetPanel: (mode) =>
          set(s => ({
            activePanels: { ...s.activePanels, [mode]: defaultPanel() },
          })),

        // ── Tab ───────────────────────────────────────────────
        setActiveTab: (tab) => set({ activeTab: tab }),

        // ── History ───────────────────────────────────────────
        clearHistory: () => set({ history: [] }),

        // ── Stats ─────────────────────────────────────────────
        resetStats: () =>
          set({
            stats: {
              totalScans: 0, threatsDetected: 0, safeItems: 0,
              criticalAlerts: 0, avgResponseMs: 0,
            },
          }),
      }),
      {
        name: 'protex-storage',
        partialize: (s) => ({ history: s.history, stats: s.stats }),
      }
    ),
    { name: 'ProtexStore' }
  )
)
