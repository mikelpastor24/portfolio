import { expect, test } from '@playwright/test'

test('the first visit follows the system theme and reacts to changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.getByRole('combobox', { name: 'Tema', exact: true })).toHaveValue('system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(23, 28, 25)')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#171c19')

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(248, 248, 244)')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f8f8f4')
  expect(await page.evaluate(() => localStorage.getItem('portfolio.theme'))).toBeNull()
})

test('manual theme selection persists, overrides the system, and can be reset', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const selector = page.getByRole('combobox', { name: 'Tema', exact: true })
  await selector.selectOption('dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('portfolio.theme'))).toBe('dark')
  await page.reload()
  await expect(selector).toHaveValue('dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.evaluate(async () => { await document.fonts.ready })
  for (const section of await page.locator('.reveal').all()) {
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveCSS('opacity', '1')
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: `artifacts/${test.info().project.name}-dark.png`, fullPage: true, animations: 'disabled' })

  await selector.selectOption('light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(selector).toHaveValue('light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await selector.selectOption('system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('portfolio.theme'))).toBeNull()
  await page.reload()
  await expect(selector).toHaveValue('system')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('theme labels are translated and selecting a language preserves the theme', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('dark')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  const selector = page.getByRole('combobox', { name: 'Theme', exact: true })
  await expect(selector).toHaveValue('dark')
  await expect(selector).toHaveAttribute('title', 'Theme: Dark')
  await expect(selector.getByRole('option')).toHaveText(['System', 'Light', 'Dark'])
  await selector.focus()
  await expect(selector).toBeFocused()
  await page.keyboard.press('Alt+ArrowDown')
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(selector).toHaveValue('light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('button', { name: 'Español', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('combobox', { name: 'Tema', exact: true }).getByRole('option')).toHaveText(['Sistema', 'Claro', 'Oscuro'])
})

test('the system theme and manual selection work without local storage', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked') } })
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('combobox', { name: 'Tema', exact: true }).selectOption('light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(errors).toEqual([])
})

test('the saved theme is applied before React loads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.addInitScript(() => localStorage.setItem('portfolio.theme', 'dark'))
  await page.route('**/src/main.tsx', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('#root')).toBeEmpty()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
})
