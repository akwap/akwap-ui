<script setup lang="ts">
import { computed, nextTick, ref, toRef, useId, watch, type Component } from 'vue'
import { CornerDownLeft, Search } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'

export interface Command {
  id: string
  label: string
  group?: string
  icon?: Component
  keywords?: string
  shortcut?: string
  run: () => void
}

/**
 * AkCommandPalette — keyboard-first search across pages and actions.
 * Pattern: modal dialog containing a combobox + listbox
 * (aria-activedescendant). Typically opened with Ctrl/⌘ + K.
 */
const props = withDefaults(defineProps<{ open: boolean; commands: Command[]; placeholder?: string }>(), {
  placeholder: 'Search pages, people and actions…',
})
const emit = defineEmits<{ 'update:open': [open: boolean] }>()
const uid = useId()
const panel = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const active = ref(0)
const isOpen = toRef(props, 'open')
useFocusTrap(panel, isOpen, { initialFocus: () => input.value })
useScrollLock(isOpen)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.commands
  return props.commands
    .map((c) => {
      const hay = `${c.label} ${c.keywords ?? ''} ${c.group ?? ''}`.toLowerCase()
      const score = c.label.toLowerCase().startsWith(q) ? 3 : c.label.toLowerCase().includes(q) ? 2 : q.split(/\s+/).every((w) => hay.includes(w)) ? 1 : 0
      return { c, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c)
})
const groups = computed(() => {
  const map = new Map<string, { cmd: Command; index: number }[]>()
  results.value.forEach((cmd, index) => {
    const g = cmd.group ?? 'Results'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push({ cmd, index })
  })
  return [...map.entries()]
})
watch(query, () => (active.value = 0))
watch(isOpen, (v) => {
  if (v) {
    query.value = ''
    active.value = 0
  }
})

function close() {
  emit('update:open', false)
}
function run(c: Command | undefined) {
  if (!c) return
  close()
  nextTick(c.run)
}
function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = (active.value + 1) % Math.max(1, n)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = (active.value - 1 + n) % Math.max(1, n)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    run(results.value[active.value])
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close()
  }
  nextTick(() => panel.value?.querySelector(`#${CSS.escape(`${uid}-opt-${active.value}`)}`)?.scrollIntoView({ block: 'nearest' }))
}
</script>

<template>
  <Teleport to="body">
    <Transition name="ak-fade">
      <div v-if="open" class="fixed inset-0 z-[var(--ak-z-modal)] bg-backdrop" aria-hidden="true" @click="close" />
    </Transition>
    <Transition name="ak-dialog">
      <div v-if="open" class="pointer-events-none fixed inset-0 z-[var(--ak-z-modal)] flex items-start justify-center px-4 pt-[12vh]">
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          class="pointer-events-auto flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-overlay border border-line-subtle bg-surface-overlay shadow-elevation-28 hc:border-line"
          @keydown="onKey"
        >
          <div class="flex items-center gap-3 border-b border-line-subtle px-4">
            <Search class="size-5 text-tertiary" aria-hidden="true" />
            <input
              ref="input"
              v-model="query"
              type="text"
              role="combobox"
              aria-expanded="true"
              :aria-controls="`${uid}-list`"
              :aria-activedescendant="results.length ? `${uid}-opt-${active}` : undefined"
              aria-autocomplete="list"
              aria-label="Search commands"
              :placeholder="placeholder"
              class="h-12 min-w-0 flex-1 bg-transparent text-body-2 text-primary outline-none placeholder:text-tertiary"
            />
            <kbd class="rounded-sm border border-line px-1.5 text-caption-1 text-tertiary">Esc</kbd>
          </div>
          <div :id="`${uid}-list`" role="listbox" aria-label="Commands" class="flex-1 overflow-y-auto p-2">
            <div v-for="[group, entries] in groups" :key="group" role="group" :aria-labelledby="`${uid}-g-${group.replace(/\W/g, '')}`" class="mb-1">
              <div :id="`${uid}-g-${group.replace(/\W/g, '')}`" class="px-2 pt-2 pb-1 text-caption-1-strong text-tertiary">{{ group }}</div>
              <div
                v-for="{ cmd, index } in entries"
                :id="`${uid}-opt-${index}`"
                :key="cmd.id"
                role="option"
                :aria-selected="index === active ? 'true' : 'false'"
                class="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-body-1"
                :class="index === active ? 'bg-surface-selected text-primary' : 'text-primary'"
                @mouseenter="active = index"
                @click="run(cmd)"
              >
                <component :is="cmd.icon" v-if="cmd.icon" class="size-4 shrink-0 text-secondary" aria-hidden="true" />
                <span class="flex-1 truncate">{{ cmd.label }}</span>
                <kbd v-if="cmd.shortcut" class="text-caption-1 text-tertiary">{{ cmd.shortcut }}</kbd>
                <CornerDownLeft v-if="index === active" class="size-3.5 text-tertiary" aria-hidden="true" />
              </div>
            </div>
            <p v-if="!results.length" class="px-2 py-8 text-center text-body-1 text-secondary">No results for “{{ query }}”</p>
          </div>
          <div class="hidden items-center gap-4 border-t border-line-subtle px-4 py-2 text-caption-1 text-tertiary sm:flex">
            <span><kbd class="font-sans">↑↓</kbd> to navigate</span>
            <span><kbd class="font-sans">Enter</kbd> to select</span>
            <span><kbd class="font-sans">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
