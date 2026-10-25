import { expect, test } from '@playwright/test'

const search = (page: import('@playwright/test').Page) =>
  page.getByPlaceholder('Search for a country...')

test.describe('region filter', () => {
  test('filters by region through the select and clears again', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('.card')).toHaveCount(24)

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Europe' }).click()

    await expect(page).toHaveURL(/[?&]region=europe/)
    const regions = page.locator('.card-fact-group', { hasText: 'Region' })
    await expect(regions.first()).toBeVisible()
    for (const region of await regions.locator('dd').allTextContents()) {
      expect(region).toBe('Europe')
    }

    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'All Regions' }).click()
    await expect(page).not.toHaveURL(/region=/)
  })

  test('lists the regions the data contains', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox').click()

    // "All Regions" comes first, then the regions alphabetically.
    expect(await page.getByRole('option').allTextContents()).toEqual([
      'All Regions',
      'Africa',
      'Americas',
      'Antarctic',
      'Asia',
      'Europe',
      'Oceania',
    ])
  })

  test('opens with the region from the URL selected', async ({ page }) => {
    await page.goto('/?region=oceania')

    await expect(page.getByRole('combobox')).toContainText('Oceania')
    await expect(page.locator('.card').first()).toBeVisible()
  })
})

test.describe('search', () => {
  test('combines a name search with a region', async ({ page }) => {
    await page.goto('/?q=united&region=europe')

    await expect(
      page.getByRole('heading', { name: 'United Kingdom' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'United States' })
    ).toHaveCount(0)
  })

  test('is case-insensitive and matches inside names', async ({ page }) => {
    await page.goto('/?q=ZECH')

    await expect(page.getByRole('heading', { name: 'Czechia' })).toBeVisible()
  })

  test('shows a message when nothing matches', async ({ page }) => {
    await page.goto('/?q=zzzzzz')

    await expect(page.getByText('No countries found.')).toBeVisible()
    await expect(page.locator('.card')).toHaveCount(0)
  })

  test('clearing the search box restores the full list', async ({ page }) => {
    await page.goto('/?q=aruba')
    await expect(page.locator('.card')).toHaveCount(1)

    await search(page).fill('')

    await expect(page).not.toHaveURL(/q=/)
    await expect(page.locator('.card')).toHaveCount(24)
  })

  test('survives opening a country and going back', async ({ page }) => {
    await page.goto('/?q=czech')
    await page.getByRole('link', { name: 'Flag of Czechia' }).click()
    await expect(page).toHaveURL(/\/details\/CZE$/)

    await page.goBack()

    await expect(page).toHaveURL(/[?&]q=czech/)
    await expect(search(page)).toHaveValue('czech')
    await expect(page.locator('.card')).toHaveCount(1)
  })
})

test.describe('infinite scroll', () => {
  test('loads every country exactly once, then stops', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.card')).toHaveCount(24)

    // 254 objects, minus 4 without an alpha-3 code.
    await expect
      .poll(
        async () => {
          await page.mouse.wheel(0, 100_000)
          return page.locator('.card').count()
        },
        { timeout: 20_000 }
      )
      .toBe(250)

    const names = await page.locator('.card .country-name').allTextContents()
    expect(new Set(names).size).toBe(250)
    expect(names).not.toContain('Abkhazia')
  })

  test('lists countries alphabetically by name', async ({ page }) => {
    await page.goto('/')

    const names = await page.locator('.card .country-name').allTextContents()
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })
})
