import { computed, type Ref, type CSSProperties } from 'vue'
import { world } from '@/utilities/gameWorldLoader'
import { useWindowSize } from './windowSize'

export function useGameWorldRendering(playerTop: Ref<number>, playerLeft: Ref<number>) {
  const { windowWidth, windowHeight } = useWindowSize()

  const mapStyle = computed<CSSProperties>(() => ({
    left: windowWidth.value / 2 - playerLeft.value + 'px',
    top: windowHeight.value / 2 - playerTop.value + 'px',
    width: world.widthPx + 'px',
    height: world.heightPx + 'px'
  }))

  const backgroundTileUrl = world.backgroundTileUrl

  const worldBackgroundCss = computed(() =>
    backgroundTileUrl ? `url(${backgroundTileUrl}) 0px 0px repeat` : null
  )

  const layersUrls = computed(() => world.layersUrls)

  return {
    mapStyle,
    worldBackgroundCss,
    backgroundTileUrl,
    layersUrls
  }
}
