<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { AkBadge, AkEmptyState, AkButton } from '@/design-system'
import DocHeader from './shared/DocHeader.vue'
import DocSection from './shared/DocSection.vue'
import ExampleBlock from './shared/ExampleBlock.vue'
import PropsTable from './shared/PropsTable.vue'
import DoDont from './shared/DoDont.vue'
import CodeBlock from './shared/CodeBlock.vue'
import Inline from './shared/Inline'
import { componentDocs } from './registry'
import type { ExampleRef } from './registry/types'

/**
 * Renders every component page with the same 14-section structure:
 * name, description, when to use, when not to use, anatomy, variants,
 * sizes, states, accessibility, responsive behaviour, code examples,
 * API reference, usage guidelines and do/don't.
 *
 * Examples are real SFCs in ./examples; the code shown is their exact
 * source (loaded with ?raw), so preview and snippet can never drift.
 */
const modules = import.meta.glob<Component>('./examples/**/*.vue', { eager: true, import: 'default' })
const sources = import.meta.glob<string>('./examples/**/*.vue', { eager: true, query: '?raw', import: 'default' })

const route = useRoute()
const doc = computed(() => componentDocs.find((d) => d.slug === route.params.slug))

function ex(ref: ExampleRef) {
  const key = `./examples/${ref.file}.vue`
  const component = modules[key]
  const code = sources[key]
  if (!component || code === undefined) throw new Error(`Missing docs example ${key}`)
  return { ...ref, component, code, id: `ex-${ref.file.split('/').pop()!.toLowerCase()}` }
}

const toc = [
  ['when-to-use', 'When to use'],
  ['when-not-to-use', 'When not to use'],
  ['anatomy', 'Anatomy'],
  ['variants', 'Variants'],
  ['sizes', 'Sizes'],
  ['states', 'Interactive states'],
  ['accessibility', 'Accessibility'],
  ['responsive', 'Responsive behaviour'],
  ['examples', 'Code examples'],
  ['api', 'Props and API'],
  ['guidelines', 'Usage guidelines'],
  ['do-dont', "Do and don't"],
] as const

const importLine = computed(() => (doc.value ? `import { ${doc.value.imports.join(', ')} } from '@/design-system'` : ''))
</script>

