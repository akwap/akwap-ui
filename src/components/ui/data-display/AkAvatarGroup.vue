<script setup lang="ts">
import { computed } from 'vue'
import AkAvatar from './AkAvatar.vue'
import AkTooltip from '../overlays/AkTooltip.vue'

/** AkAvatarGroup — overlapping stack of avatars with a "+N" overflow. */
const props = withDefaults(
  defineProps<{ people: { name: string; src?: string }[]; max?: number; size?: 24 | 28 | 32 | 40; label?: string }>(),
  { max: 4, size: 32 },
)
const shown = computed(() => props.people.slice(0, props.max))
const rest = computed(() => props.people.slice(props.max))
</script>

<template>
  <div role="group" :aria-label="label ?? `${people.length} people`" class="flex items-center">
    <span v-for="(p, i) in shown" :key="p.name" class="rounded-full ring-2 ring-surface" :class="i > 0 && '-ml-2'">
      <AkAvatar :name="p.name" :src="p.src" :size="size" />
    </span>
    <AkTooltip v-if="rest.length" :content="rest.map((r) => r.name).join(', ')">
      <template #default="{ tooltipAttrs }">
        <span
          v-bind="tooltipAttrs"
          tabindex="0"
          class="-ml-2 flex items-center justify-center rounded-full bg-surface-selected text-caption-1 font-semibold text-secondary ring-2 ring-surface focus-ring"
          :style="{ width: `${size}px`, height: `${size}px` }"
          role="img"
          :aria-label="`and ${rest.length} more`"
        >
          +{{ rest.length }}
        </span>
      </template>
    </AkTooltip>
  </div>
</template>
