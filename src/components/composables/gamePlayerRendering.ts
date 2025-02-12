import { computed, ref, type Ref } from 'vue'
import type { CharacterInfo, Axis, Direction, DirectionOrStationary, NullableAxis } from '@/types'
import { getPixelsFromPosition } from '@/utilities/positionCalculations'
import { world } from '@/utilities/gameWorldLoader'
import playerTileSetUrl from '@/assets/game/character_tileset.png'
import characterInfo from '@/assets/game/character_info.json'

const {
  width: widthPixels,
  height: heightPixels,
  frameDuration,
  animationMap
} = characterInfo as unknown as CharacterInfo

const getAnimationFrames = (axis: Axis, direction: Direction, animation: string) =>
  animationMap[animation][axis][direction]

export function useGamePlayerRendering(
  playerLeft: Ref<number>,
  playerTop: Ref<number>,
  axis: Ref<NullableAxis>,
  direction: Ref<DirectionOrStationary>
) {
  const movementAxis = ref<Axis>('y')

  const movementDirection = ref<Direction>(1)

  const animationFrames = computed(() => {
    const [x, y, length] = getAnimationFrames(
      movementAxis.value,
      movementDirection.value,
      axis.value ? 'moving' : 'standing'
    )

    const [xPixels, yPixels] = getPixelsFromPosition(x, y, widthPixels, heightPixels)

    return { x: xPixels, y: yPixels, length }
  })

  const playerStyle = computed(() => {
    // playerTop and playerLeft refer to the player's "effective tile" position, for all calculation
    // purposes, but visually we place the player's "feet" in that tile and let the rest of his body
    // be wherever above it. So we need the visual rendering to be a bit offset.

    return {
      top: `${playerTop.value - heightPixels + world.tileHeightPx}px`,

      left: `${playerLeft.value}px`,

      'background-position': `${-animationFrames.value.x}px ${-animationFrames.value.y}px`,

      animation: `player-sprite ${frameDuration}ms steps(${animationFrames.value.length}) infinite`
    }
  })

  const playerSpriteAnimation = computed(() => ({
    from: `${-animationFrames.value.x}px ${-animationFrames.value.y}px`,

    to: `${-(
      animationFrames.value.x +
      widthPixels * animationFrames.value.length
    )}px ${-animationFrames.value.y}px`
  }))

  const updatePlayer = () => {
    if (axis.value && direction.value) {
      movementAxis.value = axis.value

      movementDirection.value = direction.value
    }
  }

  return {
    playerTileSetUrl,
    playerWidthCss: `${widthPixels}px`,
    playerHeightCss: `${heightPixels}px`,
    playerBackgroundCss: `url(${playerTileSetUrl}) 0px 0px no-repeat`,
    playerStyle,
    playerSpriteAnimation,
    updatePlayer
  }
}
