<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { SlidersHorizontal, Palette, Bell, Lock, ShieldCheck, MonitorSmartphone, LogOut, Monitor, Smartphone } from '@lucide/vue'
import {
  AkAlert, AkBadge, AkButton, AkCard, AkConfirmDialog, AkField, AkRadioGroup, AkSelect, AkSwitch, AkTabs, AkThemeSwitcher, useToast,
} from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import SettingsRow from '@/components/layout/SettingsRow.vue'
import { sessions as seedSessions } from '@/services/mockData'
import { formatRelative } from '@/utils/format'

const toast = useToast()
const tab = ref('preferences')

const prefs = reactive({ language: 'en-GB', timezone: 'Africa/Nairobi', dateFormat: 'DD/MM/YYYY', currency: 'KES', startPage: '/dashboard', weekStart: 'monday' })
const appearance = reactive({
  density: (() => {
    try {
      return localStorage.getItem('akwapui:density') ?? 'comfortable'
    } catch {
      return 'comfortable'
    }
  })(),
  reducedMotion: document.documentElement.dataset.motion === 'reduced',
})
watch(
  () => appearance.reducedMotion,
  (v) => {
    if (v) document.documentElement.dataset.motion = 'reduced'
    else delete document.documentElement.dataset.motion
  },
)
const notif = reactive({ email: true, push: true, sms: false, digest: 'weekly' })
const privacy = reactive({ showProfile: true, showActivity: false, analytics: true })
const security = reactive({ twoFactor: true, sessionTimeout: '60' })
const sessions = ref(seedSessions.map((s) => ({ ...s })))
const revokeTarget = ref<(typeof seedSessions)[number] | null>(null)
const revokeAllOpen = ref(false)

function save(section: string) {
  toast.success(`${section} saved`)
}
async function revoke() {
  await new Promise((r) => setTimeout(r, 600))
  sessions.value = sessions.value.filter((s) => s.id !== revokeTarget.value?.id)
  toast.success('Session signed out', revokeTarget.value?.device)
}
async function revokeAll() {
  await new Promise((r) => setTimeout(r, 700))
  sessions.value = sessions.value.filter((s) => s.current)
  toast.success('Signed out of all other sessions')
}
</script>

