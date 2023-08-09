<script setup lang="ts">
import { useKeyDetection } from './lib/keyDetection'
import { useActiveKeyActions } from './lib/activeKeyActions'
import { useWorldRendering } from './lib/worldRendering'
import { usePlayerMovement } from './lib/playerMovement'
import { useDebug } from './lib/debug'
import { useGameLoop } from './lib/gameLoop'
import { usePlayerRendering } from './lib/playerRendering'
import { useTileInteractions } from './lib/tileInteractions'
import { useInitializeState } from './lib/initializeState'
import { usePopup } from './lib/popup'
import { useTileInteractionHandler } from './lib/tileInteractionHandler'
import GamePopup from './GamePopup.vue'
import GameGoalTracker from './GameGoalTracker.vue'
import { computed } from 'vue'

const { playerLeft, playerTop, visitedCompanies } = useInitializeState()

const { isPopupOpen, popupTitle, popupMessages, openPopup, closePopup } = usePopup()

const { pressedKeys } = useKeyDetection()

const { movementX, movementY, lastActivatedAxis } = useActiveKeyActions(pressedKeys.value)

const { isLoading, worldBackgroundCss, mapStyle, layerImages } = useWorldRendering(
  playerTop,
  playerLeft
)

const { movementAxis, movementDirection, updateMovement } = usePlayerMovement(
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
} = usePlayerRendering(playerLeft, playerTop, movementAxis, movementDirection)

const { updateTileInteractions, currentTileInteraction } = useTileInteractions(
  playerLeft,
  playerTop
)

useTileInteractionHandler(currentTileInteraction, visitedCompanies, openPopup, closePopup)

const companiesCount = computed(() => Object.keys(visitedCompanies).length)

const visitedCompaniesCount = computed(
  () => Object.values(visitedCompanies).filter((value) => value).length
)

const {
  enabled: debugEnabled,
  rows: debugRows,
  updateDebug
} = useDebug(playerLeft, playerTop, movementX, movementY, pressedKeys)

debugEnabled.value = import.meta.env.VITE_DEBUG_ENABLED || false

useGameLoop(() => {
  updateMovement()

  updatePlayer()

  updateTileInteractions()

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

      <GameGoalTracker :total="companiesCount" :won="visitedCompaniesCount" />

      <GamePopup v-if="isPopupOpen" :title="popupTitle" :messages="popupMessages" />

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
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  color: #212529;

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #000;
    font-weight: bold;
    font-size: 1.6rem;
    color: #fff;
  }

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
    z-index: 2;
    background: v-bind(playerBackgroundCss);
    height: v-bind(playerHeightCss);
    width: v-bind(playerWidthCss);

    @keyframes player-sprite {
      from {
        background-position: v-bind('playerSpriteAnimation.from');
      }
      to {
        background-position: v-bind('playerSpriteAnimation.to');
      }
    }
  }

  .debug {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;
  }
}
</style>
