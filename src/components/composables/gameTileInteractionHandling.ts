import { watch, type Ref } from 'vue'
import { getExperience } from '@/utilities/gameWorkExperienceLoader'
import type { BooleanDictionary, Interaction } from '@/types'

export function useGameTileInteractionHandling(
  currentTileInteraction: Ref<Interaction | null>,
  visitedCompanies: BooleanDictionary,
  openPopup: (messages: string | string[], title?: string | null) => void,
  closePopup: () => void
) {
  let lastTileInteraction: Interaction | null = null

  const handleEnterCompany = (interactionName: string) => {
    const experience = getExperience(interactionName)

    if (!experience) {
      return
    }

    openPopup(experience.messages, experience.name)
  }

  const handleLeaveCompany = (interactionName: string) => {
    closePopup()

    if (visitedCompanies[interactionName] === undefined) {
      return
    }

    visitedCompanies[interactionName] = true
  }

  const interactionHandlingMap: {
    [key: string]: [
      enter: (interactionName: string) => void,
      leave: (interactionName: string) => void
    ]
  } = { company: [handleEnterCompany, handleLeaveCompany] }

  watch(currentTileInteraction, (currentTileInteraction) => {
    const interaction = currentTileInteraction || lastTileInteraction

    if (!interaction) {
      return
    }

    interactionHandlingMap[interaction.type]?.[currentTileInteraction ? 0 : 1]?.(interaction.name)

    lastTileInteraction = currentTileInteraction || null
  })
}
