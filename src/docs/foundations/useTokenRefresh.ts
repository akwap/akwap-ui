import { nextTick, onMounted, ref, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useBrand } from '@/composables/useBrand'

/** A counter that bumps after mount and whenever theme or brand change. */
export function useTokenRefresh() {
  const tick = ref(0)
  const { resolved } = useTheme()
  const { brand } = useBrand()
  const bump = () => nextTick(() => requestAnimationFrame(() => tick.value++))
  onMounted(bump)
  watch([resolved, brand], bump, { deep: true })
  return tick
}
