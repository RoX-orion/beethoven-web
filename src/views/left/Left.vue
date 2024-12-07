<template>
  <div class="left-wrapper custom-scroll">
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
      :key="playlist.id"/>
  </div>

  <Dialog v-model="addPlaylistDialogVisible" width="30rem" title="新建歌单">
    <div class="flex-row playlist-dialog">
      <div class="cover">
        <img src="../../assets/img/playlistCover.png" alt="cover"/>
      </div>
      <div class="playlist-info">
        <InputText class="input-text" placeholder="歌单名" v-model="playlistInfo.title"/>
        <InputText class="input-text" placeholder="简介(可选)" v-model="playlistInfo.introduction"/>
      </div>
    </div>
    <div style="padding: 1rem">
      <Button @click="addPlaylistFun">
        FINISH
      </Button>
    </div>

  </Dialog>
</template>

<script setup lang="ts">
import PlayList from './PlayList.vue';
import Dialog from '@/components/Dialog.vue';
import { onMounted, reactive, ref } from 'vue';
import IconButton from '@/components/IconButton.vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import type { PlaylistInfo } from '@/types/global';
import { addPlaylist, getPlaylist } from '@/api/playlist';
import { Page } from '@/api/params/query';

let addPlaylistDialogVisible = ref(false);
const playlistList = ref([]);
const playlistInfo: PlaylistInfo = reactive({title: ''});

onMounted(async () => {
  await getPlayListFun(1);
});

const getPlayListFun = async (pageNum: number) => {
  let page = new Page(pageNum, 10);
  await getPlaylist(page).then(response => {
    const {data} = response;
    playlistList.value = data;
  });
}

const addPlaylistFun = async () => {
  await addPlaylist(playlistInfo).then(() => {
    addPlaylistDialogVisible.value = false;
    Object.assign(playlistInfo, {title: ''});
    getPlayListFun(1);
  });
}
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

  .cover {
    padding: var(--gap);
    border-radius: .25rem;

    img {
      width: 5rem;
      height: 5rem;
      //margin: auto;
    }
  }

  .playlist-info {
    flex-grow: 1;
    padding: var(--gap);

    .input-text {
      margin: .75rem 0;
    }
  }
}
</style>
