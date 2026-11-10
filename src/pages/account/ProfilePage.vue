<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Pencil, Camera, Mail, Phone, MapPin, Briefcase, CalendarDays, ShieldCheck, KeyRound, LogIn, UserCog, Download } from '@lucide/vue'
import {
  AkAvatar, AkBadge, AkButton, AkCard, AkDescriptionList, AkDialog, AkField, AkInput, AkSelect, AkStatusIndicator,
  AkSwitch, AkTabs, AkTimeline, AkPasswordStrength, AkAlert, useToast,
} from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import SettingsRow from '@/components/layout/SettingsRow.vue'
import { session } from '@/stores/session'
import { activityLogs } from '@/services/mockData'
import { formatDate, formatRelative } from '@/utils/format'
import { useForm } from '@/composables/useForm'
import { rules, type Rule } from '@/utils/validation'

const toast = useToast()
const user = session.user
const tab = ref('personal')
const editOpen = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)
const photo = ref<string | undefined>()

const edit = useForm(
  { name: user.name, email: user.email, phone: user.phone, title: user.title, location: user.location },
  { name: [rules.required('Full name')], email: [rules.required('Email'), rules.email()], phone: [rules.phone()] },
)
function openEdit() {
  Object.assign(edit.values, { name: user.name, email: user.email, phone: user.phone, title: user.title, location: user.location })
  editOpen.value = true
}
async function saveProfile() {
  const ok = await edit.handleSubmit(async (v) => {
    await new Promise((r) => setTimeout(r, 600))
    Object.assign(user, v)
  })
  if (ok) {
    editOpen.value = false
    toast.success('Profile updated')
  }
}
function onPhoto(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) return toast.error('Unsupported file', 'Choose a PNG, JPG or WebP image.')
  photo.value = URL.createObjectURL(f)
  toast.success('Profile photo updated')
}

const pw = useForm(
  { current: '', next: '', confirm: '' },
  {
    current: [rules.required('Current password')],
    next: [rules.required('New password'), rules.minLength(8, 'Password'), rules.strongPassword()],
    confirm: (): Rule<any>[] => [rules.required('Confirmation'), rules.matches(() => pw.values.next, 'Passwords do not match')],
  },
)
async function changePassword() {
  const ok = await pw.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 800))
  })
  if (ok) {
    Object.assign(pw.values, { current: '', next: '', confirm: '' })
    pw.submitted.value = false
    toast.success('Password changed', 'Other devices have been signed out.')
  }
}

const prefs = reactive({ productUpdates: true, weeklyDigest: true, mentions: true, billing: true, security: true, sms: false })
const security = reactive({ twoFactor: user.twoFactor, loginAlerts: true })

const activity = activityLogs
  .filter((l) => l.user === user.name)
  .slice(0, 6)
  .map((l) => ({
    id: l.id,
    title: l.action,
    description: `${l.target} · ${l.device} · ${l.ip}`,
    time: formatRelative(l.time),
    icon: l.type === 'auth' ? LogIn : l.type === 'settings' ? UserCog : l.type === 'export' ? Download : Pencil,
    intent: (l.action.startsWith('Failed') ? 'danger' : l.type === 'auth' ? 'brand' : 'neutral') as 'danger' | 'brand' | 'neutral',
  }))
</script>

