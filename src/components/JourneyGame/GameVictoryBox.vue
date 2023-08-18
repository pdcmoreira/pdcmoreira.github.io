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
  <div class="victory-box">
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
.victory-box {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;

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
