import type { PropRow } from '../shared/PropsTable.vue'

/** A live example: `file` is a path under src/docs/examples without ".vue". */
export interface ExampleRef {
  file: string
  title: string
  description?: string
}

export interface ApiTable {
  title: string
  kind?: 'Props' | 'Events' | 'Slots' | 'Exports'
  rows: PropRow[]
}

export interface NamedItem {
  name: string
  description: string
}

/**
 * Everything needed to render one component page in the fixed 14-section
 * documentation standard. Descriptions must match the implemented API.
 */
export interface ComponentDoc {
  slug: string
  /** 1. Component name */
  name: string
  /** 2. Description */
  description: string
  /** Import names this page documents, e.g. ['AkButton', 'AkSplitButton']. */
  imports: string[]
  /** 3. When to use */
  whenToUse: string[]
  /** 4. When not to use */
  whenNotToUse: string[]
  /** 5. Anatomy (numbered parts) */
  anatomy: NamedItem[]
  /** 6. Variants */
  variants: { items: NamedItem[]; example?: ExampleRef }
  /** 7. Sizes */
  sizes: { text: string; example?: ExampleRef }
  /** 8. Interactive states */
  states: { items: NamedItem[]; example?: ExampleRef }
  /** 9. Accessibility */
  accessibility: string[]
  keyboard?: { keys: string; action: string }[]
  /** 10. Responsive behaviour */
  responsive: string[]
  /** 11. Code examples */
  examples: ExampleRef[]
  /** 12. Props / API */
  api: ApiTable[]
  /** 13. Usage guidelines */
  guidelines: string[]
  /** 14. Do and don't */
  dos: string[]
  donts: string[]
}
