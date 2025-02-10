import type { Interaction, World } from '@/types'
import type { TiledLayer, TiledWorld } from './tiledTypes'
import { getWalkableTiles } from './getWalkableTiles'
import { getInteractionTiles } from './getInteractionTiles'
import { worldPath } from './assetsPaths'
import { readJsonAssetFile } from './files'
import { isImageLayer } from './imageLayer'

const processLayers = (
  layers: TiledLayer[],
  tileWidthPx: number,
  tileHeightPx: number,
  columns: number
) => {
  const imageLayers = [] as TiledLayer[]

  let walkableTiles = {} as { [key: number]: boolean }

  let interactions = {} as { [key: number]: Interaction }

  layers.forEach((layer) => {
    if (layer.name === 'WalkablePath') {
      walkableTiles = getWalkableTiles(layer)

      return
    }

    if (layer.name === 'Interactions') {
      interactions = getInteractionTiles(layer, tileWidthPx, tileHeightPx, columns)

      return
    }

    // Ignore non-image and utility layers
    if (!isImageLayer(layer)) {
      return
    }

    imageLayers.push(layer)
  })

  return { imageLayers, walkableTiles, interactions }
}

export const processWorld = (): { world: World; imageLayers: TiledLayer[] } => {
  const {
    tilewidth: tileWidthPx,
    tileheight: tileHeightPx,
    width,
    height,
    layers
  } = readJsonAssetFile<TiledWorld>(worldPath)

  const widthPx = width * tileWidthPx

  const heightPx = height * tileHeightPx

  const columns = width

  const { imageLayers, walkableTiles, interactions } = processLayers(
    layers,
    tileWidthPx,
    tileHeightPx,
    columns
  )

  return {
    world: {
      widthPx,
      heightPx,
      tileWidthPx,
      tileHeightPx,
      columns,
      backgroundTileUrl: null,
      layersUrls: [],
      walkableTiles,
      interactions
    },

    imageLayers
  }
}
