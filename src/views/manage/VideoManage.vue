<template>
  <div class="flex-row management-top">
    <Search v-model="key" :searching="searching" style="width: 100%"/>
    <Button style="width: 5rem; height: 2.25rem; border-radius: .25rem; margin: auto 0" @click="getManageVideoListFun">
      搜索
    </Button>
  </div>
  <a-table :columns="columns" :data-source="videoList" :pagination="false">
    <template v-slot:bodyCell="{ column, record}">
      <template v-if="column.dataIndex === 'cover'">
        <img :src="record.cover" alt="" class="cover"/>
      </template>
      <template v-if="column.dataIndex === 'options'">
        <div class="flex-row">
          <!--          <Button class="btn" @click="handleUpdateMusic(record)">编辑</Button>-->
          <Button class="btn" style="background-color: #e53935" @click="deleteVideoFun(record)">删除</Button>
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Search from '@/components/Search.vue';
import Button from '@/components/Button.vue';
import { getManageVideoList } from '@/api/video';
import { Pagination } from '@/types/global';
import { durationFormater, formatTime } from '@/util/time';
import { sizeFormater } from '@/util/file';

const searching = ref(false);
const key = ref('');
const videoList = ref([]);

const columns = [
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover',
  },
  {
    title: '歌曲名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
  },
  {
    title: '歌手',
    dataIndex: 'singer',
    key: 'singer',
    ellipsis: true,
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    ellipsis: true,
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    ellipsis: true,
  },
  {
    title: 'MIME',
    dataIndex: 'mime',
    key: 'mime',
    ellipsis: true,
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'options',
    key: 'options',
  },
];

const deleteVideoFun = (record: any) => {

}

onMounted(() => {
  getManageVideoListFun();
});

const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});
const getManageVideoListFun = () => {
  getManageVideoList({ page: pagination.value.page, size: 10, key: key.value.trim() }).then(response => {
    const { list, total } = response.data;
    list.forEach((video: any) => {
      video.duration = durationFormater(video.duration);
      video.size = sizeFormater(video.size);
      video.createTime = formatTime(video.createTime, '{y}-{m}-{d} {h}:{i}');
      video.updateTime = formatTime(video.updateTime, '{y}-{m}-{d} {h}:{i}');
    });
    pagination.value.total = total;
    videoList.value = list;
  });
}
</script>

<style scoped lang="scss">

</style>
