<script setup lang="ts">
import { ref } from 'vue'
import { Mail, MapPin, Send } from '@lucide/vue'
import { AkAlert, AkButton, AkEmptyState, AkField, AkInput, AkSelect, AkTextarea } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules } from '@/utils/validation'
import { company, services } from '@site/content'

const sent = ref(false)
const interests = [...services.map((s) => ({ label: s.name, value: s.slug as string })), { label: 'Something else', value: 'other' }]
const form = useForm(
  { name: '', email: '', organisation: '', interest: 'solar', location: '', message: '' },
  {
    name: [rules.required('Name')],
    email: [rules.required('Email'), rules.email()],
    message: [rules.required('Message'), rules.minLength(20, 'Message')],
  },
)

/**
 * There is no backend yet, so the form composes an email in the visitor's
 * mail app. Swap this for an API call when one exists.
 */
async function submit() {
  const ok = await form.handleSubmit(async () => {
    const v = form.values
    const interest = interests.find((i) => i.value === v.interest)?.label ?? v.interest
    const lines = [`Name: ${v.name}`, `Email: ${v.email}`]
    if (v.organisation) lines.push(`Organisation: ${v.organisation}`)
    if (v.location) lines.push(`Site location: ${v.location}`)
    lines.push(`Interested in: ${interest}`, '', v.message)
    const body = lines.join('\n')
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Project enquiry: ${interest}`)}&body=${encodeURIComponent(body)}`
  })
  if (ok) sent.value = true
}
</script>

<template>
  <section class="relative isolate overflow-hidden border-b border-line-subtle pt-18" aria-labelledby="contact-title">
    <div class="absolute inset-0 -z-10 site-grid-bg [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
    <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <p class="site-eyebrow">Contact</p>
      <h1 id="contact-title" class="mt-4 max-w-3xl text-[length:clamp(40px,5.6vw,80px)] leading-[1.02] font-bold tracking-tight">Let’s build <span class="site-gradient-text">something that lasts.</span></h1>
      <p class="mt-6 max-w-2xl text-subtitle-2 font-normal text-secondary">Tell us about the site, the problem and the timeline. An engineer will reply, usually within two working days.</p>
    </div>
  </section>

  <section class="py-16 sm:py-20">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
      <aside class="flex flex-col gap-8" aria-label="Contact details">
        <div class="flex gap-4">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-brand-subtle text-brand"><MapPin class="size-5" aria-hidden="true" /></span>
          <div><h2 class="text-subtitle-2">Based in</h2><p class="mt-1 text-body-2 text-secondary">{{ company.location }}</p></div>
        </div>
        <div class="flex gap-4">
          <span class="grid size-11 shrink-0 place-items-center rounded-full bg-brand-subtle text-brand"><Mail class="size-5" aria-hidden="true" /></span>
          <div><h2 class="text-subtitle-2">Email</h2><a :href="`mailto:${company.email}`" class="mt-1 block text-body-2 break-all text-link hover:underline">{{ company.email }}</a></div>
        </div>
        <div class="rounded-xl border border-line-subtle bg-surface p-6">
          <h2 class="site-eyebrow">Helpful to include</h2>
          <ul class="mt-4 flex list-disc flex-col gap-2 pl-5 text-body-1 text-secondary">
            <li>Where the site is and how far from power or water</li>
            <li>What you want to run, pump, monitor or automate</li>
            <li>Rough budget and timeline, if you have them</li>
          </ul>
        </div>
      </aside>

      <div class="rounded-xl border border-line-subtle bg-surface p-6 sm:p-10">
        <AkEmptyState v-if="sent" variant="success" title="Your email is ready" :heading-level="2" :description="`Your mail app should have opened with the message to ${company.email}. Press send there and we will be in touch.`">
          <AkButton @click="sent = false">Edit the message</AkButton>
          <AkButton variant="primary" to="/">Back to home</AkButton>
        </AkEmptyState>
        <form v-else class="flex flex-col gap-5" novalidate data-testid="contact-form" @submit.prevent="submit">
          <h2 class="text-title-3">Start a project</h2>
          <AkAlert v-if="form.submitted.value && form.errorCount() > 0" intent="danger">Please fix {{ form.errorCount() }} field{{ form.errorCount() === 1 ? '' : 's' }} below.</AkAlert>
          <div class="grid gap-5 sm:grid-cols-2">
            <AkField label="Name" required :error="form.errors.name"><AkInput v-model="form.values.name" autocomplete="name" @blur="form.blur('name')" @input="form.input('name')" /></AkField>
            <AkField label="Email" required :error="form.errors.email"><AkInput v-model="form.values.email" type="email" autocomplete="email" @blur="form.blur('email')" @input="form.input('email')" /></AkField>
            <AkField label="Organisation" optional><AkInput v-model="form.values.organisation" autocomplete="organization" /></AkField>
            <AkField label="Site location" optional><AkInput v-model="form.values.location" placeholder="e.g. Kakuma, Turkana West" /></AkField>
          </div>
          <AkField label="I’m interested in"><AkSelect v-model="form.values.interest" :options="interests" /></AkField>
          <AkField label="Tell us about the project" required :error="form.errors.message" helper="At least 20 characters.">
            <AkTextarea v-model="form.values.message" :rows="6" :maxlength="2000" @blur="form.blur('message')" @input="form.input('message')" />
          </AkField>
          <div><AkButton type="submit" variant="primary" size="lg" :icon="Send">Send enquiry</AkButton></div>
        </form>
      </div>
    </div>
  </section>
</template>
