import { computed, ref, watch, type Ref } from 'vue'
import { flatKeyMap } from './keyMappings'
import type { Action, NullableAxis, DirectionOrStationary } from '@/types'

const ensureDirectionValue = (value: number) =>
  ([0, 1, -1].includes(value) ? value : 0) as DirectionOrStationary

export function useActiveKeyActions(activeKeys: Ref<string[]>) {
  const activeActions = computed(() => activeKeys.value.map((key) => flatKeyMap[key]))

  const getActiveValue = <T>(action: Action, activeValue: T, inactiveValue: T) =>
    activeActions.value.includes(action) ? activeValue : inactiveValue

  const movementX = computed(() =>
    ensureDirectionValue(getActiveValue('moveLeft', -1, 0) + getActiveValue('moveRight', 1, 0))
  )

  const movementY = computed(() =>
    ensureDirectionValue(getActiveValue('moveUp', -1, 0) + getActiveValue('moveDown', 1, 0))
  )

  const lastActivatedAxis = ref<NullableAxis>(null)

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
