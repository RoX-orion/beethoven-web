<template>
  <div class="upload-wrapper">
    <div v-if="type === 'image'">
      <div class="no-file pointer"
           v-if="uploadFile === undefined"
           @click="clickUpload">
        <svg-icon class="center" name="add" size="1.5rem" color="grey"/>
      </div>
      <div v-else @click="clickUpload">
        <img class="preview pointer" :src="uploadFile?.url" alt=""/>
      </div>
    </div>
    <div v-else-if="type === 'file'">
      <svg-icon class="pointer" name="annex" size="2rem" @click="clickUpload"/>
    </div>
    <input ref="upload" class="upload" style="display: none" type="file" id="fileUpload" @change="fileChange"
           :multiple="false"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FileListType, UploadType } from '@/types/global';
import SvgIcon from '@/components/SvgIcon.vue';

defineProps<{
  type: UploadType
}>();
let uploadFile = defineModel<FileListType>();
const upload = ref<HTMLInputElement>();
const clickUpload = () => {
  upload.value!.click();
}
const fileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const fileList = target.files;
  const filesArray: File[] = fileList ? Array.from(fileList) : [];
  uploadFile.value = {};
  uploadFile.value = { file: filesArray[0], url: URL.createObjectURL(filesArray[0]) };
};
</script>

<style scoped lang="scss">
.upload-wrapper {
  --container-size: 10rem;

  .no-file {
    width: var(--container-size);
    height: var(--container-size);
    border-radius: .5rem;
    border: dashed 1px grey;
    position: relative;
  }

  .preview {
    width: var(--container-size);
    height: var(--container-size);
    border-radius: .5rem;
  }

  .upload {
    display: none;
  }
}
</style>
