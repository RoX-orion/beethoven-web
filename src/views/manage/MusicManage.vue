<template>
  <!--  <div class="flex-row">-->
  <!--    <div >-->

  <!--    </div>-->
  <!--  </div>-->
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="musicList" tab="歌曲">
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
    <a-tab-pane key="uploadMusic" tab="歌单">Content of Tab Pane 2</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>

</template>

<script setup lang="ts">
import { getManageMusicList } from '@/api/music';
import { onMounted, ref } from 'vue';
import { SearchMusicParam } from '@/api/params/query';
import { durationFormater } from '@/util/time';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';

onMounted(() => {
  getManageMusicListFun();
});

const musicList = ref<any[]>();
const activeKey = ref("musicList");

const getManageMusicListFun = () => {
  let param = new SearchMusicParam(1, 10, '');
  getManageMusicList(param).then(response => {
    musicList.value = response.data;
  });
};
</script>

<style scoped lang="scss">
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
