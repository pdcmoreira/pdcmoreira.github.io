import type { ComputedRef, Ref } from 'vue'
import { world } from './worldLoader'
import { getIndexFromPixels } from './positionCalculations'

const movementSpeed = 3

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
  movementX: ComputedRef<number>,
  movementY: ComputedRef<number>,
  lastActivatedAxis: Ref<'x' | 'y' | null>
) {
  const walkableTiles = getWalkableTiles()

  // Movement state per axis
  const axisMovement = {
    x: {
      playerPixels: playerLeft,
      movement: movementX,
      lastMovement: 0,
      movementSize: world.tilewidth
    },

    y: {
      playerPixels: playerTop,
      movement: movementY,
      lastMovement: 0,
      movementSize: world.tileheight
    }
  }

  let targetAxis: 'x' | 'y' | null = null

  let targetPixels: number | null = null

  const resolvePriority = (): ['x', 'y'] | ['y', 'x'] =>
    lastActivatedAxis.value === 'y' ? ['y', 'x'] : ['x', 'y']

  const updateMovement = () => {
    // Always keep lastMovement up to date
    ;(['x', 'y'] as ['x', 'y']).forEach((axis) => {
      axisMovement[axis].lastMovement =
        axisMovement[axis].movement.value || axisMovement[axis].lastMovement
    })

    // Resolve movement target
    resolvePriority().forEach((axis) => {
      if (targetAxis || !axisMovement[axis].movement.value) {
        return
      }

      targetPixels = getTargetPixels(
        axisMovement[axis].playerPixels.value,
        axisMovement[axis].lastMovement,
        axisMovement[axis].movementSize
      )

      if (
        targetPixels !== null &&
        walkableTiles[
          getIndexFromPixels(
            axis === 'x' ? targetPixels : axisMovement.x.playerPixels.value,
            axis === 'y' ? targetPixels : axisMovement.y.playerPixels.value,
            world.tilewidth,
            world.tileheight,
            world.width
          )
        ]
      ) {
        targetAxis = axis
      }
    })

    // Execute movement
    if (targetAxis && targetPixels !== null) {
      axisMovement[targetAxis].playerPixels.value +=
        axisMovement[targetAxis].lastMovement * movementSpeed

      if (
        isMovementComplete(
          axisMovement[targetAxis].playerPixels.value,
          targetPixels,
          axisMovement[targetAxis].lastMovement
        )
      ) {
        axisMovement[targetAxis].playerPixels.value = targetPixels

        targetAxis = null
        targetPixels = null
      }
    }
  }

  return { updateMovement }
}
