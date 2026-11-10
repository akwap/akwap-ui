import { nextTick, reactive, ref } from 'vue'
import { validate, type Rule } from '@/utils/validation'

type Rules<T> = { [K in keyof T]?: Rule<any>[] | (() => Rule<any>[]) }

/**
 * Tiny form state helper: values, per-field errors, "validate on blur, then
 * live once touched", submit guard and focusing the first invalid field.
 */
export function useForm<T extends Record<string, any>>(initial: T, rules: Rules<T>) {
  const values = reactive({ ...initial }) as T
  const errors = reactive({} as Record<string, string | null>) as Record<keyof T & string, string | null>
  const touched = reactive({} as Record<string, boolean>) as Record<keyof T & string, boolean>
  const submitting = ref(false)
  const submitted = ref(false)

  function fieldRules(key: keyof T & string): Rule<any>[] {
    const r = rules[key]
    return typeof r === 'function' ? r() : (r ?? [])
  }
  function validateField(key: keyof T & string) {
    errors[key] = validate(values[key], fieldRules(key))
    return !errors[key]
  }
  function blur(key: keyof T & string) {
    touched[key] = true
    validateField(key)
  }
  /** Re-validate on input only after the field was touched or a submit happened. */
  function input(key: keyof T & string) {
    // Deferred so the v-model update has been applied first.
    nextTick(() => {
      if (touched[key] || submitted.value) validateField(key)
    })
  }
  function validateAll() {
    let ok = true
    for (const key of Object.keys(rules) as (keyof T & string)[]) ok = validateField(key) && ok
    return ok
  }
  async function focusFirstError(root: ParentNode = document) {
    await nextTick()
    root.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }
  async function handleSubmit(fn: (v: T) => Promise<void> | void) {
    submitted.value = true
    if (!validateAll()) {
      await focusFirstError()
      return false
    }
    submitting.value = true
    try {
      await fn(values)
      return true
    } finally {
      submitting.value = false
    }
  }
  const errorCount = () => Object.values(errors).filter(Boolean).length
  return { values, errors, touched, submitting, submitted, blur, input, validateField, validateAll, handleSubmit, errorCount }
}
