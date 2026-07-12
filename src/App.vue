<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed, defineAsyncComponent, onMounted, onUnmounted, watch } from 'vue';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import { useGlobalStore } from '@/store/global';
import { useAudioPlayer } from '@/composables/useAudioPlayer';
import { ConfigProvider, theme as antTheme } from 'ant-design-vue';

const Player = defineAsyncComponent(() => import('@/views/player/Player.vue'));
const MiniPlayer = defineAsyncComponent(() => import('@/views/player/MiniPlayer.vue'));

const route = useRoute();
const isHome = computed(() => String(route.name ?? '') === 'Home');
const showMiniPlayer = computed(() => {
  const name = String(route.name ?? '');
  return name === 'BugReport' || route.path.startsWith('/manage') || name === 'Manage';
});

const { init, destroy } = useAudioPlayer();

watch(() => route?.params?.type, async type => {
  await setComponent(type as string);
});

const globalStore = useGlobalStore();
const antdTheme = computed(() => ({
  algorithm: globalStore.global.darkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  token: {
    colorPrimary: globalStore.global.darkMode ? '#78aaff' : '#377dff',
    colorInfo: globalStore.global.darkMode ? '#78aaff' : '#377dff',
    colorError: globalStore.global.darkMode ? '#ff7474' : '#d94a4a',
    borderRadius: 8,
  },
}));
watch(() => globalStore.global.searchKey, () => {
  const query = route.query;
  if (route?.params?.type === 'music' && query?.hasOwnProperty('search') && globalStore?.global?.searchKey?.length > 0) {
    componentState.currentMiddleComponent = ComponentType.SEARCH_RESULT;
  } else {
    componentState.currentMiddleComponent = ComponentType.DEFAULT;
  }
});

const setComponent = async (type: string) => {
  if (type === 'playlist') {
    componentState.currentMiddleComponent = ComponentType.PLAYLIST;
  } else {
    componentState.currentMiddleComponent = ComponentType.DEFAULT;
  }
}

const updateWindowState = () => {
  globalStore.global.windowWidth = window.innerWidth;
  globalStore.global.mobile = window.innerWidth <= 800;
};

window.addEventListener('resize', updateWindowState);

onMounted(async () => {
  updateWindowState();
  await init();
  await setComponent(route?.params?.type as string);
});

onUnmounted(() => {
  destroy();
  window.removeEventListener('resize', updateWindowState);
});
</script>

<template>
  <ConfigProvider :theme="antdTheme">
    <div id="audioPlayer" style="display: none"></div>
    <RouterView/>
    <Player v-if="isHome"/>
    <MiniPlayer v-else-if="showMiniPlayer"/>
  </ConfigProvider>
</template>

<style scoped>
</style>
