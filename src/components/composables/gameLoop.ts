import { onMounted } from 'vue'

export function useGameLoop(update: Function) {
  onMounted(() => {
    function gameLoop() {
      update()

      requestAnimationFrame(gameLoop)
    }

    requestAnimationFrame(gameLoop)
  })
}
