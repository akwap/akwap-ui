<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Mail, MailCheck } from '@lucide/vue'
import { AkAlert, AkButton, AkEmptyState, AkField, AkInput } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules } from '@/utils/validation'
import { AuthError, requestPasswordReset } from '@/services/auth'

const sentTo = ref<string | null>(null)
const serverError = ref<string | null>(null)
const form = useForm({ email: '' }, { email: [rules.required('Email'), rules.email()] })

async function submit() {
  serverError.value = null
  await form.handleSubmit(async (v) => {
    try {
      await requestPasswordReset(v.email)
      sentTo.value = v.email
    } catch (e) {
      serverError.value = e instanceof AuthError ? e.message : 'Something went wrong. Please try again.'
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="!sentTo">
      <div>
        <h1 class="text-title-2 text-primary">Forgot your password?</h1>
        <p class="mt-1 text-body-1 text-secondary">Enter the email you use for Akwap and we'll send you a link to reset it.</p>
      </div>
      <AkAlert v-if="serverError" intent="danger" title="We couldn't send the email">{{ serverError }}</AkAlert>
      <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
        <AkField label="Email" required :error="form.errors.email" helper="Tip: an address ending in @blocked.example shows the error state.">
          <AkInput v-model="form.values.email" type="email" autocomplete="email" size="lg" :leading-icon="Mail" placeholder="name@company.com" @blur="form.blur('email')" @input="form.input('email')" />
        </AkField>
        <AkButton type="submit" variant="primary" size="lg" block :loading="form.submitting.value" loading-text="Sending…">Send reset link</AkButton>
      </form>
    </template>
    <AkEmptyState v-else variant="success" :icon="MailCheck" title="Check your email" :heading-level="2" :description="`If an account exists for ${sentTo}, you'll receive a reset link within a few minutes. The link expires in 30 minutes.`">
      <AkButton variant="primary" to="/auth/reset-password?token=demo">Open reset link (demo)</AkButton>
      <AkButton @click="sentTo = null">Use a different email</AkButton>
    </AkEmptyState>
    <RouterLink to="/auth/login" class="link inline-flex items-center justify-center gap-1 text-body-1">
      <ArrowLeft class="size-4" aria-hidden="true" /> Back to sign in
    </RouterLink>
  </div>
</template>
