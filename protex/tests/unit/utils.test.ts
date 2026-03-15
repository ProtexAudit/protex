// ============================================================
// PROTEX — Unit Tests: Utilities
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  getRiskColor,
  getRiskBarPct,
  truncate,
  formatTime,
  isValidUrl,
  sanitizeInput,
} from '@/utils'
import type { RiskLevel } from '@/types'

describe('getRiskColor', () => {
  it('returns red for CRITICAL', () => {
    expect(getRiskColor('CRITICAL')).toBe('#E5453A')
  })
  it('returns amber for HIGH', () => {
    expect(getRiskColor('HIGH')).toBe('#E89B2A')
  })
  it('returns green for SAFE', () => {
    expect(getRiskColor('SAFE')).toBe('#3DB87A')
  })
})

describe('getRiskBarPct', () => {
  const cases: Array<[RiskLevel, number]> = [
    ['CRITICAL', 95],
    ['HIGH',     75],
    ['MEDIUM',   50],
    ['LOW',      25],
    ['SAFE',      5],
  ]
  it.each(cases)('returns %i for %s', (level, expected) => {
    expect(getRiskBarPct(level)).toBe(expected)
  })
})

describe('truncate', () => {
  it('returns string unchanged when under limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })
  it('truncates and appends ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello…')
  })
  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('formatTime', () => {
  it('shows ms for under 1000', () => {
    expect(formatTime(450)).toBe('450ms')
  })
  it('shows seconds for 1000+', () => {
    expect(formatTime(1500)).toBe('1.5s')
  })
})

describe('isValidUrl', () => {
  it('validates real URL', () => {
    expect(isValidUrl('https://google.com')).toBe(true)
  })
  it('rejects plain text', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })
  it('validates http', () => {
    expect(isValidUrl('http://example.xyz/login')).toBe(true)
  })
})

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })
  it('enforces 5000 char limit', () => {
    const long = 'a'.repeat(6000)
    expect(sanitizeInput(long).length).toBe(5000)
  })
})
