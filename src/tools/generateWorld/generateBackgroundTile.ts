import type { World } from '@/types'
import { getTileImageDataFromIndex, getTileSet2D, tileSet } from './tileset'
import { copyPixels, createImage2D } from './images'
import { writePublicPng } from './files'

const backgroundTileId = 663

const backgroundTilePath = 'game/tile-bg.png'

export const generateBackgroundTile = async (world: World) => {
  const tile2D = createImage2D(world.tileWidthPx, world.tileHeightPx)

  const tileSet2D = await getTileSet2D()

  const tileImageData = getTileImageDataFromIndex(
    tileSet2D,
    backgroundTileId,
    tileSet.columns,
    world.tileWidthPx,
    world.tileHeightPx
  )

  copyPixels(tile2D, 0, 0, tileImageData)

  writePublicPng(backgroundTilePath, tile2D)

  return `/${backgroundTilePath}`
}
