// ============================================================
// PROTEX — Example Presets
// ============================================================

import type { ExamplePreset } from '@/types'

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  // ── Scam ──────────────────────────────────────────────────
  {
    mode: 'scam', icon: '📧', label: 'Bank Alert',
    content: 'URGENT: Your Bank of America account has been SUSPENDED due to suspicious activity. Your account will be permanently closed in 24 hours unless you verify immediately. Click here: http://bankofamerica-secure.verification-portal.xyz/login',
  },
  {
    mode: 'scam', icon: '🎁', label: 'Prize Winner',
    content: 'Congratulations! You have been selected as our LUCKY WINNER for $1,000,000 USD! To claim your prize, please send $200 processing fee via Western Union to claim ID: WX8834. Contact agent James at +1-809-555-0192.',
  },
  {
    mode: 'scam', icon: '₿', label: 'Crypto Scam',
    content: "Hi! I'm Lisa from Binance VIP support. Your account has earned 0.5 BTC in rewards but we need you to pay 0.01 BTC gas fee to release funds. Send to: 1A2B3C4D... This is time-sensitive, offer expires in 2 hours!",
  },
  {
    mode: 'scam', icon: '📋', label: 'Tax Fraud',
    content: 'IRS NOTICE: You owe $3,847 in back taxes. Immediate payment required or warrant will be issued for your arrest. Call 1-800-TAX-SCAM within 4 hours to avoid criminal charges. Payment via iTunes gift cards only.',
  },

  // ── Link ──────────────────────────────────────────────────
  {
    mode: 'link', icon: '💳', label: 'PayPal Spoof',
    content: 'http://secure-paypal-login.verification-update.xyz/account/confirm?token=8x92js',
  },
  {
    mode: 'link', icon: '🏦', label: 'Fake Bank',
    content: 'https://chase-bank-secure-login.account-verify.net/signin/confirm',
  },
  {
    mode: 'link', icon: '✅', label: 'Legit Link',
    content: 'https://google.com/search?q=weather+today',
  },
  {
    mode: 'link', icon: '☠️', label: 'Malware Site',
    content: 'http://free-download-movies-hd.click/setup.exe?affiliate=9923',
  },

  // ── Social ────────────────────────────────────────────────
  {
    mode: 'social', icon: '⏱', label: 'Urgency Scam',
    content: "Hey this is Michael from IT. I need your login credentials RIGHT NOW. We're under cyberattack and I need to lock your account within the next 10 MINUTES or we'll lose everything. Don't call anyone, just send me your password directly.",
  },
  {
    mode: 'social', icon: '👤', label: 'Impersonation',
    content: "Hello, I'm Elon Musk's personal assistant. Mr. Musk has chosen you for his exclusive crypto investment program. He's doubling all investments this week only. Send 1 ETH to receive 2 ETH back. Verified: @ElonMusk_Official_Assistant",
  },
  {
    mode: 'social', icon: '🏛', label: 'Fake Authority',
    content: 'This is a message from INTERPOL Cybercrime Division. Your IP address has been flagged for illegal activities. To avoid arrest, you must pay a $500 digital clearance fee within 24 hours. Your case number: IC-2024-88432.',
  },
  {
    mode: 'social', icon: '💔', label: 'Romance Scam',
    content: "Baby I miss you so much. I'm stuck at the oil rig with no internet but my colleague let me use his phone. I need $500 for emergency medical treatment. I'll pay you back double when I get home in 3 weeks.",
  },
]

export function getPresetsForMode(mode: ExamplePreset['mode']): ExamplePreset[] {
  return EXAMPLE_PRESETS.filter(p => p.mode === mode)
}
