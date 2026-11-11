<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight, MapPin, RadioTower, ShieldCheck, Sun, Wrench } from '@lucide/vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import StellarGlobe from '@site/components/StellarGlobe.vue'
import ServiceArt from '@site/components/ServiceArt.vue'
import { process, sectors, services } from '@site/content'
import { useReveal } from '@site/composables'

useReveal()

const pillars = [
  { icon: Sun, title: 'Built for the sun', text: 'Designed for heat, dust and long, bright days.' },
  { icon: RadioTower, title: 'Connected anywhere', text: 'LoRa, GSM and satellite links chosen per site.' },
  { icon: Wrench, title: 'Local engineers', text: 'Installation and support from a team based in Turkana.' },
  { icon: ShieldCheck, title: 'One accountable team', text: 'Hardware, software and power under one roof.' },
]
</script>

<template>
  <!-- HERO -->
  <section class="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-18" aria-labelledby="hero-title">
    <div class="absolute inset-0 -z-10 site-grid-bg [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,color-mix(in_oklch,var(--site-jade)_14%,transparent),transparent_60%)]" aria-hidden="true" />
    <div class="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
      <div class="relative z-10">
        <p class="site-eyebrow flex items-center gap-2"><MapPin class="size-4" aria-hidden="true" />Turkana, Kenya</p>
        <h1 id="hero-title" class="mt-5 text-[length:clamp(44px,6.4vw,92px)] leading-[0.98] font-bold tracking-tight">
          Connected systems,<br /><span class="site-gradient-text">powered by the sun.</span>
        </h1>
        <p class="mt-6 max-w-xl text-subtitle-2 font-normal text-secondary">
          Akwap Systems engineers IoT devices, software platforms, smart irrigation and solar power, built for the toughest conditions and the places that need them most.
        </p>
        <div class="mt-9 flex flex-wrap gap-3">
          <AkButton to="/#solutions" variant="primary" size="lg" :icon="ArrowRight" icon-position="end">Explore solutions</AkButton>
          <AkButton to="/contact" size="lg" variant="outline">Talk to an engineer</AkButton>
        </div>
      </div>
      <div class="relative aspect-square w-full max-lg:mx-auto max-lg:max-w-[560px] lg:-mr-16">
        <StellarGlobe />
      </div>
    </div>
    <a href="#solutions" class="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-control text-caption-1 tracking-[0.3em] text-tertiary uppercase focus-ring sm:flex">
      Scroll<span class="h-10 w-px bg-gradient-to-b from-fg-tertiary to-transparent" aria-hidden="true" />
    </a>
  </section>

  <!-- MARQUEE STRIP -->
  <div class="border-y border-line-subtle bg-background-secondary">
    <ul class="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 py-6 text-body-1 font-semibold tracking-[0.2em] text-tertiary uppercase sm:px-6 lg:justify-between lg:px-8">
      <li v-for="s in services" :key="s.slug" class="flex items-center gap-3"><component :is="s.icon" class="size-5" :style="{ color: s.accent }" aria-hidden="true" />{{ s.short }}</li>
    </ul>
  </div>

  <!-- SOLUTIONS -->
  <section id="solutions" class="scroll-mt-18 py-24 sm:py-32" aria-labelledby="solutions-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="site-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div class="max-w-2xl">
          <p class="site-eyebrow">What we build</p>
          <h2 id="solutions-title" class="mt-4 text-[length:clamp(32px,4vw,56px)] leading-tight font-bold tracking-tight">Four disciplines.<br />One integrated system.</h2>
        </div>
        <p class="max-w-md text-body-2 text-secondary">Most projects need more than one. A solar pump needs a controller, the controller needs connectivity, and someone needs to see the data. We deliver all of it.</p>
      </div>

      <div class="mt-14 grid gap-5 md:grid-cols-2">
        <RouterLink
          v-for="(s, i) in services"
          :key="s.slug"
          :to="`/solutions/${s.slug}`"
          class="site-reveal group relative flex flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong focus-ring"
          :style="{ transitionDelay: `${i * 60}ms` }"
          :data-testid="`service-card-${s.slug}`"
        >
          <div class="relative aspect-[16/8] overflow-hidden border-b border-line-subtle bg-background-secondary">
            <div class="absolute inset-0 transition-transform duration-700 group-hover:scale-105"><ServiceArt :slug="s.slug" :accent="s.accent" /></div>
            <span class="absolute top-4 left-4 font-mono text-caption-1 text-tertiary">0{{ i + 1 }}</span>
          </div>
          <div class="flex flex-1 flex-col p-6 sm:p-8">
            <div class="flex items-center gap-3">
              <component :is="s.icon" class="size-6" :style="{ color: s.accent }" aria-hidden="true" />
              <h3 class="text-title-3">{{ s.name }}</h3>
            </div>
            <p class="mt-3 flex-1 text-body-2 text-secondary">{{ s.summary }}</p>
            <span class="mt-6 inline-flex items-center gap-2 text-body-1-strong text-brand">Learn more <ArrowUpRight class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- STATEMENT -->
  <section class="relative overflow-hidden border-y border-line-subtle bg-background-secondary py-24 sm:py-32" aria-labelledby="statement-title">
    <div class="absolute -top-40 -right-40 size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--site-sun)_22%,transparent),transparent_70%)]" aria-hidden="true" />
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="site-eyebrow site-reveal">Why Turkana</p>
      <h2 id="statement-title" class="site-reveal mt-6 max-w-5xl text-[length:clamp(28px,3.6vw,52px)] leading-[1.15] font-semibold tracking-tight">
        Abundant sun, scarce water, long distances. <span class="text-tertiary">We build from the place where these problems are real, so our systems are ready for anywhere.</span>
      </h2>
      <div class="mt-16 grid gap-px overflow-hidden rounded-xl border border-line-subtle bg-line-subtle sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="p in pillars" :key="p.title" class="site-reveal bg-background-secondary p-6 sm:p-8">
          <component :is="p.icon" class="size-7 text-[color:var(--site-sun)]" aria-hidden="true" />
          <h3 class="mt-5 text-subtitle-1">{{ p.title }}</h3>
          <p class="mt-2 text-body-1 text-secondary">{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTORS -->
  <section id="sectors" class="scroll-mt-18 py-24 sm:py-32" aria-labelledby="sectors-title">
    <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
      <div class="site-reveal lg:sticky lg:top-28 lg:self-start">
        <p class="site-eyebrow">Who we work with</p>
        <h2 id="sectors-title" class="mt-4 text-[length:clamp(32px,4vw,56px)] leading-tight font-bold tracking-tight">Sectors we serve</h2>
        <p class="mt-5 max-w-md text-body-2 text-secondary">From a single family farm to county-wide programmes, the same engineering discipline applies.</p>
        <AkButton to="/contact" class="mt-8" variant="outline" :icon="ArrowRight" icon-position="end">Discuss your project</AkButton>
      </div>
      <ol class="divide-y divide-line-subtle border-y border-line-subtle">
        <li v-for="(s, i) in sectors" :key="s.title" class="site-reveal group grid grid-cols-[3rem_1fr] gap-4 py-8 sm:grid-cols-[5rem_1fr]">
          <span class="font-mono text-body-1 text-tertiary">0{{ i + 1 }}</span>
          <div>
            <h3 class="text-title-3 transition-colors group-hover:text-brand">{{ s.title }}</h3>
            <p class="mt-2 text-body-2 text-secondary">{{ s.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <!-- PROCESS -->
  <section id="process" class="scroll-mt-18 border-t border-line-subtle bg-background-secondary py-24 sm:py-32" aria-labelledby="process-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="site-eyebrow site-reveal">How we work</p>
      <h2 id="process-title" class="site-reveal mt-4 text-[length:clamp(32px,4vw,56px)] leading-tight font-bold tracking-tight">From site visit to live data</h2>
      <ol class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="p in process" :key="p.step" class="site-reveal relative rounded-xl border border-line-subtle bg-surface p-6 sm:p-8">
          <span class="site-gradient-text text-title-1 font-bold">{{ p.step }}</span>
          <h3 class="mt-4 text-subtitle-1">{{ p.title }}</h3>
          <p class="mt-2 text-body-1 text-secondary">{{ p.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- CTA -->
  <section class="relative isolate overflow-hidden py-28 sm:py-36" aria-labelledby="cta-title">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--site-jade)_22%,transparent),transparent_65%)]" aria-hidden="true" />
    <div class="site-reveal mx-auto max-w-4xl px-4 text-center sm:px-6">
      <h2 id="cta-title" class="text-[length:clamp(36px,5vw,72px)] leading-[1.05] font-bold tracking-tight">Have a site that needs<br /><span class="site-gradient-text">power, water or data?</span></h2>
      <p class="mx-auto mt-6 max-w-xl text-body-2 text-secondary">Tell us what you are working on. An engineer will get back to you, usually within two working days.</p>
      <div class="mt-9 flex flex-wrap justify-center gap-3">
        <AkButton to="/contact" variant="primary" size="lg" :icon="ArrowUpRight" icon-position="end">Start a project</AkButton>
        <AkButton to="/about" size="lg" variant="subtle">About Akwap Systems</AkButton>
      </div>
    </div>
  </section>
</template>
