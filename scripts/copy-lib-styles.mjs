// Ship the CSS sources so apps running Tailwind v4 can `@import 'akwapui/tailwind.css'`
// and use the semantic utilities (bg-surface, text-secondary, …) in their own templates.
import { cpSync } from 'node:fs'

cpSync(new URL('../src/styles/', import.meta.url), new URL('../dist-lib/styles/', import.meta.url), { recursive: true })
console.log('copy-lib-styles: dist-lib/styles')
