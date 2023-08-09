<script setup lang="ts">
import { computed, type PropType } from 'vue'
import ContentBox from './ContentBox.vue'

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
    <ContentBox :title="title">
      <p v-for="(message, index) in resolvedMessages" :key="index">
        {{ message }}
      </p>
    </ContentBox>
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

  .content-box {
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
