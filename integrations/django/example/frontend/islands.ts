/**
 * Vue islands for Django pages.
 *
 * A template renders a mount point with {% ak_island "AkLineChart" props %};
 * this script finds every [data-ak-island] element and mounts that AkwapUI
 * component into it with the JSON props. Add `name="field"` to the tag to keep
 * a hidden <input> in sync with the component's v-model, so the value posts
 * with the surrounding Django <form>.
 *
 * Only the components imported here are bundled. Styles come from the
 * Django Tailwind build (see assets/css/app.css), so no extra CSS is loaded.
 */
import { createApp, h, ref, type Component } from 'vue'
import { AkBarChart, AkDataTable, AkDatePicker, AkDonutChart, AkLineChart, AkMultiSelect } from 'akwapui'

const registry: Record<string, Component> = { AkBarChart, AkDataTable, AkDatePicker, AkDonutChart, AkLineChart, AkMultiSelect }

function mount(el: HTMLElement) {
  if (el.dataset.akMounted) return
  const name = el.dataset.akIsland ?? ''
  const component = registry[name]
  if (!component) {
    console.warn(`[AkwapUI] no island registered for ${name}`)
    return
  }
  const { modelValue, ...props } = JSON.parse(el.dataset.akProps || '{}') as Record<string, unknown>
  const model = ref(modelValue)
  // Hidden inputs that carry the v-model value with the surrounding <form>:
  // one per value for arrays, so MultipleChoiceField receives a normal list.
  const fieldName = el.dataset.akName
  let holder: HTMLElement | null = null
  if (fieldName) {
    holder = document.createElement('span')
    holder.hidden = true
    el.after(holder)
  }
  const sync = (v: unknown) => {
    if (!holder || !fieldName) return
    const values = Array.isArray(v) ? v : v == null || v === '' ? [] : [v]
    holder.replaceChildren(
      ...values.map((value) => Object.assign(document.createElement('input'), { type: 'hidden', name: fieldName, value: String(value) })),
    )
  }
  sync(model.value)
  el.dataset.akMounted = 'true'
  createApp({
    render: () =>
      h(component, {
        ...props,
        ...(model.value !== undefined || holder ? { modelValue: model.value } : {}),
        'onUpdate:modelValue': (v: unknown) => {
          model.value = v
          sync(v)
        },
      }),
  }).mount(el)
}

function mountAll(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-ak-island]').forEach(mount)
}

mountAll()
// htmx and other partial page updates
document.addEventListener('htmx:afterSettle', (e) => mountAll(e.target as HTMLElement))
