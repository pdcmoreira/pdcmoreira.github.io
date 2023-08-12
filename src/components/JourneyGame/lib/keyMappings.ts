import type { Action, KeyMap, FlatKeyMap } from '@/types'

export const keyMappings: KeyMap = {
  moveLeft: ['a', 'A', 'ArrowLeft', 'DPadLeft'],
  moveDown: ['s', 'S', 'ArrowDown', 'DPadDown'],
  moveRight: ['d', 'D', 'ArrowRight', 'DPadRight'],
  moveUp: ['w', 'W', 'ArrowUp', 'DPadUp']
}

// Process key mappings into a flat map

export const flatKeyMap: FlatKeyMap = {}
;(Object.keys(keyMappings) as Action[]).forEach((action) => {
  Object.assign(
    flatKeyMap,

    keyMappings[action].reduce((accumulator: typeof flatKeyMap, key): typeof flatKeyMap => {
      accumulator[key] = action

      return accumulator
    }, {} as typeof flatKeyMap)
  )
})
