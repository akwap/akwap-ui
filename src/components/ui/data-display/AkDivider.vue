<script setup lang="ts">
/** AkDivider — separates content. Optional centred label for horizontal dividers. */
withDefaults(defineProps<{ vertical?: boolean; label?: string; appearance?: 'subtle' | 'default' | 'strong' }>(), { appearance: 'subtle' })
</script>

<template>
  <div
    v-if="vertical"
    role="separator"
    aria-orientation="vertical"
    class="w-px self-stretch"
    :class="{ subtle: 'bg-line-subtle', default: 'bg-line', strong: 'bg-line-strong' }[appearance]"
  />
  <div v-else-if="label || $slots.default" role="separator" class="flex items-center gap-3 text-caption-1 text-tertiary">
    <span class="h-px flex-1" :class="{ subtle: 'bg-line-subtle', default: 'bg-line', strong: 'bg-line-strong' }[appearance]" />
    <slot>{{ label }}</slot>
    <span class="h-px flex-1" :class="{ subtle: 'bg-line-subtle', default: 'bg-line', strong: 'bg-line-strong' }[appearance]" />
  </div>
  <hr v-else class="border-0 border-t" :class="{ subtle: 'border-line-subtle', default: 'border-line', strong: 'border-line-strong' }[appearance]" />
</template>
