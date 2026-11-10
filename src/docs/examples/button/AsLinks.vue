<script setup lang="ts">
import { ExternalLink, LayoutDashboard } from '@lucide/vue'
import { AkButton } from '@/design-system'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- `to` renders a RouterLink; `href` renders an <a>. Same styles, correct semantics. -->
    <AkButton variant="primary" to="/dashboard" :icon="LayoutDashboard">Open dashboard</AkButton>
    <AkButton href="https://vuejs.org" target="_blank" rel="noopener" :icon="ExternalLink" icon-position="end">Vue documentation</AkButton>
  </div>
</template>
