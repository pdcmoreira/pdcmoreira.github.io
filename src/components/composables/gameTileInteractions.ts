import { ref, type Ref } from 'vue'
import { world, findLayer } from '@/utilities/gameWorldLoader'
import { getIndexFromPixels } from '@/utilities/positionCalculations'
import type { Interaction } from '@/types'

const getInteractionTiles = () => {
  const interactions = findLayer('Interactions')?.objects || []

  if (!interactions.length) {
    return {}
  }

  return interactions.reduce((result, { x, y, name, type }) => {
    const index = getIndexFromPixels(x, y, world.tilewidth, world.tileheight, world.width)

    result[index] = {
      name,
      type
    }

    return result
  }, {} as { [key: number]: Interaction })
}

export function useGameTileInteractions(playerLeft: Ref<number>, playerTop: Ref<number>) {
  const interactionTiles = getInteractionTiles()

  const currentTileInteraction = ref<Interaction | null>(null)

  const updateTileInteractions = () => {
    const index = getIndexFromPixels(
      playerLeft.value,
      playerTop.value,
      world.tilewidth,
      world.tileheight,
      world.width
    )

    currentTileInteraction.value = interactionTiles[index] || null
  }

  return { updateTileInteractions, currentTileInteraction }
}
