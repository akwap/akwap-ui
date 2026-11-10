// Builds the Django package's generated assets from the design-system source:
//
//   1. tailwind/      the token, theme and utility CSS (src/styles) plus the
//                     Django component classes, for apps that run Tailwind
//   2. icons.json     the AkwapUI semantic icon set (+ a few Lucide extras)
//                     as SVG markup for the {% ak_icon %} tag
//   3. static/akwapui/akwapui.css  a prebuilt stylesheet for apps without Node
//
// Run from the repo root with `npm run build:django`.
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '../../..')
const django = join(here, '..')
const pkg = join(django, 'src/akwapui_django')
const twDir = join(pkg, 'tailwind')

// ---- 1. Tailwind sources -------------------------------------------------
rmSync(twDir, { recursive: true, force: true })
mkdirSync(twDir, { recursive: true })
for (const f of ['tokens.css', 'themes.css', 'typography.css', 'components.css']) {
  cpSync(join(root, 'src/styles', f), join(twDir, f))
}
// tailwind.css minus `@import 'tailwindcss'`: the host app imports Tailwind
// itself, so the package CSS never has to resolve node_modules from site-packages.
const theme = readFileSync(join(root, 'src/styles/tailwind.css'), 'utf8').replace(/^@import 'tailwindcss';\n/m, '')
if (theme.includes("@import 'tailwindcss'")) throw new Error('could not strip the tailwindcss import')
writeFileSync(
  join(twDir, 'theme.css'),
  theme.replace(/@import '\.\/components\.css';\n?$/m, "@import './components.css';\n@import './django.css';\n@import './django-badges.css';\n"),
)
cpSync(join(django, 'styles/django-components.css'), join(twDir, 'django.css'))
writeFileSync(join(twDir, 'django-badges.css'), badgeCss())
writeFileSync(
  join(twDir, 'README.md'),
  '# Generated\n\nCopied from `src/styles` and `integrations/django/styles` by `npm run build:django`. Do not edit here.\n',
)

// ---- 2. Icons ------------------------------------------------------------
await buildIcons()

// ---- 3. Prebuilt CSS -----------------------------------------------------
const tmp = join(django, '.build')
mkdirSync(tmp, { recursive: true })
const entry = join(tmp, 'prebuilt.css')
const rel = (p) => relative(tmp, p).split('\\').join('/')
writeFileSync(
  entry,
  `@import 'tailwindcss' source(none);
@import '${rel(join(twDir, 'theme.css'))}';
@source '${rel(join(pkg, 'templates'))}';
@source '${rel(join(pkg, 'static/akwapui/akwapui.js'))}';
/* A small layout toolkit so apps without their own Tailwind build can still lay out pages. */
@source inline('{,sm:,md:,lg:,xl:}{flex,inline-flex,grid,block,inline-block,hidden,contents}');
@source inline('{,sm:,md:,lg:,xl:}{flex-col,flex-row,flex-wrap,flex-1,shrink-0,grow,items-start,items-center,items-end,items-baseline,justify-start,justify-center,justify-end,justify-between,self-start,self-center}');
@source inline('{,sm:,md:,lg:,xl:}grid-cols-{1,2,3,4,6,12}');
@source inline('{,sm:,md:,lg:,xl:}col-span-{1,2,3,4,6,12,full}');
@source inline('{,sm:,md:,lg:}{gap,gap-x,gap-y,p,px,py,pt,pb,m,mx,my,mt,mb}-{0,1,2,3,4,5,6,8,10,12,16}');
@source inline('{,sm:,md:,lg:}space-y-{1,2,3,4,6,8}');
@source inline('{w-full,h-full,min-w-0,min-h-screen,max-w-sm,max-w-md,max-w-lg,max-w-xl,max-w-2xl,max-w-3xl,max-w-4xl,max-w-5xl,max-w-6xl,max-w-7xl,mx-auto,truncate,sr-only,text-left,text-center,text-right,tabular-nums,overflow-auto,overflow-hidden,sticky,top-0,relative,absolute}');
@source inline('text-{display,large-title,title-1,title-2,title-3,subtitle-1,subtitle-2,body-1,body-1-strong,body-2,caption-1,caption-1-strong,caption-2}');
@source inline('text-{primary,secondary,tertiary,disabled,inverse,brand,link,success,warning,danger,info}');
@source inline('bg-{background,background-secondary,surface,surface-secondary,surface-tertiary,brand,brand-subtle}');
@source inline('{border,border-t,border-b,border-default,border-subtle,border-strong,rounded-card,rounded-control,rounded-md,rounded-full,shadow-elevation-2,shadow-elevation-4,shadow-elevation-8,font-semibold,font-mono}');
`,
)
execFileSync(join(root, 'node_modules/.bin/tailwindcss'), ['-i', entry, '-o', join(pkg, 'static/akwapui/akwapui.css'), '--minify'], {
  cwd: tmp,
  stdio: 'inherit',
})
rmSync(tmp, { recursive: true, force: true })
console.log('build:django: tailwind/, icons.json, static/akwapui/akwapui.css')

