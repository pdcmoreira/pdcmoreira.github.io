import type { Action, KeyMap, FlatKeyMap } from '@/types'

export const keyMappings: KeyMap = {
  moveLeft: ['a', 'A', 'ArrowLeft', 'DPadLeft'],
  moveDown: ['s', 'S', 'ArrowDown', 'DPadDown'],
  moveRight: ['d', 'D', 'ArrowRight', 'DPadRight'],
  moveUp: ['w', 'W', 'ArrowUp', 'DPadUp']
}

export const flatKeyMap: FlatKeyMap = {}

// Process key mappings into a flat map
;(Object.keys(keyMappings) as Action[]).forEach((action) => {
  Object.assign(
    flatKeyMap,

    keyMappings[action].reduce((accumulator, key): FlatKeyMap => {
      accumulator[key] = action

      return accumulator
    }, {} as FlatKeyMap)
  )
})
