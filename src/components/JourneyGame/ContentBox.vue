<script setup lang="ts">
import { type PropType } from 'vue'

defineProps({
  title: {
    type: String as PropType<string | null>,
    default: null
  }
})
</script>

<template>
  <div class="content-box">
    <div v-if="title" class="title">
      {{ title }}
    </div>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.content-box {
  background: #fff;
  padding: 0.8rem 1.6rem;
  border: 4px solid #000;

  & > .title {
    font-weight: bold;
    display: table;
    padding: 0 0.5rem;
    margin: -1.1rem 0 0.4rem;
    font-size: 1rem;
    background-color: #fff;
  }
}
</style>
