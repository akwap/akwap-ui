<script setup lang="ts">
import { setLucideProps } from '@lucide/vue'
import { RouterView, useRouter } from 'vue-router'
import AkToaster from '@/components/ui/feedback/AkToaster.vue'
import AkLiveRegion from '@/components/shared/AkLiveRegion.vue'
import AkSkipLink from '@/components/shared/AkSkipLink.vue'
import { useTheme } from '@/composables/useTheme'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { pageTitle } from '@/router'

// Fluent-style icon weight across the whole app.
setLucideProps({ strokeWidth: 1.75 })
useTheme()

// SPA accessibility: announce the new page and move focus to <main> after
// client-side navigation (not on first load, and not for in-page hashes).
const router = useRouter()
const { announce } = useAnnouncer()
let first = true
router.afterEach((to, from) => {
  if (first) {
    first = false
    return
  }
  if (to.path === from.path) return
  announce(`${pageTitle(to) ?? 'Page'} loaded`)
  requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
})
</script>

<template>
  <AkSkipLink />
  <RouterView />
  <AkToaster />
  <AkLiveRegion />
</template>
