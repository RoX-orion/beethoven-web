<template>
  <div class="" id="videoPlayer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import 'xgplayer/dist/index.min.css';
import { useGlobalStore } from '@/store/global';
import { getVideoInfo } from '@/api/video';
import Player from "xgplayer";

const globalStore = useGlobalStore();

const player = ref();
onMounted(() => {
  player.value = new Player({
    id: 'videoPlayer',
    url: '',
    height: '100%',
    width: '100%',
  });
  if (globalStore.global.videoId) {
    getVideoInfoFun(globalStore.global.videoId);
  }
});

watch(() => globalStore.global.videoId, videoId => {
  if (videoId) {
    getVideoInfoFun(videoId);
  }
});

const getVideoInfoFun = (videoId: number) => {
  getVideoInfo(videoId).then(response => {
    if (response.data.link)
      player.value.switchURL(response.data.link);
  });
}
</script>

<style scoped lang="scss">

</style>
