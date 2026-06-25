<template>
  <Tag style="margin-bottom: .5rem"/>
  <div v-if="searchLoading" class="search-skeleton-list">
    <div class="flex-row music-wrapper search-skeleton" v-for="index in 6" :key="`search-skeleton-${index}`">
      <span class="skeleton-block cover skeleton-cover"/>
      <div class="flex-row content-space-between skeleton-content">
        <div class="music-info skeleton-music-info">
          <span class="skeleton-block skeleton-title"/>
          <span class="skeleton-block skeleton-subtitle"/>
        </div>
        <div class="flex-row skeleton-actions">
          <span class="skeleton-block skeleton-duration"/>
          <span class="skeleton-block skeleton-action"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="hasSearched && musicList.length === 0" class="empty-state">
    没有找到相关音乐
  </div>
  <div v-else-if="!hasSearched" class="empty-state">
    暂无搜索内容
  </div>
  <template v-else>
    <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.id">
      <img class="cover" :src="music.cover" :width="64" :height="64" alt=""/>
      <div class="flex-row content-space-between" style="width: 100%; align-items: center" @click="playMusicFun(music)">
        <div class="music-info">
          <p>{{ music.name }}</p>
          <p class="grey">{{ music.singer }}</p>
        </div>
        <div class="flex-row">
          <div style="margin: auto 0; line-height: 1rem">{{ durationFormater(music.duration) }}</div>
          <IconButton v-if="music.id" icon-name="add-circle" size="1.25rem" icon-color="rgba(0, 0, 0, .5)"
                      @click.stop="openAddMusicToPlaylistDialog(music.id)"/>
        </div>
      </div>
    </div>
  </template>
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
import type { CheckboxOptionType } from 'ant-design-vue';
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
const searchLoading = ref(false);
const hasSearched = ref(false);
const defaultCover = '/assets/img/playlistCover.png';

const globalStore = useGlobalStore();
const playMusicFun = (music: MusicItemType) => {
  if (!music.id) {
    return;
  }
  router.push({ path: '/music/' + music.id });
  globalStore.global.media.musicId = music.id;
  globalStore.global.canPlay = true;
  setMusicInfo(music);
}

const searchMediaFun = (key: string) => {
  const searchKey = (key ?? '').trim();
  if (!searchKey) {
    musicList.value = [];
    hasSearched.value = false;
    searchLoading.value = false;
    globalStore.global.searching = false;
    return Promise.resolve();
  }

  hasSearched.value = true;
  searchLoading.value = true;
  return searchMusic({ page: 1, size: 100, key: searchKey }).then(response => {
    response.data.forEach((e: MusicItemType) => e.cover = e.cover ? e.cover : defaultCover);
    musicList.value = response.data;
  }).finally(() => {
    searchLoading.value = false;
    globalStore.global.searching = false;
  });
}


onMounted(() => {
  searchMediaFun(globalStore.global.searchKey);
});


watch(() => globalStore.global.searchKey, newValue => {
  searchMediaFun((newValue ?? '').trim());
});

let addMusicToPlaylistDialogVisible = ref(false);
const playlistOptions = ref<CheckboxOptionType[]>([]);
let addMusicForm = ref<AddMusicFormType>({ musicId: '', playlistIds: [] });
const openAddMusicToPlaylistDialog = (musicId: string) => {
  addMusicToPlaylistDialogVisible.value = true;
  getPlaylist({ page: 1, size: 10 }).then(response => {
    const { data } = response;
    playlistOptions.value = [];
    data.forEach((e: PlaylistType) => {
      playlistOptions.value.push({ 'label': e.title, 'value': e.id });
    });
    addMusicForm.value.musicId = musicId;
  });
};

const loading = ref(false);
const addMusicToPlaylistFun = () => {
  if (!addMusicForm.value.musicId || addMusicForm.value.playlistIds.length === 0) {
    return;
  }
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

.search-skeleton-list {
  display: grid;
  gap: .1rem;
}

.search-skeleton {
  pointer-events: none;
}

.skeleton-cover {
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  border-radius: .5rem;
}

.skeleton-content {
  align-items: center;
  width: 100%;
}

.skeleton-music-info {
  display: grid;
  flex: 1;
  max-width: 22rem;
  gap: .6rem;
}

.skeleton-title {
  width: 72%;
  height: .95rem;
}

.skeleton-subtitle {
  width: 46%;
  height: .75rem;
  opacity: .78;
}

.skeleton-actions {
  align-items: center;
  gap: .75rem;
}

.skeleton-duration {
  width: 2.8rem;
  height: .85rem;
}

.skeleton-action {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
}

.empty-state {
  margin: 1rem 0;
  padding: 1.5rem 1rem;
  border: 1px dashed rgba(105, 117, 134, .28);
  border-radius: .8rem;
  color: var(--text-secondary);
  font-size: .9rem;
  text-align: center;
  background: rgba(255, 255, 255, .36);
}
</style>
