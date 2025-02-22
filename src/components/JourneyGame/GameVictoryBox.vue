<script setup lang="ts">
import GameBox from './GameBox.vue'
import GameButton from './GameButton.vue'

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

defineEmits(['click:restart'])
</script>

<template>
  <div class="game-victory-box">
    <GameBox>
      <h1>Congratulations!</h1>

      <p>You've visited every company I've worked for.</p>

      <div class="actions">
        <GameButton @click="$emit('click:restart')">Restart</GameButton>
      </div>
    </GameBox>
  </div>
</template>

<style lang="less">
.game-victory-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .game-box {
    width: 500px;

    .content {
      text-align: center;

      h1,
      p,
      .actions {
        margin: 1.7rem 0;
      }

      .actions {
        text-align: center;
      }
    }
  }
}
</style>
