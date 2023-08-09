<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />

  <RouterLink to="/boring-mode" class="boring-mode-link">Boring version →</RouterLink>
</template>

<style lang="less">
#app {
  .boring-mode-link {
    position: fixed;
    bottom: 5px;
    right: 5px;
    text-align: right;
  }
}
</style>
