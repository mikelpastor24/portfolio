import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import spanish from '../src/i18n/locales/es.json' with { type: 'json' }
import english from '../src/i18n/locales/en.json' with { type: 'json' }
import configuration from '../src/content/portfolio.json' with { type: 'json' }

async function capturePreview(page: Page, language: 'es' | 'en') {
  await page.evaluate(async () => { await document.fonts.ready })
  for (const section of await page.locator('.reveal').all()) {
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveCSS('opacity', '1')
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: `artifacts/${test.info().project.name}-${language}.png`, fullPage: true, animations: 'disabled' })
}

test('the page loads without runtime errors and fits the viewport', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hacerlo simple.Hacerlo bien.')
  await expect(page.getByRole('button', { name: 'Ver proyecto Portfolio personal' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver proyecto gamer-jev', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ver proyecto schema_engine', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
  await capturePreview(page, 'es')
})

test('project details close with Escape and restore focus', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Ver proyecto Portfolio personal' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Portfolio personal' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cerrar proyecto' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  expect(await page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('published projects open package links and keep dialog focus in both languages', async ({ page }) => {
  await page.context().route('https://pub.dev/packages/*', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><title>Package destination</title>',
  }))
  await page.goto('/')
  const publishedProjects = [
    { title: 'gamer-jev', repository: 'https://github.com/mikelpastor24/gamer-jev', packages: [] },
    {
      title: 'schema_engine',
      repository: 'https://github.com/mikelpastor24/schema_engine',
      packages: [
        { name: 'schema_engine', url: 'https://pub.dev/packages/schema_engine' },
        { name: 'schema_ui', url: 'https://pub.dev/packages/schema_ui' },
      ],
    },
  ]
  for (const { button, messages } of [{ button: 'Español', messages: spanish }, { button: 'English', messages: english }]) {
    await page.getByRole('button', { name: button, exact: true }).click()
    for (const project of publishedProjects) {
      const trigger = page.getByRole('button', { name: `${messages.projects.view} ${project.title}`, exact: true })
      const card = page.getByRole('article').filter({ has: trigger })
      await expect(card.getByRole('list', { name: messages.projects.packages })).toHaveCount(project.packages.length ? 1 : 0)
      for (const packageLink of project.packages) {
        const link = card.getByRole('link', { name: messages.projects.packageLink.replace('{name}', packageLink.name), exact: true })
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', packageLink.url)
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        const popupPromise = page.waitForEvent('popup')
        await link.click()
        const popup = await popupPromise
        await expect(popup).toHaveURL(packageLink.url)
        await popup.close()
        await expect(page.getByRole('dialog')).toHaveCount(0)
      }
      await trigger.click()
      const dialog = page.getByRole('dialog', { name: project.title, exact: true })
      const repositoryLink = dialog.getByRole('link', { name: messages.dialog.code })
      await expect(repositoryLink).toHaveAttribute('href', project.repository)
      await expect(repositoryLink).toHaveAttribute('target', '_blank')
      await expect(repositoryLink).toHaveAttribute('rel', 'noopener noreferrer')
      await expect(dialog.getByRole('link', { name: messages.dialog.visit })).toHaveCount(0)
      await expect(dialog.getByRole('list', { name: messages.projects.packages })).toHaveCount(project.packages.length ? 1 : 0)
      for (const packageLink of project.packages) {
        const link = dialog.getByRole('link', { name: messages.projects.packageLink.replace('{name}', packageLink.name), exact: true })
        await expect(link).toHaveAttribute('href', packageLink.url)
        await expect(link).toHaveAttribute('target', '_blank')
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        const popupPromise = page.waitForEvent('popup')
        await link.click()
        const popup = await popupPromise
        await expect(popup).toHaveURL(packageLink.url)
        await popup.close()
        await expect(dialog).toBeVisible()
      }
      await dialog.getByRole('button', { name: messages.dialog.close }).focus()
      if (button === 'Español') {
        await dialog.screenshot({ path: `artifacts/${test.info().project.name}-${project.title}-dialog.png`, animations: 'disabled' })
      }
      await page.keyboard.press('Shift+Tab')
      await expect(repositoryLink).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(dialog.getByRole('button', { name: messages.dialog.close })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
      await expect(trigger).toBeFocused()
    }
  }
})

test('language selection updates content and links and persists across reloads', async ({ page }) => {
  await page.goto('/')
  const linkedinLink = page.getByRole('link', { name: 'LinkedIn', exact: true })
  await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mikel-pastor?locale=es_ES')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mikel-pastor')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep it simple.Make it matter.')
  await expect(page.getByRole('button', { name: 'View project Personal portfolio' })).toBeVisible()
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Mikel Pastor's portfolio/)
  await expect(page.getByRole('link', { name: "Let's talk" })).toHaveAttribute('href', 'mailto:mikelp243@gmail.com')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mikel-pastor')
  await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await capturePreview(page, 'en')
  await page.getByRole('button', { name: 'View project Personal portfolio' }).click()
  await expect(page.getByRole('dialog', { name: 'Personal portfolio' })).toBeVisible()
  await page.getByRole('button', { name: 'Close project' }).click()
  await page.getByRole('button', { name: 'Español', exact: true }).click()
  await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/mikel-pastor?locale=es_ES')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hacerlo simple.Hacerlo bien.')
})

