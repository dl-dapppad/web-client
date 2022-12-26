import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

export const useBreakpoints = () => {
  const { width: windowWidth } = useWindowSize()

  const isXSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.xSmall)
  const isSmall = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.small)
  const isMedium = computed(() => windowWidth.value < WINDOW_BREAKPOINTS.medium)

  return {
    isXSmall,
    isSmall,
    isMedium,
  }
}
