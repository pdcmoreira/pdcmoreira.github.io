import type { TiledLayer } from './tiledTypes'

export const getWalkableTiles = (layer: TiledLayer) => {
  if (!layer?.data) {
    return {}
  }

  return layer.data.reduce((result, value, index) => {
    if (value) {
      // Index is 1-based
      result[index + 1] = true
    }

    return result
  }, {} as { [key: number]: boolean })
}
