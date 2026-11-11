<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from '@lucide/vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkBadge from '@/components/ui/data-display/AkBadge.vue'
import ServiceArt from '@site/components/ServiceArt.vue'
import { serviceBySlug, services } from '@site/content'
import NotFoundPage from './NotFoundPage.vue'

const route = useRoute()
const service = computed(() => serviceBySlug(String(route.params.slug)))
const others = computed(() => services.filter((s) => s.slug !== service.value?.slug))
</script>

<template>
  <NotFoundPage v-if="!service" />
  <template v-else>
    <section class="relative isolate overflow-hidden border-b border-line-subtle pt-18" :aria-labelledby="`title-${service.slug}`">
      <div class="absolute inset-0 -z-10 opacity-70" aria-hidden="true"><ServiceArt :slug="service.slug" :accent="service.accent" /></div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/30" aria-hidden="true" />
      <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <RouterLink to="/#solutions" class="inline-flex items-center gap-2 rounded-control text-body-1 text-secondary hover:text-primary focus-ring"><ArrowLeft class="size-4" aria-hidden="true" />All solutions</RouterLink>
        <div class="mt-8 flex items-center gap-3">
          <component :is="service.icon" class="size-8" :style="{ color: service.accent }" aria-hidden="true" />
          <p class="site-eyebrow">Solution</p>
        </div>
        <h1 :id="`title-${service.slug}`" class="mt-4 max-w-4xl text-[length:clamp(40px,5.6vw,80px)] leading-[1.02] font-bold tracking-tight">{{ service.name }}</h1>
        <p class="mt-6 max-w-2xl text-subtitle-2 font-normal text-secondary">{{ service.intro }}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <AkButton to="/contact" variant="primary" size="lg" :icon="ArrowUpRight" icon-position="end">Discuss a project</AkButton>
        </div>
      </div>
    </section>

    <section class="py-20 sm:py-28" aria-labelledby="capabilities-title">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="capabilities-title" class="text-[length:clamp(28px,3.4vw,48px)] font-bold tracking-tight">What we deliver</h2>
        <div class="mt-10 grid gap-px overflow-hidden rounded-xl border border-line-subtle bg-line-subtle sm:grid-cols-2">
          <div v-for="(c, i) in service.capabilities" :key="c.title" class="bg-background p-6 sm:p-10">
            <span class="font-mono text-caption-1 text-tertiary">0{{ i + 1 }}</span>
            <h3 class="mt-3 text-title-3">{{ c.title }}</h3>
            <p class="mt-2 text-body-2 text-secondary">{{ c.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-line-subtle bg-background-secondary py-20 sm:py-28" aria-labelledby="outcomes-title">
      <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 id="outcomes-title" class="text-[length:clamp(28px,3.4vw,48px)] font-bold tracking-tight">What it changes</h2>
          <ul class="mt-8 flex flex-col gap-5">
            <li v-for="o in service.outcomes" :key="o" class="flex gap-4 text-subtitle-2 font-normal">
              <span class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand-subtle text-brand"><Check class="size-4" aria-hidden="true" /></span>{{ o }}
            </li>
          </ul>
        </div>
        <div>
          <h2 class="site-eyebrow">Technologies</h2>
          <ul class="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            <li v-for="t in service.stack" :key="t"><AkBadge appearance="outline" color="neutral" size="lg">{{ t }}</AkBadge></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="py-20 sm:py-28" aria-labelledby="more-title">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="more-title" class="site-eyebrow">More solutions</h2>
        <ul class="mt-6 grid gap-4 md:grid-cols-3">
          <li v-for="s in others" :key="s.slug">
            <RouterLink :to="`/solutions/${s.slug}`" class="group flex h-full items-center justify-between gap-4 rounded-xl border border-line-subtle bg-surface p-6 transition-colors hover:border-line-strong focus-ring">
              <span class="flex items-center gap-3 text-subtitle-1"><component :is="s.icon" class="size-6" :style="{ color: s.accent }" aria-hidden="true" />{{ s.name }}</span>
              <ArrowRight class="size-5 text-tertiary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </template>
</template>
