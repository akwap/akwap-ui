<script setup lang="ts">
import { computed, ref } from 'vue'
import { Copy, Check } from '@lucide/vue'
import { highlight } from './highlight'
import { useAnnouncer } from '@/composables/useAnnouncer'

/** Highlighted, copyable code snippet. */
const props = withDefaults(defineProps<{ code: string; lang?: 'vue' | 'ts' | 'css' | 'bash' | 'html'; title?: string; maxHeight?: string }>(), {
  lang: 'vue',
  maxHeight: '420px',
})
const html = computed(() => highlight(props.code.trim(), props.lang))
const copied = ref(false)
const { announce } = useAnnouncer()
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code.trim())
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.code.trim()
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  announce('Code copied to clipboard')
  setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div class="code-surface overflow-hidden rounded-card border border-line-subtle bg-surface-secondary">
    <div class="flex items-center justify-between border-b border-line-subtle px-3 py-1.5">
      <span class="text-caption-1 text-tertiary">{{ title ?? lang.toUpperCase() }}</span>
      <button
        type="button"
        class="inline-flex h-7 items-center gap-1.5 rounded-sm px-2 text-caption-1 font-semibold text-secondary hover:bg-subtle-hover hover:text-primary focus-ring"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        data-testid="copy-code"
        @click="copy"
      >
        <Check v-if="copied" class="size-3.5 text-success" aria-hidden="true" /><Copy v-else class="size-3.5" aria-hidden="true" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -- content is escaped by highlight() -->
    <pre class="code-block p-4" :style="{ maxHeight }" tabindex="0" :aria-label="`${title ?? lang} code`"><code v-html="html" /></pre>
  </div>
</template>

<style scoped>
pre :deep(.tk-comment) { color: var(--ak-color-text-tertiary); font-style: italic; }
pre :deep(.tk-string) { color: var(--ak-color-success); }
pre :deep(.tk-keyword) { color: var(--ak-color-brand-foreground); font-weight: 600; }
pre :deep(.tk-number) { color: var(--ak-color-warning); }
pre :deep(.tk-tag) { color: var(--ak-color-info); }
pre :deep(.tk-attr) { color: var(--ak-color-warning); }
pre :deep(.tk-punct) { color: var(--ak-color-text-tertiary); }
</style>
