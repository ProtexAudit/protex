// ============================================================
// PROTEX — Hermes-4-70B API Client
// Powered by: NousResearch/Hermes-4-70B via OpenRouter
// ============================================================

import type {
  HermesMessage,
  HermesRequest,
  HermesResponse,
  ScanMode,
  ScanResult,
} from '@/types'
import { generateId } from '@/utils/id'

const BASE_URL = import.meta.env.VITE_HERMES_BASE_URL ?? 'https://openrouter.ai/api/v1'
const MODEL     = import.meta.env.VITE_HERMES_MODEL ?? 'nousresearch/hermes-4-70b'
const API_KEY   = import.meta.env.VITE_OPENROUTER_API_KEY ?? ''

// ── System Prompt ────────────────────────────────────────────
const SYSTEM_PROMPT = `You are PROTEX, an elite autonomous AI cybersecurity agent specializing in real-time digital threat detection. Your capabilities include:

1. SCAM DETECTION — Identify phishing emails, SMS fraud, financial scams
2. LINK ANALYSIS — Evaluate URLs for malicious domains, typosquatting, redirect chains
3. SOCIAL ENGINEERING — Detect urgency manipulation, impersonation, fake authority, romance scams

You MUST respond ONLY with a valid JSON object — no markdown fences, no preamble, no explanation outside the JSON:

{
  "riskLevel": "CRITICAL|HIGH|MEDIUM|LOW|SAFE",
  "riskScore": <integer 0-100>,
  "classification": "<concise threat category or 'Legitimate Content'>",
  "threats": ["<threat_tag_1>", "<threat_tag_2>"],
  "analysis": "<3-5 sentences of expert analysis citing specific red flags or confirming safety>",
  "recommendations": ["<action_1>", "<action_2>", "<action_3>"]
}

Risk score thresholds: CRITICAL=85-100, HIGH=60-84, MEDIUM=35-59, LOW=10-34, SAFE=0-9
Threat tags (use concise ALL_CAPS): URGENCY_TRIGGER, DOMAIN_SPOOFING, IMPERSONATION, CREDENTIAL_HARVESTING, FINANCIAL_FRAUD, SOCIAL_ENGINEERING, FAKE_AUTHORITY, MALWARE_DELIVERY, ROMANCE_SCAM, TYPOSQUATTING, SUSPICIOUS_TLD, REDIRECT_CHAIN, NO_THREATS_DETECTED

Be precise, technical, and actionable. Reference specific indicators from the input.`

// ── Mode Prompts ─────────────────────────────────────────────
const MODE_PROMPTS: Record<ScanMode, string> = {
  scam:   'Analyze this message for scam, phishing, or financial fraud indicators:',
  link:   'Analyze this URL or domain for malicious intent, spoofing, or safety threats:',
  social: 'Analyze this message for social engineering, manipulation tactics, or psychological exploitation:',
}

// ── Raw Completion ────────────────────────────────────────────
async function completion(messages: HermesMessage[]): Promise<HermesResponse> {
  if (!API_KEY) throw new Error('VITE_OPENROUTER_API_KEY is not set. Check your .env.local file.')

  const payload: HermesRequest = {
    model: MODEL,
    messages,
    max_tokens: 700,
    temperature: 0.1,   // low temperature for consistent, reliable analysis
    top_p: 0.9,
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Protex AI Security Agent',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Hermes API error ${res.status}: ${err}`)
  }

  return res.json() as Promise<HermesResponse>
}

// ── Parse Result ─────────────────────────────────────────────
function parseResult(raw: string, mode: ScanMode, processingMs: number): ScanResult {
  const clean = raw.replace(/```json|```/g, '').trim()
  let parsed: Partial<ScanResult>

  try {
    parsed = JSON.parse(clean)
  } catch {
    // Graceful fallback — extract JSON substring if model added extra text
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      try { parsed = JSON.parse(match[0]) }
      catch { parsed = {} }
    } else {
      parsed = {}
    }
  }

  return {
    id: generateId(),
    riskLevel:       parsed.riskLevel       ?? 'MEDIUM',
    riskScore:       parsed.riskScore       ?? 50,
    classification:  parsed.classification  ?? 'Unknown',
    threats:         parsed.threats         ?? ['ANALYSIS_ERROR'],
    analysis:        parsed.analysis        ?? raw,
    recommendations: parsed.recommendations ?? ['Treat with caution', 'Do not click any links', 'Report to security team'],
    metadata: {
      mode,
      timestamp:    Date.now(),
      processingMs,
      model:        MODEL,
      inputLength:  0,  // caller fills this
    },
  }
}

// ── Public Interface ──────────────────────────────────────────
export async function scanContent(content: string, mode: ScanMode): Promise<ScanResult> {
  const start = performance.now()

  const messages: HermesMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: `${MODE_PROMPTS[mode]}\n\n${content}` },
  ]

  const response = await completion(messages)
  const raw      = response.choices[0]?.message?.content ?? '{}'
  const ms       = Math.round(performance.now() - start)
  const result   = parseResult(raw, mode, ms)

  result.metadata.inputLength = content.length
  return result
}

export { MODEL as HERMES_MODEL }
