import { ref, watchEffect, computed, onUnmounted } from 'vue'

export function useDPR() {
  const dpr = ref(window.devicePixelRatio)

  const observer = new ResizeObserver(() => {
    dpr.value = window.devicePixelRatio
  })

  observer.observe(document.documentElement)

  onUnmounted(() => {
    observer.unobserve(document.documentElement)
  })

  return {
    dpr,
  }
}

export function useWidth(imgRef) {
  const width = ref(0)
  const observer = new ResizeObserver(() => {
    if (imgRef.value) {
      width.value = imgRef.value.clientWidth
    }
  })

  let img = null

  watchEffect(() => {
    const _img = imgRef.value
    if (_img) {
      img = _img
      observer.observe(img)
    }
    else if (img) {
      observer.unobserve(img)
    }
  })

  return { width }
}


export function useUrl(width, imgSrc, imgSet) {
  const { dpr } = useDPR()
  const url = computed(() => {
    if (imgSet.length === 0)
      return imgSrc
  
    // 计算出缩放图的路径
    const scale = imgSet.find(item => item >= width.value * dpr.value)
    if (scale)
      return imgSrc.replace(/(\.[a-z]+)$/i, `_${scale}$1`)
    else
      return imgSrc
  })
  return { url }
}
