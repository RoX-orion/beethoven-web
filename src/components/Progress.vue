<template>
  <div @click="updateCurrentTime">
    <canvas
      ref="progressCanvas"
      class="progress pointer"
      style="display: block; margin: auto"
      :style="{
    width: data.width,
    height: data.height,
    'border-radius': data.radius}">
    </canvas>
    <div class="seek-line pointer" ref="seekBtn" :style="{left: props.data.percentage + '%'}"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { ProgressType } from '@/types/global';

const props = defineProps<{
  data: ProgressType;
}>();
const progressCanvas = ref<HTMLCanvasElement>();
const seekBtn = ref<HTMLDivElement>();

const emit = defineEmits();
onMounted(() => {
  // seekBtn.value!.addEventListener('mousedown', () => {
  //   console.log('mousedown');
  //   // seeking = true;
  // });
  // progressCanvas.value!.addEventListener('mousemove', e => {
  //   emit('seek-move', e);
  // }, false);
  // progressCanvas.value!.addEventListener('mouseup', () => {
  //   emit('seek-end');
  //   // seeking = false;
  // }, false);
});

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

const updateCurrentTime = (e: any) => {
  emit('changeCurrentTime', e);
}
watch(() => props.data.percentage, (newVal) => {
  drawProgressBar(newVal);
});
onMounted(() => {
  drawProgressBar(props.data.percentage);
});

defineExpose({
  drawProgressBar
});
</script>

<style scoped lang="scss">

</style>
