<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'update:model-value': [boolean]
}>()
</script>

<template>
  <div
    class="d-pad-toggle"
    :class="{ open: modelValue }"
    @click="emit('update:model-value', !modelValue)"
  >
    <span class="gamepad-icon">
      <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125">
        <g data-name="Group">
          <path
            d="M72.8 37.8h-20v-7.7a10 10 0 0 1 5.8-9.1l7.5-3.5-2.5-5.4-7.5 3.5a16.1 16.1 0 0 0-9.2 14.5v7.7H27.2a25 25 0 1 0 18.4 42h8.7a25 25 0 1 0 18.4-42Zm0 44.1a19 19 0 0 1-14.7-7l-.9-1.1H42.9l-.9 1.1a19 19 0 1 1-14.8-31.1h45.6a19 19 0 1 1 0 38.1Z"
            data-name="Compound Path"
          />
          <path d="M29 53.5h-6v6.2h-6.2v6H23v6.1h6v-6.1h6.2v-6H29v-6.2z" data-name="Path" />
          <path
            d="M79.4 51a6.2 6.2 0 1 0 6.2 6.2 6.2 6.2 0 0 0-6.2-6.2Zm-.2 6.2.2-.2.2.2c0 .2-.4.2-.4 0ZM69.3 62.9a6.2 6.2 0 1 0 6.2 6.2 6.2 6.2 0 0 0-6.2-6.2Zm-.2 6.2.2-.2.2.2c0 .2-.4.2-.4 0Z"
            data-name="Compound Path"
          />
        </g>
      </svg>
    </span>

    <span class="caret">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xml:space="preserve"
        style="enable-background: new 0 0 100 100"
        viewBox="0 0 100 125"
      >
        <switch>
          <g>
            <path
              d="M43.1 21.3 4.6 67.1c-4.9 5.8-.8 14.8 6.9 14.8h77c7.6 0 11.8-8.9 6.9-14.8L56.9 21.3c-3.6-4.2-10.2-4.2-13.8 0z"
            />
          </g>
        </switch>
      </svg>
    </span>
  </div>
</template>

<style lang="less">
.d-pad-toggle {
  display: flex;
  align-items: center;
  opacity: 0.4;

  & > .gamepad-icon {
    width: 32px;
  }

  & > .caret {
    width: 10px;
    height: 10px;
    margin-left: 2px;
    transition: transform 200ms ease-in-out;
  }

  &.open {
    & > .caret {
      transform: rotate(90deg);
    }
  }
}
</style>
