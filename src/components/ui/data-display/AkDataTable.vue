<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/vue'
import AkCheckbox from '../forms/AkCheckbox.vue'
import AkSkeleton from '../feedback/AkSkeleton.vue'
import AkEmptyState from '../feedback/AkEmptyState.vue'

export interface Column<R = any> {
  key: string
  label: string
  sortable?: boolean
  align?: 'start' | 'end' | 'center'
  width?: string
  /** Hide the column below this breakpoint to keep small screens readable. */
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl'
  format?: (value: any, row: R) => string
  /** Custom sort accessor. */
  sortValue?: (row: R) => string | number
  /** Visually hide the header label (still read by screen readers). */
  hideLabel?: boolean
}
export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

/**
 * AkDataTable — semantic <table> with sorting, row selection, loading and
 * empty states. Sorting is client-side unless `manualSort` is set, in which
 * case listen to `update:sort` and pass sorted rows.
 * The scroll container is focusable so keyboard users can scroll wide tables.
 */
const props = withDefaults(
  defineProps<{
    columns: Column<Row>[]
    rows: Row[]
    rowKey?: string
    caption: string
    hideCaption?: boolean
    selectable?: boolean
    selected?: Array<string | number>
    sort?: SortState | null
    manualSort?: boolean
    loading?: boolean
    density?: 'compact' | 'default' | 'comfortable'
    stickyHeader?: boolean
    emptyTitle?: string
    emptyDescription?: string
    /** Row click handler makes rows interactive (Enter activates). */
    rowClickable?: boolean
    minWidth?: string
  }>(),
  { rowKey: 'id', selected: () => [], density: 'default', emptyTitle: 'No results', minWidth: '640px', sort: null },
)
const emit = defineEmits<{
  'update:selected': [keys: Array<string | number>]
  'update:sort': [sort: SortState | null]
  'row-click': [row: Row]
}>()

const sorted = computed(() => {
  if (props.manualSort || !props.sort) return props.rows
  const col = props.columns.find((c) => c.key === props.sort!.key)
  if (!col) return props.rows
  const get = col.sortValue ?? ((r: Row) => r[col.key])
  const dir = props.sort.direction === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const x = get(a)
    const y = get(b)
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir
    return String(x).localeCompare(String(y), undefined, { numeric: true }) * dir
  })
})

