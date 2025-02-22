<script setup lang="ts">
import { computed, type PropType } from 'vue'
import GameBox from './GameBox.vue'

const props = defineProps({
  title: {
    type: String as PropType<string | null>,
    default: null
  },

  messages: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => []
  }
})

const resolvedMessages = computed(() =>
  Array.isArray(props.messages) ? props.messages : [props.messages]
)
</script>

<template>
  <div class="game-popup">
    <GameBox :title="title">
      <p v-for="(message, index) in resolvedMessages" :key="index">
        {{ message }}
      </p>
    </GameBox>
  </div>
</template>

<style lang="less">
.game-popup {
  display: flex;
  justify-content: center;
  align-items: center;

  .game-box {
    opacity: 0.85;
    width: 450px;

    p {
      padding: 0.7rem 0;

      &:not(:last-child) {
        border-bottom: 2px dashed #ddd;
      }
    }
  }
}
</style>
