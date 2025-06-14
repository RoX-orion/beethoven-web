<template>
  <Tag style="margin-bottom: .5rem"/>
  <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.cover">
    <img class="cover" :src="music.cover" :width="64" :height="64" alt=""/>
    <div class="flex-row content-space-between" style="width: 100%; align-items: center" @click="playMusicFun(music)">
      <div class="music-info">
        <p>{{ music.name }}</p>
        <p class="grey">{{ music.singer }}</p>
      </div>
      <div class="flex-row">
        <div style="margin: auto 0; line-height: 1rem">{{ durationFormater(music.duration) }}</div>
        <IconButton icon-name="add-circle" size="1.25rem" icon-color="rgba(0, 0, 0, .5)"
                    @click.stop="openAddMusicToPlaylistDialog(music.id)"/>
      </div>
    </div>
  </div>

  <a-modal title="添加到歌单" v-model:open="addMusicToPlaylistDialogVisible" width="30rem">
    <!--    <Search model-value="" searching=""/>-->
    <a-checkbox-group v-model:value="addMusicForm.playlistIds" name="checkboxgroup" :options="playlistOptions"/>
    <!--      <div class="playlist pointer" v-for="playlist in playlistList">-->
    <!--          <div class="flex-row">-->
    <!--            <div>-->
    <!--              {{playlist.title}}-->
    <!--            </div>-->
    <!--          </div>-->
    <!--      </div>-->
    <Button @click="addMusicToPlaylistFun" :loading="loading">
      Finish
    </Button>
    <template #footer/>
  </a-modal>
</template>

<script setup lang="ts">
import eventBus from '@/util/eventBus';
import { onMounted, ref, watch } from 'vue';
import { durationFormater } from '@/util/time';
import router from '@/router';
import IconButton from '@/components/IconButton.vue';
import { addMusicToPlaylist, getPlaylist } from '@/api/playlist';
import type { AddMusicFormType, PlaylistType } from '@/types/playlist';
import type { MusicItemType } from '@/types/global';
import Button from '@/components/Button.vue';
import Tag from "@/views/middle/Tag.vue";
import { searchMusic } from "@/api/music";
import { setMusicInfo, useGlobalStore } from "@/store/global";

const musicList = ref<Array<MusicItemType>>([]);
const defaultCover = '../../src/assets/img/playlistCover.png';

const globalStore = useGlobalStore();
const playMusicFun = (music: MusicItemType) => {
  router.push({ path: '/music/' + music.id });
  globalStore.global.media.musicId = music.id;
  globalStore.global.canPlay = true;
  setMusicInfo(music);
}

const searchMediaFun = (key: string) => {
  searchMusic({ page: 1, size: 100, key }).then(response => {
    response.data.forEach(e => e.cover = e.cover ? e.cover : defaultCover);
    musicList.value = response.data;
  }).finally(() => {
    globalStore.global.searching = false;
  });
}

onMounted(() => {
  searchMediaFun(globalStore.global.searchKey);
});

watch(() => globalStore.global.searchKey, newValue => {
  searchMediaFun(newValue.trim());
});

let addMusicToPlaylistDialogVisible = ref(false);
const playlistList = ref<PlaylistType[]>([]);
const playlistOptions = ref<any[]>([]);
let addMusicForm = ref<AddMusicFormType>({});
const openAddMusicToPlaylistDialog = (musicId: string) => {
  addMusicToPlaylistDialogVisible.value = true;
  getPlaylist({ page: 1, size: 10 }).then(response => {
    const { data } = response;
    playlistOptions.value = [];
    data.forEach(e => {
      playlistOptions.value.push({ 'label': e.title, 'value': e.id });
    });
    addMusicForm.value.musicId = musicId;
  });
};

const loading = ref(false);
const addMusicToPlaylistFun = () => {
  loading.value = true;
  addMusicToPlaylist(addMusicForm.value).then(() => {
    addMusicToPlaylistDialogVisible.value = false;
    eventBus.emit('getPlayListFun', 1);
  }).finally(() => {
    loading.value = false;
  });
};
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

.playlist {
  padding: .5rem;
  border-radius: .5rem;

  &:hover {
    background-color: var(--default-background-color);
  }
}
</style>
