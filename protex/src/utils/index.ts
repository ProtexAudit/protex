// ============================================================
// PROTEX — Utility Functions
// ============================================================

import type { RiskLevel } from '@/types'

// ── ID Generator ─────────────────────────────────────────────
export function generateId(): string {
  return `ptx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

// ── Risk Helpers ─────────────────────────────────────────────
export const RISK_COLORS: Record<RiskLevel, string> = {
  CRITICAL: '#E5453A',
  HIGH:     '#E89B2A',
  MEDIUM:   '#4A9EDF',
  LOW:      '#3DB87A',
  SAFE:     '#3DB87A',
}

export const RISK_BAR_PCT: Record<RiskLevel, number> = {
  CRITICAL: 95,
  HIGH:     75,
  MEDIUM:   50,
  LOW:      25,
  SAFE:     5,
}

export const RISK_CSS_CLASS: Record<RiskLevel, string> = {
  CRITICAL: 'risk-critical',
  HIGH:     'risk-high',
  MEDIUM:   'risk-medium',
  LOW:      'risk-low',
  SAFE:     'risk-safe',
}

export function getRiskColor(level: RiskLevel): string {
  return RISK_COLORS[level] ?? '#9A8F72'
}

export function getRiskBarPct(level: RiskLevel): number {
  return RISK_BAR_PCT[level] ?? 5
}

// ── String Helpers ────────────────────────────────────────────
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return `${str.slice(0, maxLen)}…`
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp))
}

// ── Validation ────────────────────────────────────────────────
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 5000)
}

// ── Export Report ─────────────────────────────────────────────
export function exportReportAsJson(data: unknown, filename = 'protex-report'): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${filename}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
