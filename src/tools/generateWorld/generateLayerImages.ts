import type { CanvasRenderingContext2D } from 'canvas'
import type { TiledLayer } from './tiledTypes'
import type { World } from '@/types'
import { getTileImageDataFromIndex, getTileSet2D, tileSet } from './tileset'
import { getPixelsFromIndex } from '@/utilities/positionCalculations'
import { isImageLayer } from './imageLayer'
import { copyPixels, createImage2D } from './images'
import { writePublicPng } from './files'

const generateLayerImage = (
  world: World,
  layer: TiledLayer,
  tileSet2D: CanvasRenderingContext2D,
  tileSetColumns: number
) => {
  if (!layer.data) {
    return null
  }

  const layer2D = createImage2D(world.widthPx, world.heightPx)

  // Process layer tiles
  for (let i = 0; i < layer.data.length; i++) {
    const tileImageData = getTileImageDataFromIndex(
      tileSet2D,
      layer.data[i],
      tileSetColumns,
      world.tileWidthPx,
      world.tileHeightPx
    )

    const pixelPosition = getPixelsFromIndex(
      i + 1, // Index is 1-based
      world.columns,
      world.tileWidthPx,
      world.tileHeightPx
    )

    copyPixels(layer2D, ...pixelPosition, tileImageData)
  }

  return layer2D
}

const getImagePath = (index: number) => `game/layer-${index}.png`

export const generateLayerImages = async (world: World, layers: TiledLayer[]) => {
  const tileSet2D = await getTileSet2D()

  return (
    layers
      // Ensure it's an image layer
      .filter((layer) => isImageLayer(layer))
      .map((layer) => generateLayerImage(world, layer, tileSet2D, tileSet.columns))
      // Filter out any image that couldn't be generated
      .filter((layerImage) => !!layerImage)
      .map((layerImage, index) => {
        const imagePath = getImagePath(index)

        writePublicPng(imagePath, layerImage)

        return imagePath
      })
  )
}
