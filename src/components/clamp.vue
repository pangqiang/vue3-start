<!--
 - 支持选择限制行数与/或最大高度，在文本溢出时截断文本。
 - 支持自定义文本截断时显示的省略字符以及截断的位置。
 - 支持在布局变化时自动更新。
 - 支持展开/收起被截断部分内容。
 - 支持自定义截断文本前后内容，并且进行响应式更新
 -->
<template>
  <div
    ref="textClampRef"
    class="text-clamp"
    :style="{
      overflow: 'hidden',
      maxHeight: realMaxHeight
    }"
  >
    <!--      <h1>{{isClamped}}</h1>-->
    <span ref="contentRef">
      <slot
        name="before"
        :expand="expand"
        :collapse="collapse"
        :toggle="toggle"
        :clamped="isClamped"
        :expanded="state.localExpanded"
      ></slot>
      <el-tooltip :content="text" :disabled="!isClamped" effect="dark">
        <span
          ref="textRef"
          :aria-label="text"
          style="word-break: break-all; white-space: normal"
        ></span>
      </el-tooltip>
      <slot
        name="after"
        :expand="expand"
        :collapse="collapse"
        :toggle="toggle"
        :clamped="isClamped"
        :expanded="state.localExpanded"
      ></slot>
    </span>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  maxHeight: {
    type: [String, Number],
    default: undefined
  },
  maxLines: {
    type: Number,
    default: undefined
  },
  expanded: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: 'end',
    validator(value) {
      return ['start', 'middle', 'end'].includes(value)
    }
  },
  ellipsis: {
    type: String,
    default: '…'
  },
  autoResize: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['clamp-change', 'update:expanded'])

const textClampRef = ref(null)
const contentRef = ref(null)
const textRef = ref(null)
const state = reactive({
  offset: 0,
  localExpanded: !!props.expanded,
  resizeObserver: null
})

const realMaxHeight = computed(() => {
  if (state.localExpanded) return undefined
  if (!props.maxHeight) return undefined
  return typeof props?.maxHeight === 'number' ? `${props?.maxHeight}px` : props?.maxHeight
})

const applyChange = () => {
  if (textRef.value) textRef.value.textContent = realText.value
}

const update = () => {
  if (state.localExpanded) return
  applyChange()
  if (isOverflow() || isClamped.value) {
    search()
  }
}

const init = () => {
  if (!props.text) return
  state.offset = props.text.length
  cleanUp()
  if (props.autoResize && textClampRef.value) {
    state.resizeObserver = new ResizeObserver(update)
    state.resizeObserver.observe(textClampRef.value)
  }
  update()
}

const cleanUp = () => {
  if (state.resizeObserver) {
    state.resizeObserver.disconnect()
    state.resizeObserver = null
  }
}

const isOverflow = () => {
  if (!props.maxLines && !props.maxHeight) return false
  if (!textClampRef.value) return false
  if (props.maxLines && getLines() > props.maxLines) return true
  if (props.maxHeight && textClampRef.value.scrollHeight > textClampRef.value.offsetHeight)
    return true
  return false
}

const getLines = () => {
  if (!contentRef.value) return 0
  // see https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getClientRects
  return Object.keys(
    Array.prototype.slice
      .call(contentRef.value.getClientRects())
      .reduce((prev, { top, bottom }) => {
        const key = `${top}/${bottom}`
        if (!prev[key]) {
          prev[key] = true
        }
        return prev
      }, {})
  ).length
}

const search = (...range) => {
  const [from = 0, to = state.offset] = range
  if (to - from <= 3) {
    stepToFit()
    return
  }
  const target = Math.floor((to + from) / 2)
  clampAt(target)
  if (isOverflow()) {
    search(from, target)
  } else {
    search(target, to)
  }
}

const clampAt = (offset) => {
  state.offset = offset
  applyChange()
}

const stepToFit = () => {
  fill()
  clamp()
}

const fill = () => {
  while ((!isOverflow() || getLines() < 2) && state.offset < props.text.length) {
    moveEdge(1)
  }
}

const clamp = () => {
  while (isOverflow() && getLines() > 1 && state.offset > 0) {
    moveEdge(-1)
  }
}

const moveEdge = (steps) => {
  clampAt(state.offset + steps)
}

const isClamped = computed(() => {
  if (!props.text) return false
  return state.offset !== props.text.length
})

watch(
  () => isClamped.value,
  (val) => {
    setTimeout(() => {
      emits('clamp-change', val)
    }, 0)
  },
  { immediate: true }
)

const realText = computed(() => {
  return isClamped.value ? clampedText.value : props.text
})

const clampedText = computed(() => {
  if (props.location === 'start') {
    return props.ellipsis + (props.text.slice(-state.offset) || '').trim()
  }
  if (props.location === 'middle') {
    const split = Math.floor(state.offset / 2)
    return (
      (props.text.slice(0, split) || '').trim() +
      props.ellipsis +
      (props.text.slice(-split) || '').trim()
    )
  }
  return (props.text.slice(0, state.offset) || '').trim() + props.ellipsis
})

const expand = () => {
  state.localExpanded = true
}

const collapse = () => {
  state.localExpanded = false
}

const toggle = () => {
  state.localExpanded = !state.localExpanded
}

watch(
  () => props.expanded,
  (val) => {
    state.localExpanded = val
  }
)

watch(
  () => state.localExpanded,
  (val) => {
    if (val) {
      clampAt(props.text.length)
    } else {
      update()
    }
    if (props.expanded !== val) {
      emits('update:expanded', val)
    }
  }
)

watch(
  () => [props.maxLines, props.maxHeight, props.ellipsis, props.location, isClamped.value].join(),
  () => {
    nextTick(() => {
      update()
    })
  }
)

watch(
  () => [props.text, props.autoResize].join(),
  () => {
    nextTick(() => {
      init()
    })
  }
)

onUnmounted(() => {
  cleanUp()
})

onMounted(() => {
  init()
})
</script>
