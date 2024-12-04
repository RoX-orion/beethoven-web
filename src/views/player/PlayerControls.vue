<template>
  <div class="flex-col controls-wrapper">
    <div class="button-group flex-row">
      <IconButton icon-name="prev"/>
      <IconButton v-if="play" icon-name="play" @click="playOrPause"/>
      <IconButton v-else icon-name="pause" @click="playOrPause"/>
      <IconButton icon-name="next"/>
    </div>
    <div class="flex-row progress">
      <div class="time">{{ durationFormater(Math.floor(currentTime)) }}</div>
      <div style="width: 100%; position: relative; margin: auto">
        <Progress :data="progressData" @mousedown="changeCurrentTime"/>
        <div class="seek-line pointer" :style="{left: calculateProgress + '%'}"></div>
      </div>
      <div class="time" v-if="props.duration">{{ durationFormater(props.duration) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Progress from '@/components/Progress.vue';
import { computed, reactive, ref } from 'vue';
import type { ProgressType } from '@/types/global';
import IconButton from '@/components/IconButton.vue';
import { durationFormater } from '@/util/time';

const play = ref(false);
const props = defineProps({
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  currentTime: {
    type: Number,
    required: true,
    default: 0,
  },
});

let emits = defineEmits(['update']);
const playOrPause = () => {
  play.value = !play.value;
  emits('update', 'play', play.value);
}

const progressData: ProgressType = reactive({
  width: '100%',
  height: '5px',
  radius: '0.156rem',
  percentage: 0,
});

const calculateProgress = computed(() => {
  let current = Math.floor(props.currentTime / props.duration * 100);
  progressData.percentage = current;
  return current;
});

const changeCurrentTime = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  emits('update', 'changeCurrentTime', offset / total * props.duration);
}
</script>

<style scoped lang="scss">
.controls-wrapper {
  width: 40vw;
  margin: auto;
}

.button-group {
  width: 20vw;
  justify-content: space-between;
  margin: auto;

  .button {
    cursor: pointer;
    display: inline-block;
  }
}

.progress {
  position: relative;

  .time {
    line-height: 2rem;
    padding: 0 .5rem;
    color: rgba(56, 56, 56, 1);
  }
}
</style>
