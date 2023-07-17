<script setup lang="ts">
import { ref, reactive, onBeforeUnmount, onMounted } from 'vue'
import type { Action, FlatKeyMap } from './types'
import { keyMappings } from './keyMappings'

const keyActions = reactive({
  moveLeft: false,
  moveDown: false,
  moveRight: false,
  moveUp: false
})

const pressedKeys = ref<string[]>([])

// Process key mappings into a flat map

const flatKeyMap: FlatKeyMap = {}

;(Object.keys(keyMappings) as Action[]).forEach((action) => {
  Object.assign(
    flatKeyMap,

    keyMappings[action].reduce((accumulator: typeof flatKeyMap, key): typeof flatKeyMap => {
      accumulator[key] = action

      return accumulator
    }, {} as typeof flatKeyMap)
  )
})

// Key registration

const keyRegistration = (key: string, pressed: Boolean) => {
  const index = pressedKeys.value.findIndex((existingKey) => existingKey === key)

  // Add
  if (pressed) {
    if (index < 0) {
      pressedKeys.value.push(key)
    }

    return
  }

  // Remove
  if (index >= 0) {
    pressedKeys.value.splice(index, 1)
  }
}

const keyListeners: {
  [key: string]: EventListener
} = {
  keydown: (event) => keyRegistration((event as KeyboardEvent).key, true),

  keyup: (event) => keyRegistration((event as KeyboardEvent).key, false)
}

// Bind the key event listeners

const keyEvents = Object.keys(keyListeners)

onMounted(() => {
  keyEvents.forEach((listener) => document.addEventListener(listener, keyListeners[listener]))
})

onBeforeUnmount(() => {
  keyEvents.forEach((listener) => document.removeEventListener(listener, keyListeners[listener]))
})
</script>

<template>
  <div class="journey-game">
    <div class="map"></div>

    <div class="player"></div>

    <div class="hud">
      <pre>{{ pressedKeys }}</pre>
    </div>
  </div>
</template>

<style lang="less" scoped>
.journey-game {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .player {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background: red;
  }
}
</style>
