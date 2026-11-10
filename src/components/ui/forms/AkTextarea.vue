<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useAttrs, useId, watch } from 'vue'
import { useField } from './fieldContext'
import { controlShell } from './controlClasses'

defineOptions({ inheritAttrs: false })

/** AkTextarea — multi-line input with optional auto-grow and character counter. */
const props = withDefaults(
  defineProps<{
    modelValue?: string
    rows?: number
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    maxlength?: number
    /** Grow with content up to `maxRows`. */
    autoResize?: boolean
    maxRows?: number
    resize?: 'none' | 'vertical'
    id?: string
  }>(),
  { modelValue: '', rows: 3, maxRows: 10, resize: 'vertical' },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
const field = useField()
const el = ref<HTMLTextAreaElement | null>(null)
const counterId = `${useId()}-count`

const disabled = computed(() => props.disabled || field?.disabled.value)
const invalid = computed(() => props.invalid || field?.invalid.value)
const describedBy = computed(() => [field?.describedBy.value, props.maxlength ? counterId : ''].filter(Boolean).join(' ') || undefined)

function grow() {
  if (!props.autoResize || !el.value) return
  el.value.style.height = 'auto'
  const line = parseFloat(getComputedStyle(el.value).lineHeight) || 20
  el.value.style.height = `${Math.min(el.value.scrollHeight, line * props.maxRows + 12)}px`
}
watch(() => props.modelValue, () => nextTick(grow))
onMounted(grow)
</script>

<template>
  <div :class="attrs.class">
    <div :class="[controlShell({ invalid, disabled, readonly, flush: true }), 'items-stretch']">
      <textarea
        :id="id ?? field?.id.value"
        ref="el"
        v-bind="{ ...attrs, class: undefined }"
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :required="field?.required.value"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        class="w-full min-w-0 bg-transparent px-control-x py-1.5 text-body-1 text-primary outline-none placeholder:text-tertiary disabled:cursor-not-allowed"
        :class="resize === 'none' || autoResize ? 'resize-none' : 'resize-y'"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
    <p v-if="maxlength" :id="counterId" class="mt-1 text-right text-caption-1 text-tertiary" aria-live="polite">
      {{ modelValue.length }} / {{ maxlength }}
    </p>
  </div>
</template>
