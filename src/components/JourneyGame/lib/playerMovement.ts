import { computed, ref, type Ref } from 'vue'
import { world } from './worldLoader'
import { getIndexFromPixels } from './positionCalculations'
import type { NullableAxis, DirectionOrStationary } from './types'

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
  movementX: Ref<DirectionOrStationary>,
  movementY: Ref<DirectionOrStationary>,
  lastActivatedAxis: Ref<NullableAxis>
) {
  const walkableTiles = getWalkableTiles()

  // Movement state per axis
  const axisMovement = {
    x: {
      playerPixels: playerLeft,
      movement: movementX,
      lastMovement: 0 as DirectionOrStationary,
      movementSize: world.tilewidth
    },

    y: {
      playerPixels: playerTop,
      movement: movementY,
      lastMovement: 0 as DirectionOrStationary,
      movementSize: world.tileheight
    }
  }

  const movementAxis = ref<NullableAxis>(null)

  const movementDirection = computed(() =>
    movementAxis.value ? axisMovement[movementAxis.value].lastMovement : 0
  )

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
      if (movementAxis.value || !axisMovement[axis].movement.value) {
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
        movementAxis.value = axis
      }
    })

    // Execute movement
    if (movementAxis.value && targetPixels !== null) {
      axisMovement[movementAxis.value].playerPixels.value +=
        axisMovement[movementAxis.value].lastMovement * movementSpeed

      if (
        isMovementComplete(
          axisMovement[movementAxis.value].playerPixels.value,
          targetPixels,
          axisMovement[movementAxis.value].lastMovement
        )
      ) {
        axisMovement[movementAxis.value].playerPixels.value = targetPixels

        movementAxis.value = null
        targetPixels = null
      }
    }
  }

  return { updateMovement, movementAxis, movementDirection }
}
