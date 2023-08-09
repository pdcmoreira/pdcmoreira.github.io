import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useKeyDetection() {
  // Key registration

  const pressedKeys = ref<string[]>([])

  const keyRegistration = (key: string, pressed: Boolean) => {
    const index = pressedKeys.value.findIndex((existingKey) => existingKey === key)

    // Add
    if (pressed) {
      if (index < 0) {
        pressedKeys.value.push(key)
      }

      return
    }

    // Remove
    if (index >= 0) {
      pressedKeys.value.splice(index, 1)
    }
  }

  const keyListeners: {
    [key: string]: EventListener
  } = {
    keydown: (event) => keyRegistration((event as KeyboardEvent).key, true),

    keyup: (event) => keyRegistration((event as KeyboardEvent).key, false)
  }

  // Bind the key event listeners

  const keyEvents = Object.keys(keyListeners)

  onMounted(() => {
    keyEvents.forEach((listener) => document.addEventListener(listener, keyListeners[listener]))
  })

  onBeforeUnmount(() => {
    keyEvents.forEach((listener) => document.removeEventListener(listener, keyListeners[listener]))
  })

  return { pressedKeys }
}
