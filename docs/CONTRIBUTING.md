# Contributing

## Set up

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

All four must pass.

## Rules

- **Original work only.** No Microsoft (or other third-party) logos, icons, fonts, illustrations or copied code. Icons come from `@lucide/vue`.
- **Tokens, not values.** Use semantic utilities (`bg-surface`, `text-secondary`, `border-line-subtle`, `rounded-control`). Do not add hex colours or arbitrary pixel values to components. If a value is missing, add a token.
- **Accessible first.** Keyboard support, visible focus, labels and ARIA are part of "done", not follow-ups.
- **Responsive.** Check 320px, 768px and 1280px. Nothing but tables and code blocks may scroll horizontally.
- **Three themes.** Check light, dark and high contrast.
- **No dead ends.** No placeholder buttons, empty links or "coming soon" screens.
- **Minimal dependencies.** Discuss before adding a runtime dependency.

## Adding a component

1. Create `src/components/ui/<area>/AkThing.vue` with `<script setup lang="ts">`, typed props with defaults and a doc comment at the top.
2. Support `size` (`sm`/`md`/`lg`) if it is a control, `v-model` if it holds a value, and `disabled` where it makes sense.
3. Export it, and any public types, from `src/design-system/index.ts`, and add it to the `components` map so the plugin registers it.
4. Add unit tests in `tests/unit/` for behaviour, keyboard and ARIA.
5. Document it:
   - Add example SFCs in `src/docs/examples/<slug>/`. The docs show their exact source, so keep them short and realistic.
   - Add a `ComponentDoc` entry in `src/docs/registry/` with all 14 sections, and its slug to `src/docs/nav.ts`.
   - Every claim (sizes, keys, ARIA) must match the code.
6. Run the full checks above. New routes are picked up by the end-to-end route and responsive tests automatically.

## Adding a documentation page

Prose pages are data. Add an entry to the right file in `src/docs/content/` using blocks (`h2`, `p`, `list`, `code`, `callout`, `table`, `links`, `example`, `preview`, `dodont`) and a matching item in `src/docs/nav.ts`. Inline text supports `` `code` ``, `**bold**` and `[label](/path)`.

## Commits and changelog

- Write commit messages in the imperative ("Add date range picker").
- Record user-facing changes in [CHANGELOG.md](./CHANGELOG.md) under "Unreleased".
- Follow semantic versioning: breaking prop or token changes need a major version.
