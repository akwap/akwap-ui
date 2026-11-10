<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from '@lucide/vue'
import { AkAlert, AkButton, AkCard, AkCheckbox, AkEmptyState, AkField, AkInput, AkSelect, AkTextarea } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules } from '@/utils/validation'
import { faqs } from '@/services/marketing'

const sent = ref(false)
const form = useForm(
  { name: '', email: '', company: '', topic: 'sales', message: '', consent: false },
  {
    name: [rules.required('Name')],
    email: [rules.required('Email'), rules.email()],
    message: [rules.required('Message'), rules.minLength(20, 'Message')],
    consent: [(v: boolean) => v || 'Please confirm we can contact you'],
  },
)
async function submit() {
  const ok = await form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 900))
  })
  if (ok) sent.value = true
}
</script>

<template>
  <section class="border-b border-line-subtle bg-surface">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <h1 class="text-large-title text-primary">Contact us</h1>
      <p class="mt-3 max-w-2xl text-body-2 text-secondary">Questions about pricing, a migration, or a support issue? We typically reply within one business day.</p>
    </div>
  </section>

  <section class="bg-background py-12 sm:py-16">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
      <div class="flex flex-col gap-4">
        <AkCard title="Get in touch" :heading-level="2">
          <ul class="flex flex-col gap-4 text-body-1">
            <li class="flex gap-3"><Mail class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" /><span><span class="block text-secondary">Email</span><a href="mailto:hello@akwap.example" class="link">hello@akwap.example</a></span></li>
            <li class="flex gap-3"><Phone class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" /><span><span class="block text-secondary">Phone</span><a href="tel:+254700000000" class="link">+254 700 000 000</a></span></li>
            <li class="flex gap-3"><MapPin class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" /><span><span class="block text-secondary">Office</span><address class="text-primary not-italic">4th Floor, Ngong Lane Plaza<br />Ngong Road, Nairobi, Kenya</address></span></li>
            <li class="flex gap-3"><Clock class="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" /><span><span class="block text-secondary">Hours</span><span class="text-primary">Mon–Fri, 8:00–18:00 EAT</span></span></li>
          </ul>
        </AkCard>
        <div class="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card border border-line-subtle bg-surface-tertiary" role="img" aria-label="Map placeholder showing our Nairobi office location">
          <div class="absolute inset-0 opacity-70 [background-image:linear-gradient(var(--ak-color-border)_1px,transparent_1px),linear-gradient(90deg,var(--ak-color-border)_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
          <div class="absolute top-1/3 left-0 h-3 w-full -rotate-6 bg-surface" aria-hidden="true" />
          <div class="absolute top-0 left-1/2 h-full w-3 rotate-12 bg-surface" aria-hidden="true" />
          <span class="relative flex flex-col items-center gap-1" aria-hidden="true">
            <span class="flex size-10 items-center justify-center rounded-full bg-brand text-on-brand shadow-elevation-8"><MapPin class="size-5" /></span>
            <span class="rounded-sm bg-surface px-2 py-0.5 text-caption-1-strong text-primary shadow-elevation-2">Akwap HQ</span>
          </span>
        </div>
        <AkCard title="Common questions" :heading-level="2">
          <ul class="flex flex-col gap-2">
            <li v-for="f in faqs.slice(0, 4)" :key="f.q"><RouterLink to="/#faq" class="link text-body-1">{{ f.q }}</RouterLink></li>
          </ul>
        </AkCard>
      </div>

      <AkCard padding="lg">
        <AkEmptyState v-if="sent" variant="success" title="Message sent" :heading-level="2" :description="`Thanks, ${form.values.name.split(' ')[0]}. We'll reply to ${form.values.email} within one business day.`">
          <AkButton @click="(sent = false), Object.assign(form.values, { message: '', consent: false }), (form.submitted.value = false)">Send another message</AkButton>
          <AkButton variant="primary" to="/">Back to home</AkButton>
        </AkEmptyState>
        <form v-else class="flex flex-col gap-4" novalidate @submit.prevent="submit">
          <h2 class="flex items-center gap-2 text-subtitle-1 text-primary"><MessageSquare class="size-5 text-brand" aria-hidden="true" />Send us a message</h2>
          <AkAlert v-if="form.submitted.value && form.errorCount() > 0" intent="danger">Please fix {{ form.errorCount() }} field{{ form.errorCount() === 1 ? '' : 's' }} below.</AkAlert>
          <div class="grid gap-4 sm:grid-cols-2">
            <AkField label="Name" required :error="form.errors.name"><AkInput v-model="form.values.name" autocomplete="name" @blur="form.blur('name')" @input="form.input('name')" /></AkField>
            <AkField label="Work email" required :error="form.errors.email"><AkInput v-model="form.values.email" type="email" autocomplete="email" @blur="form.blur('email')" @input="form.input('email')" /></AkField>
            <AkField label="Company" optional><AkInput v-model="form.values.company" autocomplete="organization" /></AkField>
            <AkField label="Topic"><AkSelect v-model="form.values.topic" :options="[{ label: 'Sales & pricing', value: 'sales' }, { label: 'Technical support', value: 'support' }, { label: 'Partnerships', value: 'partners' }, { label: 'Press', value: 'press' }]" /></AkField>
          </div>
          <AkField label="Message" required :error="form.errors.message" helper="At least 20 characters.">
            <AkTextarea v-model="form.values.message" :rows="6" :maxlength="1000" @blur="form.blur('message')" @input="form.input('message')" />
          </AkField>
          <div>
            <AkCheckbox v-model="form.values.consent" :invalid="!!form.errors.consent" label="I agree to be contacted about my enquiry." @change="form.input('consent')" />
            <p v-if="form.errors.consent" class="mt-1 text-caption-1 text-danger">{{ form.errors.consent }}</p>
          </div>
          <div><AkButton type="submit" variant="primary" size="lg" :icon="Send" :loading="form.submitting.value" loading-text="Sending…">Send message</AkButton></div>
        </form>
      </AkCard>
    </div>
  </section>
</template>