<template>
  <div>
    <PageHeader title="Profile" description="Your personal details, security and how we contact you." />

    <AkCard class="mb-6">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div class="relative w-fit">
          <AkAvatar :name="user.name" :src="photo" :size="96" />
          <button
            type="button"
            class="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-line bg-surface text-secondary shadow-elevation-2 hover:text-primary focus-ring"
            aria-label="Change profile photo"
            @click="photoInput?.click()"
          >
            <Camera class="size-4" aria-hidden="true" />
          </button>
          <input ref="photoInput" type="file" accept="image/*" class="sr-only" tabindex="-1" aria-hidden="true" @change="onPhoto" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-title-3 text-primary">{{ user.name }}</h2>
            <AkBadge color="brand">{{ session.role }}</AkBadge>
          </div>
          <p class="text-body-1 text-secondary">{{ user.title }} · {{ user.department }}</p>
          <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-body-1 text-secondary">
            <span class="inline-flex items-center gap-1.5"><Mail class="size-4 text-tertiary" aria-hidden="true" />{{ user.email }}</span>
            <span class="inline-flex items-center gap-1.5"><Phone class="size-4 text-tertiary" aria-hidden="true" />{{ user.phone }}</span>
            <AkStatusIndicator status="active" label="Account active" />
          </div>
        </div>
        <AkButton :icon="Pencil" @click="openEdit">Edit profile</AkButton>
      </div>
    </AkCard>

    <AkTabs
      v-model="tab"
      label="Profile sections"
      :tabs="[
        { id: 'personal', label: 'Personal information' },
        { id: 'security', label: 'Security' },
        { id: 'notifications', label: 'Notifications' },
        { id: 'activity', label: 'Recent activity' },
      ]"
    >
      <template #personal>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <AkCard title="Personal information" subtitle="Visible to members of your organisation.">
            <template #actions><AkButton size="sm" variant="subtle" :icon="Pencil" @click="openEdit">Edit</AkButton></template>
            <AkDescriptionList
              dividers
              :items="[
                { term: 'Full name', description: user.name },
                { term: 'Email', description: user.email },
                { term: 'Phone', description: user.phone },
                { term: 'Job title', description: user.title },
                { term: 'Location', description: user.location },
                { term: 'Time zone', description: user.timezone },
              ]"
            />
          </AkCard>
          <AkCard title="Account">
            <ul class="flex flex-col gap-4 text-body-1">
              <li class="flex items-center gap-3"><ShieldCheck class="size-5 text-tertiary" aria-hidden="true" /><span class="flex-1 text-secondary">Status</span><AkStatusIndicator status="active" /></li>
              <li class="flex items-center gap-3"><Briefcase class="size-5 text-tertiary" aria-hidden="true" /><span class="flex-1 text-secondary">Role</span><span class="text-primary">{{ session.role }}</span></li>
              <li class="flex items-center gap-3"><CalendarDays class="size-5 text-tertiary" aria-hidden="true" /><span class="flex-1 text-secondary">Member since</span><span class="text-primary">{{ formatDate(user.joined) }}</span></li>
              <li class="flex items-center gap-3"><MapPin class="size-5 text-tertiary" aria-hidden="true" /><span class="flex-1 text-secondary">Location</span><span class="text-primary">{{ user.location }}</span></li>
            </ul>
          </AkCard>
        </div>
      </template>

      <template #security>
        <div class="grid gap-6 lg:grid-cols-2">
          <AkCard title="Change password" :subtitle="`Last changed ${formatDate(user.lastPasswordChange)}`">
            <form class="flex flex-col gap-4" novalidate @submit.prevent="changePassword">
              <AkField label="Current password" required :error="pw.errors.current">
                <AkInput v-model="pw.values.current" type="password" autocomplete="current-password" @blur="pw.blur('current')" @input="pw.input('current')" />
              </AkField>
              <AkField label="New password" required :error="pw.errors.next">
                <AkInput v-model="pw.values.next" type="password" autocomplete="new-password" @blur="pw.blur('next')" @input="pw.input('next')" />
                <template #after><AkPasswordStrength :password="pw.values.next" :show-checks="false" class="mt-1" /></template>
              </AkField>
              <AkField label="Confirm new password" required :error="pw.errors.confirm">
                <AkInput v-model="pw.values.confirm" type="password" autocomplete="new-password" @blur="pw.blur('confirm')" @input="pw.input('confirm')" />
              </AkField>
              <div><AkButton type="submit" variant="primary" :icon="KeyRound" :loading="pw.submitting.value">Update password</AkButton></div>
            </form>
          </AkCard>
          <AkCard title="Security settings">
            <div class="divide-y divide-line-subtle">
              <SettingsRow title="Two-factor authentication" description="Require a code from your authenticator app at sign-in.">
                <AkSwitch v-model="security.twoFactor" :label="security.twoFactor ? 'On' : 'Off'" @update:model-value="(v) => toast.info(v ? 'Two-factor enabled' : 'Two-factor disabled')" />
              </SettingsRow>
              <SettingsRow title="Sign-in alerts" description="Email me when my account is used from a new device.">
                <AkSwitch v-model="security.loginAlerts" :label="security.loginAlerts ? 'On' : 'Off'" />
              </SettingsRow>
            </div>
            <AkAlert v-if="!security.twoFactor" intent="warning" class="mt-2" title="Your account is less secure">Turn on two-factor authentication to protect payouts and user data.</AkAlert>
            <template #footer><AkButton variant="link" to="/account/settings">Manage active sessions</AkButton></template>
          </AkCard>
        </div>
      </template>

      <template #notifications>
        <AkCard title="Notification preferences" subtitle="Choose what we email you about. Security alerts can't be turned off.">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Mentions and comments" description="When someone @mentions you or replies to you."><AkSwitch v-model="prefs.mentions" label="Email" /></SettingsRow>
            <SettingsRow title="Billing" description="Invoices, failed payments and plan changes."><AkSwitch v-model="prefs.billing" label="Email" /></SettingsRow>
            <SettingsRow title="Weekly digest" description="A Monday summary of revenue, users and activity."><AkSwitch v-model="prefs.weeklyDigest" label="Email" /></SettingsRow>
            <SettingsRow title="Product updates" description="New features and improvements, about once a month."><AkSwitch v-model="prefs.productUpdates" label="Email" /></SettingsRow>
            <SettingsRow title="SMS alerts" description="Text me for critical security events."><AkSwitch v-model="prefs.sms" label="SMS" /></SettingsRow>
            <SettingsRow title="Security alerts" description="Always on to keep your account safe."><AkSwitch :model-value="true" disabled label="Email" /></SettingsRow>
          </div>
          <template #footer><AkButton variant="primary" @click="toast.success('Preferences saved')">Save preferences</AkButton></template>
        </AkCard>
      </template>

      <template #activity>
        <AkCard title="Recent account activity" subtitle="Sign-ins and changes made with your account.">
          <AkTimeline :items="activity" />
          <template #footer><AkButton variant="link" to="/dashboard/activity">View full activity log</AkButton></template>
        </AkCard>
      </template>
    </AkTabs>

    <AkDialog v-model:open="editOpen" title="Edit profile" description="Changes are visible to your organisation." size="md">
      <form id="edit-profile" class="grid gap-4 sm:grid-cols-2" novalidate @submit.prevent="saveProfile">
        <AkField label="Full name" required :error="edit.errors.name" class="sm:col-span-2"><AkInput v-model="edit.values.name" autocomplete="name" @blur="edit.blur('name')" /></AkField>
        <AkField label="Email" required :error="edit.errors.email"><AkInput v-model="edit.values.email" type="email" @blur="edit.blur('email')" /></AkField>
        <AkField label="Phone" :error="edit.errors.phone"><AkInput v-model="edit.values.phone" type="tel" @blur="edit.blur('phone')" /></AkField>
        <AkField label="Job title"><AkInput v-model="edit.values.title" /></AkField>
        <AkField label="Location"><AkSelect v-model="edit.values.location" :options="['Nairobi, Kenya', 'Lagos, Nigeria', 'Kampala, Uganda', 'Kigali, Rwanda', 'London, UK']" /></AkField>
      </form>
      <template #footer="{ close }">
        <AkButton @click="close">Cancel</AkButton>
        <AkButton type="submit" form="edit-profile" variant="primary" :loading="edit.submitting.value">Save changes</AkButton>
      </template>
    </AkDialog>
  </div>
</template>
