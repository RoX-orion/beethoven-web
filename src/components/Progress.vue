<template>
  <canvas
    ref="progressCanvas"
    class="progress pointer"
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

const drawProgressBar = (percentage: number) => {
  const canvas = progressCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(51, 144, 236, 1)';
      ctx.fillRect(0, 0, canvas.width * (percentage / 100), canvas.height);
    }
  }
};
watch(() => props.data.percentage, (newVal) => {
  drawProgressBar(newVal);
});
onMounted(() => {
  console.log('init', props.data.percentage);
  drawProgressBar(props.data.percentage);
});

defineExpose({
  drawProgressBar
});
</script>

<style scoped lang="scss">

</style>
