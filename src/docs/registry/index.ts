import { docSections } from '../nav'
import { actionFormDocs } from './actions-forms'
import { displayDocs } from './display'
import { overlayNavDocs } from './overlays-nav'
import type { ComponentDoc } from './types'

const all = [...actionFormDocs, ...displayDocs, ...overlayNavDocs]
const order = docSections.find((s) => s.id === 'components')!.links.map((l) => l.slug)

/** Component docs in sidebar order. Every sidebar slug must have an entry. */
export const componentDocs: ComponentDoc[] = order.map((slug) => {
  const doc = all.find((d) => d.slug === slug)
  if (!doc) throw new Error(`No component doc for "${slug}"`)
  return doc
})
