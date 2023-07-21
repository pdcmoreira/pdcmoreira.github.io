<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useKeyDetection } from './keyDetection'
import { useActiveKeyActions } from './activeKeyActions'
import { useWorldRendering } from './worldRendering'
import { getCollidingIndex } from './utilities/positionCalculations'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY } = useActiveKeyActions(pressedKeys.value)

const playerWidth = 32
const playerHeight = 32
const movementSpeed = 4

const playerHalfWidth = playerWidth / 2
const playerHalfHeight = playerHeight / 2

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(1088)
let playerLeft = ref(512)

let lastMovementX = 0
let lastMovementY = 0

let currentTile = ref<number | null>(null)

// TODO: does this need to be reactive (besides debugging)?
let targetTile = ref<number | null>(null)

const { world, columns, mapStyle, tileBackground, tileInfoByIndex } = useWorldRendering(
  playerTop,
  playerLeft
)

let completeMoveX = true
let completeMoveY = true

onMounted(() => {
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
        columns
      )

      if (targetTile.value && !tileInfoByIndex[targetTile.value]?.properties?.walkable) {
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
      columns
    )

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
})

onBeforeUnmount(() => {
  // TODO: end loop
})
</script>

<template>
  <div class="journey-game">
    <div class="map" :style="mapStyle">
      <div class="layers-container">
        <div
          v-for="(layer, index) in world.layers"
          :key="layer.id"
          class="layer"
          :style="{ 'z-index': index }"
        >
          <div
            v-for="(tile, index) in layer.data"
            :key="index"
            class="tile"
            :style="{
              'background-position': tileInfoByIndex[tile].backgroundPosition
            }"
          />
        </div>
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
</template>

<style lang="less" scoped>
.journey-game {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;

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

      .layer {
        position: absolute;
        left: 0;
        top: 0;
        display: grid;
        grid-template-columns: repeat(37, 32px);
        grid-template-rows: repeat(54, 32px);
        grid-column-gap: 0px;
        grid-row-gap: 0px;

        .tile {
          background: v-bind(tileBackground);
        }
      }
    }
  }

  .player {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background: red;
    z-index: 1;
  }

  .hud {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;
  }
}
</style>
