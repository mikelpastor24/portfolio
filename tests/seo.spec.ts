import { expect, test } from '@playwright/test'

const canonicalUrl = 'https://mikelpastor.com/'

test('crawlers can discover the canonical page without executing JavaScript', async ({ request, page }) => {
  const robotsResponse = await request.get('/robots.txt')
  expect(robotsResponse.status()).toBe(200)
  expect(robotsResponse.headers()['content-type']).toContain('text/plain')
  const robots = await robotsResponse.text()
  expect(robots).toMatch(/^User-agent:\s*\*\s*$/m)
  expect(robots).toMatch(/^Allow:\s*\/\s*$/m)
  expect(robots).not.toMatch(/^Disallow:\s*\S+/im)
  const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)/im)?.[1]
  expect(sitemapUrl).toBe(`${canonicalUrl}sitemap.xml`)

  const sitemapResponse = await request.get(new URL(sitemapUrl!).pathname)
  expect(sitemapResponse.status()).toBe(200)
  expect(sitemapResponse.headers()['content-type']).toMatch(/(?:application|text)\/xml/)
  const sitemap = await sitemapResponse.text()
  const sitemapData = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, 'application/xml')
    return {
      valid: !document.querySelector('parsererror'),
      namespace: document.documentElement.namespaceURI,
      urls: Array.from(document.querySelectorAll('loc'), (element) => element.textContent),
    }
  }, sitemap)
  expect(sitemapData.valid).toBe(true)
  expect(sitemapData.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9')
  expect(sitemapData.urls).toEqual([canonicalUrl])

  const response = await request.get(new URL(canonicalUrl).pathname)
  expect(response.status()).toBe(200)
  expect(response.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex|none/i)
  const html = await response.text()
  const metadata = await page.evaluate((source) => {
    const document = new DOMParser().parseFromString(source, 'text/html')
    return {
      canonicals: Array.from(document.querySelectorAll('link[rel="canonical"]'), (link) => link.getAttribute('href')),
      socialUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    }
  }, html)
  expect(metadata.canonicals).toEqual(sitemapData.urls)
  expect(metadata.socialUrl).toBe(canonicalUrl)
  expect(metadata.robots).not.toMatch(/noindex|none/i)
  expect(metadata.title).toContain('Mikel Pastor')
  expect(metadata.description).toContain('Mikel Pastor')
  expect(html).not.toContain('%PORTFOLIO_')
})

test('language selection and navigation preserve the canonical URL', async ({ page }) => {
  await page.goto('/?utm_source=search#projects')
  for (const language of ['English', 'Español']) {
    await page.getByRole('button', { name: language, exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', language === 'English' ? 'en' : 'es')
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl)
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl)
  }
  await page.reload()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl)
})
