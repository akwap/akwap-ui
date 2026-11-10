<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from '@lucide/vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/** AkLink — inline text link. Internal routes use RouterLink; external links open safely. */
const props = defineProps<{ to?: RouteLocationRaw; href?: string; external?: boolean; subtle?: boolean }>()
const isExternal = computed(() => props.external || (!!props.href && /^https?:/.test(props.href)))
</script>

<template>
  <RouterLink v-if="to" :to="to" class="link" :class="subtle && 'text-secondary no-underline hover:underline'"><slot /></RouterLink>
  <a
    v-else
    :href="href"
    class="link inline-flex items-center gap-0.5"
    :class="subtle && 'text-secondary no-underline hover:underline'"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <template v-if="isExternal">
      <ExternalLink class="size-3" aria-hidden="true" /><span class="sr-only"> (opens in a new tab)</span>
    </template>
  </a>
</template>
