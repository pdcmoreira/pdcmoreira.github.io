<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useKeyDetection } from './keyDetection'
import { useActiveKeyActions } from './activeKeyActions'
import { useWorldRendering } from './worldRendering'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY } = useActiveKeyActions(pressedKeys.value)

const movementSpeed = 4

// Player position relative to the world
// TODO: load initial positions from some map property?
let playerTop = ref(1096)
let playerLeft = ref(516)

const { world, mapStyle, tileBackground, tileBackgroundPositionByIndex } = useWorldRendering(
  playerTop,
  playerLeft
)

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
            :style="{ 'background-position': tileBackgroundPositionByIndex[tile] }"
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
