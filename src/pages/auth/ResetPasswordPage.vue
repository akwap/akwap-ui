<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, CircleCheck } from '@lucide/vue'
import { AkButton, AkEmptyState, AkField, AkInput, AkPasswordStrength, AkAlert } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules, type Rule } from '@/utils/validation'
import { AuthError, resetPassword } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const state = ref<'form' | 'expired' | 'done'>(route.query.token === 'expired' ? 'expired' : 'form')
const serverError = ref<string | null>(null)
const form = useForm(
  { password: '', confirm: '' },
  {
    password: [rules.required('New password'), rules.minLength(8, 'Password'), rules.strongPassword()],
    confirm: (): Rule<any>[] => [rules.required('Password confirmation'), rules.matches(() => form.values.password, 'Passwords do not match')],
  },
)
async function submit() {
  serverError.value = null
  await form.handleSubmit(async () => {
    try {
      await resetPassword(String(route.query.token ?? 'demo'))
      state.value = 'done'
    } catch (e) {
      if (e instanceof AuthError && e.message === 'expired') state.value = 'expired'
      else serverError.value = 'Something went wrong. Please try again.'
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="state === 'form'">
      <div>
        <h1 class="text-title-2 text-primary">Set a new password</h1>
        <p class="mt-1 text-body-1 text-secondary">Choose a strong password you haven't used before.</p>
      </div>
      <AkAlert v-if="serverError" intent="danger">{{ serverError }}</AkAlert>
      <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
        <AkField label="New password" required :error="form.errors.password">
          <AkInput v-model="form.values.password" type="password" autocomplete="new-password" size="lg" @blur="form.blur('password')" @input="form.input('password')" />
          <template #after><AkPasswordStrength :password="form.values.password" class="mt-1" /></template>
        </AkField>
        <AkField label="Confirm new password" required :error="form.errors.confirm">
          <AkInput v-model="form.values.confirm" type="password" autocomplete="new-password" size="lg" @blur="form.blur('confirm')" @input="form.input('confirm')" />
        </AkField>
        <AkButton type="submit" variant="primary" size="lg" block :loading="form.submitting.value" loading-text="Updating…">Update password</AkButton>
      </form>
      <p class="text-center text-caption-1 text-tertiary">Demo: <RouterLink to="/auth/reset-password?token=expired" class="link" @click="state = 'expired'">preview the expired-link state</RouterLink></p>
    </template>

    <AkEmptyState v-else-if="state === 'expired'" variant="error" :icon="Clock" :heading-level="1" title="This reset link has expired" description="For your security, reset links are valid for 30 minutes. Request a new one to continue.">
      <AkButton variant="primary" to="/auth/forgot-password">Request a new link</AkButton>
    </AkEmptyState>

    <AkEmptyState v-else variant="success" :icon="CircleCheck" :heading-level="1" title="Password updated" description="Your password has been changed and other sessions were signed out.">
      <AkButton variant="primary" @click="router.push({ path: '/auth/login', query: { reset: '1' } })">Continue to sign in</AkButton>
    </AkEmptyState>

    <RouterLink v-if="state !== 'done'" to="/auth/login" class="link inline-flex items-center justify-center gap-1 text-body-1">
      <ArrowLeft class="size-4" aria-hidden="true" /> Back to sign in
    </RouterLink>
  </div>
</template>
