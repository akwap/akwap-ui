<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Menu, Search, FlaskConical, LayoutDashboard, ChevronLeft, ChevronRight } from '@lucide/vue'
import AkLogo from '@/components/shared/AkLogo.vue'
import AkThemeSwitcher from '@/components/shared/AkThemeSwitcher.vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkDrawer from '@/components/ui/overlays/AkDrawer.vue'
import AkInput from '@/components/ui/forms/AkInput.vue'
import AkBadge from '@/components/ui/data-display/AkBadge.vue'
import { docSections, docHref, flatDocs } from '@/docs/nav'
import '@/docs/shared/docs.css'

/** DocumentationLayout — header, filterable sidebar, content and prev/next. */
const route = useRoute()
const drawer = ref(false)
const filter = ref('')
watch(() => route.fullPath, () => (drawer.value = false))

const sections = computed(() => {
  const q = filter.value.trim().toLowerCase()
  return docSections
    .map((s) => ({ ...s, links: s.links.filter((l) => !q || l.label.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)) }))
    .filter((s) => s.links.length)
})
const current = computed(() => flatDocs.findIndex((d) => d.href === route.path))
const prev = computed(() => (current.value > 0 ? flatDocs[current.value - 1] : null))
const next = computed(() => (current.value >= 0 && current.value < flatDocs.length - 1 ? flatDocs[current.value + 1] : null))
const wide = computed(() => !!route.meta.wide)
</script>

<template>
  <div class="min-h-dvh bg-background">
    <header class="sticky top-0 z-[var(--ak-z-nav)] border-b border-line-subtle bg-surface">
      <div class="flex h-14 items-center gap-3 px-3 sm:px-4">
        <AkButton variant="subtle" icon-only :icon="Menu" class="lg:hidden" aria-label="Open documentation menu" data-testid="docs-menu" @click="drawer = true">Menu</AkButton>
        <RouterLink to="/docs" class="flex items-center gap-2 rounded-control focus-ring" aria-label="AkwapUI documentation home">
          <AkLogo text="AkwapUI" />
        </RouterLink>
        <AkBadge size="sm" class="max-sm:hidden">v1.0</AkBadge>
        <nav aria-label="Documentation" class="ml-auto flex items-center gap-1">
          <AkButton variant="subtle" :icon="FlaskConical" to="/docs/playground" class="max-md:hidden">Playground</AkButton>
          <AkButton variant="subtle" :icon="LayoutDashboard" to="/dashboard" class="max-md:hidden">Live demo</AkButton>
          <AkThemeSwitcher />
        </nav>
      </div>
    </header>

    <div class="mx-auto flex max-w-[1600px]">
      <aside class="sticky top-14 hidden h-[calc(100dvh-56px)] w-64 shrink-0 overflow-y-auto border-r border-line-subtle px-3 py-4 lg:block" aria-label="Documentation sidebar">
        <AkInput v-model="filter" type="search" size="sm" placeholder="Filter pages" aria-label="Filter documentation pages" class="mb-4" />
        <nav aria-label="Documentation pages" class="flex flex-col gap-5">
          <div v-for="s in sections" :key="s.id">
            <h2 class="px-2 pb-1 text-caption-1-strong tracking-wide text-tertiary uppercase">{{ s.title }}</h2>
            <ul class="flex flex-col">
              <li v-for="l in s.links" :key="l.slug">
                <RouterLink
                  :to="docHref(s.id, l.slug)"
                  class="relative block rounded-md px-2 py-1.5 text-body-1 focus-ring-inset"
                  :class="route.path === docHref(s.id, l.slug) ? 'bg-surface-selected font-semibold text-primary' : 'text-secondary hover:bg-subtle-hover hover:text-primary'"
                  :aria-current="route.path === docHref(s.id, l.slug) ? 'page' : undefined"
                >
                  <span v-if="route.path === docHref(s.id, l.slug)" class="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand" aria-hidden="true" />
                  {{ l.label }}
                </RouterLink>
              </li>
            </ul>
          </div>
          <p v-if="!sections.length" class="px-2 text-caption-1 text-tertiary"><Search class="mr-1 inline size-3.5" aria-hidden="true" />No pages match “{{ filter }}”.</p>
        </nav>
      </aside>

      <AkDrawer v-model:open="drawer" side="left" size="sm" title="Documentation">
        <div class="p-3">
          <AkInput v-model="filter" type="search" size="md" placeholder="Filter pages" aria-label="Filter documentation pages" class="mb-4" />
          <AkButton block :icon="FlaskConical" to="/docs/playground" class="mb-4">Playground</AkButton>
          <nav aria-label="Documentation pages (mobile)" class="flex flex-col gap-5">
            <div v-for="s in sections" :key="s.id">
              <h2 class="px-2 pb-1 text-caption-1-strong tracking-wide text-tertiary uppercase">{{ s.title }}</h2>
              <ul>
                <li v-for="l in s.links" :key="l.slug">
                  <RouterLink :to="docHref(s.id, l.slug)" class="block min-h-touch rounded-md px-2 py-2.5 text-body-1 focus-ring" :class="route.path === docHref(s.id, l.slug) ? 'bg-surface-selected font-semibold text-primary' : 'text-secondary'">{{ l.label }}</RouterLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </AkDrawer>

      <main id="main" tabindex="-1" class="min-w-0 flex-1 px-4 py-8 outline-none sm:px-8 lg:px-12" :class="!wide && 'max-w-5xl'">
        <RouterView :key="route.path" />
        <nav v-if="prev || next" aria-label="Previous and next page" class="mt-16 grid gap-3 border-t border-line-subtle pt-6 sm:grid-cols-2">
          <RouterLink v-if="prev" :to="prev.href" class="group rounded-card border border-line-subtle p-4 hover:border-line focus-ring">
            <span class="flex items-center gap-1 text-caption-1 text-tertiary"><ChevronLeft class="size-3.5" aria-hidden="true" />Previous</span>
            <span class="mt-1 block text-body-1-strong text-primary group-hover:text-brand">{{ prev.label }}</span>
          </RouterLink>
          <span v-else />
          <RouterLink v-if="next" :to="next.href" class="group rounded-card border border-line-subtle p-4 text-right hover:border-line focus-ring">
            <span class="flex items-center justify-end gap-1 text-caption-1 text-tertiary">Next<ChevronRight class="size-3.5" aria-hidden="true" /></span>
            <span class="mt-1 block text-body-1-strong text-primary group-hover:text-brand">{{ next.label }}</span>
          </RouterLink>
        </nav>
      </main>
    </div>
  </div>
</template>
