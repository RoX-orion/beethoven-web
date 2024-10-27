<template>
  <div class="flex-col controls-wrapper">
    <div class="button-group flex-row">
      <svg-icon class="button" name="prev" size="1.5rem"/>
      <svg-icon class="button" name="play" size="1.5rem"/>
      <svg-icon class="button" name="next" size="1.35rem"/>
    </div>
    <div class="flex-row progress">
      <div class="time">2:17</div>
      <Progress style="margin-top: 1rem" ref="ddd" :data="progressData"/>
      <div class="time">5:45</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';
import Progress from '@/components/Progress.vue';
import { reactive, ref } from 'vue';
import type { ProgressType } from '@/types/global';

const ddd = ref();
// setInterval(() => {
//   console.log(ddd.value);
// }, 100);

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
  .time {
    line-height: 2rem;
    padding: 0 .5rem;
    color: rgba(56, 56, 56, 1);
  }
}
</style>
