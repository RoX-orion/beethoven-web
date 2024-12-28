<template>
  <TagGroup/>
  <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.cover">
    <img class="cover" :src="music.cover" alt="cover">
    <div class="flex-row content-space-between" style="width: 100%; align-items: center" @click="playMusicFun(music)">
      <div class="music-info">
        <p>{{ music.name }}</p>
        <p>{{ music.singer }}</p>
      </div>
      <div class="flex-row">
        <IconButton icon-name="add-circle" size="1rem" icon-color="rgba(0, 0, 0, .5)"
                    @click="openAddMusicToPlaylistDialog"/>
        <div style="margin: auto 0; line-height: 1rem">{{ durationFormater(music.duration) }}</div>
      </div>
    </div>
  </div>

  <Dialog title="添加到歌单" v-model="addMusicToPlaylistDialogVisible" width="30rem">
    <!--    <Search model-value="" searching=""/>-->
    <div>
      <div v-for="playlist in playlistList">
        <img class="playlist-cover" :src='playlist.cover' alt="cover"/>
      </div>
    </div>
    <Button>
      Finish
    </Button>
  </Dialog>
</template>

<script setup lang="ts">
import eventBus from '@/util/eventBus';
import { onMounted, ref } from 'vue';
import { durationFormater } from '@/util/time';
import router from '@/router';
import IconButton from '@/components/IconButton.vue';
import Dialog from '@/components/Dialog.vue';
import { getPlaylist } from '@/api/playlist';
import type { PlaylistType } from '@/types/playlist';
import type { MusicItemType } from '@/types/global';
import Button from '@/components/Button.vue';
import TagGroup from '@/views/right/TagGroup.vue';
import { useRoute } from 'vue-router';

const musicList = ref<Array<MusicItemType>>([]);
const defaultCover = '../../src/assets/img/playlistCover.png';
const getSearchMusicResult = (result: Array<MusicItemType>) => {
  result.forEach(e => e.cover = e.cover ? e.cover : defaultCover);
  musicList.value = result;
};

const playMusicFun = (music: MusicItemType) => {
  router.push({ path: '/music/' + music.id });
  eventBus.emit('playMusic', music);
}
eventBus.on('getSearchMusicResult', getSearchMusicResult);

let addMusicToPlaylistDialogVisible = ref(false);
const playlistList = ref<PlaylistType[]>([]);
const openAddMusicToPlaylistDialog = () => {
  getPlaylist({ page: 1, size: 10 }).then(response => {
    const { data } = response;
    playlistList.value = data;
    addMusicToPlaylistDialogVisible.value = true;
  });
}

const route = useRoute();
onMounted(() => {
  // console.log('search init', route);
})
</script>

<style scoped lang="scss">
.music-wrapper {
  padding: var(--base-padding);
  border-radius: .5rem;

  &:hover {
    background-color: var(--base-shadow);
  }

  .music-info {
    margin: 0 .5rem;
  }
}
</style>
