<script setup>
// 我们传入一个原始路径，然后告诉组件我们准备哪些缩放图，那么组件根据计算
// 结果，自动计算出缩放图的路径
// 例如：
// src="http://localhost/spring.jpeg"
// imgSet="[500, 1000, 2000, 3000]"
// 组件会自动计算出：
// http://localhost/spring_500.jpeg

import ScaleImage from 'components/ScaleImage.vue'
</script>

<template>
  <ScaleImage
    src="https://picsum.photos/1000/300"
    style="width: 1000px"
    :img-set="[500, 1000, 2000, 3000]"
  />
</template>

<style scoped></style>
