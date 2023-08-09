<script setup lang="ts">
import GameBox from './GameBox.vue'
import medalIconUrl from './assets/medal.png'

defineProps({
  total: {
    type: Number,
    default: 0
  },

  won: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <GameBox title="Visited" class="game-goal-tracker">
    <img v-for="n in total" :key="n" :src="medalIconUrl" class="medal" :class="{ won: n <= won }" />
  </GameBox>
</template>

<style lang="less">
.game-goal-tracker {
  position: absolute;
  top: 80px;
  left: 30px;
  z-index: 20;

  .content {
    display: flex;
    justify-content: center;
  }

  .medal:not(.won) {
    filter: grayscale(1);
  }
}
</style>