// ---------------------------------------------------------------------------
function badgeCss() {
  const accents = ['red', 'orange', 'amber', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'magenta', 'pink']
  const base = {
    brand: { filled: 'border-transparent bg-brand text-on-brand', tint: 'bg-brand-subtle text-brand border-brand-secondary', outline: 'text-brand border-brand-stroke' },
    neutral: { filled: 'border-transparent bg-surface-inverse text-inverse', tint: 'bg-surface-selected text-secondary border-line-subtle', outline: 'text-secondary border-line' },
    success: { filled: 'border-transparent bg-success-strong text-on-status', tint: 'bg-success-background text-success border-success-border', outline: 'text-success border-success-border' },
    warning: { filled: 'border-transparent bg-warning-strong text-on-status', tint: 'bg-warning-background text-warning border-warning-border', outline: 'text-warning border-warning-border' },
    danger: { filled: 'border-transparent bg-danger-strong text-on-brand', tint: 'bg-danger-background text-danger border-danger-border', outline: 'text-danger border-danger-border' },
    info: { filled: 'border-transparent bg-info-strong text-on-status', tint: 'bg-info-background text-info border-info-border', outline: 'text-info border-info-border' },
  }
  for (const a of accents) {
    base[a] = { filled: `border-transparent bg-${a}-strong text-on-accent`, tint: `bg-${a}-background text-${a} border-${a}-border`, outline: `text-${a} border-${a}-border` }
  }
  let css = '/* Generated by integrations/django/scripts/build.mjs — badge colours, mirroring AkBadge.vue. */\n@layer components {\n'
  // Default appearance is tint: `.ak-badge-success`; `.ak-badge-filled` / `.ak-badge-outline` switch it.
  for (const [c, look] of Object.entries(base)) {
    css += `  .ak-badge-${c} { @apply ${look.tint}; }\n`
    css += `  .ak-badge-filled.ak-badge-${c} { @apply ${look.filled}; }\n`
    css += `  .ak-badge-outline.ak-badge-${c} { @apply bg-transparent ${look.outline}; }\n`
  }
  css += '  .ak-badge:not([class*="ak-badge-"]) { @apply ' + base.neutral.tint + '; }\n'
  // Avatar colours share the accent palette.
  for (const a of accents) css += `  .ak-avatar-${a} { @apply bg-${a}-background text-${a}; }\n`
  return css + '}\n'
}

async function buildIcons() {
  const { createServer } = await import('vite')
  const { renderToString } = await import('vue/server-renderer')
  const { h } = await import('vue')
  const server = await createServer({ root, configFile: false, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, resolve: { alias: { '@': join(root, 'src') } } })
  try {
    const { iconGroups } = await server.ssrLoadModule('/src/components/ui/icons/icons.ts')
    const lucide = await server.ssrLoadModule('@lucide/vue')
    const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Za-z])([0-9])/g, '$1-$2').toLowerCase()
    const inner = async (component) => {
      const html = await renderToString(h(component, { size: 24 }))
      return html.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<!--[^>]*-->/g, '')
    }
    const icons = {}
    const labels = {}
    for (const group of Object.values(iconGroups)) {
      for (const [name, { icon, label }] of Object.entries(group)) {
        const svg = await inner(icon)
        icons[name] = svg
        icons[kebab(name)] = svg
        labels[name] = label
        // Lucide's own name, from the last `lucide-<name>` class on the rendered <svg>.
        const html = await renderToString(h(icon, { size: 24 }))
        const lucideName = html.match(/class="([^"]*)"/)?.[1].split(' ').filter((c) => c.startsWith('lucide-')).pop()
        if (lucideName) icons[lucideName.slice('lucide-'.length)] ??= svg
      }
    }
    // Lucide icons the Django templates use that are not in the semantic set.
    for (const extra of ['ChevronsLeft', 'ChevronsRight', 'TrendingUp', 'TrendingDown', 'Inbox', 'Bold', 'Package', 'ShoppingCart', 'Activity']) {
      icons[kebab(extra)] = await inner(lucide[extra])
    }
    const sorted = Object.fromEntries(Object.entries(icons).sort(([a], [b]) => a.localeCompare(b)))
    writeFileSync(join(pkg, 'icons.json'), JSON.stringify({ semantic: labels, icons: sorted }, null, 0) + '\n')
  } finally {
    await server.close()
  }
}
