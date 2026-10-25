import { expect, test } from '@playwright/test'

test('home server-renders the first page of countries', async ({ request }) => {
  const html = await (await request.get('/')).text()

  expect(html.match(/class="card"/g)).toHaveLength(24)
  expect(html).toContain('Where in the world?')
})

test('search narrows the list and is reflected in the URL', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('.card').first()).toBeVisible()

  await page.getByPlaceholder('Search for a country...').fill('Aruba')

  await expect(page).toHaveURL(/[?&]q=Aruba/)
  await expect(page.locator('.card')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Aruba' })).toBeVisible()
})

test('a search URL renders its results on first load', async ({ page }) => {
  await page.goto('/?q=czech&region=europe')

  await expect(page.locator('.card')).toHaveCount(1)
  await expect(page.getByPlaceholder('Search for a country...')).toHaveValue(
    'czech'
  )
})

test('scrolling loads more countries', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.card')).toHaveCount(24)

  await page.mouse.wheel(0, 100_000)

  await expect.poll(() => page.locator('.card').count()).toBeGreaterThan(24)
})

test('card opens details, a border country navigates, back returns home', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Flag of Afghanistan' }).click()

  await expect(page).toHaveURL(/\/details\/AFG$/)
  await expect(page.getByRole('heading', { name: 'Afghanistan' })).toBeVisible()
  await expect(page.getByText('Native Name')).toBeVisible()

  await page.getByRole('link', { name: 'Pakistan' }).click()
  await expect(page).toHaveURL(/\/details\/PAK$/)

  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.locator('.card').first()).toBeVisible()
})

test('an unknown country code shows not found', async ({ page }) => {
  const response = await page.goto('/details/XXX')

  expect(response?.status()).toBe(404)
  await expect(page.getByText("We couldn't find that page.")).toBeVisible()
})

test('theme choice is stored in a cookie and rendered on the server', async ({
  page,
  request,
}) => {
  await page.goto('/')
  await expect(page.locator('body')).not.toHaveClass(/dark/)

  await page.getByRole('button', { name: 'Dark Mode' }).click()
  await expect(page.locator('body')).toHaveClass(/dark/)
  await expect
    .poll(
      async () =>
        (await page.context().cookies()).find((c) => c.name === 'theme')?.value
    )
    .toBe('dark')

  await page.reload()
  await expect(page.locator('body')).toHaveClass(/dark/)

  const html = await (
    await request.get('/', { headers: { Cookie: 'theme=dark' } })
  ).text()
  expect(html).toContain('<body class="dark">')
})
