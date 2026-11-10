<script setup lang="ts">
import { provide, ref } from 'vue'
import { ACCORDION_KEY } from './accordionContext'

/** AkAccordion — vertically stacked disclosure sections. */
const props = withDefaults(defineProps<{ multiple?: boolean; defaultOpen?: string[]; appearance?: 'divided' | 'separated' }>(), {
  defaultOpen: () => [],
  appearance: 'divided',
})
const open = ref<string[]>([...props.defaultOpen])
provide(ACCORDION_KEY, {
  isOpen: (v: string) => open.value.includes(v),
  toggle: (v: string) => {
    if (open.value.includes(v)) open.value = open.value.filter((x) => x !== v)
    else open.value = props.multiple ? [...open.value, v] : [v]
  },
  appearance: props.appearance,
})
</script>

<template>
  <div :class="appearance === 'divided' ? 'divide-y divide-line-subtle border-y border-line-subtle' : 'flex flex-col gap-2'">
    <slot />
  </div>
</template>
