# Customization

[Back to the project overview](../README.md)

## Profile and projects

Edit [`src/content/portfolio.json`](../src/content/portfolio.json) to change the name, specialty, introduction, email, social links, and projects. The included configuration contains Mikel Pastor's profile; replace it with your own details when adapting the project. Contact links appear only when a value is configured. Once the introduction is complete, set `aboutIsPlaceholder` to `false`.

The included projects are this portfolio, gamer-jev, and schema_engine (the monorepo containing the Dart engine and Flutter UI packages). Each project can include `url` and `repository`; these links appear in its details dialog. Leave a link empty when no public destination is available.

The `preview` field selects a decorative illustration: `portfolio`, `gamer`, `schema`, or `concept`. These previews are illustrations, not screenshots of the projects. Set `isExample` to `true` for sample projects so the interface labels them clearly.

Keep unfinished content clearly identified as a placeholder. Do not present sample projects as completed professional work.

## Project images and videos

Add an optional `media` array to a project to show real screenshots or recordings in its details dialog. Each item has a `type` (`image` or `video`), a `src`, and a descriptive `title` in both languages. The title also provides the accessible image description or video label. Videos can include a `poster` image.

```json
"cover": "/media/gamer-jev/jev-beats-pokemon-red-first-gym.jpg",
"media": [
  {
    "type": "video",
    "src": "/media/gamer-jev/jev-starts-playing-pokemon-red.mp4",
    "poster": "/media/gamer-jev/jev-starts-playing-pokemon-red.jpg",
    "title": { "es": "Jev empieza Pokémon Rojo", "en": "Jev starts Pokémon Red" }
  },
  {
    "type": "image",
    "src": "/media/my-project/screenshot.webp",
    "title": { "es": "Vista del proyecto", "en": "Project overview" }
  }
]
```

Place published files in `public/media/<project-id>/` and use URLs starting with `/media/` in JSON. The optional `cover` selects the image shown in the project card. Without it, the card uses the first image or video poster; projects without a suitable image keep their decorative preview.

The gallery supports both images and videos. Videos have native playback controls, play inline on mobile, and load on demand without autoplay. Switching media or closing the dialog pauses playback. Use descriptive localized titles, readable images, and web-compatible video formats such as MP4 with H.264 video and AAC audio.

### Preparing recordings for the web

Keep original MP4 recordings in `assets/<project-id>/`. This source folder is ignored by Git; publish optimized versions from `public/media/` instead. With FFmpeg installed and available on your PATH:

```sh
node scripts/prepare-project-media.mjs
```

Alternatively, provide its executable path:

```sh
node scripts/prepare-project-media.mjs --ffmpeg /path/to/ffmpeg
```

The script preserves the original files and the complete recording duration. It produces 1280-pixel-wide H.264/AAC MP4 videos at 24 fps with a bitrate cap, moves metadata to the start of each video for streaming, and extracts JPEG posters. Existing outputs are skipped; move an output aside before regenerating it. Use `--posters-only` to generate just the poster images.

Check each video and poster before publishing, and add the generated paths and translated titles to the project's `media` array. FFmpeg is a media preparation tool, not an application dependency.

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
