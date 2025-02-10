<script setup lang="ts">
import { computed } from 'vue'
import { useKeyDetection } from '@/components/composables/keyDetection'
import { useGameTouchControls } from '@/components/composables/gameTouchControls'
import { useGameKeyActions } from '@/components/composables/gameKeyActions'
import { useGameWorldRendering } from '@/components/composables/gameWorldRendering'
import { useGamePlayerMovement } from '@/components/composables/gamePlayerMovement'
import { useGameDebug } from '@/components/composables/gameDebug'
import { useGameLoop } from '@/components/composables/gameLoop'
import { useGamePlayerRendering } from '@/components/composables/gamePlayerRendering'
import { useGameTileInteractions } from '@/components/composables/gameTileInteractions'
import { useGameState } from '@/components/composables/gameState'
import { useGamePopup } from '@/components/composables/gamePopup'
import { useGameTileInteractionHandling } from '@/components/composables/gameTileInteractionHandling'
import GamePopup from './GamePopup.vue'
import GameGoalTracker from './GameGoalTracker.vue'
import GameVictoryBox from './GameVictoryBox.vue'
import DPad from './DPad.vue'
import DPadToggle from './DPadToggle.vue'

const { playerLeft, playerTop, visitedCompanies, reset } = useGameState()

const { isPopupOpen, popupTitle, popupMessages, openPopup, closePopup } = useGamePopup()

const { pressedKeys } = useKeyDetection()

const { allowTouchControls, showVirtualGamePad, pressedDPadKeys } = useGameTouchControls()

const activeKeys = computed(() => [...pressedKeys.value, ...pressedDPadKeys.value])

const { movementX, movementY, lastActivatedAxis } = useGameKeyActions(activeKeys)

const { mapStyle, worldBackgroundCss, layersUrls } = useGameWorldRendering(playerTop, playerLeft)

const { movementAxis, movementDirection, updateMovement } = useGamePlayerMovement(
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
} = useGamePlayerRendering(playerLeft, playerTop, movementAxis, movementDirection)

const { updateTileInteractions, currentTileInteraction } = useGameTileInteractions(
  playerLeft,
  playerTop
)

useGameTileInteractionHandling(currentTileInteraction, visitedCompanies, openPopup, closePopup)

const companiesCount = computed(() => Object.keys(visitedCompanies).length)

const visitedCompaniesCount = computed(
  () => Object.values(visitedCompanies).filter((value) => value).length
)

const showVictory = computed(
  () => visitedCompaniesCount.value === companiesCount.value && !currentTileInteraction.value
)

const {
  enabled: debugEnabled,
  rows: debugRows,
  updateDebug
} = useGameDebug(playerLeft, playerTop, movementX, movementY, activeKeys)

debugEnabled.value = import.meta.env.VITE_DEBUG_ENABLED === 'true'

const isLoading = false

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
            v-for="(url, index) in layersUrls"
            :key="url"
            class="layer"
            :style="{ 'z-index': index, background: `url(${url}) 0px 0px no-repeat` }"
          />
        </div>

        <div class="player" :style="playerStyle" />
      </div>

      <GameGoalTracker :total="companiesCount" :won="visitedCompaniesCount" />

      <GamePopup v-if="isPopupOpen" :title="popupTitle" :messages="popupMessages" />

      <GameVictoryBox v-if="showVictory" @click:restart="reset" />

      <div v-if="debugEnabled" class="debug">
        <pre v-for="(row, index) in debugRows" :key="index">{{ row }}</pre>
      </div>

      <DPadToggle v-if="allowTouchControls" v-model="showVirtualGamePad" />

      <DPad
        v-if="showVirtualGamePad"
        :debug="debugEnabled"
        @update:pressed-keys="pressedDPadKeys = $event"
      />
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

  & > .loading {
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

  & > .map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    & > .layers-container {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      & > .layer {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    & > .player {
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
  }

  & > .d-pad-toggle {
    position: fixed;
    bottom: 40px;
    right: 250px;
    z-index: 35;
  }

  & > .d-pad {
    position: fixed;
    bottom: 40px;
    right: 65px;
    z-index: 40;
  }

  & > .debug {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: #fff;

    & + .d-pad {
      bottom: 100px;
    }
  }
}
</style>
