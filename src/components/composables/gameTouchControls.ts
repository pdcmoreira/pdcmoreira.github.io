import { hasTouchCapability } from '@/utilities/touchDetection'
import { ref, watch } from 'vue'

export function useGameTouchControls() {
  const allowTouchControls = hasTouchCapability()

  const showVirtualGamePad = ref(false)

  const pressedDPadKeys = ref<string[]>([])

  watch(showVirtualGamePad, (shown) => {
    if (!shown) {
      pressedDPadKeys.value = []
    }
  })

  return { allowTouchControls, showVirtualGamePad, pressedDPadKeys }
}
