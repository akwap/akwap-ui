<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { CalendarRange, ChevronDown } from '@lucide/vue'
import AkCalendar from './AkCalendar.vue'
import AkButton from '../buttons/AkButton.vue'
import { useFloating } from '@/composables/useFloating'
import { useClickOutside } from '@/composables/useClickOutside'
import { addDays, formatHuman, fromISODate, toISODate } from '@/utils/date'

export interface DateRangePreset {
  label: string
  days: number
}

/** AkDateRangePicker — preset ranges plus a two-click calendar range. */
const props = withDefaults(
  defineProps<{
    modelValue: [string | null, string | null]
    today?: string
    presets?: DateRangePreset[]
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    presets: () => [
      { label: 'Last 7 days', days: 7 },
      { label: 'Last 30 days', days: 30 },
      { label: 'Last 90 days', days: 90 },
      { label: 'Last 12 months', days: 365 },
    ],
    size: 'md',
  },
)
const emit = defineEmits<{ 'update:modelValue': [value: [string, string]] }>()

const open = ref(false)
const draft = ref<[string | null, string | null]>([...props.modelValue])
const anchor = ref<HTMLElement | null>(null)
const pop = ref<HTMLElement | null>(null)
const cal = ref<InstanceType<typeof AkCalendar> | null>(null)
const { style } = useFloating(anchor, pop, open, { placement: 'bottom-end' })
const todayDate = computed(() => fromISODate(props.today) ?? new Date())

const label = computed(() => {
  const [s, e] = props.modelValue
  const preset = props.presets.find((p) => e === toISODate(todayDate.value) && s === toISODate(addDays(todayDate.value, -(p.days - 1))))
  if (preset) return preset.label
  return s && e ? `${formatHuman(s)} – ${formatHuman(e)}` : 'Select range'
})

async function toggle() {
  open.value = !open.value
  draft.value = [...props.modelValue]
  if (open.value) {
    await nextTick()
    cal.value?.focus()
  }
}
function applyPreset(p: DateRangePreset) {
  const end = toISODate(todayDate.value)
  const start = toISODate(addDays(todayDate.value, -(p.days - 1)))
  emit('update:modelValue', [start, end])
  close()
}
function apply() {
  if (draft.value[0] && draft.value[1]) {
    emit('update:modelValue', [draft.value[0], draft.value[1]])
    close()
  }
}
function close() {
  open.value = false
  anchor.value?.querySelector('button')?.focus()
}
useClickOutside([anchor, pop], () => (open.value = false))
</script>

<template>
  <div ref="anchor" class="inline-flex">
    <AkButton :size="size" :icon="CalendarRange" aria-haspopup="dialog" :aria-expanded="open ? 'true' : 'false'" @click="toggle">
      {{ label }}
      <template #end><ChevronDown class="size-4 text-tertiary" aria-hidden="true" /></template>
    </AkButton>
  </div>
  <Teleport to="body">
    <Transition name="ak-pop">
      <div
        v-if="open"
        ref="pop"
        role="dialog"
        aria-label="Choose date range"
        :style="style"
        class="z-[var(--ak-z-popover)] flex max-w-[calc(100vw-16px)] flex-col gap-3 rounded-overlay border border-line-subtle bg-surface-overlay p-3 shadow-elevation-16 sm:flex-row hc:border-line"
        @keydown.esc.prevent="close"
      >
        <ul class="flex flex-wrap gap-1 sm:w-36 sm:flex-col sm:border-r sm:border-line-subtle sm:pr-3" aria-label="Presets">
          <li v-for="p in presets" :key="p.label">
            <button type="button" class="w-full rounded-md px-2 py-1.5 text-left text-body-1 text-primary hover:bg-subtle-hover focus-ring" @click="applyPreset(p)">
              {{ p.label }}
            </button>
          </li>
        </ul>
        <div class="flex flex-col gap-3">
          <AkCalendar ref="cal" v-model:range="draft" mode="range" :today="today" :max="toISODate(todayDate)" />
          <p class="text-caption-1 text-secondary" aria-live="polite">
            <template v-if="draft[0] && draft[1]">{{ formatHuman(draft[0]) }} – {{ formatHuman(draft[1]) }}</template>
            <template v-else-if="draft[0]">Select an end date</template>
            <template v-else>Select a start date</template>
          </p>
          <div class="flex justify-end gap-2">
            <AkButton size="sm" variant="subtle" @click="close">Cancel</AkButton>
            <AkButton size="sm" variant="primary" :disabled="!draft[0] || !draft[1]" @click="apply">Apply</AkButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
