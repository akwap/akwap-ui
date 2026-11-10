<script setup lang="ts">
/**
 * AkDescriptionList — key/value pairs (<dl>). "stacked" puts the term above
 * the value; "inline" uses two columns on wider screens; "grid" flows pairs
 * into columns.
 */
withDefaults(
  defineProps<{
    items: { term: string; description?: string | number | null }[]
    layout?: 'stacked' | 'inline' | 'grid'
    columns?: 2 | 3 | 4
    dividers?: boolean
  }>(),
  { layout: 'inline', columns: 2 },
)
</script>

<template>
  <dl
    :class="[
      layout === 'grid' ? ['grid gap-x-6 gap-y-4', { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns]] : 'flex flex-col',
      dividers && layout !== 'grid' ? 'divide-y divide-line-subtle' : layout !== 'grid' ? 'gap-3' : '',
    ]"
  >
    <div
      v-for="item in items"
      :key="item.term"
      :class="[layout === 'inline' ? 'grid gap-1 sm:grid-cols-[minmax(140px,1fr)_2fr] sm:gap-4' : 'flex flex-col gap-0.5', dividers && layout !== 'grid' ? 'py-3' : '']"
    >
      <dt class="text-body-1 text-secondary">{{ item.term }}</dt>
      <dd class="min-w-0 text-body-1 break-words text-primary">
        <slot :name="item.term" :item="item">{{ item.description ?? '—' }}</slot>
      </dd>
    </div>
  </dl>
</template>