function toggleSort(col: Column<Row>) {
  if (!col.sortable) return
  const s = props.sort
  if (!s || s.key !== col.key) emit('update:sort', { key: col.key, direction: 'asc' })
  else if (s.direction === 'asc') emit('update:sort', { key: col.key, direction: 'desc' })
  else emit('update:sort', null)
}
const keys = computed<Array<string | number>>(() => sorted.value.map((r) => r[props.rowKey]))
const allSelected = computed(() => keys.value.length > 0 && keys.value.every((k) => props.selected.includes(k)))
const someSelected = computed(() => !allSelected.value && keys.value.some((k) => props.selected.includes(k)))
function toggleAll() {
  emit('update:selected', allSelected.value ? props.selected.filter((k) => !keys.value.includes(k)) : [...new Set([...props.selected, ...keys.value])])
}
function toggleRow(row: Row) {
  const k = row[props.rowKey]
  emit('update:selected', props.selected.includes(k) ? props.selected.filter((x) => x !== k) : [...props.selected, k])
}
const hideCls = (c: Column<Row>) =>
  c.hideBelow ? { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell', lg: 'hidden lg:table-cell', xl: 'hidden xl:table-cell' }[c.hideBelow] : ''
const alignCls = (c: Column<Row>) => (c.align === 'end' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left')
const cellPad = computed(() => ({ compact: 'px-3 py-1.5', default: 'px-3 py-2.5', comfortable: 'px-4 py-3.5' })[props.density])
const ariaSort = (c: Column<Row>) => (props.sort?.key === c.key ? (props.sort.direction === 'asc' ? 'ascending' : 'descending') : c.sortable ? 'none' : undefined)
</script>

<template>
  <div class="relative min-w-0">
    <div
      class="relative overflow-x-auto rounded-card border border-line-subtle bg-surface focus-visible:outline-2 focus-visible:outline-line-focus"
      :class="stickyHeader && 'max-h-[70vh] overflow-y-auto'"
      tabindex="0"
      role="region"
      :aria-label="caption"
      :aria-busy="loading ? 'true' : undefined"
    >
      <table class="w-full border-collapse text-body-1" :style="{ minWidth }">
        <caption :class="hideCaption ? 'sr-only' : 'px-4 pt-3 pb-1 text-left text-subtitle-2 text-primary'">{{ caption }}</caption>
        <thead :class="stickyHeader && 'sticky top-0 z-[1]'">
          <tr class="border-b border-line-subtle bg-surface-secondary">
            <th v-if="selectable" scope="col" class="w-10 pl-3" :class="cellPad">
              <AkCheckbox :model-value="allSelected" :indeterminate="someSelected" :disabled="!rows.length" @update:model-value="toggleAll">
                <span class="sr-only">Select all rows</span>
              </AkCheckbox>
            </th>
            <th
              v-for="c in columns"
              :key="c.key"
              scope="col"
              :aria-sort="ariaSort(c)"
              class="text-caption-1-strong whitespace-nowrap text-secondary"
              :class="[cellPad, alignCls(c), hideCls(c)]"
              :style="{ width: c.width }"
            >
              <button
                v-if="c.sortable"
                type="button"
                class="-mx-1 inline-flex items-center gap-1 rounded-sm px-1 py-0.5 hover:bg-subtle-hover hover:text-primary focus-ring"
                :class="sort?.key === c.key && 'text-primary'"
                @click="toggleSort(c)"
              >
                {{ c.label }}
                <ArrowUp v-if="sort?.key === c.key && sort.direction === 'asc'" class="size-3.5" aria-hidden="true" />
                <ArrowDown v-else-if="sort?.key === c.key" class="size-3.5" aria-hidden="true" />
                <ArrowUpDown v-else class="size-3.5 opacity-50" aria-hidden="true" />
              </button>
              <span v-else :class="c.hideLabel && 'sr-only'">{{ c.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="i in 5" :key="i" class="border-b border-line-subtle last:border-0">
            <td v-if="selectable" :class="cellPad"><AkSkeleton shape="rect" width="16px" height="16px" /></td>
            <td v-for="c in columns" :key="c.key" :class="[cellPad, hideCls(c)]"><AkSkeleton /></td>
          </tr>
        </tbody>
        <tbody v-else-if="sorted.length">
          <tr
            v-for="row in sorted"
            :key="row[rowKey]"
            class="border-b border-line-subtle transition-colors duration-faster last:border-0"
            :class="[
              selected.includes(row[rowKey]) ? 'bg-brand-subtle' : 'hover:bg-surface-hover',
              rowClickable && 'cursor-pointer focus-ring-inset',
            ]"
            :tabindex="rowClickable ? 0 : undefined"
            :aria-selected="selectable ? (selected.includes(row[rowKey]) ? 'true' : 'false') : undefined"
            @click="rowClickable && emit('row-click', row)"
            @keydown.enter="rowClickable && emit('row-click', row)"
          >
            <td v-if="selectable" class="w-10 pl-3" :class="cellPad" @click.stop>
              <AkCheckbox :model-value="selected.includes(row[rowKey])" @update:model-value="toggleRow(row)">
                <span class="sr-only">Select row</span>
              </AkCheckbox>
            </td>
            <td v-for="c in columns" :key="c.key" class="text-primary" :class="[cellPad, alignCls(c), hideCls(c)]">
              <slot :name="`cell-${c.key}`" :row="row" :value="row[c.key]">
                {{ c.format ? c.format(row[c.key], row) : row[c.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length + (selectable ? 1 : 0)">
              <slot name="empty">
                <AkEmptyState variant="search" :title="emptyTitle" :description="emptyDescription" size="sm" />
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
