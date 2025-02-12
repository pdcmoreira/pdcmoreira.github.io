export type MovementAction = 'moveLeft' | 'moveDown' | 'moveRight' | 'moveUp'

export type Action = MovementAction

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

export type CharacterInfo = {
  width: number
  height: number
  frameDuration: number
  animationMap: AnimationMap
}

export type Interaction = {
  name: string
  type: string
}

export type BooleanDictionary = {
  [key: string]: boolean
}

export type Point = [x: number, y: number]

export type Triangle = [p1: Point, p2: Point, p3: Point]

export type World = {
  tileWidthPx: number
  tileHeightPx: number
  widthPx: number
  heightPx: number
  columns: number
  backgroundTileUrl: string | null
  layersUrls: string[]
  walkableTiles: { [key: number]: boolean }
  interactions: { [key: number]: Interaction }
}
