# 🛡️ PROTEX — Autonomous Digital Protection Agent

<div align="center">

![Protex Banner](https://img.shields.io/badge/PROTEX-AI%20Security%20Agent-C9A84C?style=for-the-badge&logo=shield&logoColor=black)
![Hermes-4-70B](https://img.shields.io/badge/Powered%20by-Hermes--4--70B-F0C040?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-3DB87A?style=for-the-badge)
![Build](https://img.shields.io/github/actions/workflow/status/your-org/protex/ci.yml?style=for-the-badge&label=CI)

**Real-time scam, phishing & social manipulation detection — powered by NousResearch Hermes-4-70B**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**Protex** is an autonomous AI security agent that protects users from digital threats in real time. Unlike traditional security tools that rely on static blocklists, Protex uses **Hermes-4-70B** — a state-of-the-art reasoning model — to semantically understand and classify threats with human-level nuance.

> Built for hackathon. Designed for production.

### The Problem

Every 39 seconds, a cyberattack occurs. Phishing, scams, and social engineering account for over **90% of successful breaches** — yet most people have no tool to verify suspicious messages before clicking.

### The Solution

Protex acts as your **personal AI security analyst**, available instantly in the browser. Paste any suspicious content, and within seconds receive:

- A **risk score** (0–100) with confidence level
- **Threat classification** with specific attack vector labels  
- **Expert analysis** citing exact red flags
- **Actionable recommendations** to protect yourself

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚨 **Scam Detection** | Analyze emails, SMS, and DMs for phishing, financial fraud, prize scams |
| 🔗 **Link Analyzer** | Evaluate URLs for domain spoofing, typosquatting, malware delivery |
| 🎭 **Social Manipulation** | Detect urgency triggers, impersonation, fake authority, romance scams |
| 📊 **Risk Scoring** | Continuous 0–100 threat score with 5-tier classification |
| 📋 **Scan History** | Persistent log of all scans with replay functionality |
| ↓ **Export Reports** | Download scan results as structured JSON |
| ⚡ **Real-time** | Sub-3s analysis powered by Hermes-4-70B via OpenRouter |
| 📱 **Responsive** | Fully functional on desktop and mobile |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  PROTEX UI                   │
│  React 18 + TypeScript + Framer Motion       │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Scam    │  │  Link    │  │  Social   │  │
│  │  Panel   │  │  Panel   │  │  Panel    │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       └─────────────┼──────────────┘        │
│                     │                        │
│            ┌────────▼────────┐               │
│            │   useScan Hook  │               │
│            └────────┬────────┘               │
│                     │                        │
│            ┌────────▼────────┐               │
│            │  Zustand Store  │               │
│            └────────┬────────┘               │
└─────────────────────┼───────────────────────┘
                      │
            ┌─────────▼─────────┐
            │  hermes.ts Client │
            │  API Layer        │
            └─────────┬─────────┘
                      │ HTTPS
            ┌─────────▼─────────┐
            │   OpenRouter API  │
            │  Hermes-4-70B     │
            └───────────────────┘
```

### Data Flow

```
User Input
    │
    ▼
sanitizeInput()         ← strip whitespace, enforce 5000 char limit
    │
    ▼
useRateLimit.check()    ← max 20 req/min client-side throttle
    │
    ▼
scanContent(content, mode)
    │
    ├── build system prompt  ← role: PROTEX security analyst
    ├── attach mode prompt   ← scam | link | social context
    └── POST /chat/completions → Hermes-4-70B
                                     │
                                     ▼
                              parseResult()  ← robust JSON extraction
                                     │
                                     ▼
                              ScanResult ──→ Zustand store
                                             │
                                    ┌────────┴────────┐
                                    │                 │
                                ResultCard        HistoryEntry
```

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **AI Engine** | Hermes-4-70B (NousResearch) | Superior instruction following & JSON output |
| **API Gateway** | OpenRouter | Unified access, rate limiting, cost control |
| **Frontend** | React 18 + TypeScript | Type safety, composability |
| **State** | Zustand | Minimal, persistent, devtools-ready |
| **Animation** | Framer Motion | Polished micro-interactions |
| **Build** | Vite 5 | Sub-second HMR, optimized chunks |
| **Tests** | Vitest + Playwright | Unit → integration → E2E coverage |
| **CI/CD** | GitHub Actions | Lint → test → build → deploy pipeline |
| **Fonts** | Rajdhani + Share Tech Mono | Tactical security aesthetic |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- An [OpenRouter](https://openrouter.ai) account with API key

### 1. Clone the repository

```bash
git clone https://github.com/your-org/protex.git
cd protex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and set your OpenRouter API key:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_HERMES_MODEL=nousresearch/hermes-4-70b
```

> **Where to get an API key:** Create a free account at [openrouter.ai](https://openrouter.ai), go to **Keys**, and generate a new key. Hermes-4-70B is available on the free tier with rate limits.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Try a scan

1. Click a **preset chip** (e.g. "Bank Alert" or "PayPal Spoof")
2. Hit **⬡ SCAN MESSAGE**
3. Watch PROTEX analyze in real time

---

## 📁 Project Structure

```
protex/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD: lint → test → build → deploy
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── public/
│   └── assets/
│       └── logo.webp           # Protex shield logo
├── scripts/
│   └── check-env.ts            # Pre-flight env validation
├── src/
│   ├── api/
│   │   └── hermes.ts           # ★ Hermes-4-70B API client
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── StatCards.tsx
│   │   ├── TabBar.tsx
│   │   ├── ScanPanel.tsx       # ★ Main scan interface
│   │   ├── ResultCard.tsx      # ★ Analysis output display
│   │   ├── HistoryPanel.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── ScoreBar.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useScan.ts          # ★ Core scan logic hook
│   │   └── useRateLimit.ts     # Client-side throttle
│   ├── services/
│   │   └── store.ts            # ★ Zustand global state
│   ├── styles/
│   │   └── globals.css         # Full design system
│   ├── tests/
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts            # ★ All TypeScript interfaces
│   ├── utils/
│   │   ├── id.ts
│   │   ├── index.ts            # Risk helpers, formatters
│   │   └── presets.ts          # Example scan presets
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── unit/
│   │   └── utils.test.ts
│   ├── integration/
│   │   └── hermes.test.ts
│   └── e2e/
│       └── app.spec.ts
├── .env.example                # ← Copy to .env.local
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 API Reference

### `scanContent(content, mode)`

Core function in `src/api/hermes.ts`. Makes a structured call to Hermes-4-70B and returns a typed `ScanResult`.

```typescript
import { scanContent } from '@/api/hermes'

const result = await scanContent(
  'URGENT: Your account has been suspended...',
  'scam'
)

// result: ScanResult
// {
//   id:              "ptx_lxyz123_ab4c5d",
//   riskLevel:       "CRITICAL",
//   riskScore:       92,
//   classification:  "Phishing / Account Suspension Scam",
//   threats:         ["URGENCY_TRIGGER", "CREDENTIAL_HARVESTING"],
//   analysis:        "This message employs classic urgency manipulation...",
//   recommendations: ["Do not click any links", "Report to your bank", ...],
//   metadata: {
//     mode:          "scam",
//     timestamp:     1725000000000,
//     processingMs:  1847,
//     model:         "nousresearch/hermes-4-70b",
//     inputLength:   56
//   }
// }
```

### Scan Modes

| Mode | Detects |
|---|---|
| `'scam'` | Phishing emails, SMS fraud, prize scams, financial fraud |
| `'link'` | Malicious URLs, domain spoofing, typosquatting, redirect chains |
| `'social'` | Urgency manipulation, impersonation, fake authority, romance scams |

### Risk Levels

| Level | Score Range | Color |
|---|---|---|
| `CRITICAL` | 85–100 | 🔴 Red |
| `HIGH` | 60–84 | 🟠 Amber |
| `MEDIUM` | 35–59 | 🔵 Blue |
| `LOW` | 10–34 | 🟢 Green |
| `SAFE` | 0–9 | 🟢 Green |

---

## 🧪 Testing

```bash
# Unit + integration tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (requires dev server running)
npm run test:e2e
```

Coverage targets: **80%** statements, **75%** branches, **80%** functions.

---

## 🚢 Deployment

### Vercel (recommended)

```bash
npx vercel --prod
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Docker

```bash
docker build -t protex .
docker run -p 8080:80 \
  -e VITE_OPENROUTER_API_KEY=your_key \
  protex
```

### Static hosting (Netlify, Cloudflare Pages)

```bash
npm run build
# upload dist/ folder
```

---

## 🔒 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_OPENROUTER_API_KEY` | ✅ Yes | — | Your OpenRouter API key |
| `VITE_HERMES_MODEL` | No | `nousresearch/hermes-4-70b` | Model identifier |
| `VITE_HERMES_BASE_URL` | No | `https://openrouter.ai/api/v1` | API base URL |
| `VITE_MAX_REQUESTS_PER_MINUTE` | No | `20` | Client-side rate limit |
| `VITE_MAX_SCAN_CHARS` | No | `5000` | Max input length |
| `VITE_ENABLE_EXPORT_REPORT` | No | `true` | Enable JSON export |
| `VITE_APP_ENV` | No | `development` | App environment |

> ⚠️ **Security:** Never commit `.env.local`. The API key is used client-side — for production, proxy requests through your own backend to keep the key server-side.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/bulk-scan`
3. Commit your changes: `git commit -m 'feat: add bulk scan mode'`
4. Push to the branch: `git push origin feat/bulk-scan`
5. Open a Pull Request

### Commit Convention

```
feat:     new feature
fix:      bug fix
docs:     documentation only
style:    formatting, no logic change
refactor: code restructure
test:     add or fix tests
chore:    tooling, deps, CI
```

---

## 📄 License

MIT © 2024 Protex Team

---

<div align="center">
  <strong>PROTEX</strong> · Autonomous Digital Protection Agent<br/>
  Powered by <a href="https://huggingface.co/NousResearch">NousResearch Hermes-4-70B</a> via <a href="https://openrouter.ai">OpenRouter</a>
</div>
