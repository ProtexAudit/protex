// ============================================================
// PROTEX — Vision API Client
// Uses Google Gemini Flash (free, supports images) via OpenRouter
// ============================================================

import type { ScanResult } from '@/types'
import { generateId } from '@/utils/id'

const BASE_URL = import.meta.env.VITE_HERMES_BASE_URL ?? 'https://openrouter.ai/api/v1'
const API_KEY  = import.meta.env.VITE_OPENROUTER_API_KEY ?? ''

// Vision model — gemini supports images and is free
const VISION_MODEL = 'meta-llama/llama-3.2-11b-vision-instruct:free'

const VISION_SYSTEM = `You are PROTEX, an elite AI cybersecurity agent. 
The user has uploaded a screenshot of a suspicious message, email, or notification.
Extract all visible text from the image, then analyze it for threats.
Respond ONLY with valid JSON — no markdown, no preamble:

{
  "extractedText": "<all text visible in the image>",
  "riskLevel": "CRITICAL|HIGH|MEDIUM|LOW|SAFE",
  "riskScore": <integer 0-100>,
  "classification": "<threat type or Legitimate Content>",
  "threats": ["<THREAT_TAG_1>", "<THREAT_TAG_2>"],
  "analysis": "<3-5 sentences citing specific red flags or confirming safety>",
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"]
}

Risk thresholds: CRITICAL=85-100, HIGH=60-84, MEDIUM=35-59, LOW=10-34, SAFE=0-9`

// ── Convert File to Base64 ────────────────────────────────────
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => {
      const result = reader.result as string
      // Strip data URL prefix → pure base64
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ── Scan Image ────────────────────────────────────────────────
export async function scanImage(file: File): Promise<ScanResult & { extractedText: string }> {
  if (!API_KEY) throw new Error('VITE_OPENROUTER_API_KEY is not set.')

  const start    = performance.now()
  const base64   = await fileToBase64(file)
  const mimeType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer':  window.location.origin,
      'X-Title':       'Protex Vision Scanner',
    },
    body: JSON.stringify({
      model:      VISION_MODEL,
      max_tokens: 800,
      messages: [
        { role: 'system', content: VISION_SYSTEM },
        {
          role: 'user',
          content: [
            {
              type:       'image_url',
              image_url:  { url: `data:${mimeType};base64,${base64}` },
            },
            {
              type: 'text',
              text: 'Analyze this screenshot for security threats.',
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Vision API error ${response.status}: ${err}`)
  }

  const data  = await response.json()
  const raw   = data.choices?.[0]?.message?.content ?? '{}'
  const clean = raw.replace(/```json|```/g, '').trim()
  const ms    = Math.round(performance.now() - start)

  let parsed: Record<string, unknown> = {}
  try {
    parsed = JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) try { parsed = JSON.parse(match[0]) } catch { /* noop */ }
  }

  return {
    id:              generateId(),
    riskLevel:       (parsed.riskLevel as ScanResult['riskLevel']) ?? 'MEDIUM',
    riskScore:       (parsed.riskScore  as number)  ?? 50,
    classification:  (parsed.classification as string) ?? 'Unknown',
    threats:         (parsed.threats    as string[]) ?? [],
    analysis:        (parsed.analysis   as string)  ?? raw,
    recommendations: (parsed.recommendations as string[]) ?? [],
    extractedText:   (parsed.extractedText as string) ?? '',
    metadata: {
      mode:         'scam',
      timestamp:    Date.now(),
      processingMs: ms,
      model:        VISION_MODEL,
      inputLength:  file.size,
    },
  }
}
