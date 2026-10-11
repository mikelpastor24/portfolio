# Customization

[Back to the project overview](../README.md)

## Profile and projects

Edit [`src/content/portfolio.json`](../src/content/portfolio.json) to change the name, specialty, introduction, email, social links, and projects. The included configuration contains Mikel Pastor's profile; replace it with your own details when adapting the project. Contact links appear only when a value is configured. Once the introduction is complete, set `aboutIsPlaceholder` to `false`.

The first project describes this website. The second is a visual concept explicitly labeled as an example: replace it with a real project or remove it. Each project can include `url` and `repository`; these links appear in its details dialog.

Keep unfinished content clearly identified as a placeholder. Do not present sample projects as completed professional work.

## Social links and icons

Social networks are listed in `profile.socialLinks`. Each entry has a unique English `id`, a display `name`, a `url`, and an `icon` path:

```json
{
  "id": "github",
  "name": "GitHub",
  "url": "https://github.com/mikelpastor24",
  "icon": "/icons/github.svg"
}
```

To add another network, place its monochrome SVG in [`public/icons/`](../public/icons/) and add an entry to the array. No component changes are needed. Icons use CSS masks to match the link color in light and dark themes, while the text remains the link's accessible name. A URL can be a string or an object with `es` and `en` destinations; links with an empty or whitespace-only URL for the selected language are hidden.

The included GitHub and LinkedIn icons come from [Bootstrap Icons](https://icons.getbootstrap.com/). Their MIT license is preserved in [`public/icons/LICENSE`](../public/icons/LICENSE). Keep license and copyright notices with any additional assets.

## Spanish and English content

UI text is stored in [`src/i18n/locales/es.json`](../src/i18n/locales/es.json) and [`src/i18n/locales/en.json`](../src/i18n/locales/en.json). Translate all UI text, including accessible labels. Profile and project text is grouped in the content JSON using the `es` and `en` keys:

```json
"title": { "es": "Mi proyecto", "en": "My project" }
```

The ES / EN selector updates all sections, project details, accessible labels, and metadata. See [Architecture](architecture.md) for language detection and persistence.

The LinkedIn link also depends on the selected language. Edit the LinkedIn entry's `url` in `profile.socialLinks`:

```json
"url": {
  "es": "https://linkedin.com/in/mikel-pastor?locale=es_ES",
  "en": "https://linkedin.com/in/mikel-pastor"
}
```

In Spanish, the link requests the Spanish profile version; in English, it uses the regular URL. The Spanish content must already exist on LinkedIn: the link does not translate or create a profile. [LinkedIn Learning explains profile language versions and their links](https://fr.linkedin.com/learning/l-essentiel-de-linkedin-17493922/creer-un-profil-dans-une-autre-langue-et-personnaliser-son-url).

JSON files are included at build time. You can edit them without modifying components; [rebuild the application](development.md#linting-and-production-builds) to update a deployed website. Vite reloads changes during development.

## Metadata and favicon

The page title and metadata are generated from the JSON configuration and translations, so you do not need to repeat your name in the HTML. The favicon is in [`public/favicon.svg`](../public/favicon.svg) and uses a centered MP monogram outlined from DM Sans, matching the website's wordmark font.

## Colors and styling

Both theme palettes, responsive layouts, and animations are defined in [`src/styles.css`](../src/styles.css). Use CSS variables so changes work in both themes, and preserve reduced motion support. See [Architecture](architecture.md#themes) for theme selection and persistence.
