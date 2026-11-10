<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, type Component } from 'vue'
import { createLucideIcon } from '@lucide/vue'
import { AkButton, AkEmptyState, AkInput, AkSegmentedControl, AkSpinner, useToast } from '@/design-system'

/**
 * The full Lucide library (~2,000 icons). Icon shapes are loaded on demand as
 * one data chunk (see build/lucide-icon-data.ts) and turned into components
 * only when shown, so the library never affects any other page's bundle.
 */
const PAGE = 120
type IconNode = [string, Record<string, string | number>][]
interface Entry { name: string; node: IconNode; search: string }
const all = shallowRef<Entry[]>([])
const cache = new Map<string, Component>()
function component(name: string, node: IconNode): Component {
  let c = cache.get(name)
  if (!c) cache.set(name, (c = createLucideIcon(name, node as Parameters<typeof createLucideIcon>[1])))
  return c
}
const state = ref<'loading' | 'ready' | 'error'>('loading')
const q = ref('')
const size = ref<16 | 20 | 24 | 32>(24)
const stroke = ref<'1.25' | '1.75' | '2.25'>('1.75')
const limit = ref(PAGE)
const toast = useToast()

async function load() {
  state.value = 'loading'
  try {
    const { default: data } = await import('virtual:lucide-icon-data')
    all.value = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, { node, aliases }]) => ({ name, node, search: [words(name), ...(aliases ?? []).map((a) => a.replace(/-/g, ' '))].join(' | ') }))
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
}
onMounted(load)

// "ArrowUpDown" → "arrow up down" so people can search with spaces or hyphens.
const words = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Za-z])(\d)/g, '$1 $2').toLowerCase()
const matches = computed(() => {
  const needle = q.value.trim().toLowerCase().replace(/[-_]+/g, ' ')
  if (!needle) return all.value
  const compact = needle.replace(/ /g, '')
  return all.value.filter((e) => e.search.includes(needle) || e.name.toLowerCase().includes(compact))
})
const shown = computed(() => matches.value.slice(0, limit.value))
function onSearch() {
  limit.value = PAGE
}

async function copy(name: string) {
  const text = `import { ${name} } from '@lucide/vue'`
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Import copied', text)
  } catch {
    toast.info('Copy not available', text)
  }
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <AkInput v-model="q" type="search" clearable placeholder="Search 2,000+ icons" aria-label="Search all Lucide icons" class="w-full sm:w-72" @update:model-value="onSearch" />
      <AkSegmentedControl v-model="size" size="sm" label="Preview size" :options="[{ label: '16', value: 16 }, { label: '20', value: 20 }, { label: '24', value: 24 }, { label: '32', value: 32 }]" />
      <AkSegmentedControl v-model="stroke" size="sm" label="Stroke width" :options="[{ label: 'Thin', value: '1.25' }, { label: 'Default', value: '1.75' }, { label: 'Bold', value: '2.25' }]" />
      <p v-if="state === 'ready'" class="text-caption-1 text-tertiary" role="status">{{ matches.length.toLocaleString() }} {{ matches.length === 1 ? 'icon' : 'icons' }}</p>
    </div>

    <div v-if="state === 'loading'" class="py-10"><AkSpinner size="sm" label="Loading the icon library…" /></div>
    <AkEmptyState v-else-if="state === 'error'" variant="error" title="The icon library didn't load" description="Check your connection and try again.">
      <AkButton @click="load">Try again</AkButton>
    </AkEmptyState>
    <template v-else>
      <ul class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        <li v-for="{ name, node } in shown" :key="name">
          <button type="button" class="flex w-full flex-col items-center gap-2 rounded-md border border-line-subtle bg-surface px-1 py-3 text-secondary hover:bg-surface-hover hover:text-primary focus-ring" :aria-label="`Copy import for ${name}`" @click="copy(name)">
            <component :is="component(name, node)" :size="size" :stroke-width="Number(stroke)" aria-hidden="true" />
            <span class="w-full truncate text-center text-caption-2">{{ name }}</span>
          </button>
        </li>
      </ul>
      <p v-if="!matches.length" class="text-body-1 text-secondary">No icons match “{{ q }}”.</p>
      <div v-else-if="shown.length < matches.length" class="mt-4 flex flex-wrap items-center gap-3">
        <AkButton @click="limit += PAGE">Show more</AkButton>
        <span class="text-caption-1 text-tertiary">Showing {{ shown.length }} of {{ matches.length.toLocaleString() }}</span>
      </div>
    </template>
  </div>
</template>
