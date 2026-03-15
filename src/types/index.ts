// ============================================================
// PROTEX — Core Type Definitions
// ============================================================

// ── Scan Modes ───────────────────────────────────────────────
export type ScanMode = 'scam' | 'link' | 'social'

// ── Risk Levels ──────────────────────────────────────────────
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE'

export const RISK_SCORE_THRESHOLDS: Record<RiskLevel, [number, number]> = {
  CRITICAL: [85, 100],
  HIGH:     [60, 84],
  MEDIUM:   [35, 59],
  LOW:      [10, 34],
  SAFE:     [0,  9],
}

// ── Scan Request ─────────────────────────────────────────────
export interface ScanRequest {
  content: string
  mode: ScanMode
  timestamp?: number
}

// ── Scan Result ──────────────────────────────────────────────
export interface ScanResult {
  id: string
  riskLevel: RiskLevel
  riskScore: number
  classification: string
  threats: string[]
  analysis: string
  recommendations: string[]
  metadata: ScanMetadata
}

export interface ScanMetadata {
  mode: ScanMode
  timestamp: number
  processingMs: number
  model: string
  inputLength: number
}

// ── History Entry ────────────────────────────────────────────
export interface HistoryEntry {
  id: string
  request: ScanRequest
  result: ScanResult
  createdAt: number
}

// ── Agent Stats ──────────────────────────────────────────────
export interface AgentStats {
  totalScans: number
  threatsDetected: number
  safeItems: number
  criticalAlerts: number
  avgResponseMs: number
}

// ── API ──────────────────────────────────────────────────────
export interface HermesMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface HermesRequest {
  model: string
  messages: HermesMessage[]
  max_tokens: number
  temperature?: number
  top_p?: number
}

export interface HermesResponse {
  id: string
  model: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ── UI State ─────────────────────────────────────────────────
export type ScanStatus = 'idle' | 'scanning' | 'done' | 'error'

export interface PanelState {
  status: ScanStatus
  result: ScanResult | null
  error: string | null
  inputValue: string
}

export interface AppState {
  activePanels: Record<ScanMode, PanelState>
  history: HistoryEntry[]
  stats: AgentStats
  activeTab: ScanMode | 'history'
}

// ── Example Presets ──────────────────────────────────────────
export interface ExamplePreset {
  label: string
  icon: string
  content: string
  mode: ScanMode
}
