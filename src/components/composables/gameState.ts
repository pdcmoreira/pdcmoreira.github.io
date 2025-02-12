import { reactive, ref } from 'vue'
import type { BooleanDictionary, Interaction } from '@/types'
import { workExperience } from '@/utilities/gameWorkExperienceLoader'
import { initialPlayerTilePosition } from '@/gameSettings'
import { world } from '@/utilities/gameWorldLoader'

export const getInitialPlayerPosition = (): [x: number, y: number] => {
  const [x, y] = initialPlayerTilePosition

  return [x * world.tileWidthPx, y * world.tileHeightPx]
}

export const getVisitedCompaniesInitialState = () =>
  Object.keys(workExperience).reduce((result, interactionName) => {
    result[interactionName] = false

    return result
  }, {} as BooleanDictionary)

export function useGameState() {
  // Player position relative to the world
  const playerLeft = ref(0)
  const playerTop = ref(0)

  const visitedCompanies = reactive(getVisitedCompaniesInitialState())

  const currentTileInteraction = ref<Interaction | null>(null)

  const resetPlayer = () => {
    const [x, y] = getInitialPlayerPosition()

    playerLeft.value = x
    playerTop.value = y
  }

  const resetVisitedCompanies = () => {
    Object.assign(visitedCompanies, getVisitedCompaniesInitialState())
  }

  const reset = () => {
    resetPlayer()
    resetVisitedCompanies()
  }

  reset()

  return {
    playerLeft,
    playerTop,
    visitedCompanies,
    currentTileInteraction,
    resetPlayer,
    resetVisitedCompanies,
    reset
  }
}
