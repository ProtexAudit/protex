// ============================================================
// PROTEX — E2E Tests (Playwright)
// ============================================================

import { test, expect } from '@playwright/test'

test.describe('Protex App — Core Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('shows AGENT ONLINE status in header', async ({ page }) => {
    await expect(page.locator('.app-header__status')).toContainText('AGENT ONLINE')
  })

  test('shows PROTEX wordmark', async ({ page }) => {
    await expect(page.locator('.app-header__wordmark')).toHaveText('PROTEX')
  })

  test('all four tabs are visible', async ({ page }) => {
    const tabs = page.locator('.tab-btn')
    await expect(tabs).toHaveCount(4)
  })

  test('switches between scan modes', async ({ page }) => {
    await page.click('.tab-btn:nth-child(2)')
    await expect(page.locator('.scan-textarea')).toBeVisible()
  })

  test('preset chip fills textarea', async ({ page }) => {
    const chip = page.locator('.preset-chip').first()
    await chip.click()
    const textarea = page.locator('.scan-textarea')
    await expect(textarea).not.toBeEmpty()
  })

  test('scan button is disabled when textarea is empty', async ({ page }) => {
    await expect(page.locator('.scan-btn')).toBeDisabled()
  })

  test('scan button enables when content is typed', async ({ page }) => {
    await page.fill('.scan-textarea', 'urgent click this link now!')
    await expect(page.locator('.scan-btn')).toBeEnabled()
  })

  test('char counter updates on input', async ({ page }) => {
    await page.fill('.scan-textarea', 'hello')
    await expect(page.locator('.char-count')).toContainText('5')
  })

  test('history tab shows empty state initially', async ({ page }) => {
    await page.click('.tab-btn:nth-child(4)')
    await expect(page.locator('.history-empty')).toBeVisible()
  })
})
