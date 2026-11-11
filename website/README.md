# Akwap Systems website

Company website for Akwap Systems (Turkana, Kenya): IoT & embedded systems, software systems, smart irrigation and solar.
Built on AkwapUI: it imports components, tokens and Tailwind utilities straight from `../src`.

```bash
npm run dev:website      # http://localhost:5180
npm run build:website    # type-checks, then builds to dist-website/
npm run preview:website  # serves the build on http://localhost:4180
```

## Where things live

| Path | What |
| --- | --- |
| `src/content.ts` | All copy: company details, the four solutions, sectors, process. Edit text here. |
| `src/styles.css` | Brand seed (`--ak-brand-hue: 178`, Lake Turkana jade) plus site colours `--site-jade`, `--site-sun`. |
| `src/components/AkwapMark.vue` | The globe + orbit + star logo mark (SVG, token-coloured). |
| `src/components/StellarGlobe.vue` | Animated hero globe (canvas; still frame under reduced motion). |
| `public/akwap-systems-logo.svg` | Standalone logo lockup for print, social and email. |

## Before launch

- Confirm the contact email in `src/content.ts` (currently a placeholder).
- The contact form has no backend: it opens the visitor's mail app with the message filled in. Replace `submit()` in `ContactPage.vue` with an API call when one exists.
- The site is a single-page app, so the host must rewrite unknown paths to `index.html`.
