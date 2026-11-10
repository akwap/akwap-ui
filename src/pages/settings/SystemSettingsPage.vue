<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Building2, Palette, SwatchBook, UserCog, ShieldCheck, Plug, Mail, Server, RotateCcw, Send, Copy, KeyRound, Check } from '@lucide/vue'
import {
  AkAlert, AkBadge, AkButton, AkCard, AkConfirmDialog, AkField, AkFileUpload, AkInput, AkSelect, AkSwitch, AkTabs, AkTextarea,
  AkRadioGroup, AkSegmentedControl, AkTimePicker, AkMultiSelect, useBrand, useTheme, useToast,
} from '@/design-system'
import PageHeader from '@/components/layout/PageHeader.vue'
import SettingsRow from '@/components/layout/SettingsRow.vue'
import AkLogo from '@/components/shared/AkLogo.vue'

const toast = useToast()
const { brand, setBrandHex, resetBrand } = useBrand()
const { preference, setTheme } = useTheme()
const tab = ref('general')
const saving = ref(false)

const general = reactive({ orgName: 'Akwap Cloud', legalName: 'Akwap Cloud Ltd.', supportEmail: 'support@akwap.example', country: 'KE', currency: 'KES', fiscalStart: 'january' })
const logo = ref([])
const presets = [
  { name: 'Akwap blue', hex: '#2d6bc4' },
  { name: 'Teal', hex: '#0f7b7b' },
  { name: 'Forest', hex: '#2e7d32' },
  { name: 'Indigo', hex: '#4f46b8' },
  { name: 'Plum', hex: '#8e3d8f' },
  { name: 'Rust', hex: '#b5482a' },
]
const radius = ref(document.documentElement.style.getPropertyValue('--ak-radius-control') ? 'custom' : 'medium')
function setRadius(v: string) {
  radius.value = v
  const map: Record<string, [string, string]> = { none: ['0px', '0px'], small: ['2px', '4px'], medium: ['4px', '8px'], large: ['8px', '12px'] }
  const [control, card] = map[v] ?? map.medium!
  document.documentElement.style.setProperty('--ak-radius-control', control)
  document.documentElement.style.setProperty('--ak-radius-card', card)
  document.documentElement.style.setProperty('--ak-radius-overlay', card)
}
const userDefaults = reactive({ role: 'Member', language: 'en-GB', digest: 'weekly', requireOnboarding: true })
const security = reactive({ require2fa: true, minLength: 12, expiry: '90', lockout: 5, sessionTimeout: '60', ipAllowlist: '102.68.12.0/24\n41.90.4.0/24', ssoOnly: false })
const integrations = reactive([
  { id: 'accounting', name: 'Ledgerly Accounting', description: 'Sync invoices and payments to your general ledger.', connected: true },
  { id: 'sms', name: 'Pulse SMS', description: 'Send payment reminders and OTP codes by SMS.', connected: true },
  { id: 'mobile', name: 'Mobile money gateway', description: 'Collect payments from all major mobile networks.', connected: true },
  { id: 'chat', name: 'TeamChat', description: 'Post alerts for failed payments to a team channel.', connected: false },
  { id: 'storage', name: 'Cloud storage', description: 'Archive monthly statements and exports automatically.', connected: false },
])
const email = reactive({ fromName: 'Akwap Cloud', fromAddress: 'no-reply@akwap.example', host: 'smtp.akwap.example', port: 587, username: 'apikey', password: '••••••••••', encryption: 'tls', footer: 'Akwap Cloud Ltd · Ngong Road, Nairobi' })
const sendingTest = ref(false)
const system = reactive({ maintenance: false, retention: '365', backupTime: '02:00', regions: ['af-east'] as (string | number)[], debug: false })
const maintenanceConfirm = ref(false)
const apiKey = 'ak_live_5f2c9e81b7d44a0f9c13'
const copied = ref(false)

