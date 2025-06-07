<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import { useGlobalStore } from '@/store/global';

const route = useRoute();

watch(() => route?.params?.type, async type => {
  await setComponent(type as string);
});

const globalStore = useGlobalStore();
watch(() => globalStore.global.searchKey, () => {
  const query = route.query;
  if (route?.params?.type === 'music' && query?.hasOwnProperty('search') && globalStore?.global?.searchKey?.length > 0) {
    componentState.currentMiddleComponent = ComponentType.SEARCH_RESULT;
  } else {
    componentState.currentMiddleComponent = ComponentType.DEFAULT;
  }
});
onMounted(async () => {
  await setComponent(route?.params?.type as string);
});

const setComponent = async (type: string) => {
  if (type === 'playlist') {
    componentState.currentMiddleComponent = ComponentType.PLAYLIST;
  } else {
    componentState.currentMiddleComponent = ComponentType.DEFAULT;
  }
}

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
  globalStore.global.mobile = window.innerWidth <= 800;
});

onMounted(() => {
  globalStore.global.mobile = window.innerWidth <= 800;
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
