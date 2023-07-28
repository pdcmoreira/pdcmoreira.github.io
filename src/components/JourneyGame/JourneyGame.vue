<script setup lang="ts">
import { onMounted, ref, type ComputedRef, computed } from 'vue'
import { useKeyDetection } from './lib/keyDetection'
import { useActiveKeyActions } from './lib/activeKeyActions'
import { useWorldRendering } from './worldRendering'
import { getIndexFromPixels, getPositionFromPixels } from './lib/positionCalculations'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY, lastActivatedAxis } = useActiveKeyActions(pressedKeys.value)

let debugEnabled = ref(true)

let loading = ref(true)

const playerWidth = 32
const playerHeight = 32
const movementSpeed = 3

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(51 * 32)
let playerLeft = ref(27 * 32)

let worldBackgroundCss: string | null = null

let worldMapStyle:
  | ComputedRef<{
      top: string
      left: string
    }>
  | undefined = undefined

let layerImages: string[] = []

let currentTile = ref<number | null>(null)

let playerX = 0
let playerY = 0

// TODO: extract composable with debug stuff
let debugPlayerX = ref(0)
let debugPlayerY = ref(0)

const debugPlayerPosition = computed(
  () => `${debugPlayerX.value}, ${debugPlayerY.value} (${playerLeft.value}px, ${playerTop.value}px)`
)

const getTargetPixels = (startPixels: number, direction: number, tileSize: number) =>
  direction
    ? (direction > 0 ? Math.floor : Math.ceil)((startPixels + tileSize * direction) / tileSize) *
      tileSize
    : null

const isMovementComplete = (currentPixels: number, targetPixels: number, direction: number) =>
  currentPixels === targetPixels ||
  (direction < 0 && targetPixels > currentPixels) ||
  (direction > 0 && targetPixels < currentPixels)

onMounted(async () => {
  const { world, worldBackgroundTileDataUrl, mapStyle, processedLayers, walkableTiles } =
    await useWorldRendering(playerTop, playerLeft)

  worldBackgroundCss = `url(${worldBackgroundTileDataUrl}) 0px 0px repeat`

  worldMapStyle = mapStyle

  layerImages = processedLayers.map((layer) => layer.dataUrl)

  loading.value = false

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

  const movementTarget: {
    axis: 'x' | 'y' | null
    pixels: number | null
  } = {
    axis: null,
    pixels: null
  }

  function gameLoop() {
    // TODO:
    // maybe abstract the gameLoop setup
    // extract stuff by purpose
    // remove new var declarations here

    // TODO: maybe should go with player mid point instead?
    // getCollidingPositionFromPixels
    ;[playerX, playerY] = getPositionFromPixels(
      playerLeft.value,
      playerTop.value,
      world.tilewidth,
      world.tileheight
    )

    if (debugEnabled.value) {
      debugPlayerX.value = playerX
      debugPlayerY.value = playerY
    }

    // Always keep lastMovement up to date
    ;(['x', 'y'] as ['x', 'y']).forEach((axis) => {
      axisMovement[axis].lastMovement =
        axisMovement[axis].movement.value || axisMovement[axis].lastMovement
    })

    const resolvePriority = (): ['x', 'y'] | ['y', 'x'] =>
      lastActivatedAxis.value === 'y' ? ['y', 'x'] : ['x', 'y']

    // Process movementTarget
    resolvePriority().forEach((axis) => {
      if (movementTarget.axis || !axisMovement[axis].movement.value) {
        return
      }

      movementTarget.pixels = getTargetPixels(
        axisMovement[axis].playerPixels.value,
        axisMovement[axis].lastMovement,
        axisMovement[axis].movementSize
      )

      if (
        movementTarget.pixels !== null &&
        walkableTiles[
          getIndexFromPixels(
            axis === 'x' ? movementTarget.pixels : axisMovement.x.playerPixels.value,
            axis === 'y' ? movementTarget.pixels : axisMovement.y.playerPixels.value,
            world.tilewidth,
            world.tileheight,
            world.width
          )
        ]
      ) {
        movementTarget.axis = axis
      }
    })

    // Execute movement

    if (movementTarget.axis && movementTarget.pixels !== null) {
      axisMovement[movementTarget.axis].playerPixels.value +=
        axisMovement[movementTarget.axis].lastMovement * movementSpeed

      if (
        isMovementComplete(
          axisMovement[movementTarget.axis].playerPixels.value,
          movementTarget.pixels,
          axisMovement[movementTarget.axis].lastMovement
        )
      ) {
        axisMovement[movementTarget.axis].playerPixels.value = movementTarget.pixels

        movementTarget.axis = null
        movementTarget.pixels = null
      }
    }

    currentTile.value = getIndexFromPixels(
      playerLeft.value,
      playerTop.value,
      world.tilewidth,
      world.tileheight,
      world.width
    )

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
})
</script>

<template>
  <div v-if="!loading" class="journey-game">
    <div class="map" :style="worldMapStyle">
      <div class="layers-container">
        <div
          v-for="(image, index) in layerImages"
          :key="index"
          class="layer"
          :style="{ 'z-index': index, background: `url(${image}) 0px 0px no-repeat` }"
        />
      </div>

      <div
        class="player"
        :style="{
          top: playerTop + 'px',
          left: playerLeft + 'px'
        }"
      />
    </div>

    <div v-if="debugEnabled" class="debug">
      <pre>Player movement: {{ movementX }}, {{ movementY }}</pre>

      <pre>Player position: {{ debugPlayerPosition }}</pre>

      <pre>Current tile: {{ currentTile }}</pre>

      <pre>{{ pressedKeys.join(', ') || 'No keys being pressed.' }}</pre>
    </div>
  </div>

  <div v-else>Loading...</div>
</template>

<style lang="less" scoped>
.journey-game {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: v-bind(worldBackgroundCss);

  .map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .layers-container {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      .layer {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }

  .player {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background: red;
    z-index: 2;
  }

  .debug {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;
  }
}
</style>
