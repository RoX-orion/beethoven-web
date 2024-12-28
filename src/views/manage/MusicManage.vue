<template>
  <a-tabs v-model:activeKey="activeKey" size="small">
    <a-tab-pane key="musicList" tab="歌曲">
      <div class="flex-row top">
        <Search v-model="name" :searching="searching" style="width: 100%"/>
        <Button style="width: 5rem; height: 2.25rem; border-radius: .25rem; margin: .25rem 0"
                @click="uploadMusicDialogVisible = true">上传
        </Button>
      </div>
      <div class="flex-row music content-space-between" v-for="music in musicList" :key="music.id">
        <img :src="music.cover" alt="" class="cover"/>
        <div>{{ music.name }}</div>
        <div>{{ music.singer }}</div>
        <div>{{ durationFormater(music.duration) }}</div>
        <div>{{ sizeFormater(music.size) }}</div>
        <div>{{ music.mime }}</div>
        <div>{{ music.createTime }}</div>
        <div>{{ music.updateTime }}</div>
        <div class="flex-row">
          <Button class="btn">编辑</Button>
          <Button class="btn" style="background-color: #e53935">删除</Button>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="uploadMusic" tab="歌单"></a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
  </a-tabs>
  <Dialog v-model="uploadMusicDialogVisible" width="30rem" title="上传歌曲">
    <UploadMusic/>
  </Dialog>
</template>

<script setup lang="ts">
import { getManageMusicList } from '@/api/music';
import { onMounted, ref } from 'vue';
import { durationFormater } from '@/util/time';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import Dialog from '@/components/Dialog.vue';
import UploadMusic from '@/views/manage/UploadMusic.vue';

onMounted(() => {
  getManageMusicListFun();
});

const musicList = ref<any[]>();
const activeKey = ref("musicList");
let searching = ref(false);
let name = ref('');

const getManageMusicListFun = () => {
  getManageMusicList({ page: 1, size: 10, key: '' }).then(response => {
    musicList.value = response.data;
  });
};

const uploadMusicDialogVisible = ref(false);

</script>

<style scoped lang="scss">
.top {
  justify-content: right;
  margin-bottom: .5rem;
  gap: 1rem;
}
.music {
  div {
    margin: auto 0;
  }

  .cover {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: .25rem;
  }

  .btn {
    width: 4rem;
    height: 1.5rem;
  }
}

</style>
