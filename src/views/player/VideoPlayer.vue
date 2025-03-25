<template>
  <div class="" id="player"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import { useMusicStore } from '@/store/global';
import { componentState } from '@/store/componentState';
import { ComponentType } from '@/types/global';

const musicStore = useMusicStore();

const player = ref();
onMounted(() => {
  player.value = new Player({
    id: 'player',
    url: '',
    height: '100%',
    width: '100%',
  });
});

watch(() => musicStore.music, music => {
  if (music.video) {
    componentState.currentMiddleComponent = ComponentType.VIDEO_PLAYER;
  }
});
</script>

<style scoped lang="scss">

</style>
