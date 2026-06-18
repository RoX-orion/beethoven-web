<template>
  <div id="playlist-info-top" class="flex-row playlist-hero">
    <a-image
      class="playlist-hero-cover"
      :src="playlistInfo.cover"/>
    <div class="playlist-hero-content">
      <span class="hero-label">Playlist</span>
      <p class="pointer playlist-title" @click="updatePlaylistFun">{{
          playlistInfo.title
        }}</p>
      <div class="playlist-meta">
        <span>{{ playlistInfo.author }}</span>
        <span>·</span>
        <span>{{ playlistInfo.musicCount }}首歌曲</span>
        <span>·</span>
        <span>{{ playlistInfo.createTime ? formatTime(playlistInfo.createTime, '{y}-{m}-{d} {h}:{i}') : '' }}</span>
      </div>
    </div>
  </div>

  <div v-if="musicList.length === 0" class="empty-state">
    这个歌单还没有歌曲
  </div>
  <div class="track-row playlist-info pointer" v-for="(music, index) in musicList"
       :key="music.id" @click.stop="playMusicFun(music)">
    <div class="track-main">
      <div class="track-index">{{ index + 1 }}</div>
      <img class="cover" :src="music.cover" :width="48" :height="48" alt=""/>
      <div class="track-text">
        <p>{{ music.name }}</p>
        <p class="grey" style="font-size: .8rem">{{ music.singer }}</p>
      </div>
    </div>
    <div class="track-col track-album">{{ music.album }}</div>
    <div class="track-col track-size">{{ sizeFormater(music.size) }}</div>
    <div class="track-col track-duration">
      {{ durationFormater(music.duration) }}
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
.playlist-hero {
  gap: 1.25rem;
  padding: 1.35rem;
  margin: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
  background: linear-gradient(135deg, rgba(47, 143, 118, .16), rgba(64, 158, 255, .1)),
  rgba(255, 255, 255, .48);
  box-shadow: 0 .7rem 1.6rem rgba(32, 53, 77, .07);
}

.playlist-hero-cover {
  aspect-ratio: 1 / 1;
  width: min(5.5rem, 16vw);
  max-width: 5.5rem;
  max-height: 5.5rem;
  overflow: hidden;
  border-radius: var(--radius-card);
  box-shadow: 0 .75rem 1.8rem rgba(32, 53, 77, .18);
}

.playlist-hero-content {
  display: flex;
  flex-direction: column;
  justify-content: end;
  min-width: 0;
}

.hero-label {
  color: var(--brand-primary);
  font-size: .78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.playlist-title {
  margin: .35rem 0 .6rem;
  color: var(--text-primary);
  font-size: clamp(1.45rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0;
}

.playlist-meta {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem;
  color: var(--text-secondary);
}

.track-row {
  display: grid;
  grid-template-columns: 1fr 10rem 5.5rem 4.5rem;
  align-items: center;
  width: 100%;
  margin: 0 .75rem;
  padding: .55rem .75rem;
  border: 1px solid transparent;
  border-radius: var(--radius-card);
  transition: background-color .18s ease, border-color .18s ease, transform .18s ease;

  &:hover {
    border-color: var(--surface-border);
    background-color: var(--surface-hover);
    transform: translateX(2px);
  }
}

.track-main {
  display: flex;
  align-items: center;
  min-width: 0;

  .cover {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-card);
    object-fit: cover;
    box-shadow: 0 .35rem .8rem rgba(32, 53, 77, .1);
  }
}

.track-index {
  width: 1.8rem;
  flex-shrink: 0;
  margin-right: .5rem;
  color: var(--text-secondary);
  text-align: right;
}

.track-text {
  min-width: 0;
  margin-left: .7rem;

  p {
    overflow: hidden;
    max-width: 20rem;
    color: var(--text-primary);
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.track-col {
  overflow: hidden;
  color: var(--text-secondary);
  font-size: .85rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-album {
  padding-right: 1.5rem;
}

.track-size {
  text-align: right;
  padding-right: 1.5rem;
}

.track-duration {
  text-align: right;
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
  .playlist-hero {
    flex-direction: column;
    margin: .75rem;
    padding: 1rem;
  }

  .playlist-hero-cover {
    width: 100%;
    max-width: none;
    max-height: none;
  }

  .track-row {
    margin: 0 .5rem;
    padding: .65rem .6rem;
    grid-template-columns: 1fr 4rem;
  }

  .track-text p {
    max-width: 12rem;
  }

  .track-album,
  .track-size {
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