<template>
  <article v-if="doc" :key="doc.slug" class="doc-prose flex gap-10">
    <div class="min-w-0 flex-1">
      <DocHeader eyebrow="Components" :title="doc.name" :lead="doc.description">
        <div class="mt-4 flex flex-wrap gap-2">
          <AkBadge v-for="i in doc.imports" :key="i" appearance="outline" shape="rounded"><code class="font-mono">{{ i }}</code></AkBadge>
        </div>
        <div class="mt-4 max-w-2xl"><CodeBlock :code="importLine" lang="ts" /></div>
      </DocHeader>

      <DocSection id="when-to-use" title="When to use">
        <ul class="doc-list"><li v-for="t in doc.whenToUse" :key="t"><Inline :text="t" /></li></ul>
      </DocSection>

      <DocSection id="when-not-to-use" title="When not to use">
        <ul class="doc-list"><li v-for="t in doc.whenNotToUse" :key="t"><Inline :text="t" /></li></ul>
      </DocSection>

      <DocSection id="anatomy" title="Anatomy">
        <ol class="grid gap-3 sm:grid-cols-2">
          <li v-for="(a, i) in doc.anatomy" :key="a.name" class="flex gap-3 rounded-card border border-line-subtle bg-surface p-3">
            <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-caption-1-strong text-on-brand" aria-hidden="true">{{ i + 1 }}</span>
            <div class="min-w-0">
              <p class="text-body-1-strong text-primary">{{ a.name }}</p>
              <Inline as="p" class="text-body-1 text-secondary" :text="a.description" />
            </div>
          </li>
        </ol>
      </DocSection>

      <DocSection id="variants" title="Variants">
        <dl class="doc-defs">
          <div v-for="v in doc.variants.items" :key="v.name"><dt>{{ v.name }}</dt><dd><Inline :text="v.description" /></dd></div>
        </dl>
        <ExampleBlock v-if="doc.variants.example" class="mt-6" v-bind="ex(doc.variants.example)" />
      </DocSection>

      <DocSection id="sizes" title="Sizes">
        <Inline as="p" class="max-w-3xl text-body-1 text-secondary" :text="doc.sizes.text" />
        <ExampleBlock v-if="doc.sizes.example" class="mt-6" v-bind="ex(doc.sizes.example)" />
      </DocSection>

      <DocSection id="states" title="Interactive states">
        <dl class="doc-defs">
          <div v-for="s in doc.states.items" :key="s.name"><dt>{{ s.name }}</dt><dd><Inline :text="s.description" /></dd></div>
        </dl>
        <ExampleBlock v-if="doc.states.example" class="mt-6" v-bind="ex(doc.states.example)" />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <ul class="doc-list"><li v-for="t in doc.accessibility" :key="t"><Inline :text="t" /></li></ul>
        <div v-if="doc.keyboard?.length" class="mt-6 overflow-x-auto rounded-card border border-line-subtle" role="region" tabindex="0" aria-label="Keyboard interactions">
          <table class="w-full min-w-[420px] text-left text-body-1">
            <caption class="border-b border-line-subtle bg-surface-secondary px-4 py-2 text-left text-body-1-strong text-primary">Keyboard interactions</caption>
            <thead>
              <tr class="border-b border-line-subtle">
                <th scope="col" class="w-48 px-4 py-2 text-caption-1-strong text-secondary">Keys</th>
                <th scope="col" class="px-4 py-2 text-caption-1-strong text-secondary">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in doc.keyboard" :key="k.keys" class="border-b border-line-subtle last:border-0">
                <td class="px-4 py-2"><kbd class="rounded-sm border border-line bg-surface-secondary px-1.5 py-0.5 font-mono text-caption-1 text-primary">{{ k.keys }}</kbd></td>
                <td class="px-4 py-2 text-secondary">{{ k.action }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="responsive" title="Responsive behaviour">
        <ul class="doc-list"><li v-for="t in doc.responsive" :key="t"><Inline :text="t" /></li></ul>
      </DocSection>

      <DocSection id="examples" title="Code examples">
        <p class="mb-6 text-body-1 text-secondary">Every preview below is live: interact with it, switch the preview to a mobile width, and copy the exact source.</p>
        <div class="flex flex-col gap-8">
          <ExampleBlock v-for="e in doc.examples" :key="e.file" v-bind="ex(e)" />
        </div>
      </DocSection>

      <DocSection id="api" title="Props and API">
        <div class="flex flex-col gap-6">
          <PropsTable v-for="t in doc.api" :key="t.title + (t.kind ?? '')" v-bind="t" />
        </div>
      </DocSection>

      <DocSection id="guidelines" title="Usage guidelines">
        <ul class="doc-list"><li v-for="t in doc.guidelines" :key="t"><Inline :text="t" /></li></ul>
      </DocSection>

      <DocSection id="do-dont" title="Do and don't">
        <DoDont :dos="doc.dos" :donts="doc.donts" />
      </DocSection>
    </div>

    <nav class="sticky top-20 hidden h-fit w-48 shrink-0 xl:block" aria-label="On this page">
      <p class="mb-2 text-caption-1-strong tracking-wide text-tertiary uppercase">On this page</p>
      <ul class="flex flex-col gap-1 border-l border-line-subtle text-body-1">
        <li v-for="[id, label] in toc" :key="id">
          <a :href="`#${id}`" class="-ml-px block border-l-2 border-transparent py-0.5 pl-3 text-secondary hover:border-line-strong hover:text-primary focus-ring-inset">{{ label }}</a>
        </li>
      </ul>
    </nav>
  </article>

  <AkEmptyState v-else variant="search" :heading-level="1" title="Component not found" description="There is no documentation page at this address.">
    <AkButton variant="primary" to="/docs/components/button">Browse components</AkButton>
    <RouterLink to="/docs" class="link self-center text-body-1">Documentation home</RouterLink>
  </AkEmptyState>
</template>
