<template>
  <div class="flex-row panel-wrapper">
    <div class="button-group flex-row">
      <svg-icon class="button pointer" name="loop"  size="1.5rem"/>
      <svg-icon class="button pointer" name="queue" size="1.5rem"/>
    </div>
    <div class="flex-row sound-wrapper">
      <svg-icon class="sound-button pointer" v-if="setting.player.isMute" name="mute" size="1.5rem" @click="changeMute"/>
      <svg-icon class="sound-button pointer" v-else name="sound" size="1.5rem" @click="changeMute"/>
      <Progress class="progress" :data="progressData"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import Progress from '@/components/Progress.vue';
import { useSettingStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import type { ProgressType } from '@/types/global';
import { reactive } from 'vue';

const progressData: ProgressType = reactive({
  width: '10rem',
  height: '5px',
  radius: '0.156rem'
});

const settingStore = useSettingStore();
const { setting } = storeToRefs(settingStore);
// settingStore.updatePlayer
const changeMute = () => {
  setting.value.player.isMute = !setting.value.player.isMute;
}
</script>

<style scoped lang="scss">
.panel-wrapper {
  max-width: 30vw;
  margin: auto 0;
}

.button-group {
  //align-items: center;

  .button {
    margin-right: 1rem;
  }
}

.sound-wrapper {
  align-items: center;
  .progress {
    padding: 0 5px;
  }
}
</style>
