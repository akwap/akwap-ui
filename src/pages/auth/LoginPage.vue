<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Mail, KeyRound, Globe } from '@lucide/vue'
import { AkAlert, AkButton, AkCheckbox, AkDivider, AkField, AkInput, useToast } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules } from '@/utils/validation'
import { AuthError, DEMO_PASSWORD, login } from '@/services/auth'
import { signIn } from '@/stores/session'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const serverError = ref<string | null>(null)
const success = ref(false)
const remember = ref(true)

const form = useForm(
  { email: 'amina.okafor@akwap.example', password: '' },
  { email: [rules.required('Email'), rules.email()], password: [rules.required('Password')] },
)

async function submit() {
  serverError.value = null
  await form.handleSubmit(async (v) => {
    try {
      await login(v.email, v.password)
      success.value = true
      signIn(v.email)
      toast.success('Signed in', `Welcome back! Redirecting to your dashboard.`)
      setTimeout(() => router.push((route.query.redirect as string) || '/dashboard'), 700)
    } catch (e) {
      serverError.value = e instanceof AuthError ? e.message : 'Something went wrong. Please try again.'
    }
  })
}
function social(provider: string) {
  toast.info(`${provider} sign-in`, 'Single sign-on is not configured in this demo. Use email and password instead.')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-title-2 text-primary">Welcome back</h1>
      <p class="mt-1 text-body-1 text-secondary">Sign in to your Akwap workspace.</p>
    </div>

    <AkAlert v-if="route.query.signedOut" intent="success" title="You've been signed out">Sign in again to continue.</AkAlert>
    <AkAlert v-if="route.query.reset" intent="success" title="Password updated">Sign in with your new password.</AkAlert>
    <AkAlert v-if="serverError" intent="danger" title="Couldn't sign you in" data-testid="login-error">{{ serverError }}</AkAlert>
    <AkAlert v-if="success" intent="success" title="Signed in successfully">Taking you to your dashboard…</AkAlert>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <AkField label="Email" required :error="form.errors.email">
        <AkInput
          v-model="form.values.email"
          type="email"
          autocomplete="email"
          :leading-icon="Mail"
          size="lg"
          placeholder="name@company.com"
          @blur="form.blur('email')"
          @input="form.input('email')"
        />
      </AkField>
      <AkField label="Password" required :error="form.errors.password" :helper="`Demo password: ${DEMO_PASSWORD}`">
        <AkInput
          v-model="form.values.password"
          type="password"
          autocomplete="current-password"
          :leading-icon="KeyRound"
          size="lg"
          placeholder="Enter your password"
          @blur="form.blur('password')"
          @input="form.input('password')"
        />
      </AkField>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <AkCheckbox v-model="remember" label="Keep me signed in" />
        <RouterLink to="/auth/forgot-password" class="link text-body-1">Forgot password?</RouterLink>
      </div>
      <AkButton type="submit" variant="primary" size="lg" block :loading="form.submitting.value" loading-text="Signing in…" data-testid="login-submit">Sign in</AkButton>
    </form>

    <AkDivider label="or continue with" />

    <div class="grid gap-2 sm:grid-cols-2">
      <AkButton size="lg" :icon="Globe" @click="social('Google')">Google</AkButton>
      <AkButton size="lg" :icon="KeyRound" @click="social('Company SSO')">Company SSO</AkButton>
    </div>

    <p class="text-center text-body-1 text-secondary">
      New to Akwap? <RouterLink to="/auth/register" class="link font-semibold">Create an account</RouterLink>
    </p>
  </div>
</template>
