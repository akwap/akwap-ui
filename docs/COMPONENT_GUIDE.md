# Component guide

Every component has a documentation page at `/docs/components/<name>` with the same 14 sections: name, description, when to use, when not to use, anatomy, variants, sizes, interactive states, accessibility, responsive behaviour, live code examples (the shown code is the example's exact source), props and API, usage guidelines, and do/don't.

## Shared conventions

- **Prefix.** Every component is `Ak*` and is exported from `src/design-system/index.ts`.
- **Sizes.** Controls take `size="sm" | "md" | "lg"` (24, 32 and 40px tall). `md` is the default. Use `lg` on touch-first screens such as sign-in.
- **v-model.** Form controls use `v-model` (`modelValue` + `update:modelValue`). Overlays use `v-model:open`.
- **Fields.** Put inputs inside `<AkField label="…" helper="…" :error="…">`. The field supplies id, label association, `aria-describedby`, `aria-invalid` and `required` to the control inside it.
- **Links.** `AkButton`, `AkCard` and `AkLink` render a router link with `to`, an anchor with `href`, and a button otherwise.
- **Icons.** Pass a Lucide component to `icon`; icons are decorative unless the button is icon-only, which requires `aria-label`.
- **Tokens only.** Components use semantic utilities (`bg-surface`, `text-secondary`, `rounded-control`), never raw colours.

## Catalogue

| Area | Components | Docs page |
| --- | --- | --- |
| Buttons | `AkButton`, `AkButtonGroup`, `AkSplitButton`, `AkSegmentedControl` | button |
| Text input | `AkInput`, `AkTextarea`, `AkField`, `AkPasswordStrength` | input, form |
| Selection | `AkSelect`, `AkMultiSelect`, `AkCheckbox`, `AkRadio`, `AkRadioGroup`, `AkSwitch` | select, checkbox, radio, switch |
| Date and time | `AkDatePicker`, `AkDateRangePicker`, `AkCalendar`, `AkTimePicker` | date-time |
| Files | `AkFileUpload`, `AkFileAttachment` | file-upload |
| Containers | `AkCard`, `AkStatCard`, `AkDivider` | card |
| Data | `AkDataTable`, `AkDescriptionList`, `AkKeyValue`, `AkList`, `AkTimeline`, `AkActivityFeed` | table, disclosure |
| Identity and status | `AkBadge`, `AkAvatar`, `AkAvatarGroup`, `AkStatusIndicator`, `AkKbd` | badge, avatar |
| Feedback | `AkAlert`, `AkToaster` + `useToast`, `AkProgressBar`, `AkSpinner`, `AkSkeleton`, `AkStepper`, `AkEmptyState` | alert, toast, progress, empty-state |
| Overlays | `AkDialog`, `AkConfirmDialog`, `AkDrawer`, `AkMenu`, `AkPopover`, `AkTooltip`, `AkCommandPalette` | modal, drawer, dropdown, tooltip |
| Navigation | `AkNavList`, `AkBreadcrumb`, `AkTabs`, `AkPagination`, `AkLink`, `AkSkipLink` | navigation, tabs, pagination |
| Disclosure | `AkAccordion`, `AkAccordionItem` | disclosure |
| Charts | `AkLineChart`, `AkBarChart`, `AkDonutChart`, `AkSparkline`, `AkChartCard`, `AkChartLegend` | charts |
| App pieces | `AkThemeSwitcher`, `AkLogo` | — |

Composables: `useTheme`, `useBrand`, `useToast`, `useForm`, `useAnnouncer`, `useFocusTrap`, `useFloating`. Helpers: `rules`, `validate`, `passwordStrength`.

## Quick examples

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@lucide/vue'
import { AkButton, AkDialog, AkField, AkInput, useForm, rules, useToast } from 'akwapui'

const open = ref(false)
const toast = useToast()
const form = useForm({ name: '' }, { name: [rules.required('Name')] })

function save() {
  if (!form.validateAll()) return
  open.value = false
  toast.success('Project created')
}
</script>

<template>
  <AkButton variant="primary" :icon="Plus" @click="open = true">New project</AkButton>
  <AkDialog v-model:open="open" title="New project">
    <AkField label="Name" required :error="form.errors.name">
      <AkInput v-model="form.values.name" @blur="form.blur('name')" @input="form.input('name')" />
    </AkField>
    <template #footer>
      <AkButton @click="open = false">Cancel</AkButton>
      <AkButton variant="primary" @click="save">Create</AkButton>
    </template>
  </AkDialog>
</template>
```

## Adding a component

See [CONTRIBUTING.md](./CONTRIBUTING.md#adding-a-component).
