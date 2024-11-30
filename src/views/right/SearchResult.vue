<template>
  <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.cover">
    <img class="cover" :src="music.cover" alt="cover">
    <div class="flex-row content-space-between" style="width: 100%; align-items: center" @click="playMusic(music)">
      <div class="music-info">
        <p>{{ music.name }}</p>
        <p>{{ music.singer }}</p>
      </div>
      <div>
        <div class="info-font">{{ durationFormater(music.duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import eventBus from '@/util/eventBus';
import { ref } from 'vue';
import { durationFormater } from '@/util/time';
import type { MusicItemType } from '@/types/global';
import router from '@/router';

const musicList = ref<Array<MusicItemType>>([]);
const defaultCover = '../../src/assets/img/playlistCover.png';
const getSearchMusicResult = (result: Array<MusicItemType>) => {
  result.forEach(e => e.cover = e.cover ? e.cover : defaultCover);
  musicList.value = result;
};

const playMusic = (music: MusicItemType) => {
  router.push({ path: '/music/' + music.id })
  eventBus.emit('playMusic', music);
}
eventBus.on('getSearchMusicResult', getSearchMusicResult);
</script>

<style scoped lang="scss">
.music-wrapper {
  padding: var(--base-padding);
  border-radius: .5rem;

  &:hover {
    background-color: var(--base-shadow);
  }

  .cover {
    width: 4rem;
    height: 4rem;
    border-radius: .25rem;
  }

  .music-info {
    margin: 0 .5rem;
  }
}
</style>
