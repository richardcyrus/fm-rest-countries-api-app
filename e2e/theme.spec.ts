import { expect, test } from '@playwright/test'

test('the theme survives client-side navigation and toggles back', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Dark Mode' }).click()
  await expect(page.locator('body')).toHaveClass(/dark/)

  await page.getByRole('link', { name: 'Flag of Aruba' }).click()
  await expect(page).toHaveURL(/\/details\/ABW$/)
  await expect(page.locator('body')).toHaveClass(/dark/)

  await page.getByRole('button', { name: 'Dark Mode' }).click()
  await expect(page.locator('body')).not.toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('body')).not.toHaveClass(/dark/)
})

test('the theme is part of the first server response', async ({ request }) => {
  const dark = await request.get('/details/CZE', {
    headers: { Cookie: 'theme=dark' },
  })
  expect(await dark.text()).toContain('<body class="dark">')

  const light = await request.get('/details/CZE', {
    headers: { Cookie: 'theme=light' },
  })
  expect(await light.text()).not.toContain('class="dark"')
})

test('an unrecognised theme cookie falls back to light', async ({
  request,
}) => {
  const response = await request.get('/', {
    headers: { Cookie: 'theme=%3Cscript%3E' },
  })

  expect(await response.text()).not.toContain('class="dark"')
})
