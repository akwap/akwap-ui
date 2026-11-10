<script setup lang="ts">
import { ref } from 'vue'
import { AkAlert, AkButton, AkCheckbox, AkField, AkInput, AkSelect, rules, useForm, useToast } from '@/design-system'

const toast = useToast()
const done = ref(false)
const form = useForm(
  { name: '', email: '', team: '', terms: false },
  {
    name: [rules.required('Name')],
    email: [rules.required('Email'), rules.email()],
    team: [rules.required('Team')],
    terms: [rules.required('Accepting the terms')],
  },
)

async function submit() {
  done.value = false
  const ok = await form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 800))
  })
  if (ok) {
    done.value = true
    toast.success('Invitation sent', `We emailed ${form.values.email}.`)
  }
}
</script>

<template>
  <form class="flex max-w-md flex-col gap-4" novalidate @submit.prevent="submit">
    <AkAlert v-if="form.submitted.value && form.errorCount()" intent="danger" title="Fix the highlighted fields">
      {{ form.errorCount() }} field(s) need attention.
    </AkAlert>
    <AkAlert v-if="done" intent="success" title="Invitation sent" role="status">Your teammate will receive an email shortly.</AkAlert>

    <AkField label="Full name" required :error="form.errors.name">
      <AkInput v-model="form.values.name" autocomplete="name" @blur="form.blur('name')" @input="form.input('name')" />
    </AkField>
    <AkField label="Email" required :error="form.errors.email" helper="We'll send the invitation here.">
      <AkInput v-model="form.values.email" type="email" autocomplete="email" @blur="form.blur('email')" @input="form.input('email')" />
    </AkField>
    <AkField label="Team" required :error="form.errors.team">
      <AkSelect
        v-model="form.values.team"
        placeholder="Choose a team"
        :options="['Design', 'Engineering', 'Finance', 'Operations']"
        @change="form.blur('team')"
      />
    </AkField>
    <AkCheckbox
      v-model="form.values.terms"
      label="I confirm this person may join the workspace"
      :invalid="!!form.errors.terms"
      @change="form.blur('terms')"
    />
    <p v-if="form.errors.terms" class="-mt-2 text-caption-1 text-danger">{{ form.errors.terms }}</p>
    <AkButton type="submit" variant="primary" :loading="form.submitting.value">Send invitation</AkButton>
  </form>
</template>
