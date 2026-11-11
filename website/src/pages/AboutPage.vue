<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUpRight, Compass, HeartHandshake, Leaf, MapPin } from '@lucide/vue'
import AkButton from '@/components/ui/buttons/AkButton.vue'
import AkwapMark from '@site/components/AkwapMark.vue'
import { company, services } from '@site/content'
import { useReveal } from '@site/composables'

useReveal()

const values = [
  { icon: Compass, title: 'Engineer for the real site', text: 'Every design starts with a visit: the heat, the dust, the signal and the people who will use it.' },
  { icon: Leaf, title: 'Clean energy first', text: 'Solar is the default power source in everything we build, not an add-on.' },
  { icon: HeartHandshake, title: 'Stay after handover', text: 'We monitor what we install, train the people who run it and come back when it needs us.' },
]
</script>

<template>
  <section class="relative isolate overflow-hidden pt-18" aria-labelledby="about-title">
    <div class="absolute inset-0 -z-10 site-grid-bg [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:px-8">
      <div>
        <p class="site-eyebrow flex items-center gap-2"><MapPin class="size-4" aria-hidden="true" />{{ company.location }}</p>
        <h1 id="about-title" class="mt-5 text-[length:clamp(40px,5.6vw,80px)] leading-[1.02] font-bold tracking-tight">Engineering from <span class="site-gradient-text">the edge of the map.</span></h1>
        <p class="mt-6 max-w-2xl text-subtitle-2 font-normal text-secondary">
          Akwap Systems is a technology company in Turkana County, Kenya. We combine embedded electronics, software, irrigation and solar engineering to build systems that work in arid, remote and off-grid places.
        </p>
      </div>
      <div class="grid place-items-center">
        <AkwapMark :size="260" animated class="max-w-full" />
      </div>
    </div>
  </section>

  <section class="border-y border-line-subtle bg-background-secondary py-20 sm:py-28" aria-labelledby="mark-title">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
      <h2 id="mark-title" class="site-reveal text-[length:clamp(28px,3.4vw,48px)] leading-tight font-bold tracking-tight">The globe and the star</h2>
      <div class="site-reveal flex flex-col gap-5 text-body-2 text-secondary">
        <p>Our mark is a globe, wrapped by an orbit, with a star rising from it. The globe is the connected world our devices report to. The orbit is the link that keeps remote places in that world. The star is the sun over Turkana, the energy behind everything we build.</p>
        <p>Its colours come from the same place: the jade of Lake Turkana and the gold of the afternoon sun.</p>
      </div>
    </div>
  </section>

  <section class="py-20 sm:py-28" aria-labelledby="values-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p class="site-eyebrow site-reveal">What we stand for</p>
      <h2 id="values-title" class="site-reveal mt-4 text-[length:clamp(28px,3.4vw,48px)] font-bold tracking-tight">How we work</h2>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <div v-for="v in values" :key="v.title" class="site-reveal rounded-xl border border-line-subtle bg-surface p-6 sm:p-8">
          <component :is="v.icon" class="size-7 text-brand" aria-hidden="true" />
          <h3 class="mt-5 text-title-3">{{ v.title }}</h3>
          <p class="mt-2 text-body-2 text-secondary">{{ v.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="border-t border-line-subtle bg-background-secondary py-20 sm:py-28" aria-labelledby="disciplines-title">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="disciplines-title" class="site-reveal text-[length:clamp(28px,3.4vw,48px)] font-bold tracking-tight">Our disciplines</h2>
      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="s in services" :key="s.slug" class="site-reveal">
          <RouterLink :to="`/solutions/${s.slug}`" class="flex h-full flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-6 transition-colors hover:border-line-strong focus-ring">
            <component :is="s.icon" class="size-7" :style="{ color: s.accent }" aria-hidden="true" />
            <span class="text-subtitle-1">{{ s.name }}</span>
            <span class="text-body-1 text-secondary">{{ s.summary }}</span>
          </RouterLink>
        </li>
      </ul>
      <AkButton to="/contact" variant="primary" size="lg" class="mt-12" :icon="ArrowUpRight" icon-position="end">Work with us</AkButton>
    </div>
  </section>
</template>
