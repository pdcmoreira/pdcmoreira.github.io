<script setup lang="ts">
import JourneyGame from '@/components/JourneyGame'
import ContactInfo from '@/components/ContactInfo.vue'
</script>

<template>
  <div class="game-view">
    <JourneyGame />

    <ContactInfo />
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

  .contact-info {
    position: fixed;
    top: 6px;
    left: 6px;
    box-shadow: 13px 12px 19px -16px rgba(0, 0, 0, 0.1);
    z-index: 20;
  }
}
</style>
