import { computed, type CSSProperties } from 'vue'
import { world } from '@/utilities/gameWorldLoader'
import { useWindowSize } from './windowSize'

// Roughly the ideal number of tiles to show
const targetTiles = 20

// Min/max scale values, to not allow the game to get too small or too big

const minScale = 0.6

const maxScale = 1

export function useElementScaling() {
  const { windowWidth } = useWindowSize()

  const scale = computed(() => {
    // Calculate what would be the ideal width
    const targetWidthPx = targetTiles * world.tileWidthPx

    // Calculate the scale needed to achieve that width
    const scaleFactor = windowWidth.value / targetWidthPx

    // Adjust the scale to fit between min and max
    return Math.max(minScale, Math.min(maxScale, scaleFactor))
  })

  const scalingStyle = computed<CSSProperties>(() => ({ transform: `scale(${scale.value})` }))

  return {
    scale,
    scalingStyle
  }
}
