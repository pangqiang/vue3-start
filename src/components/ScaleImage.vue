<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUrl, useWidth } from 'composables/useScale'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  imgSet: {
    type: Array as () => number[],
    default: () => []
  }
})

const imgref = ref<HTMLImageElement | null>(null)
const width = useWidth(imgref)
const { url } = useUrl(width, props.src, props.imgSet)
</script>

<template>
  <div>
    <img ref="imgref" :src="url" />
    {{ url }}
  </div>
</template>
