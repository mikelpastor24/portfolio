import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { formatProfileText, profile } from './src/content/portfolio.ts'
import spanish from './src/i18n/locales/es.json' with { type: 'json' }

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'portfolio-metadata',
      transformIndexHtml(html) {
        const title = profile.name ? `${profile.name} — ${profile.specialty}` : spanish.footer.personalPortfolio
        return html
          .replaceAll('%PORTFOLIO_TITLE%', escapeHtml(title))
          .replaceAll('%PORTFOLIO_DESCRIPTION%', escapeHtml(formatProfileText(spanish.meta.description)))
      },
    },
  ],
})
