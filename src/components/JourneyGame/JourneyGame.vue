<script setup lang="ts">
import { ref } from 'vue'
import { useKeyDetection } from './lib/keyDetection'
import { useActiveKeyActions } from './lib/activeKeyActions'
import { useWorldRendering } from './lib/worldRendering'
import { usePlayerMovement } from './lib/playerMovement'
import { useDebug } from './lib/debug'
import { useGameLoop } from './lib/gameLoop'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY, lastActivatedAxis } = useActiveKeyActions(pressedKeys.value)

const playerWidth = 32
const playerHeight = 32

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(51 * 32)
let playerLeft = ref(27 * 32)

const {
  enabled: debugEnabled,
  rows: debugRows,
  updateDebug
} = useDebug(playerLeft, playerTop, movementX, movementY, pressedKeys)

const { isLoading, worldBackgroundCss, mapStyle, layerImages } = useWorldRendering(
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

debugEnabled.value = true

useGameLoop(() => {
  updateMovement()

  updateDebug()
})
</script>

<template>
  <div v-if="!isLoading" class="journey-game">
    <div class="map" :style="mapStyle">
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
      <pre v-for="(row, index) in debugRows" :key="index">{{ row }}</pre>
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
