<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { ACCORDION_KEY } from './accordionContext'

/** AkAccordionItem — a header button (aria-expanded) controlling a region. */
const props = withDefaults(defineProps<{ value: string; title: string; headingLevel?: 2 | 3 | 4; disabled?: boolean }>(), { headingLevel: 3 })
const ctx = inject(ACCORDION_KEY)!
const uid = useId()
const open = computed(() => ctx.isOpen(props.value))
</script>

<template>
  <div :class="ctx.appearance === 'separated' && 'rounded-card border border-line-subtle bg-surface'">
    <component :is="`h${headingLevel}`" class="m-0">
      <button
        :id="`${uid}-btn`"
        type="button"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="`${uid}-panel`"
        :disabled="disabled"
        class="flex w-full items-center gap-3 px-2 py-3 text-left text-body-1-strong text-primary hover:bg-subtle-hover focus-ring-inset disabled:text-disabled"
        :class="ctx.appearance === 'separated' ? 'rounded-card px-4' : 'rounded-md'"
        @click="ctx.toggle(value)"
      >
        <span class="flex-1">{{ title }}</span>
        <ChevronDown class="size-4 shrink-0 text-secondary transition-transform duration-fast" :class="open && 'rotate-180'" aria-hidden="true" />
      </button>
    </component>
    <div v-show="open" :id="`${uid}-panel`" role="region" :aria-labelledby="`${uid}-btn`" class="pb-4 text-body-1 text-secondary" :class="ctx.appearance === 'separated' ? 'px-4' : 'px-2'">
      <slot />
    </div>
  </div>
</template>
