import { computed, ref, type Ref } from 'vue'
import { getIndexFromPosition, getPositionFromPixels } from '@/utilities/positionCalculations'
import { world } from '@/utilities/gameWorldLoader'

export function useGameDebug(
  playerLeft: Ref<number>,
  playerTop: Ref<number>,
  movementX: Ref<number>,
  movementY: Ref<number>,
  pressedKeys: Ref<string[]>
) {
  const enabled = ref(false)

  const playerX = ref(0)
  const playerY = ref(0)
  const currentTile = ref<number | null>(null)

  const movement = computed(() => `Movement: ${movementX.value}, ${movementY.value}`)

  const position = computed(
    () =>
      `Position: ${playerX.value}, ${playerY.value} (${playerLeft.value}px, ${playerTop.value}px)`
  )

  const tile = computed(() => `Tile: ${currentTile.value}`)

  const keys = computed(() => pressedKeys.value.join(', ') || 'No keys being pressed.')

  const rows = computed(() => [movement.value, position.value, tile.value, keys.value])

  const updateDebug = () => {
    if (!enabled.value) {
      return
    }

    ;[playerX.value, playerY.value] = getPositionFromPixels(
      playerLeft.value,
      playerTop.value,
      world.tileWidthPx,
      world.tileHeightPx
    )

    currentTile.value = getIndexFromPosition(playerX.value, playerY.value, world.widthPx)
  }

  return {
    enabled,
    rows,
    updateDebug
  }
}