test('contact details are loaded from the configuration', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Ir al inicio' })).toHaveText('Mikel Pastor.')
  await expect(page.getByText('SOFTWARE DEVELOPER', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Hablemos' })).toHaveAttribute('href', 'mailto:mikelp243@gmail.com')
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', 'https://github.com/mikelpastor24')
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://linkedin.com/in/mikel-pastor?locale=es_ES')
})

test('new social networks support custom icons and URLs per language', async ({ page, isMobile }) => {
  const customConfiguration = structuredClone(configuration)
  customConfiguration.profile.socialLinks.push(
    {
      id: 'example-community',
      name: 'Example Community',
      url: { es: 'https://example.com/es/profile', en: 'https://example.com/en/profile' },
      icon: '/icons/community.svg',
    },
    {
      id: 'english-community',
      name: 'English Community',
      url: { es: '  ', en: 'https://example.com/en/community' },
      icon: '/icons/community.svg',
    },
  )
  await page.route('**/src/content/portfolio.json*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default ${JSON.stringify(customConfiguration)}`,
  }))
  await page.route('**/icons/community.svg', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>',
  }))
  const iconResponse = page.waitForResponse('**/icons/community.svg')
  await page.goto('/')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  expect((await iconResponse).ok()).toBe(true)
  const communityLink = page.getByRole('link', { name: 'Example Community', exact: true })
  await expect(communityLink).toBeVisible()
  await expect(communityLink).toHaveAttribute('href', 'https://example.com/es/profile')
  await communityLink.focus()
  await expect(communityLink).toBeFocused()
  await expect(page.getByRole('link', { name: 'English Community', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(communityLink).toHaveAttribute('href', 'https://example.com/en/profile')
  await expect(page.getByRole('link', { name: 'English Community', exact: true })).toHaveAttribute('href', 'https://example.com/en/community')
  await page.evaluate(async () => { await document.fonts.ready })
  const widths = isMobile ? [page.viewportSize()!.width] : [320, 641, 768, 1024, 1440]
  for (const width of widths) {
    if (!isMobile) await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Social links at viewport width ${width}`).toBe(true)
  }
  await page.getByRole('button', { name: 'Español', exact: true }).click()
  await expect(page.getByRole('link', { name: 'English Community', exact: true })).toHaveCount(0)
})

test('language switching works when local storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked') } })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep it simple.Make it matter.')
})

test.describe('browser language preference', () => {
  test.use({ locale: 'en-US' })
  test('English is detected when no language preference has been saved', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('link', { name: 'Explore projects' })).toBeVisible()
  })
})

test('the layout fits small mobile, tablet, and desktop viewports in both languages', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Viewport resizing is covered by the desktop project without device emulation.')
  await page.goto('/')
  await page.evaluate(async () => { await document.fonts.ready })
  for (const width of [320, 640, 641, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const language of ['English', 'Español']) {
      await page.getByRole('button', { name: language, exact: true }).click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Viewport width ${width}, language ${language}`).toBe(true)
    }
  }
})

test('navigation uses English anchors in both languages and closes the mobile menu', async ({ page, isMobile }) => {
  await page.goto('/')
  for (const { button, messages } of [{ button: 'Español', messages: spanish }, { button: 'English', messages: english }]) {
    await page.getByRole('button', { name: button, exact: true }).click()
    const sections = [
      { id: 'projects', label: messages.navigation.projects },
      { id: 'about', label: messages.navigation.about },
      { id: 'contact', label: messages.navigation.contact },
    ]
    for (const { id, label } of sections) {
      if (isMobile) {
        await page.getByRole('button', { name: messages.navigation.openMenu }).click()
        await expect(page.getByRole('button', { name: messages.navigation.closeMenu })).toHaveAttribute('aria-expanded', 'true')
      }
      await page.getByRole('navigation').getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`).getByRole('heading', { level: 2 })).toBeInViewport()
      if (isMobile) await expect(page.getByRole('button', { name: messages.navigation.openMenu })).toHaveAttribute('aria-expanded', 'false')
    }

    await page.getByRole('link', { name: messages.navigation.home }).click()
    await expect(page).toHaveURL(/#home$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()
    await page.getByRole('link', { name: messages.footer.backToTop }).click()
    await expect(page).toHaveURL(/#home$/)
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport()

    await page.getByRole('link', { name: messages.skipToContent }).focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
    await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeInViewport()
  }
})

test('reduced motion keeps sections visible and disables animations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('link', { name: 'Explorar proyectos' }).click()
  await expect(page.getByRole('heading', { name: /Lo que va tomando forma/ })).toBeInViewport()
  const styles = await page.locator('.hero-copy').evaluate((element) => ({
    animation: getComputedStyle(element).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }))
  expect(styles).toEqual({ animation: 'none', scroll: 'auto' })
  await expect(page.locator('.reveal-pending')).toHaveCount(0)
})

test('Escape closes the mobile menu and restores focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Desktop navigation is always visible.')
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú' }).click()
  await page.getByRole('navigation').getByRole('link', { name: 'Proyectos' }).focus()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Proyectos' })).not.toBeVisible()
})
