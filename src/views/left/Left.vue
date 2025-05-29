<template>
  <div v-if="screenWidth > 800" class="left-wrapper custom-scroll">
    <div class="flex-row left-header">
      <div style="font-size: 1.2rem; padding: .5rem; margin: auto 0">
        歌单
      </div>
      <IconButton
        size="1.5rem"
        icon-name="add"
        icon-color="rgba(0, 0, 0, .5)"
        @click="addPlaylistDialogVisible = !addPlaylistDialogVisible"/>
    </div>
    <PlayList
      v-for="(playlist) in playlistList"
      :title="playlist.title"
      :musicCount="playlist.musicCount"
      :author="playlist.author"
      :cover="playlist.cover"
      :key="playlist.id"
      @click="gotoPlayListInfo(playlist.id)"/>
  </div>

  <a-drawer
    v-else
    class="left-wrapper custom-scroll"
    placement="left"
    :closable="false"
    :open="open"
    width="80%"
    @close="onClose"
  >
    <div class="flex-row left-header">
      <div style="font-size: 1.2rem; padding: .5rem; margin: auto 0">
        歌单
      </div>
      <IconButton
        size="1.5rem"
        icon-name="add"
        icon-color="rgba(0, 0, 0, .5)"
        @click="addPlaylistDialogVisible = !addPlaylistDialogVisible; open = false"/>
    </div>
    <PlayList
      v-for="(playlist) in playlistList"
      :title="playlist.title"
      :musicCount="playlist.musicCount"
      :author="playlist.author"
      :cover="playlist.cover"
      :key="playlist.id"
      @click="gotoPlayListInfo(playlist.id)"/>
  </a-drawer>

  <a-modal v-model:open="addPlaylistDialogVisible" width="30rem" title="新建歌单">
    <div class="flex-row playlist-dialog">
      <UploadImage class="upload-img" type="image" v-model="uploadFile"/>
      <div class="playlist-info">
        <InputText class="input-text" placeholder="歌单名" v-model="playlistInfo.title"/>
        <InputText class="input-text" placeholder="简介(可选)" v-model="playlistInfo.introduction"/>
        <span class="grey" style="font-size: 14px">是否公开: </span>
        <a-switch size="small" v-model:checked="playlistInfo.accessible"/>
      </div>
    </div>
    <div style="padding: 1rem 0">
      <Button @click="addPlaylistFun" :loading="loading">
        FINISH
      </Button>
    </div>
    <template #footer/>
  </a-modal>
</template>

<script setup lang="ts">
import PlayList from './PlayList.vue';
import { onMounted, reactive, ref } from 'vue';
import IconButton from '@/components/IconButton.vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import { addPlaylist, getPlaylist } from '@/api/playlist';
import type { PlaylistType } from '@/types/playlist';
import router from '@/router';
import { TOKEN } from '@/config';
import { getData } from '@/util/localStorage';
import mitt from '@/util/eventBus';
import UploadImage from '@/components/UploadImage.vue';
import type { FileListType } from '@/types/global';

let addPlaylistDialogVisible = ref(false);
const playlistList = ref<PlaylistType[]>([]);
const playlistInfo: PlaylistType = reactive({ id: '', title: '', accessible: true, author: '', musicCount: 0 });

onMounted(() => {
  screenWidth.value = window.innerWidth;
  if (getData(TOKEN)) {
    getPlayListFun(1);
  }
});

const getPlayListFun = (page: number) => {
  getPlaylist({ page, size: 10 }).then(response => {
    const {data} = response;
    playlistList.value = data;
    playlistList.value.forEach(e => e.cover = e.cover ? e.cover : '/assets/img/playlistCover.png');
  });
}

mitt.on('getPlayListFun', getPlayListFun);

const loading = ref(false);
const uploadFile = ref<FileListType>();
const addPlaylistFun = () => {
  loading.value = true;
  const playlistData = new FormData();
  if (uploadFile.value?.file) {
    playlistData.append('coverFile', uploadFile.value.file);
  }
  playlistData.append('title', playlistInfo.title);
  if (playlistInfo.introduction) {
    playlistData.append('introduction', playlistInfo.introduction);
  }
  playlistData.append('accessible', playlistInfo.accessible.toString());
  addPlaylist(playlistData).then(response => {
    if (response.code === 200) {
      addPlaylistDialogVisible.value = false;
      uploadFile.value = undefined;
      Object.assign(playlistInfo, { id: '', title: '', introduction: '', accessible: true });
      getPlayListFun(1);
    }
  }).finally(() => {
    loading.value = false;
  });
};

const open = ref(false);
const gotoPlayListInfo = (playlistId: string) => {
  router.push({ path: `/playlist/${playlistId}` });
  open.value = false;
}

const screenWidth = ref(0);
window.addEventListener('resize', function () {
  screenWidth.value = window.innerWidth;
});

const showDrawer = () => {
  open.value = true;
};

mitt.on('showDrawer', showDrawer);

const onClose = () => {
  open.value = false;
};
</script>

<style lang="scss" scoped>
.left-wrapper {
  width: var(--left-width);
  margin-right: 1rem;
  padding: var(--base-padding);
  border-radius: .25rem;
  overflow: hidden;
  overflow-y: scroll;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);

  .left-header {
    justify-content: space-between;
    align-items: center;
    line-height: 1.2;
  }
}

.playlist-dialog {
  --gap: 1rem;
  margin: auto;

  .playlist-info {
    flex-grow: 1;
    padding: 0 var(--gap);

    .input-text {
      margin: .75rem 0;
    }
  }
}

@media (max-width: 800px) {
  .playlist-dialog {
    display: flex;
    flex-direction: column;

    .upload-img {
      margin: auto;
    }

    .playlist-info {
      padding: var(--gap) 0;
    }
  }
}
</style>
