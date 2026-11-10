<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Ellipsis } from '@lucide/vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import AkMenu from '../overlays/AkMenu.vue'

export interface BreadcrumbItem {
  label: string
  to?: RouteLocationRaw
}

/**
 * AkBreadcrumb — shows where the current page sits in the hierarchy.
 * Long trails collapse the middle items into an overflow menu.
 */
const props = withDefaults(defineProps<{ items: BreadcrumbItem[]; maxVisible?: number; size?: 'sm' | 'md' }>(), { maxVisible: 4, size: 'md' })

const collapsed = computed(() => props.items.length > props.maxVisible)
const visible = computed(() =>
  collapsed.value ? [props.items[0]!, ...props.items.slice(props.items.length - (props.maxVisible - 2))] : props.items,
)
const hidden = computed(() => (collapsed.value ? props.items.slice(1, props.items.length - (props.maxVisible - 2)) : []))
</script>

<template>
  <nav aria-label="Breadcrumb" class="min-w-0">
    <ol class="flex min-w-0 flex-wrap items-center gap-0.5" :class="size === 'sm' ? 'text-caption-1' : 'text-body-1'">
      <template v-for="(item, i) in visible" :key="i">
        <li class="flex min-w-0 items-center">
          <RouterLink
            v-if="item.to && i < visible.length - 1"
            :to="item.to"
            class="truncate rounded-sm px-1 py-0.5 text-secondary hover:bg-subtle-hover hover:text-primary focus-ring"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else :aria-current="i === visible.length - 1 ? 'page' : undefined" class="truncate px-1 py-0.5 font-semibold text-primary">
            {{ item.label }}
          </span>
        </li>
        <li v-if="i === 0 && collapsed" class="flex items-center">
          <ChevronRight class="size-3.5 text-tertiary" aria-hidden="true" />
          <AkMenu :items="hidden.map((h) => ({ label: h.label, to: typeof h.to === 'string' ? h.to : undefined }))" label="Hidden breadcrumbs">
            <template #trigger="{ attrs }">
              <button v-bind="attrs" type="button" class="inline-flex size-6 items-center justify-center rounded-sm text-secondary hover:bg-subtle-hover focus-ring" aria-label="Show more breadcrumbs">
                <Ellipsis class="size-4" aria-hidden="true" />
              </button>
            </template>
          </AkMenu>
        </li>
        <li v-if="i < visible.length - 1" aria-hidden="true" class="flex items-center">
          <ChevronRight class="size-3.5 text-tertiary" />
        </li>
      </template>
    </ol>
  </nav>
</template>
