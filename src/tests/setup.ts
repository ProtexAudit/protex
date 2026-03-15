import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.location for API client
Object.defineProperty(window, 'location', {
  value: { origin: 'http://localhost:5173' },
  writable: true,
})

// Mock performance.now
global.performance = { now: vi.fn(() => Date.now()) } as unknown as Performance
