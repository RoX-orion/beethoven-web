<template>
  <div ref="seekLineContainer" @mousedown.stop="updateCurrentTime" @touchstart.stop="updateCurrentTimeTouch">
    <canvas
      ref="progressCanvas"
      class="progress pointer"
      style="display: block; margin: auto"
      :style="{
      width: data.width,
      height: data.height,
      'border-radius': data.radius}">
    </canvas>
    <div class="seek-line pointer" ref="seekButton" :style="{left: computePercentage + '%'}"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { ProgressType } from '@/types/global';
const props = defineProps<{
  data: ProgressType;
}>();
const emit = defineEmits();
const seekLineContainer = ref<HTMLDialogElement>();
const progressCanvas = ref<HTMLCanvasElement>();
const seekButton = ref<HTMLDivElement>();
let seeking = false;

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

const handleMouseMove = (e: any) => {
  let containerRect = seekLineContainer.value!.getBoundingClientRect();
  let offsetX = e.clientX - containerRect.left;
  if (offsetX < 0)
    offsetX = 0;
  if (offsetX > containerRect.width)
    offsetX = containerRect.width;
  props.data.percentage = (offsetX / containerRect.width) * 100;
  seekButton.value!.style.left = `${offsetX}px`;
  emit('update', props.data.percentage);
  drawProgressBar(props.data.percentage);
};

const handleMouseUp = () => {
  seeking = false;
  emit('changeCurrentTime', props.data.percentage);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

const updateCurrentTime = (e: any) => {
  e.preventDefault();
  seeking = true;
  handleMouseMove(e);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('mouseup', handleMouseUp, false);
}
// mobile
const updateCurrentTimeTouch = (e: any) => {
  e.preventDefault();
  seeking = true;
  handleTouchMove(e);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchUp, false);
};

const handleTouchMove = (e: any) => {
  // e.preventDefault();
  let touch = e.touches[0];
  let containerRect = seekLineContainer.value!.getBoundingClientRect();
  let offsetX = touch.clientX - containerRect.left;

  if (offsetX < 0) offsetX = 0;
  if (offsetX > containerRect.width) offsetX = containerRect.width;
  props.data.percentage = (offsetX / containerRect.width) * 100;
  seekButton.value!.style.left = `${offsetX}px`;
  emit('update', props.data.percentage);
  drawProgressBar(props.data.percentage);
};

const handleTouchUp = () => {
  seeking = false;
  emit('changeCurrentTime', props.data.percentage);

  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchUp);
};

const computePercentage = computed(() => {
  return props.data.percentage;
});
watch(() => props.data.percentage, (newVal) => {
  drawProgressBar(newVal);
});
onMounted(() => {
  drawProgressBar(props.data.percentage);
});
</script>

<style scoped lang="scss">

</style>
