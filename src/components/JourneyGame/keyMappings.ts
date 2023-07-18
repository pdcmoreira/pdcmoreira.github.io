import type { KeyMap } from './types'
import type { Action, FlatKeyMap } from './types'

export const keyMappings: KeyMap = {
  moveLeft: ['a', 'A', 'ArrowLeft'],
  moveDown: ['s', 'S', 'ArrowDown'],
  moveRight: ['d', 'D', 'ArrowRight'],
  moveUp: ['w', 'W', 'ArrowUp'],
  main: [' ', 'Enter']
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
