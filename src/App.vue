<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import {onMounted, watch} from 'vue';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import { useGlobalStore } from '@/store/global';

const route = useRoute();

watch(() => route?.params?.type, async type => {
  const query = route.query;
  if (type === 'playlist')
    componentState.currentMiddleComponent = ComponentType.PLAYLIST;
  else if (type === 'music' && query?.hasOwnProperty('search')) {
    globalStore.global.searchKey = query.search;
    componentState.currentMiddleComponent = ComponentType.SEARCH_RESULT;
  } else {
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
