<script setup lang="ts">
import pointInTriangle from 'point-in-triangle'
import type { Point, Triangle } from '@/types'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { isNotNull } from '@/utilities/typeAssertions'

const props = defineProps({
  size: {
    type: Number,
    default: 160
  },

  debug: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  'update:pressed-keys': [string[]]
}>()

const dPad = ref<HTMLElement | null>(null)

const pressedKeys = ref<string[]>([])

const getTriangles = (size: number): { [key: string]: Triangle } => {
  const full = size

  const mid = full / 2

  const oneFourth = full / 4

  const threeFourths = oneFourth * 3

  return {
    DPadUp: [
      [oneFourth, 0],
      [threeFourths, 0],
      [mid, mid]
    ],

    DPadDown: [
      [oneFourth, full],
      [threeFourths, full],
      [mid, mid]
    ],

    DPadLeft: [
      [0, oneFourth],
      [0, threeFourths],
      [mid, mid]
    ],

    DPadRight: [
      [full, oneFourth],
      [full, threeFourths],
      [mid, mid]
    ],

    DPadUpLeft: [
      [oneFourth, 0],
      [0, oneFourth],
      [mid, mid]
    ],

    DPadUpRight: [
      [threeFourths, 0],
      [full, oneFourth],
      [mid, mid]
    ],

    DPadDownLeft: [
      [0, threeFourths],
      [oneFourth, full],
      [mid, mid]
    ],

    DPadDownRight: [
      [threeFourths, full],
      [full, threeFourths],
      [mid, mid]
    ]
  }
}

const keyTrianglesMap = computed(() => getTriangles(props.size))

const findTriangleAtPoint = (point: Point) =>
  Object.keys(keyTrianglesMap.value).find((key) =>
    pointInTriangle(point, keyTrianglesMap.value[key])
  ) || null

const touchHandler = (event: TouchEvent) => {
  if (!event.touches?.length || !dPad.value) {
    pressedKeys.value = []

    return
  }

  // TODO: cache this
  const { top, left } = dPad.value.getBoundingClientRect()

  // Assign the keys for which their triangles collide with the touch points
  pressedKeys.value = Array.from(event.touches)
    .reduce(
      (result, touch) => [
        ...result,
        findTriangleAtPoint([touch.clientX - left, touch.clientY - top])
      ],
      [] as (string | null)[]
    )
    .filter(isNotNull)

  event.preventDefault()
}

// Register touch events

const touchEvents = ['touchstart', 'touchend', 'touchcancel', 'touchmove']

onMounted(() => {
  touchEvents.forEach((event) => {
    dPad.value?.addEventListener(event, touchHandler as EventListener)
  })
})

onBeforeUnmount(() => {
  touchEvents.forEach((event) => {
    dPad.value?.removeEventListener(event, touchHandler as EventListener)
  })

  emit('update:pressed-keys', [])
})

// Map the diagonal keys into their respective individual direction keys
const keyCombinationMap: { [key: string]: string[] } = {
  DPadUpLeft: ['DPadUp', 'DPadLeft'],
  DPadUpRight: ['DPadUp', 'DPadRight'],
  DPadDownLeft: ['DPadDown', 'DPadLeft'],
  DPadDownRight: ['DPadDown', 'DPadRight']
}

// Resolve the individual direction keys, based on the diagonal combinations
const resolvedKeys = computed(() =>
  // Using an object here to accumulate the resolved keys instead of manipulating an array so that
  // we don't have to check for duplicates. We can just set the keys at will and extract them from
  // the object in the end.
  Object.keys(
    pressedKeys.value.reduce((result, key) => {
      ;(keyCombinationMap[key] || [key]).forEach((resultKey) => {
        result[resultKey] = true
      })

      return result
    }, {} as { [key: string]: boolean })
  )
)

watch(resolvedKeys, (keys) => {
  emit('update:pressed-keys', keys)
})

// Debug

const debugCanvas = ref<HTMLCanvasElement | null>(null)

const drawTriangle = (context: CanvasRenderingContext2D, triangle: Triangle, fillStyle: string) => {
  context.beginPath()

  context.fillStyle = fillStyle

  context.moveTo(triangle[0][0], triangle[0][1])

  context.lineTo(triangle[1][0], triangle[1][1])

  context.lineTo(triangle[2][0], triangle[2][1])

  context.closePath()

  context.fill()
}

watch(debugCanvas, (canvas) => {
  if (!canvas) {
    return
  }

  const context = canvas.getContext('2d')

  if (!context) {
    return
  }

  const mainKeys = ['DPadUp', 'DPadDown', 'DPadLeft', 'DPadRight']

  Object.entries(keyTrianglesMap.value).forEach(([key, triangle]) => {
    drawTriangle(context, triangle, mainKeys.includes(key) ? 'red' : 'blue')
  })
})
</script>

<template>
  <div ref="dPad" class="d-pad">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-dpad"
      viewBox="0 0 16 16"
    >
      <path
        d="m7.788 2.34-.799 1.278A.25.25 0 0 0 7.201 4h1.598a.25.25 0 0 0 .212-.382l-.799-1.279a.25.25 0 0 0-.424 0Zm0 11.32-.799-1.277A.25.25 0 0 1 7.201 12h1.598a.25.25 0 0 1 .212.383l-.799 1.278a.25.25 0 0 1-.424 0ZM3.617 9.01 2.34 8.213a.25.25 0 0 1 0-.424l1.278-.799A.25.25 0 0 1 4 7.201V8.8a.25.25 0 0 1-.383.212Zm10.043-.798-1.277.799A.25.25 0 0 1 12 8.799V7.2a.25.25 0 0 1 .383-.212l1.278.799a.25.25 0 0 1 0 .424Z"
      />
      <path
        d="M6.5 0A1.5 1.5 0 0 0 5 1.5v3a.5.5 0 0 1-.5.5h-3A1.5 1.5 0 0 0 0 6.5v3A1.5 1.5 0 0 0 1.5 11h3a.5.5 0 0 1 .5.5v3A1.5 1.5 0 0 0 6.5 16h3a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 0 16 9.5v-3A1.5 1.5 0 0 0 14.5 5h-3a.5.5 0 0 1-.5-.5v-3A1.5 1.5 0 0 0 9.5 0h-3ZM6 1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3A1.5 1.5 0 0 0 11.5 6h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a1.5 1.5 0 0 0-1.5 1.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3A1.5 1.5 0 0 0 4.5 10h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 0 6 4.5v-3Z"
      />
    </svg>

    <div v-if="debug" class="debug">
      <canvas ref="debugCanvas" :width="size" :height="size"></canvas>
    </div>
  </div>
</template>

<style lang="less">
.d-pad {
  width: v-bind('size + "px"');
  height: v-bind('size + "px"');
  opacity: 0.4;

  & > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind('size + "px"');
    height: v-bind('size + "px"');
  }

  & > .debug {
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }
}
</style>
