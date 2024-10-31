<template>
  <div>
    <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.cover">
      <img class="cover" :src="music.cover" alt="cover">
      <div class="flex-row content-space-between" style="width: 100%; align-items: center">
        <div>
          <p>{{ music.name }}</p>
          <p>{{ music.singer }}</p>
        </div>
        <div>
          <div class="info-font">{{ durationFormater(music.duration) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import eventBus from '@/util/eventBus';
import { onBeforeUnmount, reactive, ref } from 'vue';
import { durationFormater } from '@/util/time';

interface MusicItemType {
  cover?: string;
  name: string;
  singer?: string;
  duration: number;
}

const musicList = ref<Array<MusicItemType>>([]);
const defaultCover = '../../src/assets/img/playlistCover.png';
const getSearchMusicResult = (result: Array<MusicItemType>) => {
  result.forEach(e => e.cover = e.cover ? e.cover : defaultCover);
  musicList.value = result;
};
eventBus.on('getSearchMusicResult', getSearchMusicResult);

onBeforeUnmount(() => {
  eventBus.off('getSearchMusicResult', getSearchMusicResult);
});
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
  }
}
</style>
