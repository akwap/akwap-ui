<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ kind: 'privacy' | 'terms' }>()
const doc = computed(() =>
  props.kind === 'privacy'
    ? {
        title: 'Privacy policy',
        sections: [
          ['What we collect', 'Account details you give us (name, email, phone), data you store in your workspace, and technical information such as IP address and device type used to keep your account secure.'],
          ['How we use it', 'To provide and secure the service, to send the notifications you choose, and to improve the product using aggregated, anonymous usage data you can opt out of.'],
          ['Who we share it with', 'Only sub-processors needed to run the service (hosting, email, SMS), each under a data processing agreement. We never sell personal data.'],
          ['Your rights', 'You can access, correct, export or delete your data at any time from Account settings, or by contacting privacy@akwap.example.'],
        ],
      }
    : {
        title: 'Terms of service',
        sections: [
          ['Using Akwap', 'You must be authorised to act for the organisation that owns the workspace and keep your credentials confidential.'],
          ['Your data', 'You own the data you put into Akwap. We process it only to provide the service as described in our privacy policy.'],
          ['Billing', 'Subscriptions renew automatically. You can cancel anytime; access continues until the end of the paid period.'],
          ['Liability', 'The service is provided with the uptime commitments of your plan. Our liability is limited to the fees paid in the prior 12 months.'],
        ],
      },
)
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
    <p class="text-caption-1 text-tertiary">Last updated 1 October 2026 · Demo content</p>
    <h1 class="mt-2 text-title-1 text-primary">{{ doc.title }}</h1>
    <div class="prose-ak mt-6 max-w-none">
      <template v-for="[h, p] in doc.sections" :key="h">
        <h2>{{ h }}</h2>
        <p>{{ p }}</p>
      </template>
      <p>Questions? <RouterLink to="/contact">Contact us</RouterLink>.</p>
    </div>
  </article>
</template>
