<script setup lang="ts">
import { ref, type Component } from 'vue'
import { Code2, Smartphone, Monitor } from '@lucide/vue'
import CodeBlock from './CodeBlock.vue'

/** Live, interactive example rendered next to (above) its exact source. */
defineProps<{ title: string; description?: string; component: Component; code: string; id?: string }>()
const showCode = ref(true)
const narrow = ref(false)
</script>

<template>
  <section :id="id" class="scroll-mt-20 overflow-hidden rounded-card border border-line-subtle bg-surface" :aria-label="`Example: ${title}`">
    <header class="flex flex-wrap items-center gap-2 border-b border-line-subtle px-4 py-2.5">
      <div class="min-w-0 flex-1">
        <h3 class="text-body-1-strong text-primary">{{ title }}</h3>
        <p v-if="description" class="text-caption-1 text-secondary">{{ description }}</p>
      </div>
      <div class="flex gap-1">
        <button type="button" class="inline-flex size-7 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover focus-ring" :aria-pressed="narrow ? 'true' : 'false'" :aria-label="narrow ? 'Desktop preview width' : 'Mobile preview width'" @click="narrow = !narrow">
          <Monitor v-if="narrow" class="size-4" aria-hidden="true" /><Smartphone v-else class="size-4" aria-hidden="true" />
        </button>
        <button type="button" class="inline-flex size-7 items-center justify-center rounded-sm hover:bg-subtle-hover focus-ring" :class="showCode ? 'text-brand' : 'text-secondary'" :aria-pressed="showCode ? 'true' : 'false'" aria-label="Show code" @click="showCode = !showCode">
          <Code2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </header>
    <div class="bg-background p-6">
      <div class="mx-auto transition-[max-width] duration-normal" :class="narrow ? 'max-w-[375px] rounded-md border border-dashed border-line p-3' : 'max-w-full'">
        <component :is="component" />
      </div>
    </div>
    <div v-if="showCode" class="border-t border-line-subtle [&_.code-surface]:rounded-none [&_.code-surface]:border-0">
      <CodeBlock :code="code" lang="vue" title="Example.vue" />
    </div>
  </section>
</template>
