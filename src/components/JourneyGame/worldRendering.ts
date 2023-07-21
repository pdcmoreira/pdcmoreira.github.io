import { computed, type Ref } from 'vue'
import { getTileInfoByIndex } from './utilities/tileRendering'
import { world, exteriors, tilesetUrl } from './utilities/worldLoader'

export function useWorldRendering(playerTop: Ref<number>, playerLeft: Ref<number>) {
  // Window
  // TODO: update on resize
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  // Tileset

  const columns = exteriors.imagewidth / exteriors.tilewidth

  // World

  const worldWidthPx = world.width * world.tilewidth
  const worldHeightPx = world.height * world.tileheight

  const mapStyle = computed(() => ({
    top: windowHeight / 2 - playerTop.value + 'px',
    left: windowWidth / 2 - playerLeft.value + 'px'
  }))

  // Tiles

  const tileBackground = `url(${tilesetUrl}) 0px 0px no-repeat`

  const tileInfoByIndex = getTileInfoByIndex(
    exteriors.tilecount,
    columns,
    world.tilewidth,
    world.tileheight
  )

  return {
    world,
    columns,
    mapStyle,
    tileBackground,
    tileInfoByIndex
  }
}
