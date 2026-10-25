import { expect, test } from '@playwright/test'

test('renders the full Country Detail on the server', async ({ request }) => {
  const html = await (await request.get('/details/CZE')).text()

  expect(html).toContain('Czechia')
  for (const label of [
    'Native Name',
    'Population',
    'Region',
    'Sub Region',
    'Capital',
    'Top Level Domain',
    'Currencies',
    'Languages',
  ]) {
    expect(html).toContain(label)
  }
  expect(html).toContain('Prague')
  expect(html).toContain('Czech koruna')
  expect(html).toContain('href="/details/POL"')
})

test('shows the facts for a country', async ({ page }) => {
  await page.goto('/details/CZE')

  const fact = (label: string) =>
    page
      .locator('.fact-group')
      .filter({ has: page.getByText(label, { exact: true }) })
      .locator('dd')

  await expect(fact('Capital')).toHaveText('Prague')
  await expect(fact('Region')).toHaveText('Europe')
  await expect(fact('Languages')).toContainText('Czech')
  await expect(page.getByRole('img', { name: 'Flag of Czechia' })).toBeVisible()
  await expect(page.locator('.border-country-button')).toHaveCount(4)
})

test('accepts a lower-case code', async ({ page }) => {
  await page.goto('/details/cze')

  await expect(page.getByRole('heading', { name: 'Czechia' })).toBeVisible()
})

test('omits Border Countries for a country with no land borders', async ({
  page,
}) => {
  await page.goto('/details/AUS')

  await expect(page.getByRole('heading', { name: 'Australia' })).toBeVisible()
  await expect(page.getByText('Border Countries:')).toHaveCount(0)
})

test('omits the capital for a country without one', async ({ page }) => {
  await page.goto('/details/ATA')

  await expect(page.getByRole('heading', { name: 'Antarctica' })).toBeVisible()
  await expect(page.locator('.fact-label', { hasText: 'Capital' })).toHaveCount(
    0
  )
})

for (const code of ['XXX', 'ab', 'abcd', '123', 'A%20B']) {
  test(`treats "${code}" as not found`, async ({ page }) => {
    const response = await page.goto(`/details/${code}`)

    expect(response?.status()).toBe(404)
    await expect(page.getByText("We couldn't find that page.")).toBeVisible()
    await page.getByRole('link', { name: 'Back' }).click()
    await expect(page).toHaveURL('/')
  })
}

test('a border country link navigates to that country', async ({ page }) => {
  await page.goto('/details/CZE')
  await page.getByRole('link', { name: 'Austria' }).click()

  await expect(page).toHaveURL(/\/details\/AUT$/)
  await expect(page.getByRole('heading', { name: 'Austria' })).toBeVisible()
})
