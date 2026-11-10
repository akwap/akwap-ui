import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { AkConfirmDialog, AkDialog, AkInput } from '@/design-system'

function dialogHarness(extra: Record<string, unknown> = {}) {
  const open = ref(false)
  const Harness = defineComponent({
    setup: () => () => [
      h('button', { id: 'opener', onClick: () => (open.value = true) }, 'Open'),
      h(
        AkDialog,
        { open: open.value, 'onUpdate:open': (v: boolean) => (open.value = v), title: 'Rename project', description: 'Pick a new name', initialFocus: 'input', ...extra },
        { default: () => h(AkInput, { 'aria-label': 'Name' }) },
      ),
    ],
  })
  const w = mount(Harness, { attachTo: document.body })
  return { w, open }
}

describe('AkDialog', () => {
  it('opens with dialog semantics and moves focus inside', async () => {
    const { open } = dialogHarness()
    const opener = document.getElementById('opener')!
    opener.focus()
    opener.click()
    await nextTick()
    await flushPromises()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog).not.toBeNull()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    const title = document.getElementById(dialog.getAttribute('aria-labelledby')!)!
    expect(title.textContent).toBe('Rename project')
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe('Pick a new name')
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(document.activeElement!.tagName).toBe('INPUT')
    expect(open.value).toBe(true)
  })

  it('closes on Escape and restores focus to the opener', async () => {
    const { open } = dialogHarness()
    const opener = document.getElementById('opener')!
    opener.focus()
    opener.click()
    await flushPromises()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(open.value).toBe(false)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(opener)
  })

  it('persistent dialogs ignore Escape', async () => {
    const { open } = dialogHarness({ persistent: true })
    document.getElementById('opener')!.click()
    await flushPromises()
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(open.value).toBe(true)
  })
})

describe('AkConfirmDialog', () => {
  it('uses alertdialog, focuses Cancel first and awaits onConfirm', async () => {
    let confirmed = 0
    const open = ref(true)
    mount(
      defineComponent({
        setup: () => () =>
          h(AkConfirmDialog, {
            open: open.value,
            'onUpdate:open': (v: boolean) => (open.value = v),
            title: 'Remove member?',
            intent: 'danger',
            confirmLabel: 'Remove',
            onConfirm: async () => {
              confirmed++
            },
          }),
      }),
      { attachTo: document.body },
    )
    await flushPromises()
    const dialog = document.querySelector('[role="alertdialog"]')!
    expect(dialog).not.toBeNull()
    expect(document.activeElement?.textContent?.trim()).toBe('Cancel')
    const confirm = Array.from(dialog.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Remove')!
    confirm.click()
    await flushPromises()
    expect(confirmed).toBe(1)
    expect(open.value).toBe(false)
  })
})
