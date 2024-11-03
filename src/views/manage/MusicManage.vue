<template>
  <div class="manage-wrapper">
    <div class="flex-row content-center">
      <Upload v-model="musicList"/>
      <Upload v-model="coverList"/>
    </div>
    <div class="music-info">
      <InputText class="input-text" placeholder="请输入歌曲名" v-model="data.name"/>
      <InputText class="input-text" placeholder="请输入歌手名" v-model="data.singer"/>
      <InputText class="input-text" placeholder="请输入专辑名(可选)" v-model="data.album"/>
      <Button @click="uploadMusicFun">
        <Loading color="white" v-if="uploading"/>
        <label v-else>FINISH</label>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import Loading from '@/components/Loading.vue';
import Upload from '@/components/Upload.vue';
import { uploadMusic } from '@/api/music';

const data = reactive({
  name: '',
  singer: '',
  album: '',
});

const musicList = ref([]);
const coverList = ref([]);

let uploading = ref(false);

const uploadMusicFun = () => {
  console.log(musicList.value);
  console.log(coverList.value);
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
  musicData.append('music', musicList.value[0]);
  musicData.append('cover', coverList.value[0]);
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
  margin: 5rem auto;
  padding: 1rem;
  border-radius: .3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);

  .music-info {
    .input-text {
      margin: 1.25rem 0;
      width: 100%;
      height: 3rem;
    }
  }
}
</style>
