// Post-process dist-lib/types: rewrite "@/..." path aliases to relative
// paths (TypeScript does not rewrite `paths`) and drop CSS side-effect imports.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const root = new URL('../dist-lib/types/', import.meta.url).pathname
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
let changed = 0
for (const file of walk(root).filter((f) => f.endsWith('.d.ts'))) {
  const src = readFileSync(file, 'utf8')
  const out = src
    .replace(/(from\s+|import\(\s*)(['"])@\/([^'"]+)\2/g, (_, pre, q, p) => {
      let rel = relative(dirname(file), join(root, p))
      if (!rel.startsWith('.')) rel = `./${rel}`
      return `${pre}${q}${rel}${q}`
    })
    .replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '')
  if (out !== src) {
    writeFileSync(file, out)
    changed++
  }
}
console.log(`fix-lib-types: rewrote ${changed} declaration files`)
