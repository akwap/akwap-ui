<script setup lang="ts">
import { computed, useId } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/vue'
import AkSelect from '../forms/AkSelect.vue'

/** AkPagination — page navigation with range summary and page-size picker. */
const props = withDefaults(
  defineProps<{
    page: number
    pageSize: number
    total: number
    pageSizes?: number[]
    /** Number of page buttons on each side of the current page. */
    siblings?: number
    label?: string
    showSummary?: boolean
  }>(),
  { pageSizes: () => [10, 25, 50], siblings: 1, label: 'Pagination', showSummary: true },
)
const uid = useId()
const emit = defineEmits<{ 'update:page': [page: number]; 'update:pageSize': [size: number] }>()

const pages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const to = computed(() => Math.min(props.total, props.page * props.pageSize))

const items = computed<(number | '…')[]>(() => {
  const total = pages.value
  const s = props.siblings
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
  if (total <= 5 + s * 2) return range(1, total)
  const left = Math.max(2, props.page - s)
  const right = Math.min(total - 1, props.page + s)
  const out: (number | '…')[] = [1]
  if (left > 2) out.push('…')
  out.push(...range(left, right))
  if (right < total - 1) out.push('…')
  out.push(total)
  return out
})
function go(p: number) {
  emit('update:page', Math.min(pages.value, Math.max(1, p)))
}
const btn =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-body-1 tabular-nums transition-colors duration-faster focus-ring disabled:cursor-not-allowed disabled:text-disabled'
</script>

<template>
  <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
    <div v-if="showSummary" class="flex items-center gap-3 text-body-1 text-secondary">
      <span aria-live="polite">
        <span class="font-semibold text-primary tabular-nums">{{ from }}–{{ to }}</span> of
        <span class="tabular-nums">{{ total.toLocaleString() }}</span>
      </span>
      <span v-if="pageSizes.length" class="hidden items-center gap-2 sm:flex">
        <label :for="`${uid}-ps`" class="whitespace-nowrap">Rows per page</label>
        <AkSelect :id="`${uid}-ps`" class="w-20" size="sm" :model-value="pageSize" :options="pageSizes.map((n) => ({ label: String(n), value: n }))" @update:model-value="(v) => (emit('update:pageSize', Number(v)), emit('update:page', 1))" />
      </span>
    </div>
    <nav :aria-label="label">
      <ul class="flex items-center gap-1">
        <li class="hidden sm:block">
          <button type="button" :class="[btn, 'text-secondary enabled:hover:bg-subtle-hover']" :disabled="page <= 1" aria-label="First page" @click="go(1)">
            <ChevronsLeft class="size-4" aria-hidden="true" />
          </button>
        </li>
        <li>
          <button type="button" :class="[btn, 'text-secondary enabled:hover:bg-subtle-hover']" :disabled="page <= 1" aria-label="Previous page" @click="go(page - 1)">
            <ChevronLeft class="size-4" aria-hidden="true" />
          </button>
        </li>
        <li v-for="(p, i) in items" :key="`${p}-${i}`">
          <span v-if="p === '…'" class="inline-flex h-8 min-w-6 items-center justify-center text-tertiary" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            :class="[btn, p === page ? 'bg-brand-subtle font-semibold text-brand ring-1 ring-brand-stroke ring-inset' : 'text-primary hover:bg-subtle-hover']"
            :aria-current="p === page ? 'page' : undefined"
            :aria-label="`Page ${p}`"
            @click="go(p)"
          >
            {{ p }}
          </button>
        </li>
        <li>
          <button type="button" :class="[btn, 'text-secondary enabled:hover:bg-subtle-hover']" :disabled="page >= pages" aria-label="Next page" @click="go(page + 1)">
            <ChevronRight class="size-4" aria-hidden="true" />
          </button>
        </li>
        <li class="hidden sm:block">
          <button type="button" :class="[btn, 'text-secondary enabled:hover:bg-subtle-hover']" :disabled="page >= pages" aria-label="Last page" @click="go(pages)">
            <ChevronsRight class="size-4" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
