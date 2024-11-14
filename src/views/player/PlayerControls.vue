<template>
  <div class="flex-col controls-wrapper">
    <div class="button-group flex-row">
      <IconButton icon-name="prev"/>
      <IconButton v-if="play" icon-name="play" @click="playOrPause"/>
      <IconButton v-else icon-name="pause" @click="playOrPause"/>
      <IconButton icon-name="next"/>
      <!--      <svg-icon class="button" name="prev" size="1.5rem"/>-->
      <!--      <svg-icon class="button" name="play" size="1.5rem" @click="playOrPause"/>-->
      <!--      <svg-icon class="button" name="next" size="1.35rem"/>-->
    </div>
    <div class="flex-row progress">
      <div class="time">2:17</div>
      <div style="position: relative; width: 100%">
        <div class="seek-line pointer" style="margin: auto"></div>
        <Progress :data="progressData"/>
      </div>
      <div class="time">5:45</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Progress from '@/components/Progress.vue';
import { reactive, ref } from 'vue';
import type { ProgressType } from '@/types/global';
import IconButton from '@/components/IconButton.vue';

const play = ref(false);
// const props = defineProps<{
//   buttons: ControlButton;
// }>();
let emits = defineEmits(['update']);
const playOrPause = () => {
  play.value = !play.value;
  emits('update', 'play', play.value);
}

const progressData: ProgressType = reactive({
  width: '100%',
  height: '5px',
  radius: '0.156rem'
});
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
