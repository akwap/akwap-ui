<script setup lang="ts">
import { setLucideProps } from '@lucide/vue'
import { RouterView, useRouter } from 'vue-router'
import AkToaster from '@/components/ui/feedback/AkToaster.vue'
import AkLiveRegion from '@/components/shared/AkLiveRegion.vue'
import AkSkipLink from '@/components/shared/AkSkipLink.vue'
import { useAnnouncer } from '@/composables/useAnnouncer'
import { pageTitle } from './router'

setLucideProps({ strokeWidth: 1.75 })

// Announce page changes and move focus to <main> after client-side navigation.
const router = useRouter()
const { announce } = useAnnouncer()
let first = true
router.afterEach((to, from) => {
  if (first) return void (first = false)
  if (to.path === from.path) return
  announce(`${pageTitle(to.path, to.meta.title, to.params.slug)} loaded`)
  requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
})
</script>

<template>
  <AkSkipLink />
  <RouterView />
  <AkToaster />
  <AkLiveRegion />
</template>
