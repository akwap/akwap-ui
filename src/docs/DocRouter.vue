<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowRight, ExternalLink, Monitor, Smartphone } from '@lucide/vue'
import { ref } from 'vue'
import { AkAlert, AkButton, AkEmptyState, AkSegmentedControl } from '@/design-system'
import DocHeader from './shared/DocHeader.vue'
import CodeBlock from './shared/CodeBlock.vue'
import ExampleBlock from './shared/ExampleBlock.vue'
import DoDont from './shared/DoDont.vue'
import Inline from './shared/Inline'
import { docSections } from './nav'
import { introduction } from './content/introduction'
import { foundations } from './content/foundations'
import { patterns } from './content/patterns'
import { templates } from './content/templates'
import { resources } from './content/resources'
import type { DocPages } from './content/types'

/** Renders prose documentation pages from ./content by section and slug. */
const pages: Record<string, DocPages> = { introduction, foundations, patterns, templates, resources }
const route = useRoute()
const section = computed(() => docSections.find((s) => s.id === route.params.section))
const page = computed(() => pages[route.params.section as string]?.[route.params.slug as string])
const previewWidth = ref<'desktop' | 'mobile'>('desktop')

const modules = import.meta.glob<Component>('./examples/**/*.vue', { import: 'default', eager: true })
const sources = import.meta.glob<string>('./examples/**/*.vue', { query: '?raw', import: 'default', eager: true })
const example = (file: string) => ({ component: modules[`./examples/${file}.vue`]!, code: sources[`./examples/${file}.vue`]! })
</script>

<template>
  <article v-if="page && section" :key="route.path" class="doc-prose max-w-4xl">
    <DocHeader :eyebrow="section.title" :title="page.title" :lead="page.lead" />
    <template v-for="(b, i) in page.blocks" :key="i">
      <h2 v-if="b.t === 'h2'" :id="b.id" class="mt-12 mb-4 scroll-mt-20 text-title-3 text-primary first:mt-0">{{ b.text }}</h2>
      <h3 v-else-if="b.t === 'h3'" class="mt-8 mb-3 text-subtitle-1 text-primary">{{ b.text }}</h3>
      <Inline v-else-if="b.t === 'p'" as="p" :text="b.text" class="mb-3" />
      <component :is="b.ordered ? 'ol' : 'ul'" v-else-if="b.t === 'list'" class="doc-list mb-4" :class="b.ordered && 'list-decimal'">
        <li v-for="item in b.items" :key="item"><Inline :text="item" /></li>
      </component>
      <div v-else-if="b.t === 'code'" class="my-4"><CodeBlock :code="b.code" :lang="b.lang ?? 'vue'" :title="b.title" /></div>
      <AkAlert v-else-if="b.t === 'callout'" :intent="b.intent" :title="b.title" role="none" class="my-4"><Inline :text="b.text" /></AkAlert>
      <div v-else-if="b.t === 'table'" class="my-4 overflow-x-auto rounded-card border border-line-subtle" role="region" tabindex="0" :aria-label="b.caption">
        <table class="w-full min-w-[480px] text-left text-body-1">
          <caption class="sr-only">{{ b.caption }}</caption>
          <thead class="bg-surface-secondary">
            <tr><th v-for="h in b.head" :key="h" scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">{{ h }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="(r, ri) in b.rows" :key="ri" class="border-t border-line-subtle align-top">
              <td v-for="(c, ci) in r" :key="ci" class="px-4 py-2 text-secondary" :class="ci === 0 && 'text-primary'"><Inline :text="c" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul v-else-if="b.t === 'links'" class="my-4 grid gap-3 sm:grid-cols-2">
        <li v-for="l in b.items" :key="l.to">
          <RouterLink :to="l.to" class="group flex h-full flex-col gap-1 rounded-card border border-line-subtle bg-surface p-4 hover:border-line-hover hover:bg-surface-hover focus-ring">
            <span class="flex items-center gap-2 text-body-1-strong text-primary">{{ l.label }}<ArrowRight class="size-4 text-tertiary transition-transform duration-fast group-hover:translate-x-0.5" aria-hidden="true" /></span>
            <span class="text-body-1 text-secondary">{{ l.description }}</span>
          </RouterLink>
        </li>
      </ul>
      <div v-else-if="b.t === 'component'" class="my-6"><component :is="b.is" v-bind="b.props" /></div>
      <ExampleBlock v-else-if="b.t === 'example'" class="my-6" :title="b.title" :description="b.description" v-bind="example(b.file)" />
      <div v-else-if="b.t === 'dodont'" class="my-6"><DoDont :dos="b.dos" :donts="b.donts" /></div>
      <section v-else-if="b.t === 'preview'" class="my-6 overflow-hidden rounded-card border border-line-subtle bg-surface" :aria-label="`Live preview: ${b.title}`">
        <header class="flex flex-wrap items-center gap-2 border-b border-line-subtle px-4 py-2.5">
          <p class="min-w-0 flex-1 text-body-1-strong text-primary">Live preview <span class="font-normal text-tertiary">· {{ b.to }}</span></p>
          <AkSegmentedControl
            v-model="previewWidth"
            size="sm"
            label="Preview width"
            :options="[
              { label: 'Desktop', value: 'desktop', icon: Monitor },
              { label: 'Mobile', value: 'mobile', icon: Smartphone },
            ]"
          />
          <AkButton size="sm" :to="b.to" :icon="ExternalLink" icon-position="end">Open page</AkButton>
        </header>
        <div class="overflow-x-auto bg-background p-3">
          <iframe
            :src="b.to"
            :title="`${b.title} template preview`"
            loading="lazy"
            class="mx-auto block rounded-md border border-line-subtle bg-background"
            :style="{ width: previewWidth === 'mobile' ? '375px' : '100%', minWidth: previewWidth === 'mobile' ? '375px' : '0', height: `${b.height ?? 640}px` }"
          />
        </div>
      </section>
    </template>
  </article>
  <AkEmptyState v-else variant="search" :heading-level="1" title="Page not found" description="This documentation page doesn't exist. It may have moved.">
    <AkButton variant="primary" to="/docs/introduction/overview">Documentation home</AkButton>
  </AkEmptyState>
</template>
