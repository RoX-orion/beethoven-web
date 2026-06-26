<template>
  <div class="upload-field">
    <div
      class="upload-wrapper pointer"
      :class="{
        'is-image': type === 'image',
        'has-file': !!uploadFile?.url || !!uploadFile?.file,
      }"
      @click="clickUpload"
    >
      <template v-if="type === 'image' && uploadFile?.url">
        <img class="preview" :src="uploadFile.url" alt="preview"/>
        <div class="overlay">
          <span>点击更换</span>
        </div>
      </template>
      <template v-else>
        <svg-icon :name="type === 'image' ? 'add' : 'annex'" size="1.6rem" color="var(--brand-primary)"/>
        <p class="title">{{ titleText }}</p>
        <p class="hint">{{ descriptionText }}</p>
        <p v-if="fileName" class="file-name">{{ fileName }}</p>
      </template>
    </div>
    <button
      v-if="uploadFile?.url || uploadFile?.file"
      class="clear-button pointer"
      type="button"
      @click.stop="clearFile"
    >
      清空
    </button>
    <input
      ref="upload"
      class="upload"
      type="file"
      :accept="acceptValue"
      :multiple="false"
      @change="fileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FileListType, UploadType } from '@/types/global';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps<{
  type: UploadType;
  accept?: string;
  title?: string;
  hint?: string;
}>();

const uploadFile = defineModel<FileListType | undefined>();
const upload = ref<HTMLInputElement>();

const acceptValue = computed(() => {
  if (props.accept) {
    return props.accept;
  }
  return props.type === 'image' ? 'image/*' : '*';
});

const titleText = computed(() => {
  if (props.title) {
    return props.title;
  }
  return props.type === 'image' ? '上传图片' : '选择文件';
});

const descriptionText = computed(() => {
  if (props.hint) {
    return props.hint;
  }
  return props.type === 'image' ? '支持点击替换封面' : '支持单文件上传';
});

const fileName = computed(() => uploadFile.value?.file?.name ?? '');

const clickUpload = () => {
  upload.value?.click();
};

const clearNativeInput = () => {
  if (upload.value) {
    upload.value.value = '';
  }
};

const clearFile = () => {
  uploadFile.value = undefined;
  clearNativeInput();
};

const fileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    return;
  }
  uploadFile.value = {
    file,
    url: props.type === 'image' ? URL.createObjectURL(file) : undefined,
  };
  clearNativeInput();
};
</script>

<style scoped lang="scss">
.upload-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .6rem;
}

.upload-wrapper {
  --container-size: 10rem;

  width: min(100%, 100%);
  min-height: 8.5rem;
  border: 1px dashed rgba(55, 125, 255, .28);
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, .96), rgba(242, 248, 255, .88));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  padding: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(55, 125, 255, .5);
    box-shadow: 0 .8rem 1.8rem rgba(55, 125, 255, .12);
  }

  &.is-image {
    width: min(100%, var(--container-size));
    min-height: var(--container-size);
    padding: 0;
  }

  &.is-image.has-file {
    border-style: solid;
  }

  .preview {
    width: 100%;
    height: 100%;
    min-height: var(--container-size);
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    background: linear-gradient(180deg, rgba(24, 33, 47, .05), rgba(24, 33, 47, .48));
    opacity: 0;
    transition: opacity .18s ease;
  }

  &:hover .overlay {
    opacity: 1;
  }

  .title {
    font-weight: 700;
    color: var(--text-primary);
  }

  .hint {
    font-size: .82rem;
    line-height: 1.45;
    color: var(--text-secondary);
  }

  .file-name {
    max-width: 100%;
    font-size: .8rem;
    color: var(--brand-primary-hover);
    word-break: break-all;
  }
}

.clear-button {
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: .82rem;
  padding: 0;

  &:hover {
    color: var(--danger);
  }
}

.upload {
  display: none;
}
</style>
