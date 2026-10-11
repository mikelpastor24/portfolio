# Development

[Back to the project overview](../README.md)

## Prerequisites

- Node.js 22.12 or later.
- npm.
- Google Chrome for the default browser tests.

## Local development

Run these commands from the repository root:

```sh
npm install
npm run dev
```

The website runs at `http://127.0.0.1:5173`. Vite reports a different port if that one is already in use.

The application does not require external services to run. The DM Sans font is served from the project's files.

## Linting and production builds

```sh
npm run lint
npm run build
npm run preview
```

`lint` runs Oxlint. `build` checks TypeScript and generates the production website in `dist/`. `preview` serves that build locally for review.

Portfolio data and translations are included at build time. Vite reloads JSON changes during development; rebuild the application to update a deployed website.

GitHub Actions checks and publishes pushes to `main`. See [Deployment](deployment.md) for the workflow and the one-time GitHub Pages and custom domain setup.

## Browser tests

With Google Chrome installed:

```sh
npm test
```

Playwright checks runtime errors, horizontal overflow, navigation, dialog focus, the mobile menu, reduced motion, localization, contact links, and theme behavior. The tests start their own development server on port 4173 and use Google Chrome for both desktop and mobile emulation.

They also save full-page screenshots for both languages, desktop and mobile layouts, and dark mode in `artifacts/`.

### Using Playwright's Chromium

Install Chromium:

```sh
npx playwright install chromium
```

Set `PLAYWRIGHT_CHANNEL=chromium` in your terminal and run the tests. In PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = "chromium"
npm test
```

In a POSIX shell:

```sh
PLAYWRIGHT_CHANNEL=chromium npm test
```

The browser configuration is in [`playwright.config.ts`](../playwright.config.ts).
