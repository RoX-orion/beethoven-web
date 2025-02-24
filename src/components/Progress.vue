<template>
  <div ref="seekLineContainer" @mousedown="updateCurrentTime">
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
  seekButton.value!.style.left = `${offsetX - seekButton.value!.offsetWidth / 2}px`;
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
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);
}

const computePercentage = computed(() => {
  return props.data.percentage;
  // return seekLineContainer.value && seekButton.value ? seekLineContainer.value!.getBoundingClientRect().width * (props.data.percentage / 100) - seekButton.value?.offsetWidth / 2 : 0;
});
watch(() => props.data.percentage, (newVal) => {
  drawProgressBar(newVal);
});
onMounted(() => {
  drawProgressBar(props.data.percentage);
});

defineExpose({
  handleMouseMove,
});
</script>

<style scoped lang="scss">

</style>
