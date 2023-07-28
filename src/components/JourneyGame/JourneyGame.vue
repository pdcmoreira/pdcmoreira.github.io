<script setup lang="ts">
import { onMounted, ref, type ComputedRef, computed } from 'vue'
import { useKeyDetection } from './lib/keyDetection'
import { useActiveKeyActions } from './lib/activeKeyActions'
import { useWorldRendering } from './lib/worldRendering'
import { getIndexFromPixels, getPositionFromPixels } from './lib/positionCalculations'
import { usePlayerMovement } from './lib/playerMovement'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY, lastActivatedAxis } = useActiveKeyActions(pressedKeys.value)

let debugEnabled = ref(true)

let loading = ref(true)

const playerWidth = 32
const playerHeight = 32

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

onMounted(async () => {
  const { world, worldBackgroundTileDataUrl, mapStyle, processedLayers } = await useWorldRendering(
    playerTop,
    playerLeft
  )

  const { updateMovement } = usePlayerMovement(
    playerLeft,
    playerTop,
    movementX,
    movementY,
    lastActivatedAxis
  )

  worldBackgroundCss = `url(${worldBackgroundTileDataUrl}) 0px 0px repeat`

  worldMapStyle = mapStyle

  layerImages = processedLayers.map((layer) => layer.dataUrl)

  loading.value = false

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

    updateMovement()

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
