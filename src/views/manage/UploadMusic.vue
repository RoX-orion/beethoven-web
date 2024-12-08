<template>
  <div class="manage-wrapper">
    <div class="flex-row content-center">
      <Upload v-model="musicList" type="image"/>
      <Upload v-model="coverList" type="file"/>
    </div>
    <div class="music-info">
      <InputText class="input-text" placeholder="请输入歌曲名" v-model="data.name"/>
      <InputText class="input-text" placeholder="请输入歌手名" v-model="data.singer"/>
      <InputText class="input-text" placeholder="请输入专辑名(可选)" v-model="data.album"/>
      <Button @click="uploadMusicFun" label="FINISH" :loading="uploading"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import Upload from '@/components/Upload.vue';
import { uploadMusic } from '@/api/music';
import type { FileListType } from '@/types/global';

const data = reactive({
  name: '',
  singer: '',
  album: '',
});

const musicList = ref<FileListType[]>([]);
const coverList = ref<FileListType[]>([]);

let uploading = ref(false);

const uploadMusicFun = () => {
  if (musicList.value.length === 0) {
    alert('Please select music!');
    return;
  }
  if (coverList.value.length === 0) {
    alert('Please select cover!');
    return;
  }
  uploading.value = true;
  const musicData = new FormData();
  musicData.append('music', musicList.value[0].data);
  musicData.append('cover', coverList.value[0].data);
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album.trim());

  uploadMusic(musicData).then(() => {

  }).finally(() => {
    uploading.value = false;
  });
}
</script>

<style scoped lang="scss">
.manage-wrapper {
  max-width: 30rem;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: .3rem;

  .music-info {
    .input-text {
      margin: 1.25rem 0;
      width: 100%;
      height: 3rem;
    }
  }
}
</style>