<template>
  <div>
    <PageHeader title="Account settings" description="Personal preferences that apply only to you." />
    <AkTabs
      v-model="tab"
      orientation="vertical"
      appearance="subtle"
      label="Settings sections"
      :tabs="[
        { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Lock },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'sessions', label: 'Active sessions', icon: MonitorSmartphone, badge: sessions.length },
      ]"
    >
      <template #preferences>
        <AkCard title="Personal preferences" subtitle="Language and regional formats.">
          <div class="grid gap-4 sm:grid-cols-2">
            <AkField label="Language">
              <AkSelect v-model="prefs.language" :options="[{ label: 'English (UK)', value: 'en-GB' }, { label: 'English (US)', value: 'en-US' }, { label: 'Français', value: 'fr' }, { label: 'Kiswahili', value: 'sw' }, { label: 'Português', value: 'pt' }]" />
            </AkField>
            <AkField label="Time zone" helper="Used for reports and scheduled exports.">
              <AkSelect v-model="prefs.timezone" :options="[{ label: '(UTC+03:00) Nairobi', value: 'Africa/Nairobi' }, { label: '(UTC+01:00) Lagos', value: 'Africa/Lagos' }, { label: '(UTC+00:00) London', value: 'Europe/London' }, { label: '(UTC+02:00) Johannesburg', value: 'Africa/Johannesburg' }, { label: '(UTC−05:00) New York', value: 'America/New_York' }]" />
            </AkField>
            <AkField label="Date format"><AkSelect v-model="prefs.dateFormat" :options="['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']" /></AkField>
            <AkField label="Display currency"><AkSelect v-model="prefs.currency" :options="[{ label: 'Kenyan shilling (KES)', value: 'KES' }, { label: 'US dollar (USD)', value: 'USD' }, { label: 'Nigerian naira (NGN)', value: 'NGN' }, { label: 'Euro (EUR)', value: 'EUR' }]" /></AkField>
            <AkField label="Start page"><AkSelect v-model="prefs.startPage" :options="[{ label: 'Overview', value: '/dashboard' }, { label: 'Analytics', value: '/dashboard/analytics' }, { label: 'Users', value: '/dashboard/users' }]" /></AkField>
            <AkRadioGroup v-model="prefs.weekStart" label="Week starts on" orientation="horizontal" :options="[{ label: 'Monday', value: 'monday' }, { label: 'Sunday', value: 'sunday' }]" />
          </div>
          <template #footer><AkButton variant="primary" @click="save('Preferences')">Save preferences</AkButton></template>
        </AkCard>
      </template>

      <template #appearance>
        <AkCard title="Appearance" subtitle="Applies on this device.">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Theme" description="System follows your device setting."><AkThemeSwitcher appearance="segmented" /></SettingsRow>
            <SettingsRow title="Density" description="Compact fits more rows into tables.">
              <AkSelect v-model="appearance.density" class="w-40" :options="[{ label: 'Comfortable', value: 'comfortable' }, { label: 'Compact', value: 'compact' }]" />
            </SettingsRow>
            <SettingsRow title="Reduce motion" description="Turns off animations and transitions in the app.">
              <AkSwitch v-model="appearance.reducedMotion" :label="appearance.reducedMotion ? 'On' : 'Off'" />
            </SettingsRow>
          </div>
          <template #footer><AkButton variant="link" to="/dashboard/settings">Organisation branding lives in System settings</AkButton></template>
        </AkCard>
      </template>

      <template #notifications>
        <AkCard title="Notification settings">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Email notifications"><AkSwitch v-model="notif.email" :label="notif.email ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Browser push notifications"><AkSwitch v-model="notif.push" :label="notif.push ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="SMS for critical alerts"><AkSwitch v-model="notif.sms" :label="notif.sms ? 'On' : 'Off'" /></SettingsRow>
            <div class="py-4">
              <AkRadioGroup v-model="notif.digest" label="Activity digest" :options="[{ label: 'Daily', value: 'daily', description: 'Every morning at 8:00' }, { label: 'Weekly', value: 'weekly', description: 'Mondays at 8:00' }, { label: 'Never', value: 'never' }]" />
            </div>
          </div>
          <template #footer>
            <AkButton variant="primary" @click="save('Notification settings')">Save</AkButton>
            <AkButton variant="subtle" to="/dashboard/notifications">View notifications</AkButton>
          </template>
        </AkCard>
      </template>

      <template #privacy>
        <AkCard title="Privacy">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Show my profile to everyone in the organisation"><AkSwitch v-model="privacy.showProfile" :label="privacy.showProfile ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Show my recent activity to managers"><AkSwitch v-model="privacy.showActivity" :label="privacy.showActivity ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Share anonymous usage data" description="Helps us improve Akwap. Never includes customer data."><AkSwitch v-model="privacy.analytics" :label="privacy.analytics ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Download my data" description="A ZIP of your profile and activity, ready within 24 hours.">
              <AkButton @click="toast.info('Export requested', 'We\'ll email you when it\'s ready.')">Request export</AkButton>
            </SettingsRow>
          </div>
          <template #footer><AkButton variant="primary" @click="save('Privacy settings')">Save</AkButton></template>
        </AkCard>
      </template>

      <template #security>
        <AkCard title="Security">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Two-factor authentication" description="Authenticator app"><AkSwitch v-model="security.twoFactor" :label="security.twoFactor ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Sign out after inactivity">
              <AkSelect v-model="security.sessionTimeout" class="w-40" :options="[{ label: '15 minutes', value: '15' }, { label: '1 hour', value: '60' }, { label: '8 hours', value: '480' }, { label: 'Never', value: '0' }]" />
            </SettingsRow>
            <SettingsRow title="Password" description="Change it from your profile."><AkButton to="/account/profile">Change password</AkButton></SettingsRow>
          </div>
          <AkAlert v-if="security.sessionTimeout === '0'" intent="warning" class="mt-3">Staying signed in forever is not recommended on shared computers.</AkAlert>
          <template #footer><AkButton variant="primary" @click="save('Security settings')">Save</AkButton></template>
        </AkCard>
      </template>

      <template #sessions>
        <AkCard title="Active sessions" subtitle="Devices currently signed in to your account.">
          <template #actions>
            <AkButton size="sm" variant="subtle" :icon="LogOut" :disabled="sessions.length <= 1" @click="revokeAllOpen = true">Sign out others</AkButton>
          </template>
          <ul class="divide-y divide-line-subtle">
            <li v-for="s in sessions" :key="s.id" class="flex flex-wrap items-center gap-3 py-3">
              <span class="flex size-10 items-center justify-center rounded-md bg-surface-tertiary text-secondary" aria-hidden="true">
                <Smartphone v-if="s.device.includes('iPhone')" class="size-5" /><Monitor v-else class="size-5" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="flex flex-wrap items-center gap-2 text-body-1-strong text-primary">{{ s.device }} <AkBadge v-if="s.current" color="success" size="sm">This device</AkBadge></p>
                <p class="text-caption-1 text-secondary">{{ s.location }} · {{ s.ip }} · {{ s.current ? 'Active now' : `Last active ${formatRelative(s.lastActive)}` }}</p>
              </div>
              <AkButton v-if="!s.current" size="sm" @click="revokeTarget = s">Sign out</AkButton>
            </li>
          </ul>
        </AkCard>
      </template>
    </AkTabs>

    <AkConfirmDialog
      :open="!!revokeTarget"
      title="Sign out this session?"
      :description="`${revokeTarget?.device} in ${revokeTarget?.location} will need to sign in again.`"
      confirm-label="Sign out"
      intent="danger"
      :on-confirm="revoke"
      @update:open="(v) => !v && (revokeTarget = null)"
    />
    <AkConfirmDialog v-model:open="revokeAllOpen" title="Sign out all other sessions?" description="Every device except this one will be signed out." confirm-label="Sign out all" intent="danger" :on-confirm="revokeAll" />
  </div>
</template>
