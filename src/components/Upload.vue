<template>
  <div class="upload-wrapper">
    <svg-icon class="pointer" name="annex" size="2rem" @click="clickUpload"/>
    <input ref="upload" class="upload" style="display: none" type="file" id="fileUpload" @change="fileChange"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fileList = defineModel();
const upload = ref<HTMLInputElement>();
const clickUpload = () => {
  upload.value?.click();
}
const fileChange = () => {
  fileList.value = upload.value?.files;
}
</script>

<style scoped lang="scss">
.upload-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .upload {
    display: none;
  }
}
</style>
