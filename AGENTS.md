# Project instructions

## Purpose

Build the user's personal website and portfolio with React.
The website should clearly present their profile, projects, and contact information.

## Confirmed decisions

- React is a project requirement.
- Communicate with the user in Spanish.
- The user wants to make this project public and open source. Write all code in English, including variable, function, type, and component names, filenames, CSS classes and custom properties, DOM IDs, configuration keys, and internal slugs. Write documentation, comments, test descriptions, diagnostics, and other developer-facing text in English too.
- The project uses the MIT license. Preserve the root `LICENSE` and third-party license and copyright notices.
- Keep the website available in Spanish and English. Spanish text is expected in localization data and test assertions that verify Spanish UI labels.
- The design should be simple and clean, with subtle animations and little visual noise.
- Personal information and projects must be editable through JSON.
- The theme follows the system by default. Users can choose light or dark mode or return to the system setting. Manual choices are remembered.
- The application uses React, TypeScript, Vite, and CSS. Vite and TypeScript were selected as the implementation foundation.
- His profile and links are in the configuration; the remaining professional content has yet to be defined.
- Publish the portfolio with GitHub Pages and GitHub Actions at `mikelpastor.com`, without `www` as the primary address. Keep Vite's `base: '/'` and root-relative asset URLs aligned with the custom domain.

## Structure and commands

- `src/content/portfolio.json` centralizes the profile, projects, and links. Unfinished content must remain clearly identified as a placeholder.
- Projects can include an optional `packages` array with a `name` and pub.dev `url` for each package. `ProjectPackageLinks` shows these links in both project cards and details dialogs.
- Projects can include a `media` array with `image` or `video` entries (`src`, localized `title`, and optional video `poster`) and an optional `cover`. `ProjectGallery` displays them with native video controls and pauses playback when switching media or closing the dialog. `ProjectThumbnail` uses real media when available and falls back to an illustration.
- Keep original recordings in the ignored `assets/<project-id>/` folder. `scripts/prepare-project-media.mjs` uses FFmpeg to create complete optimized MP4 recordings and JPEG posters in `public/media/<project-id>/`. Use `/media/` URLs in JSON; do not publish the large source recordings.
- `profile.socialLinks` lists social networks with an English `id`, a `name`, an `icon` path, and a `url` that can be a string or an `es`/`en` object. Place SVG icons in `public/icons/`; CSS masks make them follow the link color in both themes. Keep their license notices with the assets.
- `src/i18n/locales/es.json` and `en.json` contain UI text. Translate all new UI text, including accessible labels; `LocaleProvider` manages language selection and persistence.
- `src/components/` contains page sections and reusable components.
- Keep section IDs and URL fragments in English and stable across languages: `home`, `main-content`, `projects`, `about`, and `contact`. Update navigation, calls to action, skip links, and tests together when changing an ID.
- `src/styles.css` defines the responsive design and animations while respecting reduced motion preferences.
- `src/theme/ThemeProvider.tsx` manages the theme, and `public/theme-init.js` applies it before React loads. Keep the `portfolio.theme` storage key consistent and use CSS variables so new elements work in both themes.
- `npm run dev` starts the local server; `npm run build` checks TypeScript and generates `dist/`.
- `npm run lint` runs Oxlint; `npm test` checks desktop and mobile interactions with Playwright.
- `.github/workflows/deploy.yml` checks, builds, and publishes pushes to `main`, with a manual trigger. It runs browser tests in Google Chrome before deploying `dist/`. The custom domain is configured in GitHub Pages settings, not a `CNAME` file; `docs/deployment.md` documents the required setup.
- Browser checks use Google Chrome, as requested by the user.
- The README presents the project's purpose, features, technologies, and links to technical documentation in `docs/`. Setup and browser options for testing are documented in `docs/development.md`.

## Development

- Inspect the project before editing files and preserve the user's existing changes.
- Prefer functional React components and use hooks when needed.
- Keep components small and reusable, with clear names and specific responsibilities.
- Choose a simple structure and add dependencies only when they serve a concrete purpose.
- Separate portfolio data from presentation when it makes content easier to update.
- Keep the README concise and put technical instructions in `docs/`. Keep `docs/development.md` up to date with prerequisites and actual commands for installing dependencies, development, production builds, and browser tests.

## Design and content

- Design for mobile and desktop, with clear navigation and no accidental horizontal scrolling.
- Use semantic HTML, keyboard navigation, visible focus indicators, and sufficient contrast.
- Respect reduced motion preferences in animations.
- Maintain a clear visual hierarchy, consistent typography, spacing, and section styling.
- Optimize images and other assets for fast loading.
- Include introduction, about, projects, and contact sections as appropriate for the available content.
- Do not invent professional experience, projects, achievements, personal information, or links. Clearly identify placeholder content.
- Include suitable titles and metadata for sharing and search indexing.

## Verification

- Use the project's available scripts; inspect the configuration before assuming a command exists.
- After functional changes, run the relevant available checks, such as builds, linting, or tests.
- Check responsive behavior and primary interactions when possible.
- Add tests for meaningful logic; avoid tests that merely repeat markup or styles.
- Report what was verified and any checks that could not be run.

## Maintenance

- Keep these instructions aligned with the project's structure and tools.
- Do not store secrets or credentials in code or versioned files.
- Briefly explain what changed, why, and how it was checked.
