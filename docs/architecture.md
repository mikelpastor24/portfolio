# Architecture

[Back to the project overview](../README.md)

## Project structure

- [`src/App.tsx`](../src/App.tsx): page composition and project selection.
- [`src/components/`](../src/components/): navigation, sections, previews, and the project dialog.
- [`src/content/portfolio.json`](../src/content/portfolio.json): personal information and editable content in both languages.
- [`src/i18n/`](../src/i18n/): translations, language detection, and selection.
- [`src/theme/`](../src/theme/): application theme and system preferences.
- [`src/styles.css`](../src/styles.css): styling, responsive layout, and reduced motion support.
- [`public/theme-init.js`](../public/theme-init.js): theme initialization before React loads.
- [`public/icons/`](../public/icons/): social SVG icons and their license notice.
- [`tests/portfolio.spec.ts`](../tests/portfolio.spec.ts): browser checks for desktop and mobile.
- [`tests/theme.spec.ts`](../tests/theme.spec.ts): system theme detection, manual selection, and persistence.
- [`tests/media.spec.ts`](../tests/media.spec.ts): image galleries, video playback, loading, and error handling.
- [`public/media/`](../public/media/): published project images, video posters, and optimized recordings.
- [`scripts/prepare-project-media.mjs`](../scripts/prepare-project-media.mjs): prepares web recordings and posters from local originals in the ignored `assets/` folder.
- [`docs/`](./): development and maintenance documentation.
- [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml): checks, builds, and publishes `main` to GitHub Pages.

Project details use a dialog. Standalone project routes and Markdown articles have not been implemented.

The production website is served from the custom domain root with Vite's `base: '/'`. See [Deployment](deployment.md) for GitHub Pages and DNS setup.

## Language selection

`LocaleProvider` manages the selected language and saves it in `localStorage` under `portfolio.locale`. On the first visit, the application detects a supported browser language and falls back to English if none is found. A saved selection takes precedence over browser preferences. If storage is unavailable, language selection still works during the current visit.

Content editing and translation examples are in [Customization](customization.md).

## Themes

The theme selector is next to the language selector in the header. On the first visit, the application follows the operating system's preference. The `System` option also reacts to changes while the page is open.

Choosing `Light` or `Dark` saves the preference in `localStorage` under `portfolio.theme` and preserves it across reloads. Selecting `System` removes the manual preference. If the browser blocks storage, the selector still works during the current visit.

[`public/theme-init.js`](../public/theme-init.js) applies the preference before React loads to prevent a flash of the wrong theme. [`src/theme/ThemeProvider.tsx`](../src/theme/ThemeProvider.tsx) manages the theme, listens for system changes, and updates the browser's theme color. Both palettes are defined with variables in [`src/styles.css`](../src/styles.css).

## Repository conventions

Write all code in English, including variable, function, type, and component names, filenames, CSS classes and custom properties, DOM IDs, configuration keys, and internal slugs. Documentation, comments, test descriptions, diagnostics, and other developer-facing text must also be in English. Keep UI content localized in Spanish and English, including accessible labels and the Spanish strings used in UI assertions.

Section anchors are `#home`, `#projects`, `#about`, and `#contact`; the skip link targets `#main-content`. These identifiers stay the same in both languages. Update navigation, calls to action, skip links, and tests together when changing an ID.

Keep the root README focused on the project's purpose, features, and technologies. Put technical instructions in `docs/` and keep its guides aligned with the available commands and implementation.

Preserve the root [MIT license](../LICENSE) and third-party license and copyright notices. Do not store secrets or credentials in code or versioned files.
