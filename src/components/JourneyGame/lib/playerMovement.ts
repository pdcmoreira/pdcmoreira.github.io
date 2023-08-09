import { computed, ref, type Ref } from 'vue'
import { isNotNull } from '@/utilities/typeAssertions'
import { world, findLayer } from './worldLoader'
import { getIndexFromPixels } from './positionCalculations'
import type { NullableAxis, DirectionOrStationary, Axis, Direction } from './types'

const movementSpeed = 3

type TargetMovement = {
  pixels: number
  axis: Axis
  direction: Direction
} | null

const getWalkableTiles = () => {
  const walkablePathLayer = findLayer('WalkablePath')

  if (!walkablePathLayer?.data) {
    return {}
  }

  return walkablePathLayer.data.reduce((result, value, index) => {
    if (value) {
      // Index is 1-based
      result[index + 1] = true
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

  let currentTarget: TargetMovement = null

  // Auxiliary variables

  let resolvedTargetPixels: number | null = null

  // Output

  const movementAxis = ref<NullableAxis>(null)

  const movementDirection = ref<DirectionOrStationary>(0)

  const updateMovement = () => {
    // Clear the currentTarget if it has already completed
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

    // Resolve the first valid wanted target, from the priority-based wantedMovements
    wantedMovements.value.some(({ axis, direction }) => {
      // Only proceed if no other wanted movement (for a different axis) took precedence.
      // Otherwise end the loop.
      if (wantedTarget) {
        return true
      }

      // Get the target tile in pixels
      resolvedTargetPixels = getTargetPixels(
        axisMovement[axis].playerPixels.value,
        direction,
        axisMovement[axis].movementSize
      )

      // Discard if the calculated target tile is not walkable
      if (
        !resolvedTargetPixels ||
        !walkableTiles[
          getIndexFromPixels(
            axis === 'x' ? resolvedTargetPixels : axisMovement.x.playerPixels.value,
            axis === 'y' ? resolvedTargetPixels : axisMovement.y.playerPixels.value,
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
        pixels: resolvedTargetPixels
      }
    })

    // Set the current target (or change it if we're only changing direction in the same axis)
    if (wantedTarget && (!currentTarget || currentTarget.axis === wantedTarget.axis)) {
      currentTarget = wantedTarget
    }

    // Update the output refs with the actual movement that will be executed

    movementAxis.value = currentTarget?.axis || null

    movementDirection.value = currentTarget?.direction || 0

    // Execute movement
    if (movementAxis.value && movementDirection.value) {
      // Resolve what would be the final position after adding the movement speed
      resolvedTargetPixels =
        axisMovement[movementAxis.value].playerPixels.value +
        movementDirection.value * movementSpeed

      // Adjust the calculation if it goes beyond the target
      if (
        currentTarget &&
        !wantedTarget &&
        isMovementComplete(resolvedTargetPixels, currentTarget.pixels, movementDirection.value)
      ) {
        resolvedTargetPixels = currentTarget.pixels
      }

      // Update the position with the final calculation
      axisMovement[movementAxis.value].playerPixels.value = resolvedTargetPixels
    }

    // Reset the wanted target, so it can be re-evaluated in the next iteration
    wantedTarget = null
  }

  return { updateMovement, movementAxis, movementDirection }
}
