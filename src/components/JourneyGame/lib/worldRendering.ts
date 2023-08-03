import { computed, ref, watch, type Ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { copyPixels, createImage2D } from './canvas'
import { world, exteriors, tilesetUrl } from './worldLoader'
import { getTileImageDataFromIndex, loadTileSet2D } from './tileset'
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

const preRenderLayerImages = (
  tileSet2D: CanvasRenderingContext2D,
  tileSetColumns: number,
  worldColumns: number,
  worldWidthPx: number,
  worldHeightPx: number
) => {
  const layerImages: string[] = []

  world.layers.forEach((layer) => {
    // Ignore non-tile and utility layers
    if (layer.type !== 'tilelayer' || !layer.data || layer.class === 'utility') {
      return
    }

    const layer2D = createImage2D(worldWidthPx, worldHeightPx, true)

    for (let i = 0; i < layer.data.length; i++) {
      const tileImageData = getTileImageDataFromIndex(
        tileSet2D,
        layer.data[i],
        tileSetColumns,
        world.tilewidth,
        world.tileheight
      )

      const pixelPosition = getPixelsFromIndex(
        i + 1, // Index is 1-based
        worldColumns,
        world.tilewidth,
        world.tileheight
      )

      copyPixels(layer2D, ...pixelPosition, tileImageData)
    }

    layerImages.push(layer2D.canvas.toDataURL())
  })

  return layerImages
}

export function useWorldRendering(playerTop: Ref<number>, playerLeft: Ref<number>) {
  // Window
  // TODO: update on resize
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  // Tileset

  const tileSetColumns = exteriors.columns

  // World

  // TODO: these could go into the worldLoader module

  const worldColumns = world.width

  const worldWidthPx = world.width * world.tilewidth
  const worldHeightPx = world.height * world.tileheight

  // Pre-render world layers

  const { state: tileSet2D, isLoading: isLoadingTileSet2D } = useAsyncState(
    loadTileSet2D(tilesetUrl),
    null
  )

  const layerImages = ref<string[]>([])

  watch(tileSet2D, (value) => {
    if (!value) {
      return
    }

    layerImages.value = preRenderLayerImages(
      value,
      tileSetColumns,
      worldColumns,
      worldWidthPx,
      worldHeightPx
    )
  })

  const worldBackgroundCss = computed(() =>
    tileSet2D.value
      ? `url(${getBackgroundTileDataUrl(tileSet2D.value, tileSetColumns)}) 0px 0px repeat`
      : null
  )

  const mapStyle = computed(() => ({
    top: windowHeight / 2 - playerTop.value + 'px',
    left: windowWidth / 2 - playerLeft.value + 'px',
    width: worldWidthPx + 'px',
    height: worldHeightPx + 'px'
  }))

  const isLoading = computed(() => isLoadingTileSet2D.value || !layerImages.value.length)

  return {
    isLoading,
    worldBackgroundCss,
    mapStyle,
    layerImages
  }
}
