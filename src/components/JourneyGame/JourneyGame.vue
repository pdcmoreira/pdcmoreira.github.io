<script setup lang="ts">
import { useKeyDetection } from './keyDetection'
import { useActiveKeyActions } from './activeKeyActions'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const { pressedKeys } = useKeyDetection()

const { movementX, movementY } = useActiveKeyActions(pressedKeys.value)

const movementSpeed = 3

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
    <div class="map"></div>

    <div
      class="player"
      :style="{
        top: playerTop + 'px',
        left: playerLeft + 'px'
      }"
    ></div>

    <div class="hud">
      <pre>{{ movementX }} | {{ movementY }}</pre>

      <pre>{{ playerTop }} | {{ playerLeft }}</pre>

      <pre>{{ pressedKeys }}</pre>
    </div>
  </div>
</template>

<style lang="less" scoped>
.journey-game {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .player {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background: red;
  }

  .hud {
    position: fixed;
    bottom: 0;
    padding: 10px;
  }
}
</style>
