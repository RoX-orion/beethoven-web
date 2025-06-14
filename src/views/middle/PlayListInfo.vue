<template>
  <div id="playlist-info-top" class="flex-row" style="padding: 1rem">
    <a-image
      style="aspect-ratio: 1 / 1; max-width: 12rem; max-height: 12rem; border-radius: .25rem; box-shadow: 0 .25rem 1rem rgba(0, 0, 0, .5);"
      :src="playlistInfo.cover"/>
    <div style="padding: 0 1rem; display: flex; flex-direction: column; justify-content: end">
      <p class="pointer" style="font-weight: bold; font-size: clamp(1.125rem, 4vw, 3rem);" @click="updatePlaylistFun">{{
          playlistInfo.title
        }}</p>
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
       :key="music.id" @click.stop="playMusicFun(music)">
    <div class="flex-row">
      <div style="margin: auto .5rem auto auto;">{{ index + 1 }}</div>
      <img class="cover" :src="music.cover" :width="64" :height="64" alt=""/>
      <div style="margin: auto auto auto .5rem;">
        <p>{{ music.name }}</p>
        <p class="grey" style="font-size: .85rem">{{ music.singer }}</p>
      </div>
    </div>

    <div class="mobile">{{ music.album }}</div>
    <div class="mobile">{{ sizeFormater(music.size) }}</div>
    <div class="flex-row">
      <p style="margin: 0 .25rem">{{ durationFormater(music.duration) }}</p>
      <!--      <a-dropdown :trigger="['click']">-->
      <!--        <svg-icon name="more" color="black"/>-->
      <!--        <template #overlay>-->
      <!--          <a-menu>-->
      <!--            <a-menu-item key="0">-->
      <!--              加入歌单-->
      <!--            </a-menu-item>-->
      <!--            <a-menu-item key="1" @click="removeMusicFun(music.id)">-->
      <!--              从此歌单中删除-->
      <!--            </a-menu-item>-->
      <!--            <a-menu-item key="3">-->
      <!--              分享-->
      <!--            </a-menu-item>-->
      <!--          </a-menu>-->
      <!--        </template>-->
      <!--      </a-dropdown>-->
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
import { durationFormater, formatTime } from '@/util/time';
import { getPlaylistInfo, getPlaylistMusic, removeMusic, updatePlaylist } from '@/api/playlist';
import type { FileListType, MusicItemType } from '@/types/global';
import type { PlaylistType } from '@/types/playlist';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';
import InputText from '@/components/InputText.vue';
import { setMusicInfo, useGlobalStore } from '@/store/global';
import UploadImage from '@/components/UploadImage.vue';
import { notification } from 'ant-design-vue';
import eventBus from '@/util/eventBus';
import { getData } from '@/util/localStorage';
import { TOKEN } from '@/config';

const route = useRoute();
const musicList = ref<Array<MusicItemType>>([]);
const playlistCover = ref();
const loading = ref(false);
let playlistId: string;

const uploadFile = ref<FileListType>();

const globalStore = useGlobalStore();
const playMusicFun = (music: MusicItemType) => {
  globalStore.global.media.musicId = music.id;
  globalStore.global.canPlay = true;
  setMusicInfo(music);
};

const getPlaylistMusicFun = (playlistId: string) => {
  getPlaylistMusic(playlistId).then(response => {
    musicList.value = response.data;
  });
};

const playlistInfo = ref<PlaylistType>({ id: '', title: '', accessible: true, musicCount: 0, author: '' });
const getPlaylistInfoFun = async (playlistId: string) => {
  getPlaylistInfo(playlistId).then(response => {
    playlistInfo.value = response.data;
    uploadFile.value = { url: response.data.cover };
  });
}

let updatePlaylistDialogVisible = ref(false);
let updatePlaylistInfo = ref<PlaylistType>({ id: '', title: '', accessible: true, musicCount: 0, author: '' });
const handleUpdatePlaylist = () => {
  const playlistData = new FormData();
  playlistData.append('id', updatePlaylistInfo.value.id);
  playlistData.append('title', updatePlaylistInfo.value.title);
  if (updatePlaylistInfo.value.introduction) {
    playlistData.append('introduction', updatePlaylistInfo.value.introduction);
  }
  playlistData.append('accessible', updatePlaylistInfo.value.accessible.toString());
  if (uploadFile.value?.file) {
    playlistData.append('coverFile', uploadFile.value.file);
  }
  loading.value = true;
  updatePlaylist(playlistData).then(async response => {
    if (response.code === 200) {
      eventBus.emit('getPlayListFun', 1);
      await getPlaylistInfoFun(playlistInfo.value.id);
      updatePlaylistDialogVisible.value = false;
      updatePlaylistInfo.value = { id: '', title: '', accessible: true, musicCount: 0, author: '' };
    }
  }).finally(() => {
    loading.value = false;
  });
}

const updatePlaylistFun = () => {
  if (!getData(TOKEN)) {
    return;
  }
  updatePlaylistInfo.value = JSON.parse(JSON.stringify(playlistInfo.value))
  playlistCover.value = playlistInfo.value.cover;
  updatePlaylistDialogVisible.value = true;
}

onMounted(() => {
  if (route.params.id) {
    playlistId = route.params.id as string;
    getPlaylistMusicFun(playlistId);
    getPlaylistInfoFun(playlistId);
  }
  changeScreenWidth(globalStore.global.mobile);
});

watch(() => route.params.id, id => {
  playlistId = id as string;
  getPlaylistMusicFun(playlistId);
  getPlaylistInfoFun(playlistId);
});

watch(() => globalStore.global.mobile, value => {
  changeScreenWidth(value);
});

const changeScreenWidth = (mobile: boolean) => {
  // if (mobile) {
  //   const element = document.getElementById('playlist-info-top')!;
  //   element.classList.remove('flex-row');
  //   element.classList.add('flex-col');
  // }
}

const removeMusicFun = (musicId: string) => {
  removeMusic(playlistId, musicId).then(() => {
    notification.success({
      message: '删除成功',
    });
    getPlaylistMusicFun(playlistId);
    eventBus.emit('getPlayListFun', 1);
  });
}
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

  .playlist-dialog {
    display: flex;
    flex-direction: column;

    .playlist-cover-edit {
      margin: auto;
    }
  }
}
</style>
