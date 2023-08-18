import throttle from 'lodash/throttle'
import { ref } from 'vue'

const delay = 100

// Singletons
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const updateSize = throttle(() => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}, delay)

window.addEventListener('resize', updateSize)

export function useWindowSize() {
  return { windowWidth, windowHeight }
}
