<script setup lang="ts">
/** AkButtonGroup — visually joins adjacent buttons (e.g. a segmented toolbar). */
withDefaults(defineProps<{ label?: string; vertical?: boolean }>(), {})
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    class="inline-flex"
    :class="
      vertical
        ? 'flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none'
        : '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none'
    "
  >
    <slot />
  </div>
</template>
