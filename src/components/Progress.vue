<template>
  <canvas
    ref="progressCanvas"
    class="progress"
    style="display: block; margin: auto"
    :style="{
    width: data.width,
    height: data.height,
    'border-radius': data.radius}">
  </canvas>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { ProgressType } from '@/types/global';

const props = defineProps<{
  data: ProgressType;
}>();
const progressCanvas = ref<HTMLCanvasElement | null>(null);
let percentage = defineModel<number>({default: 10});
// 绘制进度条的函数
const drawProgressBar = (percentage: number) => {
  const canvas = progressCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e0e0e0'; // 背景色
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(51, 144, 236, 1)'; // 进度条颜色
      ctx.fillRect(0, 0, canvas.width * (percentage / 100), canvas.height);
    }
  }
};
watch(percentage, (newVal) => {
  drawProgressBar(newVal);
});
onMounted(() => {
  console.log('percentage', percentage);
  drawProgressBar(percentage.value);
});

defineExpose({
  drawProgressBar
});
</script>

<style scoped lang="scss">
.progress {
  //line-height: 1rem;
}
</style>
