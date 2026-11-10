<script setup lang="ts">
import { Check, X } from '@lucide/vue'

export interface Step {
  id: string
  label: string
  description?: string
  error?: boolean
}

/** AkStepper — progress through a multi-step flow. Current step uses aria-current="step". */
withDefaults(defineProps<{ steps: Step[]; current: number; orientation?: 'horizontal' | 'vertical'; label?: string }>(), {
  orientation: 'horizontal',
  label: 'Progress',
})
</script>

<template>
  <nav :aria-label="label">
    <ol class="flex" :class="orientation === 'vertical' ? 'flex-col gap-0' : 'flex-col gap-3 sm:flex-row sm:items-start sm:gap-0'">
      <li
        v-for="(s, i) in steps"
        :key="s.id"
        class="relative flex flex-1 gap-3"
        :class="orientation === 'vertical' ? 'pb-6 last:pb-0' : 'sm:flex-col sm:items-center sm:text-center'"
        :aria-current="i === current ? 'step' : undefined"
      >
        <span
          v-if="i < steps.length - 1"
          aria-hidden="true"
          class="absolute"
          :class="[
            orientation === 'vertical' ? 'top-8 bottom-0 left-[15px] w-px' : 'hidden sm:block sm:top-4 sm:left-[calc(50%+20px)] sm:h-px sm:w-[calc(100%-40px)]',
            i < current ? 'bg-brand' : 'bg-line',
          ]"
        />
        <span
          class="relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-body-1-strong"
          :class="
            s.error
              ? 'border-danger-strong bg-danger-background text-danger'
              : i < current
                ? 'border-brand bg-brand text-on-brand'
                : i === current
                  ? 'border-brand bg-surface text-brand'
                  : 'border-line bg-surface text-tertiary'
          "
        >
          <X v-if="s.error" class="size-4" aria-hidden="true" />
          <Check v-else-if="i < current" class="size-4" aria-hidden="true" />
          <span v-else aria-hidden="true">{{ i + 1 }}</span>
        </span>
        <span class="min-w-0 pt-1 sm:px-2">
          <span class="block text-body-1" :class="i === current ? 'font-semibold text-primary' : i < current ? 'text-primary' : 'text-secondary'">
            {{ s.label }}
            <span class="sr-only">{{ s.error ? '(error)' : i < current ? '(completed)' : i === current ? '(current)' : '(not started)' }}</span>
          </span>
          <span v-if="s.description" class="block text-caption-1 text-tertiary">{{ s.description }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
