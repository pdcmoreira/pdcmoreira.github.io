import { ref, type Ref } from 'vue'
import { world } from '@/utilities/gameWorldLoader'
import { getIndexFromPixels } from '@/utilities/positionCalculations'
import type { Interaction } from '@/types'

export function useGameTileInteractions(playerLeft: Ref<number>, playerTop: Ref<number>) {
  const currentTileInteraction = ref<Interaction | null>(null)

  const updateTileInteractions = () => {
    const index = getIndexFromPixels(
      playerLeft.value,
      playerTop.value,
      world.tileWidthPx,
      world.tileHeightPx,
      world.columns
    )

    currentTileInteraction.value = world.interactions[index] || null
  }

  return { updateTileInteractions, currentTileInteraction }
}
