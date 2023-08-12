import { ref, watch } from 'vue'

export function useTouchControls() {
  const showVirtualGamePad = ref(false)

  const pressedDPadKeys = ref<string[]>([])

  watch(showVirtualGamePad, (shown) => {
    if (!shown) {
      pressedDPadKeys.value = []
    }
  })

  return { showVirtualGamePad, pressedDPadKeys }
}
