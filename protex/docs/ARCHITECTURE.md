# PROTEX — Architecture Deep Dive

## Core Design Principles

1. **AI-first** — Every threat decision goes through Hermes-4-70B. No static rules.
2. **Type-safe** — Full TypeScript coverage, no `any` escapes in core paths.
3. **Resilient** — Graceful degradation on API failures, JSON parse errors, rate limits.
4. **Observable** — Zustand devtools, structured metadata on every result.
5. **Testable** — Pure functions at the boundary; side effects isolated to hooks.

## Module Responsibilities

| Module | Responsibility |
|---|---|
| `src/api/hermes.ts` | Raw HTTP → Hermes; JSON parsing; error normalization |
| `src/hooks/useScan.ts` | Orchestrates scan flow; bridges API ↔ store |
| `src/hooks/useRateLimit.ts` | Sliding window counter; prevents API abuse |
| `src/services/store.ts` | Global state; persistence; computed stats |
| `src/types/index.ts` | Single source of truth for all data shapes |
| `src/utils/index.ts` | Pure, side-effect-free helper functions |
| `src/utils/presets.ts` | Static example data for demos and testing |

## State Shape

```typescript
AppState {
  activeTab: ScanMode | 'history'
  activePanels: {
    scam:   PanelState   // { status, result, error, inputValue }
    link:   PanelState
    social: PanelState
  }
  history: HistoryEntry[]   // max 50, persisted to localStorage
  stats: AgentStats          // aggregated counters, persisted
}
```

## Hermes Prompt Strategy

The system prompt defines PROTEX as a specialized cybersecurity analyst, not a general assistant. Key decisions:

- **Temperature 0.1** — deterministic, consistent analysis
- **Structured JSON output** — all fields typed and validated
- **Mode-specific user prompts** — scam / link / social each get tailored framing
- **Graceful JSON extraction** — regex fallback if model adds preamble text

## Error Handling Hierarchy

```
Network error        → throws, caught by useScan → setError → toast
HTTP 4xx/5xx         → throws with status code
Empty response       → fallback ScanResult with riskLevel MEDIUM
Malformed JSON       → regex extraction attempt → fallback
Missing API key      → immediate throw before fetch
Rate limit exceeded  → client-side check before API call
```
