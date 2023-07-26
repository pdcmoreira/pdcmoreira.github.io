<script setup lang="ts">
import { onMounted, ref, type ComputedRef } from 'vue'
import { useKeyDetection } from './keyDetection'
import { useActiveKeyActions } from './activeKeyActions'
import { useWorldRendering } from './worldRendering'
import { getCollidingIndex } from './utilities/positionCalculations'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY } = useActiveKeyActions(pressedKeys.value)

let loading = ref(true)

const playerWidth = 32
const playerHeight = 32
const movementSpeed = 8

const playerHalfWidth = playerWidth / 2
const playerHalfHeight = playerHeight / 2

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(51 * 32)
let playerLeft = ref(27 * 32)

let worldMapStyle:
  | ComputedRef<{
      top: string
      left: string
    }>
  | undefined = undefined

let layerImages: string[] = []

let lastMovementX = 0
let lastMovementY = 0

let currentTile = ref<number | null>(null)

// TODO: does this need to be reactive (besides debugging)?
let targetTile = ref<number | null>(null)

let completeMoveX = true
let completeMoveY = true

onMounted(async () => {
  const { world, columns, mapStyle, processedLayers, walkableTiles } = await useWorldRendering(
    playerTop,
    playerLeft
  )

  console.log(walkableTiles)

  worldMapStyle = mapStyle

  layerImages = processedLayers.map((layer) => layer.dataUrl)

  loading.value = false

  function gameLoop() {
    // TODO:
    // maybe abstract the gameLoop setup
    // extract stuff by purpose

    // Force movement for whole tiles

    lastMovementX = movementX.value || lastMovementX

    lastMovementY = movementY.value || lastMovementY

    completeMoveX = !(playerLeft.value % world.tilewidth)

    completeMoveY = !(playerTop.value % world.tileheight)

    // Moving intent to targetTile

    if ((completeMoveX && movementX.value) || (completeMoveY && movementY.value)) {
      targetTile.value = getCollidingIndex(
        playerLeft.value + playerHalfWidth + movementX.value * world.tilewidth,
        playerTop.value + playerHalfHeight + movementY.value * world.tileheight,
        world.tilewidth,
        world.tileheight,
        world.width
      )

      // TODO: figure out collision problems
      if (targetTile.value && !walkableTiles[targetTile.value]) {
        targetTile.value = null
      }
    }

    if (!completeMoveX || (movementX.value && targetTile.value)) {
      playerLeft.value += lastMovementX * movementSpeed
    }

    if (!completeMoveY || (movementY.value && targetTile.value)) {
      playerTop.value += lastMovementY * movementSpeed
    }

    currentTile.value = getCollidingIndex(
      playerLeft.value + playerHalfWidth,
      playerTop.value + playerHalfHeight,
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

    <div class="hud">
      <pre>Player movement: {{ movementX }} | {{ movementY }}</pre>

      <pre>Player position: {{ playerTop }} | {{ playerLeft }}</pre>

      <pre>Current tile: {{ currentTile }}</pre>

      <pre>Target tile: {{ targetTile }}</pre>

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
  background: #000;
  // background: v-bind(tileBackground);
  // background-position: v-bind(genericBackgroundPosition);

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

      // .layer {
      //   position: absolute;
      //   left: 0;
      //   top: 0;
      //   display: grid;
      //   grid-template-columns: v-bind(worldGridTemplateColumns);
      //   grid-template-rows: v-bind(worldGridTemplateRows);
      //   grid-column-gap: 0px;
      //   grid-row-gap: 0px;

      //   .tile {
      //     background: v-bind(tileBackground);
      //   }
      // }

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

  .hud {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;
  }
}
</style>
