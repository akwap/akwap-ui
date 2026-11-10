<script setup lang="ts">
import { computed, type Component } from 'vue'
import { TrendingDown, TrendingUp, Minus } from '@lucide/vue'
import AkSparkline from '../charts/AkSparkline.vue'

/**
 * AkStatCard — a single KPI with its change versus a comparison period.
 * Numbers are deliberately modest in size (title-2) for calm dashboards.
 * `positiveIsGood=false` flips colouring for metrics like churn or cost.
 */
const props = withDefaults(
  defineProps<{
    label: string
    value: string
    delta?: number
    deltaLabel?: string
    icon?: Component
    positiveIsGood?: boolean
    trend?: number[]
    loading?: boolean
  }>(),
  { positiveIsGood: true, deltaLabel: 'vs last period' },
)
const direction = computed(() => (props.delta === undefined ? null : props.delta > 0 ? 'up' : props.delta < 0 ? 'down' : 'flat'))
const good = computed(() => (direction.value === 'flat' ? null : (direction.value === 'up') === props.positiveIsGood))
const deltaText = computed(() => (props.delta === undefined ? '' : `${props.delta > 0 ? '+' : ''}${props.delta.toFixed(1)}%`))
</script>

<template>
  <section class="flex min-w-0 flex-col gap-3 rounded-card border border-line-subtle bg-surface p-4" :aria-busy="loading ? 'true' : undefined">
    <div class="flex items-center gap-2">
      <span v-if="icon" class="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-subtle text-brand">
        <component :is="icon" class="size-4" aria-hidden="true" />
      </span>
      <h3 class="truncate text-body-1 text-secondary">{{ label }}</h3>
    </div>
    <div class="flex items-end justify-between gap-3">
      <div class="min-w-0">
        <p v-if="loading" class="skeleton h-8 w-28 rounded-sm" aria-hidden="true" />
        <p v-else class="text-title-2 whitespace-nowrap text-primary tabular-nums">{{ value }}</p>
        <p v-if="delta !== undefined && !loading" class="mt-1 flex flex-wrap items-center gap-x-1.5 text-caption-1">
          <span
            class="inline-flex items-center gap-0.5 font-semibold"
            :class="good === null ? 'text-secondary' : good ? 'text-success' : 'text-danger'"
          >
            <TrendingUp v-if="direction === 'up'" class="size-3.5" aria-hidden="true" />
            <TrendingDown v-else-if="direction === 'down'" class="size-3.5" aria-hidden="true" />
            <Minus v-else class="size-3.5" aria-hidden="true" />
            <span class="sr-only">{{ direction === 'up' ? 'Increased' : direction === 'down' ? 'Decreased' : 'No change' }} </span>
            {{ deltaText }}
          </span>
          <span class="text-tertiary">{{ deltaLabel }}</span>
        </p>
      </div>
      <AkSparkline v-if="trend && !loading" :values="trend" :intent="good === false ? 'danger' : 'brand'" class="h-10 w-16 min-w-0 shrink sm:w-20" />
    </div>
    <slot />
  </section>
</template>
