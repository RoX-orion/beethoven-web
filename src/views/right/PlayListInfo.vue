<template>
  <div class="flex-row">
    <!--      <Upload type="image" v-model="fileList"/>-->
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
  <Dialog title="编辑歌单" width="30rem" v-model="updatePlaylistDialogVisible">
    <div class="flex-row playlist-dialog">
      <div class="cover">
        <img src="../../assets/img/playlistCover.png" alt="cover"/>
      </div>
      <div class="update-playlist-info">
        <InputText class="input-text" placeholder="歌单名" v-model="updatePlaylistInfo.title"/>
        <InputText class="input-text" placeholder="简介(可选)" v-model="updatePlaylistInfo.introduction"/>
      </div>
    </div>
    <div style="padding: 1rem">
      <Button @click="handleUpdatePlaylist">
        FINISH
      </Button>
    </div>
  </Dialog>
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
import type { MusicItemType } from '@/types/global';
import type { PlaylistType } from '@/types/playlist';
import { sizeFormater } from '@/util/file';
import { formatTime } from '@/util/time';
import eventBus from '@/util/eventBus';
import Dialog from '@/components/Dialog.vue';
import Button from '@/components/Button.vue';
import InputText from '@/components/InputText.vue';

const route = useRoute();
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

const playlistInfo = ref<PlaylistType>({ id: '', title: '' });
let fileList = ref<any[]>([]);
const getPlaylistInfoFun = async (playlistId: string) => {
  getPlaylistInfo(playlistId).then(response => {
    playlistInfo.value = response.data;
    fileList.value[0] = response.data.cover;
  });
}

let updatePlaylistDialogVisible = ref(false);
let updatePlaylistInfo: PlaylistType = { id: '', title: '' };
const handleUpdatePlaylist = () => {
  updatePlaylist(updatePlaylistInfo).then(async response => {
    if (response.code === 200) {
      await getPlaylistInfoFun(playlistInfo.value.id);
      updatePlaylistDialogVisible.value = false;
      updatePlaylistInfo = { id: '', title: '' };
    }
  });
}

const updatePlaylistFun = () => {
  Object.assign(updatePlaylistInfo, playlistInfo.value);
  updatePlaylistDialogVisible.value = true;
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

.playlist-dialog {
  --gap: 1rem;

  margin: auto;

  .cover {
    padding: var(--gap);
    border-radius: .25rem;

    img {
      width: 5rem;
      height: 5rem;
    }
  }

  .update-playlist-info {
    flex-grow: 1;
    padding: var(--gap);

    .input-text {
      margin: .75rem 0;
    }
  }
}
</style>
