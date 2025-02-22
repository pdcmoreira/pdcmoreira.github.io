<script setup lang="ts">
import GameBox from './GameBox.vue'
import medalIconUrl from '@/assets/game/medal.png'

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
  .content {
    display: flex;
    justify-content: center;
  }

  .medal {
    width: 32px;
    height: auto;

    &:not(.won) {
      filter: grayscale(1);
    }
  }
}
</style>
