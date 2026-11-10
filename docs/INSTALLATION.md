# Installation

## Requirements

- Node.js 20.19 or newer (Vite 8 requirement)
- npm 10 or newer

## Run the project

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-checks (`vue-tsc -b`) and builds the site into `dist/` |
| `npm run preview` | Serves `dist/` |
| `npm run build:lib` | Builds the reusable library into `dist-lib/` |
| `npm run typecheck` | Type-checks app, unit tests, end-to-end tests and configs |
| `npm test` | Unit and component tests (Vitest + jsdom) |
| `npm run test:e2e` | End-to-end, responsive and axe accessibility tests (Playwright) |

The end-to-end tests build the site and serve it on port 4173. If Playwright's own browser is not installed, run `npx playwright install chromium`, or point at an existing Chromium with `PW_CHROMIUM=/path/to/chromium npm run test:e2e`.

## Use AkwapUI in a Django project

See the [Django guide](DJANGO.md).

## Use AkwapUI in another Vue app

### Option A: the library build

```bash
npm run build:lib
# dist-lib/akwapui.js      ES module with every component and composable
# dist-lib/style.css       tokens, themes and the utilities the components use
# dist-lib/styles/         source CSS for apps that run Tailwind themselves
# dist-lib/types/          TypeScript declarations
```

In the host app:

```bash
npm install vue vue-router @lucide/vue
npm install ../akwapui        # or publish the package to your registry
```

```ts
// main.ts
import { createApp } from 'vue'
import AkwapUI from 'akwapui'
import 'akwapui/style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).use(AkwapUI).mount('#app') // registers every Ak* component
```

Or import only what you need:

```ts
import { AkButton, AkField, AkInput, useToast, useTheme } from 'akwapui'
```

Place `<AkToaster />` once near the root if you use toasts.

To use the Tailwind utilities (`bg-surface`, `text-secondary`…) in your own templates, run Tailwind v4 in the host app and import the AkwapUI theme:

```css
@import 'akwapui/tailwind.css';
@source '../node_modules/akwapui/dist-lib';
```

Components that navigate (`AkButton` with `to`, `AkNavList`, `AkBreadcrumb`, `AkLink`) need vue-router in the host app.

This flow was checked with a separate Vite + Vue app: it type-checks in strict mode, builds, and renders components, toasts, theme switching and brand changes.

### Option B: copy the source

Copy `src/styles`, `src/components/ui`, `src/components/shared`, `src/composables`, `src/utils` and `src/design-system` into your project, keep the `@/` alias pointing at `src`, and import `src/styles/tailwind.css` from your main stylesheet.

### Avoid a flash of the wrong theme

Add this before your app script in `index.html`:

```html
<script>
  (function () {
    try {
      var pref = localStorage.getItem('akwapui:theme') || 'system';
      var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var forced = window.matchMedia('(forced-colors: active)').matches;
      document.documentElement.setAttribute('data-theme',
        pref === 'system' ? (forced ? 'high-contrast' : dark ? 'dark' : 'light') : pref);
    } catch (e) {}
  })();
</script>
```
