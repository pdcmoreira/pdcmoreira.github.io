<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useKeyDetection } from './keyDetection'
import { useActiveKeyActions } from './activeKeyActions'
import world from './assets/world.json'
import exteriors from './assets/exteriors.json'

// Tileset
const cols = exteriors.imagewidth / exteriors.tilewidth
const rows = exteriors.imageheight / exteriors.tileheight

const getMatrixCoordinates = (index: number): [number, number] => [
  Math.floor(index / cols),
  (index % cols) - 1
]

const getImagePixelPosition = (row: number, col: number): [number, number] => [
  col * exteriors.tilewidth,
  row * exteriors.tileheight
]

const getImagePixelPositionByIndex = (index: number) =>
  getImagePixelPosition(...getMatrixCoordinates(index))

const getImageBackgroundPosition = (index: number) => {
  const [x, y] = getImagePixelPositionByIndex(index)

  return `${-x}px ${-y}px`
}

// World
const worldWidthPx = world.width * world.tilewidth
const worldHeightPx = world.height * world.tileheight

const layersContainerStyle = {
  left: `calc(50% - (${worldWidthPx}px / 2))`
}

const { pressedKeys } = useKeyDetection()

const { movementX, movementY } = useActiveKeyActions(pressedKeys.value)

const movementSpeed = 4

let playerTop = ref(0)
let playerLeft = ref(0)

onMounted(() => {
  function gameLoop() {
    // TODO: do things here

    playerTop.value += movementY.value * movementSpeed

    if (playerTop.value < 0) {
      playerTop.value = 0
    }

    playerLeft.value += movementX.value * movementSpeed

    if (playerLeft.value < 0) {
      playerLeft.value = 0
    }

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
    <div class="map">
      <div class="layers-container" :style="layersContainerStyle">
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
            :style="{ 'background-position': getImageBackgroundPosition(tile) }"
          />
        </div>
      </div>
    </div>

    <div
      class="player"
      :style="{
        top: playerTop + 'px',
        left: playerLeft + 'px'
      }"
    ></div>

    <div class="hud">
      <pre>Player movement: {{ movementX }} | {{ movementY }}</pre>

      <pre>Player position: {{ playerTop }} | {{ playerLeft }}</pre>

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
    right: 0;
    bottom: 0;
    left: 0;

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
          color: white;
          background: url('./assets/exteriors_tileset.png') 0px 0px no-repeat;
        }
      }
    }
  }

  .player {
    position: absolute;
    width: 24px;
    height: 24px;
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
