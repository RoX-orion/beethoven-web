<template>
  <a-tabs v-model:activeKey="activeKey" size="small">
    <a-tab-pane key="musicConfig" tab="音乐设置">
      <div>
        <p class="label-text">默认音乐封面:</p>
        <UploadImage v-model="defaultMusicCover" type="image"/>
        <p class="label-text">分片大小:</p>
        <InputText v-model="musicConfig.shardingSize"/>
        <Button style="margin-top: 1rem" :loading="loading" label="保存" @click="updateMusicConfigFun"/>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import UploadImage from '@/components/UploadImage.vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import { getMusicConfig, updateMusicConfig } from '@/api/appConfig';
import type { FileListType, MusicConfigType } from '@/types/global';

const activeKey = ref('musicConfig');
const defaultMusicCover = ref<FileListType>();
const loading = ref(false);
let musicConfig: MusicConfigType = reactive({});

const getMusicConfigFun = () => {
  getMusicConfig().then(response => {
    Object.assign(musicConfig, response.data);
    defaultMusicCover.value = { 'url': musicConfig.defaultMusicCover };
  });
}
const updateMusicConfigFun = () => {
  if (!/^(?!0\d)\d+$/.test(musicConfig.shardingSize) || musicConfig.shardingSize < 1024) {
    return;
  }
  const musicConfigData = new FormData();
  musicConfigData.append('defaultMusicCoverFile', defaultMusicCover.value?.file);
  musicConfigData.append('shardingSize', musicConfig.shardingSize);
  loading.value = true;
  updateMusicConfig(musicConfigData)
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getMusicConfigFun();
});
</script>

<style scoped lang="scss">
.label-text {
  margin: .5rem 0;
}
</style>
