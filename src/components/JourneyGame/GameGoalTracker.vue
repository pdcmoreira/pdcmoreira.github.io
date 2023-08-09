<script setup lang="ts">
import ContentBox from './ContentBox.vue'
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
  <ContentBox title="Visited" class="game-goal-tracker">
    <img v-for="n in total" :key="n" :src="medalIconUrl" class="medal" :class="{ won: n <= won }" />
  </ContentBox>
</template>

<style lang="less">
.game-goal-tracker {
  position: absolute;
  top: 100px;
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
