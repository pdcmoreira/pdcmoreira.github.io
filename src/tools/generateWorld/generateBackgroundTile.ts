import type { World } from '@/types'
import { backgroundTileId, backgroundTilePublicPath } from './settings'
import { getTileImageDataFromIndex, getTileSet, getTileSet2D } from './tileset'
import { copyPixels, createImage2D } from './images'
import { writePublicPng } from './files'

export const generateBackgroundTile = async (world: World) => {
  const tileSet = getTileSet()

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

  writePublicPng(backgroundTilePublicPath, tile2D)

  return `/${backgroundTilePublicPath}`
}
