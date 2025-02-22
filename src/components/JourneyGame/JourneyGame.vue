<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameState } from '@/components/composables/gameState'
import { useGamePopup } from '@/components/composables/gamePopup'
import { useKeyDetection } from '@/components/composables/keyDetection'
import { useGameTouchControls } from '@/components/composables/gameTouchControls'
import { useGameKeyActions } from '@/components/composables/gameKeyActions'
import { useGamePlayerMovement } from '@/components/composables/gamePlayerMovement'
import { useGameTileInteractions } from '@/components/composables/gameTileInteractions'
import { useGameTileInteractionHandling } from '@/components/composables/gameTileInteractionHandling'
import { useGameDebug } from '@/components/composables/gameDebug'
import { useGameWorldRendering } from '@/components/composables/gameWorldRendering'
import { useGamePlayerRendering } from '@/components/composables/gamePlayerRendering'
import { useElementScaling } from '@/components/composables/elementScaling'
import { useGameLoop } from '@/components/composables/gameLoop'
import { preloadImages } from '@/utilities/preloadImages'
import { isNotNull } from '@/utilities/typeAssertions'
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

// Player input

const { movementAxis, movementDirection, updateMovement } = useGamePlayerMovement(
  playerLeft,
  playerTop,
  movementX,
  movementY,
  lastActivatedAxis
)

// Player interaction with the world

const { updateTileInteractions, currentTileInteraction } = useGameTileInteractions(
  playerLeft,
  playerTop
)

useGameTileInteractionHandling(currentTileInteraction, visitedCompanies, openPopup, closePopup)

// Victory tracking

const companiesCount = computed(() => Object.keys(visitedCompanies).length)

const visitedCompaniesCount = computed(
  () => Object.values(visitedCompanies).filter((value) => value).length
)

const showVictory = computed(
  () => visitedCompaniesCount.value === companiesCount.value && !currentTileInteraction.value
)

// Debugging

const {
  enabled: debugEnabled,
  rows: debugRows,
  updateDebug
} = useGameDebug(playerLeft, playerTop, movementX, movementY, activeKeys)

debugEnabled.value = import.meta.env.VITE_DEBUG_ENABLED === 'true'

// Rendering

const { mapStyle, worldBackgroundCss, backgroundTileUrl, layersUrls } = useGameWorldRendering(
  playerTop,
  playerLeft
)

const {
  playerTileSetUrl,
  playerBackgroundCss,
  playerHeightCss,
  playerWidthCss,
  playerStyle,
  playerSpriteAnimation,
  updatePlayer
} = useGamePlayerRendering(playerLeft, playerTop, movementAxis, movementDirection)

const { scalingStyle } = useElementScaling()

// Loading state

const isLoading = ref(true)

// Preload assets and remove the loading state
;(async () => {
  const imagesUrls = [...layersUrls.value, backgroundTileUrl, playerTileSetUrl]

  await preloadImages(imagesUrls.filter(isNotNull))

  isLoading.value = false
})()

// Game loop

useGameLoop((delta) => {
  if (isLoading.value) {
    return
  }

  updateMovement(delta)

  updatePlayer()

  updateTileInteractions()

  updateDebug()
})
</script>

<template>
  <div ref="journeyGame" class="journey-game">
    <div v-if="isLoading" class="loading">Loading...</div>

    <template v-else>
      <div class="map-scaler" :style="scalingStyle">
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
      </div>

      <div class="game-ui">
        <GameGoalTracker
          :total="companiesCount"
          :won="visitedCompaniesCount"
          :style="scalingStyle"
        />

        <GamePopup
          v-if="isPopupOpen"
          :title="popupTitle"
          :messages="popupMessages"
          :style="scalingStyle"
        />

        <GameVictoryBox v-if="showVictory" @click:restart="reset" :style="scalingStyle" />

        <div v-if="debugEnabled" class="debug">
          <pre v-for="(row, index) in debugRows" :key="index">{{ row }}</pre>
        </div>

        <DPadToggle v-if="allowTouchControls" v-model="showVirtualGamePad" />

        <DPad
          v-if="showVirtualGamePad"
          :debug="debugEnabled"
          @update:pressed-keys="pressedDPadKeys = $event"
        />
      </div>
    </template>
  </div>
</template>

<style lang="less">
.journey-game {
  // Mixin to absolutely position and fully ocuppy the available space
  .full-absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  overflow: hidden;
  background: v-bind(worldBackgroundCss);
  font-family: 'Press Start 2P', cursive;
  font-size: 12px;
  color: #212529;
  position: relative;
  .full-absolute;

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

  & > .map-scaler {
    .full-absolute;

    & > .map {
      .full-absolute;

      & > .layers-container {
        .full-absolute;

        & > .layer {
          .full-absolute;
        }
      }

      & > .player {
        position: absolute;
        z-index: 3;
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
  }

  & > .game-ui {
    pointer-events: none;
    z-index: 10;

    & > * {
      pointer-events: auto;
    }

    & > .game-goal-tracker {
      position: absolute;
      top: 80px;
      left: 30px;
      z-index: 20;
      transform-origin: top left;
    }

    & > .game-popup {
      .full-absolute;
      z-index: 20;
    }

    & > .game-victory-box {
      .full-absolute;
      z-index: 30;
    }

    & > .d-pad-toggle {
      position: absolute;
      bottom: 40px;
      left: 30px;
      z-index: 35;
    }

    & > .d-pad {
      position: absolute;
      bottom: 40px;
      right: calc(35% - 80px);
      z-index: 40;
    }

    & > .debug {
      position: absolute;
      bottom: 0;
      padding: 10px;
      color: #fff;
    }
  }
}
</style>
