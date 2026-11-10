<script setup lang="ts" generic="V extends string | number">
import { nextTick, ref, type Component } from 'vue'

/**
 * AkSegmentedControl — pick one of 2–5 mutually exclusive views or modes
 * (radiogroup semantics, arrow keys move the selection). Use AkTabs instead
 * when each option reveals a different panel of content.
 */
const props = withDefaults(
  defineProps<{
    modelValue: V
    options: { label: string; value: V; icon?: Component }[]
    label: string
    size?: 'sm' | 'md'
    block?: boolean
  }>(),
  { size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [value: V] }>()
const root = ref<HTMLElement | null>(null)
function onKey(e: KeyboardEvent) {
  const i = props.options.findIndex((o) => o.value === props.modelValue)
  let n = i
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % props.options.length
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + props.options.length) % props.options.length
  else return
  e.preventDefault()
  emit('update:modelValue', props.options[n]!.value)
  nextTick(() => root.value?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus())
}
</script>

<template>
  <div
    ref="root"
    role="radiogroup"
    :aria-label="label"
    class="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-control border border-line bg-surface p-0.5"
    :class="block && 'flex w-full'"
    @keydown="onKey"
  >
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === o.value ? 'true' : 'false'"
      :tabindex="modelValue === o.value ? 0 : -1"
      class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm px-2.5 font-semibold whitespace-nowrap transition-colors duration-faster focus-ring"
      :class="[
        size === 'sm' ? 'h-6 text-caption-1 [&_svg]:size-3.5' : 'h-7 text-body-1 [&_svg]:size-4',
        block && 'flex-1',
        modelValue === o.value ? 'bg-brand text-on-brand' : 'text-secondary hover:bg-subtle-hover hover:text-primary',
      ]"
      @click="emit('update:modelValue', o.value)"
    >
      <component :is="o.icon" v-if="o.icon" aria-hidden="true" />{{ o.label }}
    </button>
  </div>
</template>
