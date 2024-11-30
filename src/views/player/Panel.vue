<template>
  <div class="flex-row panel-wrapper">
    <div class="button-group flex-row">
      <svg-icon class="button pointer" name="loop"  size="1.5rem"/>
      <svg-icon class="button pointer" name="queue" size="1.5rem"/>
    </div>
    <div class="flex-row sound-wrapper">
      <svg-icon class="sound-button pointer" v-if="volume === 0" name="volume-off" size="1.5rem" @click="changeMute"/>
      <svg-icon class="sound-button pointer" v-else name="volume-on" size="1.5rem" @click="changeMute"/>

      <div style="position: relative;">
        <div class="seek-line pointer" :style="{left: volume + '%'}" @mousedown="saveVolume"></div>
        <div style="display: block; margin: auto">
          <Progress v-model="volume" :data="progressData" @mousedown="changeVolume"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import Progress from '@/components/Progress.vue';
import { useSettingStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import type { ProgressType } from '@/types/global';
import { onMounted, reactive, ref, watch } from 'vue';
import { initPlayerSetting } from '@/lib/init';

const progressData: ProgressType = reactive({
  width: '10rem',
  height: '5px',
  radius: '0.556rem',
});

let volume = ref(10);

let emits = defineEmits(['update']);

const settingStore = useSettingStore();
const { setting } = storeToRefs(settingStore);

onMounted(() => {
  console.log('setting', setting);
  if (!setting) {
    initPlayerSetting();
  } else {
    volume.value = setting.value.player.volume;
  }
});
// settingStore.updatePlayer
const changeMute = () => {
  if (volume.value === 0) {
    volume.value = setting.value.player.volume;
  } else {
    setting.value.player.volume = volume.value;
    console.log(setting.value.player.volume);
    volume.value = 0;
  }
  // setting.value.player.isMute = !setting.value.player.isMute;
  // console.log(setting.value.player.isMute);
}

const saveVolume = () => {
  // volume
}

const changeVolume = (e: any) => {
  const offset = e.offsetX;
  const total = e.target.getBoundingClientRect().width;
  volume.value = Math.floor(offset / total * 100);
  setting.value.player.volume = volume.value;
}

watch(volume, (newVolume) => {
  emits('update', 'changeVolume', newVolume / 100);
});
</script>

<style scoped lang="scss">
.panel-wrapper {
  max-width: 30vw;
  margin: auto 0;
}

.button-group {
  .button {
    margin-right: 1rem;
  }
}

.sound-wrapper {
  align-items: center;
  position: relative;
}
</style>
