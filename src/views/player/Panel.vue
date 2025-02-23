<template>
  <div class="flex-row panel-wrapper">
    <div class="button-group flex-row">
      <svg-icon class="button pointer" name="loop"  size="1.5rem"/>
      <svg-icon class="button pointer" name="queue" size="1.5rem"/>
    </div>
    <div class="flex-row sound-wrapper">
      <svg-icon class="sound-button pointer" v-if="volume === 0" name="volume-off" size="1.5rem" @click="changeMute"/>
      <svg-icon class="sound-button pointer" v-else name="volume-on" size="1.5rem" @click="changeMute"/>
      <a-slider class="progress" style="width: 100px" v-model:value="volume"/>
      <!--      <div class="progress" style="position: relative;">-->
      <!--        <div style="display: block; margin: auto">-->
      <!--          <Progress v-model="volume" :data="progressData" @mousedown="changeVolume"/>-->
      <!--        </div>-->
      <!--        <div class="seek-line pointer" :style="{left: volume + '%'}" @mousedown="saveVolume"></div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import { useGlobalStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import type { ProgressType } from '@/types/global';
import { onMounted, reactive, ref, watch } from 'vue';
import { initGlobal } from '@/lib/init';

const progressData: ProgressType = reactive({
  width: '10rem',
  height: '5px',
  radius: '0.556rem',
  percentage: 10,
});

let volume = ref(10);

let emits = defineEmits(['update']);

const globalStore = useGlobalStore();
const { global } = storeToRefs(globalStore);

onMounted(() => {
  screenWidth.value = window.innerWidth;
  setMobileVolume();
  if (!global) {
    initGlobal();
  } else {
    volume.value = global.value.player.volume;
  }
});

const changeMute = () => {
  if (volume.value === 0) {
    volume.value = global.value.player.volume;
  } else {
    global.value.player.volume = volume.value;
    volume.value = 0;
  }
}

const saveVolume = () => {
  // volume
}

const changeVolume = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  volume.value = Math.floor(offset / total * 100);
  global.value.player.volume = volume.value;
  progressData.percentage = volume.value;
}

const screenWidth = ref(0);
window.addEventListener('resize', function () {
  screenWidth.value = window.innerWidth;
  setMobileVolume();
});

const setMobileVolume = () => {
  if (screenWidth.value <= 800) {
    volume.value = 100;
    emits('update', 'changeVolume', 1);
  }
}

watch(volume, (newVolume) => {
  emits('update', 'changeVolume', newVolume / 100);
});
</script>

<style scoped lang="scss">
.panel-wrapper {
  margin: auto 0;
}

.button-group {
  .button {
    margin: auto .5rem;
  }
}

.sound-wrapper {
  align-items: center;
  position: relative;
}

@media (max-width: 800px) {
  .progress {
    display: none;
  }
}
</style>
