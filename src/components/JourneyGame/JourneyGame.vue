<script setup lang="ts">
import { useKeyDetection } from './keyDetection'

const { pressedKeys } = useKeyDetection()
</script>

<template>
  <div class="journey-game">
    <div class="map"></div>

    <div class="player"></div>

    <div class="hud">
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
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background: red;
  }
}
</style>
