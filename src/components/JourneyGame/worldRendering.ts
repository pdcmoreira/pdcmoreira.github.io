import { computed, type Ref } from 'vue'

// TODO: load dynamically
import world from './assets/world.json'
import exteriors from './assets/exteriors.json'
import tilesetUrl from './assets/exteriors_tileset.png'

const getMatrixCoordinates = (index: number, cols: number): [number, number] => [
  Math.floor(index / cols),
  (index % cols) - 1
]

const getPixelCoordinates = (
  row: number,
  col: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [col * tileWidth, row * tileHeight]

const getPixelCoordinatesByIndex = (
  index: number,
  cols: number,
  tileWidth: number,
  tileHeight: number
) => getPixelCoordinates(...getMatrixCoordinates(index, cols), tileWidth, tileHeight)

const getPixelBackgroundPositionByIndex = (
  index: number,
  cols: number,
  tileWidth: number,
  tileHeight: number
) => {
  const [x, y] = getPixelCoordinatesByIndex(index, cols, tileWidth, tileHeight)

  return `${-x}px ${-y}px`
}

const getTileBackgroundPositionByIndex = (tileCount: number, cols: number) => {
  const result: { [key: number]: string } = {}

  for (let i = 0; i < tileCount; i++) {
    result[i] = getPixelBackgroundPositionByIndex(
      i,
      cols,
      exteriors.tilewidth,
      exteriors.tileheight
    )
  }

  return result
}

export function useWorldRendering(playerTop: Ref<number>, playerLeft: Ref<number>) {
  // Window
  // TODO: update on resize
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  // Tileset

  const cols = exteriors.imagewidth / exteriors.tilewidth

  // World

  const worldWidthPx = world.width * world.tilewidth
  const worldHeightPx = world.height * world.tileheight

  const mapStyle = computed(() => ({
    top: windowHeight / 2 - playerTop.value + 'px',
    left: windowWidth / 2 - playerLeft.value + 'px'
  }))

  // Tiles

  const tileBackground = `url(${tilesetUrl}) 0px 0px no-repeat`

  const tileBackgroundPositionByIndex = getTileBackgroundPositionByIndex(exteriors.tilecount, cols)

  for (let i = 0; i < exteriors.tilecount; i++) {
    tileBackgroundPositionByIndex[i] = getPixelBackgroundPositionByIndex(
      i,
      cols,
      exteriors.tilewidth,
      exteriors.tileheight
    )
  }

  return {
    world,
    mapStyle,
    tileBackground,
    tileBackgroundPositionByIndex
  }
}
