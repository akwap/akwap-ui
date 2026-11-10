<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Compass } from '@lucide/vue'
import { AkButton, AkEmptyState } from '@/design-system'
import AkLogo from '@/components/shared/AkLogo.vue'
const router = useRouter()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <header class="px-4 py-4 sm:px-8"><RouterLink to="/" class="rounded-control focus-ring" aria-label="Akwap home"><AkLogo /></RouterLink></header>
    <main id="main" tabindex="-1" class="flex flex-1 items-center justify-center px-4 outline-none">
      <AkEmptyState :icon="Compass" :heading-level="1" size="lg" title="We can't find that page" description="The link may be broken or the page may have moved. Check the address, or head back to somewhere familiar.">
        <AkButton variant="primary" to="/">Go to homepage</AkButton>
        <AkButton @click="router.back()">Go back</AkButton>
        <AkButton variant="subtle" to="/docs">Browse the docs</AkButton>
      </AkEmptyState>
    </main>
  </div>
</template>
