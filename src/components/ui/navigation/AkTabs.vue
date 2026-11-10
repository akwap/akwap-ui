<script setup lang="ts">
import { computed, nextTick, ref, useId, type Component } from 'vue'

export interface TabItem {
  id: string
  label: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
}

/**
 * AkTabs — WAI-ARIA tabs with automatic activation.
 * ←/→ (or ↑/↓ when vertical), Home and End move between tabs.
 * Content: a slot named after each tab id, e.g. <template #overview>, or a
 * shared #panel slot that receives the active tab.
 */
const props = withDefaults(
  defineProps<{
    tabs: TabItem[]
    modelValue?: string
    orientation?: 'horizontal' | 'vertical'
    appearance?: 'line' | 'subtle'
    size?: 'sm' | 'md' | 'lg'
    label?: string
    /** Keep inactive panels mounted (hidden) to preserve state. */
    keepAlive?: boolean
  }>(),
  { orientation: 'horizontal', appearance: 'line', size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()
const uid = useId()
const internal = ref(props.tabs.find((t) => !t.disabled)?.id ?? '')
const active = computed(() => props.modelValue ?? internal.value)
const list = ref<HTMLElement | null>(null)
const vertical = computed(() => props.orientation === 'vertical')

function select(id: string) {
  internal.value = id
  emit('update:modelValue', id)
}
function onKey(e: KeyboardEvent) {
  const enabled = props.tabs.filter((t) => !t.disabled)
  const idx = enabled.findIndex((t) => t.id === active.value)
  const prev = vertical.value ? 'ArrowUp' : 'ArrowLeft'
  const next = vertical.value ? 'ArrowDown' : 'ArrowRight'
  let target: number | null = null
  if (e.key === next) target = (idx + 1) % enabled.length
  else if (e.key === prev) target = (idx - 1 + enabled.length) % enabled.length
  else if (e.key === 'Home') target = 0
  else if (e.key === 'End') target = enabled.length - 1
  if (target === null) return
  e.preventDefault()
  select(enabled[target]!.id)
  nextTick(() => list.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus())
}
const sizeCls = computed(() => ({ sm: 'h-8 px-2 text-caption-1', md: 'h-10 px-3 text-body-1', lg: 'h-12 px-4 text-body-2' })[props.size])
</script>

<template>
  <div :class="vertical ? 'flex flex-col gap-4 md:flex-row md:gap-6' : 'flex flex-col'">
    <div
      ref="list"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      class="flex shrink-0"
      :class="vertical ? 'flex-row overflow-x-auto md:w-52 md:flex-col md:overflow-visible' : 'overflow-x-auto border-b border-line-subtle [scrollbar-width:none]'"
      @keydown="onKey"
    >
      <button
        v-for="t in tabs"
        :id="`${uid}-tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="t.id === active ? 'true' : 'false'"
        :aria-controls="`${uid}-panel-${t.id}`"
        :tabindex="t.id === active ? 0 : -1"
        :disabled="t.disabled"
        class="group relative inline-flex shrink-0 items-center gap-2 rounded-md whitespace-nowrap transition-colors duration-faster focus-ring-inset disabled:cursor-not-allowed disabled:text-disabled"
        :class="[
          sizeCls,
          vertical ? 'md:w-full md:justify-start' : '',
          t.id === active ? 'font-semibold text-primary' : 'text-secondary enabled:hover:text-primary',
          appearance === 'subtle' ? (t.id === active ? 'bg-surface-selected' : 'enabled:hover:bg-subtle-hover') : 'enabled:hover:bg-subtle-hover',
        ]"
        @click="select(t.id)"
      >
        <component :is="t.icon" v-if="t.icon" class="size-4 shrink-0" :class="t.id === active ? 'text-brand' : ''" aria-hidden="true" />
        {{ t.label }}
        <span v-if="t.badge !== undefined" class="rounded-full bg-surface-selected px-1.5 text-caption-1 font-semibold text-secondary">{{ t.badge }}</span>
        <!-- Selection indicator -->
        <span
          v-if="appearance === 'line'"
          aria-hidden="true"
          class="absolute rounded-full transition-colors duration-fast"
          :class="[
            vertical ? 'inset-x-3 bottom-0 h-[3px] md:inset-x-auto md:inset-y-2 md:left-0 md:h-auto md:w-[3px]' : 'inset-x-3 bottom-0 h-[3px]',
            t.id === active ? 'bg-brand' : 'bg-transparent group-enabled:group-hover:bg-line',
          ]"
        />
      </button>
    </div>
    <div class="min-w-0 flex-1">
      <template v-for="t in tabs" :key="t.id">
        <div
          v-if="keepAlive || t.id === active"
          v-show="t.id === active"
          :id="`${uid}-panel-${t.id}`"
          role="tabpanel"
          :aria-labelledby="`${uid}-tab-${t.id}`"
          tabindex="0"
          class="rounded-md outline-none focus-visible:outline-2 focus-visible:outline-line-focus"
          :class="vertical ? '' : 'pt-4'"
        >
          <slot :name="t.id" :tab="t"><slot name="panel" :tab="t" /></slot>
        </div>
      </template>
    </div>
  </div>
</template>
