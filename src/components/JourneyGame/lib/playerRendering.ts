import { computed, ref, type Ref } from 'vue'
import tilesetUrl from '../assets/character_tileset.png'
import type { AnimationMap, Axis, Direction, DirectionOrStationary, NullableAxis } from '@/types'
import { getPixelsFromPosition } from './positionCalculations'
import { world } from './worldLoader'

const widthPixels = 32
const heightPixels = 64
const frameDuration = 500

// Some basic manually-made animation map, based on the tileset image
const playerAnimationMap: AnimationMap = {
  standing: {
    x: {
      '-1': [2, 0, 1],
      1: [0, 0, 1]
    },

    y: {
      '-1': [1, 0, 1],
      1: [3, 0, 1]
    }
  },

  moving: {
    x: {
      '-1': [12, 2, 6],
      1: [0, 2, 6]
    },

    y: {
      '-1': [6, 2, 6],
      1: [18, 2, 6]
    }
  }
}

const getAnimationFrames = (axis: Axis, direction: Direction, animation: string) =>
  playerAnimationMap[animation][axis][direction]

export function usePlayerRendering(
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
      top: `${playerTop.value - heightPixels + world.tileheight}px`,

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
    playerWidthCss: `${widthPixels}px`,
    playerHeightCss: `${heightPixels}px`,
    playerBackgroundCss: `url(${tilesetUrl}) 0px 0px no-repeat`,
    playerStyle,
    playerSpriteAnimation,
    updatePlayer
  }
}
