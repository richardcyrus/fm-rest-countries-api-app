import { expect, test } from '@playwright/test'
import { healthy, origin, TOKEN } from './servers'

test('the browser never talks to the countries API', async ({ page }) => {
  const requested: string[] = []
  page.on('request', (request) => requested.push(request.url()))

  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()
  await page.mouse.wheel(0, 100_000)
  await expect.poll(() => page.locator('.card').count()).toBeGreaterThan(24)
  await page.getByRole('link', { name: 'Flag of Aruba' }).click()
  await expect(page).toHaveURL(/\/details\/ABW$/)

  const upstream = requested.filter(
    (url) =>
      url.startsWith(origin(healthy.fake)) ||
      url.includes('api.restcountries.com')
  )
  expect(upstream).toEqual([])
})

test('the token appears in no page, script, or server-function response', async ({
  page,
}) => {
  const bodies: string[] = []
  page.on('response', async (response) => {
    const type = response.headers()['content-type'] ?? ''
    if (/json|javascript|html|text/.test(type)) {
      bodies.push(await response.text().catch(() => ''))
    }
  })

  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()
  await page.mouse.wheel(0, 100_000)
  await expect.poll(() => page.locator('.card').count()).toBeGreaterThan(24)
  await page.goto('/details/CZE')
  await page.waitForLoadState('networkidle')

  expect(bodies.length).toBeGreaterThan(3)
  for (const body of bodies) {
    expect(body).not.toContain(TOKEN)
    expect(body).not.toContain('Bearer')
    expect(body).not.toContain('COUNTRIES_API')
    expect(body).not.toContain(`localhost:${healthy.fake}`)
  }
})
