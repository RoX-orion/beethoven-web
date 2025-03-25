<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { watch } from 'vue';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import { useGlobalStore } from '@/store/global';

const route = useRoute();

watch(() => route?.params?.type, type => {
  switch (type) {
    case 'playlist':
      componentState.currentMiddleComponent = ComponentType.PLAYLIST;
      break;
    case 'music':
      componentState.currentMiddleComponent = ComponentType.SEARCH_RESULT;
      break;
    default:
      componentState.currentMiddleComponent = ComponentType.DEFAULT;
  }
});

const globalStore = useGlobalStore();
// const accountStore = useAccountStore();
// watch(() => globalStore.global, global => {
//   updateSetting({
//     userId: accountStore.account.id,
//     musicId: global.media.musicId,
//     currentTime: global.media.currentTime,
//     isMute: global.player.isMute,
//     volume: global.player.volume,
//     playMode: global.player.playMode,
//   });
// }, { deep: true });

window.addEventListener('resize', function () {
  globalStore.global.windowWidth = window.innerWidth;
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
