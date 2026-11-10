import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'

/**
 * Exposes `virtual:lucide-icon-data`: every Lucide icon as plain SVG node data
 * (plus its alias names), keyed by component name. The docs icon library imports it on demand and
 * renders icons with `createLucideIcon`, so the full set lives in one lazy
 * data chunk and never mixes with the icons an app actually imports.
 */
const ID = 'virtual:lucide-icon-data'
const RESOLVED = '\0' + ID

export function lucideIconData(): Plugin {
  return {
    name: 'akwapui:lucide-icon-data',
    resolveId(id) {
      return id === ID ? RESOLVED : undefined
    },
    load(id) {
      if (id !== RESOLVED) return
      const require = createRequire(import.meta.url)
      const pkgDir = dirname(require.resolve('@lucide/vue/package.json'))
      const dir = join(pkgDir, 'dist/esm/icons')
      const data: Record<string, unknown> = {}
      for (const file of readdirSync(dir)) {
        if (!file.endsWith('.mjs')) continue
        const src = readFileSync(join(dir, file), 'utf8')
        const name = /const (\w+) = createLucideIcon\(/.exec(src)?.[1]
        const literal = /const __iconData = (\{[\s\S]*?\n\});/.exec(src)?.[1]
        if (!name || !literal) continue
        // __iconData is a plain object literal (strings, numbers and arrays only).
        const icon = new Function(`return ${literal}`)() as { node: [string, Record<string, string>][]; aliases?: string[] }
        data[name] = {
          node: icon.node.map(([tag, { key: _key, ...attrs }]) => [tag, attrs]),
          ...(icon.aliases?.length ? { aliases: icon.aliases } : {}),
        }
      }
      return `export default ${JSON.stringify(data)}`
    },
  }
}
