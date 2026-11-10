<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { addDays, addMonths, fromISODate, sameDay, startOfMonth, toISODate } from '@/utils/date'

/**
 * AkCalendar — month grid (WAI-ARIA date-grid pattern).
 * Keyboard: arrows move by day/week, PageUp/PageDown by month,
 * Shift+PageUp/Down by year, Home/End to week start/end, Enter selects.
 * mode="range" selects a start and end date.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    /** Range mode value: [start, end]. */
    range?: [string | null, string | null]
    mode?: 'single' | 'range'
    min?: string
    max?: string
    /** Disable specific dates. */
    isDisabled?: (iso: string) => boolean
    today?: string
    weekStartsOn?: 0 | 1
  }>(),
  { mode: 'single', weekStartsOn: 1 },
)
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:range': [value: [string | null, string | null]]
  select: [value: string]
}>()

const uid = useId()
const todayDate = computed(() => fromISODate(props.today) ?? new Date())
const selected = computed(() => fromISODate(props.modelValue))
const rangeStart = computed(() => fromISODate(props.range?.[0]))
const rangeEnd = computed(() => fromISODate(props.range?.[1]))
const focusDate = ref<Date>(selected.value ?? rangeStart.value ?? todayDate.value)
const view = ref<Date>(startOfMonth(focusDate.value))
const hover = ref<Date | null>(null)
const grid = ref<HTMLElement | null>(null)

watch(
  () => props.modelValue,
  (v) => {
    const d = fromISODate(v)
    if (d) {
      focusDate.value = d
      view.value = startOfMonth(d)
    }
  },
)

const monthLabel = computed(() => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(view.value))
const weekdays = computed(() => {
  const base = new Date(2024, 0, 7 + props.weekStartsOn) // a Sunday + offset
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(base, i)
    return {
      short: new Intl.DateTimeFormat('en-US', { weekday: 'narrow' }).format(d),
      long: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d),
    }
  })
})
const weeks = computed(() => {
  const first = startOfMonth(view.value)
  const offset = (first.getDay() - props.weekStartsOn + 7) % 7
  const start = addDays(first, -offset)
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)))
})

function disabled(d: Date) {
  const iso = toISODate(d)
  return (!!props.min && iso < props.min) || (!!props.max && iso > props.max) || !!props.isDisabled?.(iso)
}
function inRange(d: Date) {
  const s = rangeStart.value
  const e = rangeEnd.value ?? (s && hover.value && hover.value > s ? hover.value : null)
  return !!s && !!e && d > s && d < e
}
function isEdge(d: Date) {
  return sameDay(d, rangeStart.value) || sameDay(d, rangeEnd.value)
}

function choose(d: Date) {
  if (disabled(d)) return
  const iso = toISODate(d)
  focusDate.value = d
  if (props.mode === 'range') {
    const [s, e] = props.range ?? [null, null]
    if (!s || (s && e) || iso < s) emit('update:range', [iso, null])
    else emit('update:range', [s, iso])
  } else emit('update:modelValue', iso)
  emit('select', iso)
}
function moveFocus(d: Date) {
  focusDate.value = d
  if (d.getMonth() !== view.value.getMonth() || d.getFullYear() !== view.value.getFullYear()) view.value = startOfMonth(d)
  nextTick(() => grid.value?.querySelector<HTMLElement>('[tabindex="0"]')?.focus())
}
function onKey(e: KeyboardEvent) {
  const f = focusDate.value
  const map: Record<string, () => Date> = {
    ArrowLeft: () => addDays(f, -1),
    ArrowRight: () => addDays(f, 1),
    ArrowUp: () => addDays(f, -7),
    ArrowDown: () => addDays(f, 7),
    PageUp: () => addMonths(f, e.shiftKey ? -12 : -1),
    PageDown: () => addMonths(f, e.shiftKey ? 12 : 1),
    Home: () => addDays(f, -((f.getDay() - props.weekStartsOn + 7) % 7)),
    End: () => addDays(f, 6 - ((f.getDay() - props.weekStartsOn + 7) % 7)),
  }
  if (map[e.key]) {
    e.preventDefault()
    moveFocus(map[e.key]!())
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    choose(f)
  }
}
function changeMonth(n: number) {
  view.value = addMonths(view.value, n)
  focusDate.value = addMonths(focusDate.value, n)
}
defineExpose({ focus: () => nextTick(() => grid.value?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()) })
</script>

<template>
  <div class="w-[17.5rem] max-w-full select-none">
    <div class="mb-2 flex items-center justify-between">
      <h2 :id="`${uid}-label`" class="text-body-1-strong text-primary" aria-live="polite">{{ monthLabel }}</h2>
      <div class="flex gap-0.5">
        <button type="button" class="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover focus-ring" aria-label="Previous month" @click="changeMonth(-1)">
          <ChevronLeft class="size-4" aria-hidden="true" />
        </button>
        <button type="button" class="inline-flex size-8 items-center justify-center rounded-md text-secondary hover:bg-subtle-hover focus-ring" aria-label="Next month" @click="changeMonth(1)">
          <ChevronRight class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
    <table ref="grid" role="grid" :aria-labelledby="`${uid}-label`" class="w-full border-collapse" @keydown="onKey">
      <thead>
        <tr>
          <th v-for="w in weekdays" :key="w.long" scope="col" :abbr="w.long" class="h-8 text-caption-1 font-normal text-tertiary">
            {{ w.short }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, wi) in weeks" :key="wi">
          <td
            v-for="d in week"
            :key="d.getTime()"
            class="p-0 text-center"
            :class="inRange(d) ? 'bg-brand-subtle' : ''"
            role="gridcell"
            :aria-selected="sameDay(d, selected) || isEdge(d) ? 'true' : undefined"
          >
            <button
              type="button"
              :tabindex="sameDay(d, focusDate) ? 0 : -1"
              :disabled="disabled(d)"
              :aria-label="new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(d)"
              :aria-current="sameDay(d, todayDate) ? 'date' : undefined"
              class="relative mx-auto inline-flex size-9 items-center justify-center rounded-md text-body-1 transition-colors duration-faster focus-ring"
              :class="[
                sameDay(d, selected) || isEdge(d)
                  ? 'bg-brand font-semibold text-on-brand hover:bg-brand-hover'
                  : disabled(d)
                    ? 'cursor-not-allowed text-disabled line-through'
                    : d.getMonth() !== view.getMonth()
                      ? 'text-tertiary hover:bg-subtle-hover'
                      : 'text-primary hover:bg-subtle-hover',
                sameDay(d, todayDate) && !(sameDay(d, selected) || isEdge(d)) ? 'font-semibold text-brand ring-1 ring-brand-stroke ring-inset' : '',
              ]"
              @click="choose(d)"
              @mouseenter="hover = d"
              @focus="focusDate = d"
            >
              {{ d.getDate() }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
