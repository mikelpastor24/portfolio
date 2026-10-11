import { expect, test } from '@playwright/test'
import configuration from '../src/content/portfolio.json' with { type: 'json' }

test('project videos load on demand, play, and pause when switching or closing', async ({ page }) => {
  const videoRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('.mp4')) videoRequests.push(request.url())
  })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Ver proyecto gamer-jev', exact: true })
  await trigger.click()
  const gallery = page.getByRole('region', { name: 'Imágenes y vídeos del proyecto' })
  const player = gallery.locator('video')
  await expect(player).toHaveAttribute('preload', 'none')
  await expect(player).toHaveJSProperty('paused', true)
  expect(videoRequests).toEqual([])

  const firstPlayer = await player.evaluateHandle((video: HTMLVideoElement) => video)
  await player.evaluate(async (video: HTMLVideoElement) => { video.muted = true; await video.play() })
  await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
  await gallery.getByRole('button', { name: 'Jev supera el primer gimnasio', exact: true }).click()
  expect(await firstPlayer.evaluate((video) => video.paused)).toBe(true)
  await expect(player).toHaveAttribute('src', '/media/gamer-jev/jev-beats-pokemon-red-first-gym.mp4')
  await expect(player).toHaveJSProperty('paused', true)
  await expect(gallery.getByRole('button', { name: 'Jev supera el primer gimnasio', exact: true })).toHaveAttribute('aria-pressed', 'true')
  expect(videoRequests.every((url) => url.includes('jev-starts-playing-pokemon-red.mp4'))).toBe(true)
  await gallery.screenshot({ path: `artifacts/${test.info().project.name}-gamer-jev-gallery.png`, animations: 'disabled' })

  const secondPlayer = await player.evaluateHandle((video: HTMLVideoElement) => video)
  await player.evaluate(async (video: HTMLVideoElement) => { video.muted = true; await video.play() })
  await expect.poll(() => player.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0.1)
  expect(await player.evaluate((video: HTMLVideoElement) => video.error)).toBeNull()
  const dialog = page.getByRole('dialog', { name: 'gamer-jev', exact: true })
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  expect(await secondPlayer.evaluate((video) => video.paused)).toBe(true)
  await expect(trigger).toBeFocused()

  await page.getByRole('button', { name: 'English', exact: true }).click()
  await page.getByRole('button', { name: 'View project gamer-jev', exact: true }).click()
  const englishGallery = page.getByRole('region', { name: 'Project images and videos' })
  await expect(englishGallery.locator('video')).toHaveAccessibleName('Jev starts Pokémon Red')
  await englishGallery.getByRole('button', { name: 'Jev beats the first gym', exact: true }).click()
  await expect(englishGallery.locator('video')).toHaveAccessibleName('Jev beats the first gym')
  await expect(englishGallery.locator('video')).toHaveJSProperty('paused', true)
})

test('project images can be configured in JSON and selected in either language', async ({ page }) => {
  const customConfiguration = {
    ...configuration,
    projects: configuration.projects.map((project) => project.id === 'schema-engine' ? {
      ...project,
      media: [
        { type: 'image', src: '/media/test-builder.svg', title: { es: 'Constructor de esquemas', en: 'Schema builder' } },
        { type: 'image', src: '/media/test-form.svg', title: { es: 'Formulario generado', en: 'Generated form' } },
      ],
    } : project),
  }
  await page.route('**/src/content/portfolio.json*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default ${JSON.stringify(customConfiguration)}`,
  }))
  await page.route('**/media/test-*.svg', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#34483d"/></svg>',
  }))
  await page.goto('/')
  for (const { language, view, galleryName, firstTitle, secondTitle } of [
    { language: 'Español', view: 'Ver proyecto', galleryName: 'Imágenes y vídeos del proyecto', firstTitle: 'Constructor de esquemas', secondTitle: 'Formulario generado' },
    { language: 'English', view: 'View project', galleryName: 'Project images and videos', firstTitle: 'Schema builder', secondTitle: 'Generated form' },
  ]) {
    await page.getByRole('button', { name: language, exact: true }).click()
    await page.getByRole('button', { name: `${view} schema_engine`, exact: true }).click()
    const gallery = page.getByRole('region', { name: galleryName })
    const firstImage = gallery.getByRole('img', { name: firstTitle, exact: true })
    await expect.poll(() => firstImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(320)
    await gallery.getByRole('button', { name: secondTitle, exact: true }).click()
    await expect(gallery.getByRole('img', { name: secondTitle, exact: true })).toHaveAttribute('src', '/media/test-form.svg')
    await expect(gallery.locator('video')).toHaveCount(0)
    await page.keyboard.press('Escape')
  }
})

test('a failed media file shows a translated message and a direct file link', async ({ page }) => {
  const customConfiguration = {
    ...configuration,
    projects: configuration.projects.map((project) => project.id === 'schema-engine' ? {
      ...project,
      media: [{ type: 'image', src: '/media/missing-image.png', title: { es: 'Captura del proyecto', en: 'Project screenshot' } }],
    } : project),
  }
  await page.route('**/src/content/portfolio.json*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `export default ${JSON.stringify(customConfiguration)}`,
  }))
  await page.route('**/media/missing-image.png', (route) => route.abort())
  await page.goto('/')
  for (const { language, view, message, link } of [
    { language: 'Español', view: 'Ver proyecto', message: 'No se ha podido cargar este archivo.', link: 'Abrir archivo' },
    { language: 'English', view: 'View project', message: 'This file could not be loaded.', link: 'Open file' },
  ]) {
    await page.getByRole('button', { name: language, exact: true }).click()
    await page.getByRole('button', { name: `${view} schema_engine`, exact: true }).click()
    await expect(page.getByRole('status')).toContainText(message)
    await expect(page.getByRole('status').getByRole('link', { name: link })).toHaveAttribute('href', '/media/missing-image.png')
    await page.keyboard.press('Escape')
  }
})
