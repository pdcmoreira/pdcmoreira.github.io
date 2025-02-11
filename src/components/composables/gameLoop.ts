import { onMounted, onUnmounted } from 'vue'

export function useGameLoop(update: (delta: number) => void) {
  // Fail-safe flag to stop the loop when unmounted
  let running = false

  // Frame-rate independent delta time multiplier
  let delta = 0

  let lastTime = 0

  onMounted(() => {
    running = true

    function gameLoop(currentTime: number) {
      if (!running) {
        return
      }

      // Calculate delta

      delta = (currentTime - lastTime) / 1000

      lastTime = currentTime

      // Call the update callback with delta
      update(delta)

      // Loop
      requestAnimationFrame(gameLoop)
    }

    // Initialize lastTime before the first frame
    lastTime = performance.now()

    gameLoop(lastTime)
  })

  onUnmounted(() => {
    running = false
  })
}
