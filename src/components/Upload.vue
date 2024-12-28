<template>
  <div class="upload-wrapper">
    <div v-if="type === 'image'">
      <div class="no-file pointer"
           v-if="fileList?.length === 0 || (fileList !== undefined && fileList[0].url === undefined)"
           @click="clickUpload">
        <svg-icon class="center" name="add" size="1.5rem" color="grey"/>
      </div>
      <div v-else>
        <img class="preview" :src="fileList[0]?.url" alt=""/>
      </div>
    </div>
    <div v-else-if="type === 'file'">
      <svg-icon class="pointer" name="annex" size="2rem" @click="clickUpload"/>
    </div>
    <input ref="upload" class="upload" style="display: none" type="file" id="fileUpload" @change="fileChange" multiple/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FileListType, UploadType } from '@/types/global';
import SvgIcon from '@/components/SvgIcon.vue';

let fileList = defineModel<FileListType[]>();
const upload = ref<HTMLInputElement>();
const clickUpload = () => {
  upload.value?.click();
}
const fileChange = () => {
  [...upload.value?.files].forEach(e => fileList.value?.push({
    'file': e,
  }));
};

defineProps<{
  type: UploadType
}>();
// console.log(fileList);
</script>

<style scoped lang="scss">
.upload-wrapper {
  --container-size: 5rem;

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
