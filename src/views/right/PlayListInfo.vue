<template>
  <div class="">
    <div class="flex-row">
      <!--      <Upload type="image" v-model="fileList"/>-->
      <div>
        <p class="pointer" style="font-size: 2rem">{{ playListInfo.title }}</p>
        <div style="color: grey">
          <span>{{ playListInfo.author }}</span>
          <span>·</span>
          <span>{{ playListInfo.musicCount }}首歌曲</span>
          <span>·</span>
          <span>{{ formatTime(playListInfo.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </div>

      </div>
    </div>

    <div class="flex-row content-space-between playlist-info pointer" v-for="(music, index) in musicList"
         :key="music.id" @click="playMusicFun(music)">
      <div class="flex-row">
        <div style="margin: auto .5rem auto auto;">{{ index + 1 }}</div>
        <img class="cover" :src="music.cover" alt="cover">
        <div style="margin: auto auto auto .5rem;">
          <p>{{ music.name }}</p>
          <p class="grey">{{ music.singer }}</p>
        </div>
      </div>

      <div>{{ music.album }}</div>
      <div>{{ sizeFormater(music.size) }}</div>
      <div>{{ durationFormater(music.duration) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { durationFormater } from '@/util/time';
import { getPlaylistInfo, getPlaylistMusic } from '@/api/playlist';
import type { MusicItemType } from '@/types/global';
import type { PlaylistType } from '@/types/playlist';
import { sizeFormater } from '@/util/file';
import { formatTime } from '@/util/time';
import eventBus from '@/util/eventBus';

const route = useRoute();
const playlistId = route.params.id as string;
const musicList = ref<Array<MusicItemType>>([]);

const playMusicFun = (music: MusicItemType) => {
  // router.push({ path: '/music/' + music.id });
  eventBus.emit('playMusic', music);
}

const getPlaylistMusicFun = (playlistId: string) => {
  getPlaylistMusic(playlistId).then(response => {
    musicList.value = response.data;
  });
};

let playListInfo = ref<PlaylistType>({ id: '' });
let fileList = ref<any[]>([]);
const getPlaylistInfoFun = (playlistId: string) => {
  getPlaylistInfo(playlistId).then(response => {
    playListInfo.value = response.data;
    fileList.value[0] = response.data.cover;
  });
}

onMounted(() => {
  getPlaylistMusicFun(route.params.id as string);
  getPlaylistInfoFun(route.params.id as string);
});

watch(() => route.params.id, (playlistId) => {
  getPlaylistMusicFun(playlistId as string);
  getPlaylistInfoFun(route.params.id as string);
});

</script>

<style scoped lang="scss">
.playlist-cover {
  width: 7rem;
  height: 7rem;
  border-radius: .5rem;
  background-color: #409eff;
}

.playlist-info {
  width: 100%;
  padding: .5rem;
  border-radius: .25rem;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }

  div {
    margin: auto 0;
  }
}
</style>
