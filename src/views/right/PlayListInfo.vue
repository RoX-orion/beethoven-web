<template>
  <div class="">
    <img class="playlist-cover" src="" alt="cover">
    <div class="flex-row playlist-wrapper" v-for="music in musicList" :key="music.id">
      <img class="cover" :src="music.cover" alt="cover">
      <div class="flex-row content-space-between" style="width: 100%; align-items: center" @click="playMusicFun(music)">
        <div class="music-info">
          <p>{{ music.name }}</p>
          <p class="grey">{{ music.singer }}</p>
        </div>
        <div class="flex-row">
          <div style="margin: auto 0; line-height: 1rem">{{ durationFormater(music.duration) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { durationFormater } from '@/util/time';
import { getPlaylistMusic } from '@/api/playlist';
import type { MusicItemType } from '@/types/global';

const route = useRoute();
const playlistId = route.params.id as string;
const musicList = ref<Array<MusicItemType>>([]);

const playMusicFun = (music: MusicItemType) => {

}

const getPlaylistMusicFun = (playlistId: string) => {
  getPlaylistMusic(playlistId).then(response => {
    musicList.value = response.data;
  });
};

onMounted(() => {
  getPlaylistMusic(route.params.id as string).then(response => {
    musicList.value = response.data;
  });
});

watch(() => route.params.id, (playlistId) => {
  getPlaylistMusicFun(playlistId as string);
});
</script>

<style scoped lang="scss">
.playlist-cover {
  width: 6rem;
  height: 6rem;
}

.playlist-wrapper {
  padding: .5rem;
  border-radius: .25rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
}
</style>
