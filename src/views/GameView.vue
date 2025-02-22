<script setup lang="ts">
import JourneyGame from '@/components/JourneyGame'
import ContactInfo from '@/components/ContactInfo.vue'
import SourceLink from '@/components/SourceLink.vue'
</script>

<template>
  <div class="game-view">
    <div class="game-container">
      <JourneyGame />
    </div>

    <div class="overlay-container">
      <ContactInfo />

      <SourceLink />

      <!-- TODO -->
      <!-- <RouterLink to="/boring-mode" class="boring-mode-link">Boring version →</RouterLink> -->
    </div>
  </div>
</template>

<style lang="less">
.game-view {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;

  .game-container,
  .overlay-container {
    width: 100%;
    height: 100%;
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 30;

    .contact-info {
      position: fixed;
      top: 6px;
      left: 6px;
      box-shadow: 13px 12px 19px -16px rgba(0, 0, 0, 0.1);
      pointer-events: auto;
    }

    .source {
      position: fixed;
      bottom: 6px;
      right: 6px;
      pointer-events: auto;
    }

    .boring-mode-link {
      position: fixed;
      bottom: 6px;
      right: 6px;
      text-align: right;
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
