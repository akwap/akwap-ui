import type { Component } from 'vue'
import type { Intent } from '@/components/ui/feedback/intent'

/**
 * Documentation prose is data: an ordered list of blocks rendered by
 * DocRouter. Inline text supports `code`, **bold** and [label](/path).
 */
export type Block =
  | { t: 'h2'; id: string; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[]; ordered?: boolean }
  | { t: 'code'; code: string; lang?: 'vue' | 'ts' | 'css' | 'bash' | 'html'; title?: string }
  | { t: 'callout'; intent: Intent; title?: string; text: string }
  | { t: 'table'; caption: string; head: string[]; rows: string[][] }
  | { t: 'links'; items: { label: string; to: string; description: string }[] }
  | { t: 'component'; is: Component; props?: Record<string, unknown> }
  | { t: 'dodont'; dos: string[]; donts: string[] }
  | { t: 'preview'; to: string; title: string; height?: number }
  /** A live example from src/docs/examples, shown with its source. */
  | { t: 'example'; file: string; title: string; description?: string }

export interface DocPage {
  title: string
  lead: string
  blocks: Block[]
}

export type DocPages = Record<string, DocPage>
