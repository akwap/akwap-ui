<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { MailOpen, Clock, CircleCheck } from '@lucide/vue'
import { AkButton, AkEmptyState, AkTabs, useToast } from '@/design-system'
import { resendVerification } from '@/services/auth'

const route = useRoute()
const toast = useToast()
const email = computed(() => (route.query.email as string) || 'amina.okafor@akwap.example')
const status = ref<'pending' | 'verified' | 'expired'>((route.query.status as any) || 'pending')
const sending = ref(false)
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

async function resend() {
  sending.value = true
  await resendVerification()
  sending.value = false
  toast.success('Verification email sent', `We sent a new link to ${email.value}.`)
  if (status.value === 'expired') status.value = 'pending'
  cooldown.value = 30
  clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex flex-col gap-6">
    <AkTabs
      v-model="status"
      appearance="subtle"
      size="sm"
      label="Preview verification state"
      :tabs="[{ id: 'pending', label: 'Pending' }, { id: 'verified', label: 'Verified' }, { id: 'expired', label: 'Expired' }]"
    >
      <template #pending>
        <AkEmptyState :icon="MailOpen" :heading-level="1" title="Verify your email" :description="`We sent a verification link to ${email}. Open it on this device to activate your account.`">
          <AkButton variant="primary" :loading="sending" :disabled="cooldown > 0" @click="resend">
            {{ cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email' }}
          </AkButton>
          <AkButton @click="status = 'verified'">I've verified (demo)</AkButton>
        </AkEmptyState>
      </template>
      <template #verified>
        <AkEmptyState variant="success" :icon="CircleCheck" :heading-level="1" title="Email verified" description="Thanks! Your account is active. Let's set up your workspace.">
          <AkButton variant="primary" to="/dashboard">Continue to dashboard</AkButton>
        </AkEmptyState>
      </template>
      <template #expired>
        <AkEmptyState variant="error" :icon="Clock" :heading-level="1" title="Verification link expired" description="Links are valid for 24 hours. Request a new one and we'll send it right away.">
          <AkButton variant="primary" :loading="sending" @click="resend">Send a new link</AkButton>
        </AkEmptyState>
      </template>
    </AkTabs>
    <p class="text-center text-caption-1 text-tertiary">Wrong address? <RouterLink to="/auth/register" class="link">Go back and change it</RouterLink></p>
  </div>
</template>
