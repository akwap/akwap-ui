<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { AkAlert, AkButton, AkCheckbox, AkField, AkInput, AkPasswordStrength, useToast } from '@/design-system'
import { useForm } from '@/composables/useForm'
import { rules, type Rule } from '@/utils/validation'
import { AuthError, register } from '@/services/auth'

const router = useRouter()
const toast = useToast()
const serverError = ref<string | null>(null)

const form = useForm(
  { name: '', email: '', phone: '', password: '', confirm: '', terms: false },
  {
    name: [rules.required('Full name'), rules.minLength(2, 'Full name')],
    email: [rules.required('Email'), rules.email()],
    phone: [rules.required('Phone number'), rules.phone()],
    password: [rules.required('Password'), rules.minLength(8, 'Password'), rules.strongPassword()],
    confirm: (): Rule<any>[] => [rules.required('Password confirmation'), rules.matches(() => form.values.password, 'Passwords do not match')],
    terms: [(v: boolean) => v || 'You must accept the terms to continue'],
  },
)

async function submit() {
  serverError.value = null
  await form.handleSubmit(async (v: any) => {
    try {
      await register(v.email)
      toast.success('Account created', 'Check your inbox to verify your email address.')
      router.push({ path: '/auth/verify-email', query: { email: v.email } })
    } catch (e) {
      serverError.value = e instanceof AuthError ? e.message : 'Something went wrong. Please try again.'
    }
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-title-2 text-primary">Create your account</h1>
      <p class="mt-1 text-body-1 text-secondary">Start a 14-day free trial. No credit card required.</p>
    </div>

    <AkAlert v-if="serverError" intent="danger" title="Couldn't create your account">
      {{ serverError }} <RouterLink to="/auth/login" class="link">Sign in instead</RouterLink>
    </AkAlert>
    <AkAlert v-else-if="form.submitted.value && form.errorCount() > 1" intent="danger" title="Please fix the highlighted fields">
      {{ form.errorCount() }} fields need your attention.
    </AkAlert>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <AkField label="Full name" required :error="form.errors.name">
        <AkInput v-model="form.values.name" autocomplete="name" placeholder="Amina Okafor" @blur="form.blur('name')" @input="form.input('name')" />
      </AkField>
      <AkField label="Work email" required :error="form.errors.email">
        <AkInput v-model="form.values.email" type="email" autocomplete="email" placeholder="name@company.com" @blur="form.blur('email')" @input="form.input('email')" />
      </AkField>
      <AkField label="Phone number" required :error="form.errors.phone" helper="Used for sign-in verification codes.">
        <AkInput v-model="form.values.phone" type="tel" autocomplete="tel" placeholder="+254 712 345 678" @blur="form.blur('phone')" @input="form.input('phone')" />
      </AkField>
      <AkField label="Password" required :error="form.errors.password">
        <AkInput v-model="form.values.password" type="password" autocomplete="new-password" @blur="form.blur('password')" @input="form.input('password'), form.input('confirm')" />
        <template #after>
          <AkPasswordStrength :password="form.values.password" class="mt-1" />
        </template>
      </AkField>
      <AkField label="Confirm password" required :error="form.errors.confirm" :success="!form.errors.confirm && form.values.confirm && form.values.confirm === form.values.password ? 'Passwords match' : null">
        <AkInput v-model="form.values.confirm" type="password" autocomplete="new-password" @blur="form.blur('confirm')" @input="form.input('confirm')" />
      </AkField>
      <div>
        <AkCheckbox v-model="form.values.terms" required :invalid="!!form.errors.terms" @change="form.input('terms')">
          I agree to the <RouterLink to="/terms" class="link">Terms of service</RouterLink> and <RouterLink to="/privacy" class="link">Privacy policy</RouterLink>
        </AkCheckbox>
        <p v-if="form.errors.terms" class="mt-1 text-caption-1 text-danger" role="alert">{{ form.errors.terms }}</p>
      </div>
      <AkButton type="submit" variant="primary" size="lg" block :loading="form.submitting.value" loading-text="Creating account…">Create account</AkButton>
    </form>

    <p class="text-center text-body-1 text-secondary">
      Already have an account? <RouterLink to="/auth/login" class="link font-semibold">Sign in</RouterLink>
    </p>
  </div>
</template>
