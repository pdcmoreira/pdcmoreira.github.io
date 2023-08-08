<script setup lang="ts">
import { computed, type PropType } from 'vue'

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
    <div class="container">
      <div v-if="title" class="title">{{ title }}</div>

      <div class="messages">
        <p v-for="(message, index) in resolvedMessages" :key="index">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.game-popup {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;

  & > .container {
    background: #fff;
    opacity: 0.85;
    padding: 0.8rem 1.6rem;
    border: 4px solid #000;
    width: 450px;

    & > .title {
      font-weight: bold;
      display: table;
      padding: 0 0.5rem;
      margin: -1.1rem 0 0.4rem;
      font-size: 1rem;
      background-color: #fff;
    }

    & > .messages {
      & > p {
        padding: 0.7rem 0;

        &:not(:last-child) {
          border-bottom: 2px dashed #ddd;
        }
      }
    }
  }
}
</style>
