export type TiledWorld = {
  tilewidth: number
  tileheight: number
  width: number
  height: number
  layers: TiledLayer[]
}

export type TiledTileSet = {
  columns: number
}

export type TiledLayer = {
  name: string
  type: string
  class?: string
  data?: number[]
  objects?: InteractionLayerObject[]
}

export type InteractionLayerObject = { x: number; y: number; name: string; type: string }
