<script setup lang="ts">
import { computed, ref } from 'vue'
import { AkIcon, AkInput, AkSegmentedControl, AkTabs, iconGroups, useToast } from '@/design-system'
import IconLibrary from './IconLibrary.vue'

/** The semantic AkwapUI icon set, plus the full Lucide library (loaded on demand). */
const tab = ref('set')
const q = ref('')
const size = ref<'sm' | 'md' | 'lg'>('md')
const toast = useToast()

const groups = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return Object.entries(iconGroups)
    .map(([group, items]) => ({
      group,
      items: Object.entries(items)
        .filter(([name, v]) => !needle || name.toLowerCase().includes(needle) || v.label.toLowerCase().includes(needle))
        .map(([name, v]) => ({ name, label: v.label, icon: v.icon })),
    }))
    .filter((g) => g.items.length)
})
const count = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))

const snippet = (name: string) => `<AkIcon name="${name}" />`

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied', text)
  } catch {
    toast.info('Copy not available', text)
  }
}
</script>

<template>
  <AkTabs v-model="tab" label="Icon sets" :tabs="[{ id: 'set', label: 'AkwapUI set' }, { id: 'all', label: 'All Lucide icons' }]">
    <template #set>
      <div class="pt-4">
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <AkInput v-model="q" type="search" clearable placeholder="Search by name or meaning" aria-label="Search the AkwapUI icon set" class="w-full sm:w-72" />
          <AkSegmentedControl v-model="size" size="sm" label="Icon size" :options="[{ label: '16', value: 'sm' }, { label: '20', value: 'md' }, { label: '24', value: 'lg' }]" />
          <p class="text-caption-1 text-tertiary" role="status">{{ count }} {{ count === 1 ? 'icon' : 'icons' }}</p>
        </div>
        <section v-for="g in groups" :key="g.group" class="mb-6" :aria-labelledby="`ig-${g.group}`">
          <h3 :id="`ig-${g.group}`" class="mb-2 text-subtitle-2 text-primary">{{ g.group }}</h3>
          <ul class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <li v-for="i in g.items" :key="i.name">
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-md border border-line-subtle bg-surface px-3 py-2 text-left hover:bg-surface-hover focus-ring"
                @click="copy(snippet(i.name))"
              >
                <AkIcon :icon="i.icon" :size="size" class="text-primary" />
                <span class="sr-only">Copy snippet:</span>
                <span class="min-w-0">
                  <span class="block truncate font-mono text-caption-1 text-primary">{{ i.name }}</span>
                  <span class="block truncate text-caption-2 text-tertiary">{{ i.label }}</span>
                </span>
              </button>
            </li>
          </ul>
        </section>
        <p v-if="!count" class="text-body-1 text-secondary">No icons match “{{ q }}”. Try the full library tab.</p>
      </div>
    </template>
    <template #all>
      <div class="pt-4"><IconLibrary /></div>
    </template>
  </AkTabs>
</template>
