export type MovementAction = 'moveLeft' | 'moveDown' | 'moveRight' | 'moveUp'

export type TriggerActions = 'main'

export type Action = MovementAction | TriggerActions

export type KeyMap = { [key in Action]: string[] }

export type FlatKeyMap = { [key: string]: Action }

export type Direction = 1 | -1

export type DirectionOrStationary = Direction | 0

export type Axis = 'x' | 'y'

export type NullableAxis = Axis | null

export type AnimationFrames = [x: number, y: number, length: number]

export type AnimationMap = {
  [key: string]: {
    [key in Axis]: {
      '-1': AnimationFrames

      1: AnimationFrames
    }
  }
}

export type Interaction = {
  name: string
  type: string
}

export type BooleanDictionary = {
  [key: string]: boolean
}
