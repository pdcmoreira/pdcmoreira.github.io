import { computed, ref, type Ref } from 'vue'
import { isNotNull } from '@/utilities/typeAssertions'
import { world } from './worldLoader'
import { getIndexFromPixels } from './positionCalculations'
import type { NullableAxis, DirectionOrStationary, Axis, Direction } from './types'

const movementSpeed = 3

type TargetMovement = {
  pixels: number
  axis: Axis
  direction: Direction
} | null

const getWalkableTiles = () => {
  const walkablePathLayer = world.layers.find(({ name }) => name === 'WalkablePath')

  if (!walkablePathLayer) {
    return {}
  }

  return walkablePathLayer.data.reduce((result, value, index) => {
    if (value) {
      result[index] = true
    }

    return result
  }, {} as { [key: number]: boolean })
}

const getTargetPixels = (startPixels: number, direction: number, tileSize: number) =>
  direction
    ? (direction > 0 ? Math.floor : Math.ceil)((startPixels + tileSize * direction) / tileSize) *
      tileSize
    : null

const isMovementComplete = (currentPixels: number, targetPixels: number, direction: number) =>
  currentPixels === targetPixels ||
  (direction < 0 && targetPixels > currentPixels) ||
  (direction > 0 && targetPixels < currentPixels)

export function usePlayerMovement(
  playerLeft: Ref<number>,
  playerTop: Ref<number>,
  movementX: Ref<DirectionOrStationary>,
  movementY: Ref<DirectionOrStationary>,
  lastActivatedAxis: Ref<NullableAxis>
) {
  const walkableTiles = getWalkableTiles()

  // Movement state refs per axis
  const axisMovement = {
    x: {
      playerPixels: playerLeft,
      movement: movementX,
      movementSize: world.tilewidth
    },

    y: {
      playerPixels: playerTop,
      movement: movementY,
      movementSize: world.tileheight
    }
  }

  // Resolve non-null axis priority based on the last activated one
  const axisActivation = computed(() => {
    const current: Axis = lastActivatedAxis.value || 'y'

    const other: Axis = current === 'y' ? 'x' : 'y'

    return [current, other]
  })

  // Resolve currently wanted movement based on axis priority
  const wantedMovements = computed(() =>
    axisActivation.value
      .map((axis) =>
        axisMovement[axis].movement.value
          ? { axis, direction: axisMovement[axis].movement.value as Direction }
          : null
      )
      .filter(isNotNull)
  )

  // All variables (even auxiliary) are declared outside the loopable update method, to prevent
  // multiple allocations

  let wantedTarget: TargetMovement = null

  // Auxiliary variable
  let resolvedPixels: number | null = null

  let currentTarget: TargetMovement = null

  // Output

  const movementAxis = ref<NullableAxis>(null)

  const movementDirection = ref<DirectionOrStationary>(0)

  const updateMovement = () => {
    // Resolve the first valid wanted target, from the priority-based wantedMovements
    wantedMovements.value.forEach(({ axis, direction }) => {
      // Only proceed if no other wanted movement (for a different axis) took precedence.
      if (wantedTarget) {
        return
      }

      // Get the target tile in pixels
      resolvedPixels = getTargetPixels(
        axisMovement[axis].playerPixels.value,
        direction,
        axisMovement[axis].movementSize
      )

      // Discard if the calculated target tile is not walkable
      if (
        !resolvedPixels ||
        !walkableTiles[
          getIndexFromPixels(
            axis === 'x' ? resolvedPixels : axisMovement.x.playerPixels.value,
            axis === 'y' ? resolvedPixels : axisMovement.y.playerPixels.value,
            world.tilewidth,
            world.tileheight,
            world.width
          )
        ]
      ) {
        return
      }

      wantedTarget = {
        axis,
        direction,
        pixels: resolvedPixels
      }
    })

    if (
      currentTarget &&
      isMovementComplete(
        axisMovement[currentTarget.axis].playerPixels.value,
        currentTarget.pixels,
        currentTarget.direction
      )
    ) {
      axisMovement[currentTarget.axis].playerPixels.value = currentTarget.pixels

      currentTarget = null
    }

    if (wantedTarget && (!currentTarget || currentTarget.axis === wantedTarget.axis)) {
      currentTarget = wantedTarget
    }

    // Keep output refs up to date

    movementAxis.value = currentTarget?.axis || null

    movementDirection.value = currentTarget?.direction || 0

    // Execute movement
    if (movementAxis.value && movementDirection.value) {
      axisMovement[movementAxis.value].playerPixels.value += movementDirection.value * movementSpeed
    }

    // Reset the wanted target, so it can be re-evaluated in the next iteration
    wantedTarget = null
  }

  return { updateMovement, movementAxis, movementDirection }
}
