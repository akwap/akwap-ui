<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ArrowUpRight, Mail, MapPin, Menu } from '@lucide/vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkDrawer from '@/components/ui/overlays/AkDrawer.vue'
import AkwapLogo from './AkwapLogo.vue'
import { company, services } from '@site/content'

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)
watch(() => route.fullPath, () => (mobileOpen.value = false))

const onScroll = () => (scrolled.value = window.scrollY > 24)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const nav = [
  { label: 'Solutions', to: '/#solutions' },
  { label: 'Sectors', to: '/#sectors' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
const isActive = (to: string) => !to.includes('#') && route.path === to
const year = new Date().getFullYear()
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background text-primary">
    <header
      class="fixed inset-x-0 top-0 z-[var(--ak-z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300"
      :class="scrolled || route.path !== '/' ? 'border-b border-line-subtle bg-background/80 backdrop-blur-md' : 'border-b border-transparent'"
    >
      <div class="mx-auto flex h-18 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="rounded-control focus-ring" aria-label="Akwap Systems home"><AkwapLogo /></RouterLink>
        <nav aria-label="Main" class="ml-auto hidden lg:block">
          <ul class="flex items-center gap-1">
            <li v-for="n in nav" :key="n.label">
              <RouterLink
                :to="n.to"
                class="rounded-control px-4 py-2 text-body-1 font-medium tracking-wide transition-colors focus-ring"
                :class="isActive(n.to) ? 'text-primary' : 'text-secondary hover:text-primary'"
                :aria-current="isActive(n.to) ? 'page' : undefined"
              >
                {{ n.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="ml-auto flex items-center gap-2 lg:ml-2">
          <AkButton to="/contact" variant="primary" :icon="ArrowUpRight" icon-position="end" class="max-sm:hidden">Start a project</AkButton>
          <AkButton variant="subtle" icon-only :icon="Menu" class="lg:hidden" aria-label="Open menu" :aria-expanded="mobileOpen ? 'true' : 'false'" data-testid="site-menu" @click="mobileOpen = true">Open menu</AkButton>
        </div>
      </div>
    </header>

    <AkDrawer v-model:open="mobileOpen" side="right" size="sm" aria-label="Menu" title="Menu">
      <nav aria-label="Mobile" class="p-3">
        <ul class="flex flex-col gap-1">
          <li v-for="n in nav" :key="n.label">
            <RouterLink :to="n.to" class="flex min-h-touch items-center rounded-md px-3 text-body-2 text-primary hover:bg-subtle-hover focus-ring" @click="mobileOpen = false">{{ n.label }}</RouterLink>
          </li>
        </ul>
        <p class="mt-6 px-3 site-eyebrow">Solutions</p>
        <ul class="mt-2 flex flex-col gap-1">
          <li v-for="s in services" :key="s.slug">
            <RouterLink :to="`/solutions/${s.slug}`" class="flex min-h-touch items-center gap-3 rounded-md px-3 text-body-1 text-secondary hover:bg-subtle-hover hover:text-primary focus-ring">
              <component :is="s.icon" class="size-5" :style="{ color: s.accent }" aria-hidden="true" />{{ s.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <template #footer>
        <AkButton to="/contact" variant="primary" size="lg" block>Start a project</AkButton>
      </template>
    </AkDrawer>

    <main id="main" tabindex="-1" class="flex-1 outline-none">
      <RouterView />
    </main>

    <footer class="relative overflow-hidden border-t border-line-subtle bg-background-secondary">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div class="max-w-sm">
          <AkwapLogo size="lg" />
          <p class="mt-5 text-body-2 text-secondary">{{ company.tagline }}</p>
        </div>
        <nav aria-label="Solutions">
          <h2 class="site-eyebrow">Solutions</h2>
          <ul class="mt-4 flex flex-col gap-3">
            <li v-for="s in services" :key="s.slug">
              <RouterLink :to="`/solutions/${s.slug}`" class="rounded-sm text-body-1 text-secondary hover:text-primary focus-ring">{{ s.name }}</RouterLink>
            </li>
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 class="site-eyebrow">Company</h2>
          <ul class="mt-4 flex flex-col gap-3">
            <li><RouterLink to="/about" class="rounded-sm text-body-1 text-secondary hover:text-primary focus-ring">About us</RouterLink></li>
            <li><RouterLink to="/#process" class="rounded-sm text-body-1 text-secondary hover:text-primary focus-ring">How we work</RouterLink></li>
            <li><RouterLink to="/#sectors" class="rounded-sm text-body-1 text-secondary hover:text-primary focus-ring">Sectors</RouterLink></li>
            <li><RouterLink to="/contact" class="rounded-sm text-body-1 text-secondary hover:text-primary focus-ring">Contact</RouterLink></li>
          </ul>
        </nav>
        <div>
          <h2 class="site-eyebrow">Get in touch</h2>
          <ul class="mt-4 flex flex-col gap-3 text-body-1 text-secondary">
            <li class="flex gap-2"><MapPin class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{{ company.location }}</li>
            <li class="flex gap-2"><Mail class="mt-0.5 size-4 shrink-0" aria-hidden="true" /><a :href="`mailto:${company.email}`" class="rounded-sm break-all hover:text-primary focus-ring">{{ company.email }}</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-line-subtle">
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-caption-1 text-tertiary sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {{ year }} {{ company.name }}. All rights reserved.</p>
          <p>Engineered in Turkana, Kenya · Built with AkwapUI</p>
        </div>
      </div>
      <p aria-hidden="true" class="pointer-events-none -mb-[0.22em] select-none px-4 text-center text-[length:clamp(64px,17vw,260px)] leading-none font-bold tracking-tighter text-fg-primary/[0.04]">AKWAP</p>
    </footer>
  </div>
</template>
