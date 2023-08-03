<script setup lang="ts">
import { ref } from 'vue'
import { useKeyDetection } from './lib/keyDetection'
import { useActiveKeyActions } from './lib/activeKeyActions'
import { useWorldRendering } from './lib/worldRendering'
import { usePlayerMovement } from './lib/playerMovement'
import { useDebug } from './lib/debug'
import { useGameLoop } from './lib/gameLoop'
import { usePlayerRendering } from './lib/playerRendering'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY, lastActivatedAxis } = useActiveKeyActions(pressedKeys.value)

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(51 * 32)
let playerLeft = ref(28 * 32)

const {
  enabled: debugEnabled,
  rows: debugRows,
  updateDebug
} = useDebug(playerLeft, playerTop, movementX, movementY, pressedKeys)

const { isLoading, worldBackgroundCss, mapStyle, layerImages } = useWorldRendering(
  playerTop,
  playerLeft
)

const { updateMovement, movementAxis, movementDirection } = usePlayerMovement(
  playerLeft,
  playerTop,
  movementX,
  movementY,
  lastActivatedAxis
)

const {
  playerBackgroundCss,
  playerHeightCss,
  playerWidthCss,
  playerStyle,
  playerSpriteAnimation,
  updatePlayer
} = usePlayerRendering(playerTop, playerLeft, movementAxis, movementDirection)

debugEnabled.value = true

useGameLoop(() => {
  updateMovement()

  updatePlayer()

  updateDebug()
})
</script>

<template>
  <div class="journey-game">
    <div v-if="isLoading" class="loading">Loading...</div>

    <template v-else>
      <div class="map" :style="mapStyle">
        <div class="layers-container">
          <div
            v-for="(image, index) in layerImages"
            :key="index"
            class="layer"
            :style="{ 'z-index': index, background: `url(${image}) 0px 0px no-repeat` }"
          />
        </div>

        <div class="player" :style="playerStyle" />
      </div>

      <div v-if="debugEnabled" class="debug">
        <pre v-for="(row, index) in debugRows" :key="index">{{ row }}</pre>
      </div>
    </template>
  </div>
</template>

<style lang="less">
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
    @keyframes player-sprite {
      from {
        background-position: v-bind('playerSpriteAnimation.from');
      }
      to {
        background-position: v-bind('playerSpriteAnimation.to');
      }
    }

    position: absolute;
    z-index: 2;
    background: v-bind(playerBackgroundCss);
    height: v-bind(playerHeightCss);
    width: v-bind(playerWidthCss);
  }

  .debug {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;
  }
}
</style>
