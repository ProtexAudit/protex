// ============================================================
// PROTEX — Integration Tests: Hermes API Client
// Uses mocked fetch to test parsing and error handling
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scanContent } from '@/api/hermes'

const MOCK_RESULT = {
  riskLevel:       'HIGH',
  riskScore:       72,
  classification:  'Phishing Attempt',
  threats:         ['DOMAIN_SPOOFING', 'CREDENTIAL_HARVESTING'],
  analysis:        'The URL uses a deceptive subdomain pattern mimicking PayPal.',
  recommendations: ['Do not click this link', 'Report to security team', 'Delete the message'],
}

function makeMockResponse(content: string) {
  return {
    ok: true,
    json: async () => ({
      id: 'test-id',
      model: 'nousresearch/hermes-4-70b',
      choices: [{ message: { role: 'assistant', content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 100, completion_tokens: 80, total_tokens: 180 },
    }),
  }
}

describe('scanContent — link mode', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'test-key-123')
    vi.stubEnv('VITE_HERMES_MODEL', 'nousresearch/hermes-4-70b')
  })

  it('parses a valid JSON response from the model', async () => {
    global.fetch = vi.fn().mockResolvedValue(makeMockResponse(JSON.stringify(MOCK_RESULT)))

    const result = await scanContent('http://secure-paypal-login.xyz', 'link')

    expect(result.riskLevel).toBe('HIGH')
    expect(result.riskScore).toBe(72)
    expect(result.threats).toContain('DOMAIN_SPOOFING')
    expect(result.metadata.mode).toBe('link')
    expect(result.metadata.model).toBe('nousresearch/hermes-4-70b')
  })

  it('handles JSON wrapped in markdown code fences', async () => {
    const withFences = '```json\n' + JSON.stringify(MOCK_RESULT) + '\n```'
    global.fetch = vi.fn().mockResolvedValue(makeMockResponse(withFences))

    const result = await scanContent('http://evil.xyz', 'link')
    expect(result.riskLevel).toBe('HIGH')
  })

  it('sets fallback values on unparseable response', async () => {
    global.fetch = vi.fn().mockResolvedValue(makeMockResponse('not valid json at all'))

    const result = await scanContent('http://test.com', 'link')
    expect(result.riskLevel).toBe('MEDIUM')
    expect(result.riskScore).toBe(50)
  })

  it('throws when API key is missing', async () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', '')
    await expect(scanContent('test', 'scam')).rejects.toThrow('VITE_OPENROUTER_API_KEY')
  })

  it('throws on non-OK HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429, text: async () => 'rate limited' })
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'test-key')

    await expect(scanContent('test', 'scam')).rejects.toThrow('429')
  })
})
