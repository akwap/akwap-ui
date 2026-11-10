import { defineComponent, h, type VNode } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Renders a tiny, safe subset of inline markup without v-html:
 * `code`, **bold** and [label](/internal or https://external).
 */
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

export function renderInline(text: string): (VNode | string)[] {
  return text.split(TOKEN).filter(Boolean).map((part) => {
    if (part.startsWith('`')) return h('code', part.slice(1, -1))
    if (part.startsWith('**')) return h('strong', { class: 'font-semibold text-primary' }, part.slice(2, -2))
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (m) {
      const [, label, to] = m
      return /^https?:/.test(to!)
        ? h('a', { href: to, target: '_blank', rel: 'noopener', class: 'link' }, [label, h('span', { class: 'sr-only' }, ' (opens in a new tab)')])
        : h(RouterLink, { to: to!, class: 'link' }, () => label)
    }
    return part
  })
}

export default defineComponent({
  name: 'DocInline',
  props: { text: { type: String, required: true }, as: { type: String, default: 'span' } },
  setup(props) {
    return () => h(props.as, renderInline(props.text))
  },
})
