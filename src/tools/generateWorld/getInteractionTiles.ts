import type { Interaction } from '@/types'
import { getIndexFromPixels } from '@/utilities/positionCalculations'
import type { TiledLayer } from './tiledTypes'

export const getInteractionTiles = (
  layer: TiledLayer,
  tileWidthPx: number,
  tileHeightPx: number,
  columns: number
) => {
  const interactions = layer?.objects || []

  if (!interactions.length) {
    return {}
  }

  return interactions.reduce(
    (result, { x, y, name, type }) => {
      const index = getIndexFromPixels(x, y, tileWidthPx, tileHeightPx, columns)

      result[index] = {
        name,
        type
      }

      return result
    },
    {} as { [key: number]: Interaction }
  )
}
