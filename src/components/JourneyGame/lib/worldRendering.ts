import { computed, type Ref } from 'vue'
import { world, exteriors, tilesetUrl } from './worldLoader'
import { copyPixels, createImage2D, getTileImageDataFromIndex, loadTileSet2D } from './tileset'
import { getPixelsFromIndex } from './positionCalculations'

const backgroundTileId = 663

const getBackgroundTileDataUrl = (tileSet2D: CanvasRenderingContext2D, tileSetColumns: number) => {
  const tile2D = createImage2D(world.tilewidth, world.tileheight)

  const tileImageData = getTileImageDataFromIndex(
    tileSet2D,
    backgroundTileId,
    tileSetColumns,
    world.tilewidth,
    world.tileheight
  )

  copyPixels(tile2D, 0, 0, tileImageData)

  return tile2D.canvas.toDataURL()
}

export async function useWorldRendering(playerTop: Ref<number>, playerLeft: Ref<number>) {
  // Window
  // TODO: update on resize
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  // Tileset

  // TODO: rename to tileset columns
  const columns = exteriors.columns // exteriors.imagewidth / exteriors.tilewidth

  // World

  const worldColumns = world.width

  const worldWidthPx = world.width * world.tilewidth
  const worldHeightPx = world.height * world.tileheight

  // Pre-render world layers

  const tileSet2D = await loadTileSet2D(tilesetUrl)

  const worldBackgroundTileDataUrl = getBackgroundTileDataUrl(tileSet2D, columns)

  const mapStyle = computed(() => ({
    top: windowHeight / 2 - playerTop.value + 'px',
    left: windowWidth / 2 - playerLeft.value + 'px',
    width: worldWidthPx + 'px',
    height: worldHeightPx + 'px'
  }))

  const processedLayers: {
    layer2D: CanvasRenderingContext2D
    dataUrl: string
  }[] = []

  world.layers.forEach((layer) => {
    if (layer.name === 'WalkablePath') {
      return // Don't render this layer
    }

    const layer2D = createImage2D(worldWidthPx, worldHeightPx)

    for (let i = 0; i < layer.data.length; i++) {
      const tileImageData = getTileImageDataFromIndex(
        tileSet2D,
        layer.data[i],
        columns,
        world.tilewidth,
        world.tileheight
      )

      const pixelPosition = getPixelsFromIndex(i, worldColumns, world.tilewidth, world.tileheight)

      copyPixels(layer2D, ...pixelPosition, tileImageData)
    }

    processedLayers.push({
      layer2D,
      dataUrl: layer2D.canvas.toDataURL()
    })
  })

  return {
    world,
    columns,
    worldBackgroundTileDataUrl,
    mapStyle,
    processedLayers
  }
}
