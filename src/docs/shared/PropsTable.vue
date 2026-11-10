<script setup lang="ts">
export interface PropRow {
  name: string
  type: string
  default?: string
  description: string
}
/** API reference table for props, events or slots. */
defineProps<{ title: string; rows: PropRow[]; kind?: 'Props' | 'Events' | 'Slots' }>()
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line-subtle" tabindex="0" role="region" :aria-label="`${title} ${kind ?? 'Props'}`">
    <table class="w-full min-w-[560px] border-collapse text-left text-body-1">
      <caption class="border-b border-line-subtle bg-surface-secondary px-4 py-2 text-left text-body-1-strong text-primary">
        <code class="font-mono">{{ title }}</code> <span class="font-normal text-tertiary">· {{ kind ?? 'Props' }}</span>
      </caption>
      <thead>
        <tr class="border-b border-line-subtle">
          <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Name</th>
          <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">{{ kind === 'Slots' ? 'Scope' : kind === 'Events' ? 'Payload' : 'Type' }}</th>
          <th v-if="!kind || kind === 'Props'" scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Default</th>
          <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.name" class="border-b border-line-subtle align-top last:border-0">
          <td class="px-4 py-2.5"><code class="font-mono text-caption-1 font-semibold text-brand">{{ r.name }}</code></td>
          <td class="px-4 py-2.5"><code class="font-mono text-caption-1 break-words text-secondary">{{ r.type }}</code></td>
          <td v-if="!kind || kind === 'Props'" class="px-4 py-2.5"><code class="font-mono text-caption-1 text-tertiary">{{ r.default ?? '—' }}</code></td>
          <td class="px-4 py-2.5 text-secondary">{{ r.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
