<script setup lang="ts">
/**
 * AkSkeleton — placeholder shapes while content loads. The container should
 * set aria-busy="true"; skeletons themselves are hidden from AT.
 */
withDefaults(
  defineProps<{
    shape?: 'text' | 'rect' | 'circle'
    width?: string
    height?: string
    lines?: number
  }>(),
  { shape: 'text', lines: 1 },
)
</script>

<template>
  <span v-if="shape === 'text'" aria-hidden="true" class="flex w-full flex-col gap-2" :style="{ width }">
    <span v-for="i in lines" :key="i" class="skeleton block h-3 rounded-sm" :style="{ width: i === lines && lines > 1 ? '60%' : '100%', height }" />
  </span>
  <span
    v-else
    aria-hidden="true"
    class="skeleton block"
    :class="shape === 'circle' ? 'rounded-full' : 'rounded-md'"
    :style="{ width: width ?? (shape === 'circle' ? '40px' : '100%'), height: height ?? (shape === 'circle' ? width ?? '40px' : '80px') }"
  />
</template>
