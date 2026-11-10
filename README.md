# AkwapUI

An original, token-driven design system for **Vue 3**, **TypeScript** and **Tailwind CSS v4**, inspired by the calm, accessible feel of Fluent 2. It contains no Microsoft branding or assets.

- Two-layer design tokens with a brand colour you can change at runtime
- Light, dark and high-contrast themes
- About 60 accessible components, 4 layouts and 16 example pages
- A documentation site with live examples and a component playground
- Tested for WCAG 2.1 AA with axe, and from 320px to 1920px wide

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 for the example site, `/docs` for the documentation, `/docs/playground` for the playground and `/dashboard` for the dashboard demo (demo sign-in password: `Akwap!2026`).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Type-check and build the site |
| `npm run build:lib` | Build the reusable library into `dist-lib/` |
| `npm run typecheck` | Type-check everything |
| `npm test` | Unit and component tests |
| `npm run test:e2e` | End-to-end, responsive and accessibility tests |

## Documentation

- [Design system](docs/DESIGN_SYSTEM.md)
- [Installation](docs/INSTALLATION.md), including use in another app
- [Theme guide](docs/THEME_GUIDE.md)
- [Component guide](docs/COMPONENT_GUIDE.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Changelog and progress](docs/CHANGELOG.md)

## Licence

Released under the MIT licence (see `package.json`). Icons are from [Lucide](https://lucide.dev) (ISC licence).
