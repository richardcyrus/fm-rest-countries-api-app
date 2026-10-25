import { expect, test } from '@playwright/test'
import { failing, flaky, origin, TOKEN } from './servers'

const UNAVAILABLE = /temporarily unavailable/i

test.describe('upstream that always fails', () => {
  test.use({ baseURL: origin(failing.app) })

  test('Home shows a plain error, with nothing sensitive in it', async ({
    page,
  }) => {
    await page.goto('/')

    const alert = page.getByRole('alert')
    await expect(alert).toHaveText(UNAVAILABLE)
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()

    const html = await page.content()
    for (const secret of [TOKEN, 'Bearer', String(failing.fake), '500']) {
      expect(html).not.toContain(secret)
    }
  })

  test('Details shows the same error instead of crashing', async ({ page }) => {
    await page.goto('/details/CZE')

    await expect(page.getByRole('alert')).toHaveText(UNAVAILABLE)
  })

  test('the header stays usable on the error page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('alert')).toBeVisible()

    await page.getByRole('button', { name: 'Dark Mode' }).click()
    await expect(page.locator('body')).toHaveClass(/dark/)
  })
})

test.describe('upstream that fails and recovers', () => {
  test.use({ baseURL: origin(flaky.app) })
  // The tests share one app instance and its cache, so order matters.
  test.describe.configure({ mode: 'serial' })

  const control = async (
    playwright: import('@playwright/test').PlaywrightWorkerArgs['playwright'],
    path: string
  ) => {
    const context = await playwright.request.newContext()
    await context.post(`${origin(flaky.fake)}/__control/${path}`)
    await context.dispose()
  }

  test.beforeAll(async ({ playwright }) => {
    await control(playwright, 'reset')
  })

  test('shows an error with a cold cache, then recovers on retry', async ({
    page,
    playwright,
  }) => {
    await control(playwright, 'fail?status=503')
    await page.goto('/')
    await expect(page.getByRole('alert')).toHaveText(UNAVAILABLE)

    await control(playwright, 'reset')
    // The cache replays a cold failure for a few seconds before it retries.
    await expect(async () => {
      await page.getByRole('button', { name: 'Try again' }).click()
      await expect(page.locator('.card')).toHaveCount(24, { timeout: 1000 })
    }).toPass({ timeout: 15_000 })
    await expect(page.getByRole('alert')).toHaveCount(0)
  })

  test('keeps serving stale data once the cache expires and the upstream is down', async ({
    page,
    playwright,
  }) => {
    await page.goto('/')
    await expect(page.locator('.card')).toHaveCount(24)

    await control(playwright, 'fail?status=503')
    // The cache lives for 1s in this instance.
    await page.waitForTimeout(1_200)

    // A new query goes through the expired cache, so it must try to refresh.
    await page.goto('/?q=czech')
    await expect(page.getByRole('heading', { name: 'Czechia' })).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)

    const context = await playwright.request.newContext()
    const { requests } = await (
      await context.get(`${origin(flaky.fake)}/__control/requests`)
    ).json()
    await context.dispose()
    expect(requests.some((r: { status: number }) => r.status === 503)).toBe(
      true
    )
  })
})
