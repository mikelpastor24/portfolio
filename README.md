# Personal portfolio

A personal portfolio built with React, TypeScript, and Vite. The design uses warm neutral colors, a green accent, self-hosted typography, and subtle CSS animations.

## Development

Prerequisites: Node.js 22.12 or later and npm.

```sh
npm install
npm run dev
```

The website runs at `http://127.0.0.1:5173`. Vite reports a different port if that one is already in use.

```sh
npm run lint
npm run build
npm run preview
```

`build` checks TypeScript and generates the production website in `dist/`. `preview` serves that build locally for review.

## Customizing the content

Edit `src/content/portfolio.json` to change the name, specialty, introduction, email, social links, and projects. The included configuration contains Mikel Pastor's profile; replace it with your own details when adapting the project. Contact links appear only when a value is configured. Once the introduction is complete, set `aboutIsPlaceholder` to `false`.

The first project describes this website. The second is a visual concept explicitly labeled as an example: replace it with a real project or remove it. Each project can include `url` and `repository`; these links appear in its details dialog.

The page title and metadata are generated from the JSON configuration and translations, so you do not need to repeat your name in the HTML. The favicon is in `public/favicon.svg` and uses a centered MP monogram outlined from DM Sans, matching the website's wordmark font.

### Social links and icons

Social networks are listed in `profile.socialLinks`. Each entry has a unique English `id`, a display `name`, a `url`, and an `icon` path:

```json
{
  "id": "github",
  "name": "GitHub",
  "url": "https://github.com/mikelpastor24",
  "icon": "/icons/github.svg"
}
```

To add any other network, place its monochrome SVG in `public/icons/` and add an entry to the array. No component changes are needed. Icons use CSS masks to match the link color in light and dark themes, while the text remains the link's accessible name. A URL can be a string or an object with `es` and `en` destinations; links with an empty or whitespace-only URL for the selected language are hidden.

The included GitHub and LinkedIn icons come from [Bootstrap Icons](https://icons.getbootstrap.com/). Their MIT license is preserved in `public/icons/LICENSE`.

## Spanish and English

UI text is stored in `src/i18n/locales/es.json` and `src/i18n/locales/en.json`. Profile and project text is grouped in the content JSON using the `es` and `en` keys:

```json
"title": { "es": "Mi proyecto", "en": "My project" }
```

The ES / EN selector updates all sections, project details, accessible labels, and metadata. The selection is saved in `localStorage`. On the first visit, the application detects a supported browser language and falls back to Spanish if none is found.

The LinkedIn link also depends on the selected language. Edit the LinkedIn entry's `url` in `profile.socialLinks` inside `src/content/portfolio.json`:

```json
"url": {
  "es": "https://linkedin.com/in/mikel-pastor?locale=es_ES",
  "en": "https://linkedin.com/in/mikel-pastor"
}
```

In Spanish, the link requests the Spanish profile version; in English, it uses the regular URL. The Spanish content must already exist on LinkedIn: the link does not translate or create a profile. [LinkedIn Learning explains profile language versions and their links](https://fr.linkedin.com/learning/l-essentiel-de-linkedin-17493922/creer-un-profil-dans-une-autre-langue-et-personnaliser-son-url).

JSON files are included at build time. You can edit them without modifying components; rebuild the application to update a deployed website. Vite reloads changes during development.

## Light, dark, and system themes

The theme selector is next to the language selector in the header. On the first visit, the application follows the operating system's preference. The `System` option also reacts to changes while the page is open.

Choosing `Light` or `Dark` saves the preference in `localStorage` under `portfolio.theme` and preserves it across reloads. Selecting `System` removes the manual preference. If the browser blocks storage, the selector still works during the current visit.

`public/theme-init.js` applies the preference before React loads to prevent a flash of the wrong theme. `src/theme/ThemeProvider.tsx` manages the theme, listens for system changes, and updates the browser's theme color. Both palettes are defined with variables in `src/styles.css`.

## Project structure

- `src/App.tsx`: page composition and project selection.
- `src/components/`: navigation, sections, previews, and the project dialog.
- `src/content/portfolio.json`: personal information and editable content in both languages.
- `src/i18n/`: translations, language detection, and selection.
- `src/theme/`: application theme and system preferences.
- `src/styles.css`: styling, responsive layout, and reduced motion support.
- `public/icons/`: social SVG icons and their license notice.
- `tests/portfolio.spec.ts`: browser checks for desktop and mobile.
- `tests/theme.spec.ts`: system theme detection, manual selection, and persistence.

## Browser tests

With Google Chrome installed:

```sh
npm test
```

The tests check runtime errors, horizontal overflow, navigation, dialog focus, the mobile menu, reduced motion, localization, contact links, and theme behavior. They start their own server on port 4173.

They also save full-page screenshots for both languages, desktop and mobile layouts, and dark mode in `artifacts/`.

To use Playwright's Chromium instead of Chrome:

```sh
npx playwright install chromium
```

Then set `PLAYWRIGHT_CHANNEL=chromium` in your terminal and run `npm test`. By default, the tests use Google Chrome for both desktop and mobile emulation.

The application does not require external services to run. The DM Sans font is served from the project's files.

## Repository language

Write all code in English, including variable, function, type, and component names, filenames, CSS classes and custom properties, DOM IDs, configuration keys, and internal slugs. Documentation, comments, test descriptions, diagnostics, and other developer-facing text must also be in English. Keep UI content localized in Spanish and English, including accessible labels and the Spanish strings used in UI assertions.

Section anchors are `#home`, `#projects`, `#about`, and `#contact`; the skip link targets `#main-content`. These identifiers stay the same in both languages.

## License

This project is licensed under the [MIT License](LICENSE), copyright 2026 Mikel Pastor. Third-party dependencies and assets retain their respective licenses, including the [Bootstrap Icons notice](public/icons/LICENSE).
