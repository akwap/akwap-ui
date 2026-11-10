<script setup lang="ts">
import type { Component } from 'vue'
/** AkKeyValue — one compact label/value pair, optionally with an icon. */
defineProps<{ label: string; value?: string | number; icon?: Component }>()
</script>

<template>
  <div class="flex min-w-0 items-start gap-2">
    <component :is="icon" v-if="icon" class="mt-0.5 size-4 shrink-0 text-tertiary" aria-hidden="true" />
    <div class="min-w-0">
      <p class="text-caption-1 text-tertiary">{{ label }}</p>
      <p class="truncate text-body-1 text-primary"><slot>{{ value ?? '—' }}</slot></p>
    </div>
  </div>
</template>
