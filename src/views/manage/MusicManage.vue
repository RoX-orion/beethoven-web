<template>
  <div class="manage-wrapper">
    <div class="flex-row content-center">
      <div class="upload-wrapper">
        <svg-icon class="pointer" name="annex" size="2rem" onclick="document.getElementById('fileUpload').click()"/>
        <input class="upload" style="display: none" type="file" id="fileUpload" accept="audio/mpeg"/>
      </div>
      <div class="upload-wrapper">
        <svg-icon class="pointer" name="annex" size="2rem" onclick="document.getElementById('fileUpload').click()"/>
        <input class="upload" style="display: none" type="file" id="fileUpload"/>
      </div>
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
import InputText from '@/components/InputText.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { reactive, ref } from 'vue';
import Button from '@/components/Button.vue';
import Loading from '@/components/Loading.vue';

const data = reactive({
  name: '',
  singer: '',
  album: undefined,
});

let uploading = ref(false);

const uploadMusicFun = () => {
  uploading.value = !uploading.value;
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

  .upload-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .upload {
      display: none;
    }
  }
}
</style>