async function save() {
  saving.value = true
  await new Promise((r) => setTimeout(r, 800))
  saving.value = false
  toast.success('Settings saved', 'Changes apply to everyone in your organisation.')
}
async function testEmail() {
  sendingTest.value = true
  await new Promise((r) => setTimeout(r, 1000))
  sendingTest.value = false
  toast.success('Test email sent', `Check ${general.supportEmail}.`)
}
function toggleMaintenance(v: boolean) {
  if (v) maintenanceConfirm.value = true
  else {
    system.maintenance = false
    toast.success('Maintenance mode off')
  }
}
async function copyKey() {
  try {
    await navigator.clipboard.writeText(apiKey)
  } catch {
    /* clipboard may be unavailable */
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div>
    <PageHeader title="System settings" description="Organisation-wide configuration. Only owners and admins can change these.">
      <template #meta><AkBadge color="warning" class="mt-2" dot>Affects all users</AkBadge></template>
    </PageHeader>

    <AkTabs
      v-model="tab"
      orientation="vertical"
      appearance="subtle"
      label="System settings sections"
      keep-alive
      :tabs="[
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'theme', label: 'Theme', icon: SwatchBook },
        { id: 'users', label: 'User preferences', icon: UserCog },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'integrations', label: 'Integrations', icon: Plug },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'system', label: 'System', icon: Server },
      ]"
    >
      <template #general>
        <AkCard title="General" subtitle="Your organisation's details.">
          <div class="grid gap-4 sm:grid-cols-2">
            <AkField label="Organisation name" required><AkInput v-model="general.orgName" /></AkField>
            <AkField label="Legal name"><AkInput v-model="general.legalName" /></AkField>
            <AkField label="Support email" helper="Shown on invoices and receipts."><AkInput v-model="general.supportEmail" type="email" /></AkField>
            <AkField label="Country"><AkSelect v-model="general.country" :options="[{ label: 'Kenya', value: 'KE' }, { label: 'Nigeria', value: 'NG' }, { label: 'Uganda', value: 'UG' }, { label: 'Rwanda', value: 'RW' }, { label: 'Ghana', value: 'GH' }]" /></AkField>
            <AkField label="Base currency"><AkSelect v-model="general.currency" :options="['KES', 'NGN', 'UGX', 'RWF', 'GHS', 'USD']" /></AkField>
            <AkField label="Fiscal year starts"><AkSelect v-model="general.fiscalStart" :options="[{ label: 'January', value: 'january' }, { label: 'April', value: 'april' }, { label: 'July', value: 'july' }]" /></AkField>
          </div>
        </AkCard>
      </template>

      <template #branding>
        <div class="flex flex-col gap-4">
          <AkCard title="Brand colour" subtitle="Recolours buttons, links, focus accents and charts everywhere, instantly.">
            <div class="flex flex-col gap-5">
              <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Brand colour presets">
                <button
                  v-for="p in presets"
                  :key="p.hex"
                  type="button"
                  role="radio"
                  :aria-checked="brand.hex === p.hex ? 'true' : 'false'"
                  class="flex items-center gap-2 rounded-control border px-2.5 py-1.5 text-body-1 focus-ring"
                  :class="brand.hex === p.hex ? 'border-brand-stroke bg-brand-subtle text-primary' : 'border-line text-secondary hover:bg-subtle-hover'"
                  @click="setBrandHex(p.hex)"
                >
                  <span class="size-4 rounded-full" :style="{ background: p.hex }" aria-hidden="true" />{{ p.name }}
                </button>
              </div>
              <div class="flex flex-wrap items-end gap-3">
                <AkField label="Custom colour" helper="Any hex colour; the system derives a full accessible ramp.">
                  <div class="flex items-center gap-2">
                    <input type="color" :value="brand.hex" aria-label="Pick brand colour" class="size-8 cursor-pointer rounded-control border border-line bg-transparent p-0.5" @input="setBrandHex(($event.target as HTMLInputElement).value)" />
                    <AkInput :model-value="brand.hex" class="w-32" aria-label="Brand colour hex" @change="(e: Event) => /^#[0-9a-f]{6}$/i.test((e.target as HTMLInputElement).value) && setBrandHex((e.target as HTMLInputElement).value)" />
                  </div>
                </AkField>
                <AkButton variant="subtle" :icon="RotateCcw" @click="resetBrand">Reset to default</AkButton>
              </div>
              <div class="flex flex-wrap items-center gap-3 rounded-md border border-line-subtle bg-surface-secondary p-4" aria-label="Preview">
                <AkLogo />
                <AkButton variant="primary">Primary</AkButton>
                <AkButton variant="outline">Outline</AkButton>
                <a href="#branding" class="link" @click.prevent>Link text</a>
                <AkBadge color="brand">Badge</AkBadge>
                <AkSwitch :model-value="true" label="Switch" />
              </div>
            </div>
          </AkCard>
          <AkCard title="Logo" subtitle="SVG or PNG, at least 256 × 256 px.">
            <AkFileUpload v-model="logo" accept=".svg,.png,image/png,image/svg+xml" :multiple="false" :max-files="1" :max-size="2 * 1024 * 1024" />
          </AkCard>
        </div>
      </template>

      <template #theme>
        <AkCard title="Theme customisation" subtitle="Defaults for your organisation. Users can still override the theme.">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Default theme">
              <AkSegmentedControl :model-value="preference" label="Default theme" :options="[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'high-contrast', label: 'High contrast' }, { value: 'system', label: 'System' }]" @update:model-value="setTheme" />
            </SettingsRow>
            <SettingsRow title="Corner radius" description="Applies to controls, cards and dialogs.">
              <AkSegmentedControl :model-value="radius" label="Corner radius" :options="[{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]" @update:model-value="setRadius" />
            </SettingsRow>
          </div>
          <AkAlert intent="info" class="mt-2" title="Tip">The theme tokens live in <code>src/styles/themes.css</code>. See the Theming guide in the docs for adding your own theme.</AkAlert>
        </AkCard>
      </template>

      <template #users>
        <AkCard title="Defaults for new users">
          <div class="grid gap-4 sm:grid-cols-2">
            <AkField label="Default role"><AkSelect v-model="userDefaults.role" :options="['Member', 'Analyst', 'Manager']" /></AkField>
            <AkField label="Default language"><AkSelect v-model="userDefaults.language" :options="[{ label: 'English (UK)', value: 'en-GB' }, { label: 'Kiswahili', value: 'sw' }, { label: 'Français', value: 'fr' }]" /></AkField>
            <AkRadioGroup v-model="userDefaults.digest" label="Activity digest" orientation="horizontal" :options="[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Off', value: 'off' }]" />
            <AkSwitch v-model="userDefaults.requireOnboarding" label="Show onboarding checklist" description="New users see a short setup guide." />
          </div>
        </AkCard>
      </template>

      <template #security>
        <AkCard title="Security policy">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Require two-factor authentication" description="Users without 2FA must set it up at next sign-in."><AkSwitch v-model="security.require2fa" :label="security.require2fa ? 'Required' : 'Optional'" /></SettingsRow>
            <SettingsRow title="Single sign-on only" description="Disable password sign-in for everyone except owners."><AkSwitch v-model="security.ssoOnly" :label="security.ssoOnly ? 'On' : 'Off'" /></SettingsRow>
            <SettingsRow title="Minimum password length"><AkInput v-model="security.minLength" type="number" :min="8" :max="64" class="w-28" aria-label="Minimum password length" /></SettingsRow>
            <SettingsRow title="Password expiry"><AkSelect v-model="security.expiry" class="w-40" aria-label="Password expiry" :options="[{ label: 'Never', value: '0' }, { label: '60 days', value: '60' }, { label: '90 days', value: '90' }, { label: '180 days', value: '180' }]" /></SettingsRow>
            <SettingsRow title="Lock account after failed attempts"><AkInput v-model="security.lockout" type="number" :min="3" :max="10" class="w-28" aria-label="Failed attempts before lockout" /></SettingsRow>
            <div class="py-4">
              <AkField label="IP allowlist" helper="One CIDR range per line. Leave empty to allow all addresses.">
                <AkTextarea v-model="security.ipAllowlist" :rows="3" class="font-mono" />
              </AkField>
            </div>
          </div>
        </AkCard>
      </template>

      <template #integrations>
        <div class="grid gap-4 md:grid-cols-2">
          <AkCard v-for="i in integrations" :key="i.id">
            <div class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-tertiary text-secondary" aria-hidden="true"><Plug class="size-5" /></span>
              <div class="min-w-0 flex-1">
                <p class="flex flex-wrap items-center gap-2 text-body-1-strong text-primary">{{ i.name }} <AkBadge v-if="i.connected" color="success" size="sm" dot>Connected</AkBadge></p>
                <p class="mt-0.5 text-caption-1 text-secondary">{{ i.description }}</p>
              </div>
            </div>
            <template #footer>
              <AkButton size="sm" :variant="i.connected ? 'secondary' : 'primary'" @click="(i.connected = !i.connected), toast.success(i.connected ? `${i.name} connected` : `${i.name} disconnected`)">
                {{ i.connected ? 'Disconnect' : 'Connect' }}
              </AkButton>
              <AkButton v-if="i.connected" size="sm" variant="subtle" @click="toast.info(`${i.name} is healthy`, 'Last sync 4 minutes ago.')">Check status</AkButton>
            </template>
          </AkCard>
        </div>
      </template>

      <template #email>
        <AkCard title="Email delivery" subtitle="Outgoing mail for invitations, receipts and alerts.">
          <div class="grid gap-4 sm:grid-cols-2">
            <AkField label="Sender name"><AkInput v-model="email.fromName" /></AkField>
            <AkField label="Sender address"><AkInput v-model="email.fromAddress" type="email" /></AkField>
            <AkField label="SMTP host"><AkInput v-model="email.host" /></AkField>
            <AkField label="Port"><AkInput v-model="email.port" type="number" /></AkField>
            <AkField label="Username"><AkInput v-model="email.username" autocomplete="off" /></AkField>
            <AkField label="Password"><AkInput v-model="email.password" type="password" autocomplete="new-password" /></AkField>
            <AkRadioGroup v-model="email.encryption" label="Encryption" orientation="horizontal" :options="[{ label: 'TLS', value: 'tls' }, { label: 'SSL', value: 'ssl' }, { label: 'None', value: 'none' }]" />
            <AkField label="Email footer" class="sm:col-span-2"><AkTextarea v-model="email.footer" :rows="2" /></AkField>
          </div>
          <AkAlert v-if="email.encryption === 'none'" intent="warning" class="mt-4">Sending without encryption exposes credentials and content.</AkAlert>
          <template #footer><AkButton :icon="Send" :loading="sendingTest" @click="testEmail">Send test email</AkButton></template>
        </AkCard>
      </template>

      <template #system>
        <AkCard title="System configuration">
          <div class="divide-y divide-line-subtle">
            <SettingsRow title="Maintenance mode" description="Signs out non-admin users and shows a maintenance page.">
              <AkSwitch :model-value="system.maintenance" :label="system.maintenance ? 'On' : 'Off'" @update:model-value="toggleMaintenance" />
            </SettingsRow>
            <SettingsRow title="Data retention" description="How long activity logs are kept.">
              <AkSelect v-model="system.retention" class="w-40" aria-label="Data retention" :options="[{ label: '90 days', value: '90' }, { label: '1 year', value: '365' }, { label: '7 years', value: '2555' }]" />
            </SettingsRow>
            <SettingsRow title="Daily backup time" description="East Africa Time."><AkTimePicker v-model="system.backupTime" class="w-40" aria-label="Daily backup time" :hour12="false" :step="60" /></SettingsRow>
            <SettingsRow title="Data regions"><AkMultiSelect v-model="system.regions" class="w-56" aria-label="Data regions" :options="[{ label: 'Africa (East)', value: 'af-east' }, { label: 'Africa (West)', value: 'af-west' }, { label: 'Europe (West)', value: 'eu-west' }]" /></SettingsRow>
            <SettingsRow title="API key" description="Use with the REST API. Keep it secret.">
              <div class="flex items-center gap-2">
                <code class="rounded-sm border border-line-subtle bg-surface-tertiary px-2 py-1 font-mono text-caption-1">{{ apiKey.slice(0, 12) }}••••••••</code>
                <AkButton size="sm" :icon="copied ? Check : Copy" :aria-label="copied ? 'Copied' : 'Copy API key'" icon-only @click="copyKey">Copy</AkButton>
                <AkButton size="sm" :icon="KeyRound" @click="toast.warning('Key rotated', 'Update your integrations within 24 hours.')">Rotate</AkButton>
              </div>
            </SettingsRow>
            <SettingsRow title="Verbose logging" description="Temporarily capture extra diagnostics for support."><AkSwitch v-model="system.debug" :label="system.debug ? 'On' : 'Off'" /></SettingsRow>
          </div>
        </AkCard>
      </template>
    </AkTabs>

    <div class="sticky bottom-0 z-[var(--ak-z-sticky)] -mx-4 mt-6 -mb-6 border-t border-line-subtle bg-surface/95 backdrop-blur sm:-mx-6 lg:-mx-8">
      <div class="flex items-center justify-end gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <p class="mr-auto hidden text-caption-1 text-tertiary sm:block">Changes are saved for the whole organisation.</p>
        <AkButton @click="toast.info('Changes discarded')">Discard</AkButton>
        <AkButton variant="primary" :loading="saving" data-testid="save-settings" @click="save">Save changes</AkButton>
      </div>
    </div>

    <AkConfirmDialog
      v-model:open="maintenanceConfirm"
      title="Turn on maintenance mode?"
      description="All non-admin users will be signed out immediately and see a maintenance page until you turn it off."
      confirm-label="Turn on"
      intent="danger"
      :on-confirm="async () => { system.maintenance = true; toast.warning('Maintenance mode on') }"
    />
  </div>
</template>
