import { computed, ref, watch } from 'vue'
import { flatKeyMap } from './keyMappings'
import type { Action } from './types'

export function useActiveKeyActions(activeKeys: string[]) {
  const activeActions = computed(() => activeKeys.map((key) => flatKeyMap[key]))

  const getActiveValue = <T>(action: Action, activeValue: T, inactiveValue: T) =>
    activeActions.value.includes(action) ? activeValue : inactiveValue

  const movementX = computed(
    () => getActiveValue('moveLeft', -1, 0) + getActiveValue('moveRight', 1, 0)
  )

  const movementY = computed(
    () => getActiveValue('moveUp', -1, 0) + getActiveValue('moveDown', 1, 0)
  )

  const lastActivatedAxis = ref<'x' | 'y' | null>(null)

  watch(movementX, (value) => {
    if (value) {
      lastActivatedAxis.value = 'x'
    }
  })

  watch(movementY, (value) => {
    if (value) {
      lastActivatedAxis.value = 'y'
    }
  })

  return { activeActions, movementX, movementY, lastActivatedAxis }
}
