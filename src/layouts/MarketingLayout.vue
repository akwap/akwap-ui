<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Menu } from '@lucide/vue'
import AkLogo from '@/components/shared/AkLogo.vue'
import AkThemeSwitcher from '@/components/shared/AkThemeSwitcher.vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkDrawer from '@/components/ui/overlays/AkDrawer.vue'

/** MarketingLayout — public site shell: sticky header, mobile drawer, footer. */
const route = useRoute()
const mobileOpen = ref(false)
watch(() => route.fullPath, () => (mobileOpen.value = false))

const nav = [
  { label: 'Features', to: '/#features' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Design system', to: '/docs' },
]
const footer = [
  { title: 'Product', links: [{ label: 'Features', to: '/#features' }, { label: 'Pricing', to: '/#pricing' }, { label: 'Dashboard demo', to: '/dashboard' }, { label: 'FAQ', to: '/#faq' }] },
  { title: 'Company', links: [{ label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }, { label: 'Careers', to: '/about#team' }] },
  { title: 'Resources', links: [{ label: 'Design system', to: '/docs' }, { label: 'Components', to: '/docs/components/button' }, { label: 'Playground', to: '/docs/playground' }] },
  { title: 'Legal', links: [{ label: 'Privacy', to: '/privacy' }, { label: 'Terms', to: '/terms' }] },
]
const isActive = (to: string) => !to.includes('#') && route.path === to
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <header class="sticky top-0 z-[var(--ak-z-nav)] border-b border-line-subtle bg-surface/85 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-surface">
      <div class="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="rounded-control focus-ring" aria-label="Akwap home"><AkLogo /></RouterLink>
        <nav aria-label="Main" class="hidden flex-1 lg:block">
          <ul class="flex items-center gap-1">
            <li v-for="n in nav" :key="n.label">
              <RouterLink
                :to="n.to"
                class="rounded-control px-3 py-2 text-body-1 transition-colors focus-ring"
                :class="isActive(n.to) ? 'font-semibold text-primary' : 'text-secondary hover:bg-subtle-hover hover:text-primary'"
                :aria-current="isActive(n.to) ? 'page' : undefined"
              >
                {{ n.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="ml-auto flex items-center gap-2">
          <AkThemeSwitcher />
          <AkButton to="/auth/login" variant="subtle" class="max-sm:hidden">Sign in</AkButton>
          <AkButton to="/auth/register" variant="primary" class="max-sm:hidden">Get started</AkButton>
          <AkButton variant="subtle" icon-only :icon="Menu" class="lg:hidden" aria-label="Open menu" :aria-expanded="mobileOpen ? 'true' : 'false'" data-testid="marketing-menu" @click="mobileOpen = true">Open menu</AkButton>
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
      </nav>
      <template #footer>
        <div class="grid w-full grid-cols-2 gap-2">
          <AkButton to="/auth/login" size="lg">Sign in</AkButton>
          <AkButton to="/auth/register" variant="primary" size="lg">Get started</AkButton>
        </div>
      </template>
    </AkDrawer>

    <main id="main" tabindex="-1" class="flex-1 outline-none">
      <RouterView />
    </main>

    <footer class="border-t border-line-subtle bg-surface">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_3fr] lg:px-8">
        <div class="max-w-xs">
          <AkLogo />
          <p class="mt-3 text-body-1 text-secondary">Operations, billing and member management for growing businesses across Africa and beyond.</p>
        </div>
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <nav v-for="col in footer" :key="col.title" :aria-label="col.title">
            <h2 class="text-caption-1-strong text-primary">{{ col.title }}</h2>
            <ul class="mt-3 flex flex-col gap-2">
              <li v-for="l in col.links" :key="l.label">
                <RouterLink :to="l.to" class="rounded-sm text-body-1 text-secondary hover:text-primary hover:underline focus-ring">{{ l.label }}</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="border-t border-line-subtle">
        <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-caption-1 text-tertiary sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Akwap Cloud Ltd. Built with AkwapUI.</p>
          <p>Made in Nairobi · Serving 14 countries</p>
        </div>
      </div>
    </footer>
  </div>
</template>
