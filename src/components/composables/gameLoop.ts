import { onMounted, onUnmounted } from 'vue'

export function useGameLoop(update: Function) {
  // Fail-safe flag to stop the loop when unmounted
  let running = false

  onMounted(() => {
    running = true

    function gameLoop() {
      if (!running) {
        return
      }

      update()

      requestAnimationFrame(gameLoop)
    }

    gameLoop()
  })

  onUnmounted(() => {
    running = false
  })
}
