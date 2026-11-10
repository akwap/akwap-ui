<script setup lang="ts">
import { computed } from 'vue'
import { Check, X } from '@lucide/vue'
import { passwordStrength } from '@/utils/validation'

/** AkPasswordStrength — meter + requirement checklist for a password value. */
const props = withDefaults(defineProps<{ password: string; showChecks?: boolean }>(), { showChecks: true })
const result = computed(() => passwordStrength(props.password))
const barColor = computed(() => ['bg-line', 'bg-danger-strong', 'bg-warning-strong', 'bg-success-strong', 'bg-success-strong'][result.value.score])
const textColor = computed(() => ['text-tertiary', 'text-danger', 'text-warning', 'text-success', 'text-success'][result.value.score])
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <div class="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
        <span v-for="i in 4" :key="i" class="h-1 rounded-full transition-colors duration-normal" :class="i <= result.score ? barColor : 'bg-surface-selected'" />
      </div>
      <span class="w-20 text-right text-caption-1-strong" :class="textColor" aria-live="polite">
        <span class="sr-only">Password strength: </span>{{ password ? result.label : '' }}
      </span>
    </div>
    <ul v-if="showChecks" class="grid gap-x-4 gap-y-1 text-caption-1 sm:grid-cols-2">
      <li v-for="c in result.checks" :key="c.label" class="flex items-center gap-1.5" :class="c.met ? 'text-success' : 'text-tertiary'">
        <Check v-if="c.met" class="size-3.5" aria-hidden="true" />
        <X v-else class="size-3.5" aria-hidden="true" />
        {{ c.label }}<span class="sr-only">{{ c.met ? ' (met)' : ' (not met)' }}</span>
      </li>
    </ul>
  </div>
</template>
