<template>
  <Tag style="margin-bottom: .5rem"/>
  <div v-if="musicList.length === 0 && !globalStore.global.searching" class="empty-state">
    没有找到相关音乐
  </div>
  <div class="flex-row pointer music-wrapper" v-for="music in musicList" :key="music.id">
    <img class="cover" :src="music.cover" :width="64" :height="64" alt=""/>
    <div class="flex-row content-space-between music-content" @click="playMusicFun(music)">
      <div class="music-info">
        <p>{{ music.name }}</p>
        <p class="grey">{{ music.singer }}</p>
      </div>
      <div class="flex-row music-actions">
        <div class="duration">{{ durationFormater(music.duration) }}</div>
        <IconButton v-if="music.id" icon-name="add-circle" size="1.25rem" icon-color="rgba(0, 0, 0, .5)"
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
      添加
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
const defaultCover = '../../src/assets/img/playlistCover.png';

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
  if (!key) {
    musicList.value = [];
    globalStore.global.searching = false;
    return;
  }
  searchMusic({ page: 1, size: 100, key }).then(response => {
    response.data.forEach((e: MusicItemType) => e.cover = e.cover ? e.cover : defaultCover);
    musicList.value = response.data;
  }).finally(() => {
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
  align-items: center;
  margin: 0 .75rem;
  padding: .65rem .75rem;
  border: 1px solid transparent;
  border-radius: var(--radius-card);
  transition: background-color .18s ease, border-color .18s ease, transform .18s ease;

  &:hover {
    border-color: var(--surface-border);
    background-color: var(--surface-hover);
    transform: translateX(2px);
  }

  .cover {
    border-radius: var(--radius-card);
    box-shadow: 0 .35rem .8rem rgba(32, 53, 77, .1);
  }

  .music-content {
    width: 100%;
    min-width: 0;
    align-items: center;
  }

  .music-info {
    min-width: 0;
    margin: 0 .75rem;

    p {
      overflow: hidden;
      color: var(--text-primary);
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .grey {
      color: var(--text-secondary);
      font-size: .86rem;
      font-weight: 400;
    }
  }

  .music-actions {
    flex-shrink: 0;
    align-items: center;
    gap: .5rem;
    color: var(--text-secondary);
  }

  .duration {
    min-width: 3.5rem;
    text-align: right;
    line-height: 1rem;
    font-size: .86rem;
  }
}

.empty-state {
  margin: 1rem;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  text-align: center;
  border: 1px dashed var(--surface-border-strong);
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, .36);
}

.playlist {
  padding: .5rem;
  border-radius: .5rem;

  &:hover {
    background-color: var(--default-background-color);
  }
}

@media (max-width: 800px) {
  .music-wrapper {
    margin: 0 .5rem;
    padding: .6rem;
  }

  .duration {
    display: none;
  }
}
</style>
