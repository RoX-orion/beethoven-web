<script setup lang="ts">
import { RouterView } from 'vue-router';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import { useAccountStore, useGlobalStore } from '@/store/global';
import { updateSetting } from '@/api/setting';

const route = useRoute();

watch(() => route?.params?.type, type => {
  switch (type) {
    case 'playlist':
      componentState.currentRightComponent = ComponentType.PLAYLIST;
      break;
    case 'music':
      componentState.currentRightComponent = ComponentType.SEARCH_RESULT;
      break;
    default:
      componentState.currentRightComponent = ComponentType.DEFAULT;
  }
});

const globalStore = useGlobalStore();
const accountStore = useAccountStore();
watch(() => globalStore.global, global => {
  updateSetting({
    userId: accountStore.account.id,
    musicId: global.media.musicId,
    currentTime: global.media.currentTime,
    isMute: global.player.isMute,
    volume: global.player.volume,
    playMode: global.player.playMode,
  });
}, { deep: true });

window.addEventListener('resize', function () {
  globalStore.global.windowWidth = window.innerWidth;
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
