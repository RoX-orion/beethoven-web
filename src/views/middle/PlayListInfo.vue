<template>
  <div class="flex-row" style="padding: 1rem">
    <!--    <a-image style="max-width: 8rem; max-height: 8rem" class="playlist-cover" :src="playlistInfo.cover"/>-->
    <div>
      <p class="pointer" style="font-size: 2rem" @click="updatePlaylistFun">{{ playlistInfo.title }}</p>
      <div style="color: grey">
        <span>{{ playlistInfo.author }}</span>
        <span>·</span>
        <span>{{ playlistInfo.musicCount }}首歌曲</span>
        <span>·</span>
        <span>{{ formatTime(playlistInfo.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
      </div>
    </div>
  </div>

  <div class="flex-row content-space-between playlist-info pointer" v-for="(music, index) in musicList"
       :key="music.id" @click="playMusicFun(music)">
    <div class="flex-row">
      <div style="margin: auto .5rem auto auto;">{{ index + 1 }}</div>
      <a-image class="cover" :src="music.cover" :width="64" :height="64"></a-image>
      <div style="margin: auto auto auto .5rem;">
        <p>{{ music.name }}</p>
        <p class="grey" style="font-size: .85rem">{{ music.singer }}</p>
      </div>
    </div>

    <div class="mobile">{{ music.album }}</div>
    <div class="mobile">{{ sizeFormater(music.size) }}</div>
    <div class="flex-row">
      <p style="margin: 0 .25rem">{{ durationFormater(music.duration) }}</p>
      <a-dropdown :trigger="['click']">
        <svg-icon name="more" color="black"/>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0">
              加入歌单
            </a-menu-item>
            <a-menu-item key="1">
              从此歌单中删除
            </a-menu-item>
            <a-menu-item key="3">
              分享
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
  <a-modal title="编辑歌单" width="30rem" v-model:open="updatePlaylistDialogVisible">
    <div class="flex-row playlist-dialog">
      <div class="playlist-cover-edit">
        <UploadImage type="image" v-model="uploadFile"/>
      </div>
      <div class="update-playlist-info">
        <InputText class="input-text" placeholder="歌单名" v-model="updatePlaylistInfo.title"/>
        <InputText class="input-text" placeholder="简介(可选)" v-model="updatePlaylistInfo.introduction"/>
        <span class="grey" style="font-size: 14px">是否公开: </span>
        <a-switch size="small" v-model:checked="updatePlaylistInfo.accessible"/>
      </div>
    </div>
    <div style="padding: 1rem 0">
      <Button @click="handleUpdatePlaylist" :loading="loading">
        确认
      </Button>
    </div>
    <template #footer/>
  </a-modal>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { durationFormater } from '@/util/time';
import {
  getPlaylistInfo,
  getPlaylistMusic,
  updatePlaylist,
} from '@/api/playlist';
import type { FileListType, MusicItemType } from '@/types/global';
import type { PlaylistType } from '@/types/playlist';
import { sizeFormater } from '@/util/file';
import { formatTime } from '@/util/time';
import Button from '@/components/Button.vue';
import InputText from '@/components/InputText.vue';
import { useGlobalStore } from '@/store/global';
import SvgIcon from '@/components/SvgIcon.vue';
import UploadImage from '@/components/UploadImage.vue';

const route = useRoute();
const musicList = ref<Array<MusicItemType>>([]);
const playlistCover = ref();
const loading = ref(false);

const uploadFile = ref<FileListType>();

const globalStore = useGlobalStore();
const playMusicFun = (music: MusicItemType) => {
  // router.push({ path: '/music/' + music.id });
  globalStore.global.media.musicId = music.id;
  globalStore.global.music = music;
  // eventBus.emit('playMusic', music);
};

const getPlaylistMusicFun = (playlistId: string) => {
  getPlaylistMusic(playlistId).then(response => {
    musicList.value = response.data;
  });
};

const playlistInfo = ref<PlaylistType>({ id: '', title: '', accessible: true });
const getPlaylistInfoFun = async (playlistId: string) => {
  getPlaylistInfo(playlistId).then(response => {
    playlistInfo.value = response.data;
    uploadFile.value = { url: response.data.cover };
  });
}

let updatePlaylistDialogVisible = ref(false);
let updatePlaylistInfo = ref<PlaylistType>({ id: '', title: '', accessible: true });
const handleUpdatePlaylist = () => {
  const playlistData = new FormData();
  playlistData.append('id', updatePlaylistInfo.value.id);
  playlistData.append('title', updatePlaylistInfo.value.title);
  playlistData.append('introduction', updatePlaylistInfo.value.introduction);
  playlistData.append('accessible', updatePlaylistInfo.value.accessible);
  playlistData.append('coverFile', uploadFile.value?.file);
  loading.value = true;
  updatePlaylist(playlistData).then(async response => {
    if (response.code === 200) {
      await getPlaylistInfoFun(playlistInfo.value.id);
      updatePlaylistDialogVisible.value = false;
      updatePlaylistInfo.value = { id: '', title: '', accessible: true };
    }
  }).finally(() => {
    loading.value = false;
  });
}

const updatePlaylistFun = () => {
  updatePlaylistInfo.value = playlistInfo.value;
  playlistCover.value = playlistInfo.value.cover;
  updatePlaylistDialogVisible.value = true;
}

onMounted(() => {
  if (route.params.id) {
    getPlaylistMusicFun(route.params.id as string);
    getPlaylistInfoFun(route.params.id as string);
  }
});

watch(() => route.params.id, (playlistId) => {
  getPlaylistMusicFun(playlistId as string);
  getPlaylistInfoFun(route.params.id as string);
});

</script>

<style scoped lang="scss">
.playlist-info {
  width: 100%;
  padding: .5rem 1rem;
  border-radius: .25rem;

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }

  div {
    margin: auto 0;
  }
}

.playlist-cover {
  width: 1rem;
  height: 1rem;
  border-radius: .5rem;
}

.playlist-dialog {
  --gap: .5rem;
  margin: auto;

  .playlist-cover-edit {
    padding: var(--gap);
    border-radius: .25rem;
  }

  .update-playlist-info {
    flex-grow: 1;
    padding: var(--gap);

    .input-text {
      margin-bottom: 1rem;
    }
  }
}

@media (max-width: 800px) {
  .mobile {
    display: none;
  }
}
</style>
