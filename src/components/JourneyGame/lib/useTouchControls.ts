import { hasTouchCapability } from '@/utilities/touchDetection'
import { ref, watch } from 'vue'

export function useTouchControls() {
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
