<template>
  <div class="flex-row management-top">
    <Search v-model="key" :searching="searching" style="width: 100%"/>
    <Button style="width: 5rem; height: 2.25rem; border-radius: .25rem; margin: auto 0"
            @click="albumDialogVisible = true; title = '添加专辑'">添加专辑
    </Button>
  </div>
  <a-table :columns="columns" :data-source="albumList" :pagination="false">
    <template v-slot:bodyCell="{ column, record}">
      <template v-if="column.dataIndex === 'options'">
        <div class="flex-row">
          <Button class="btn" @click="handleUpdateAlbum(record)">编辑</Button>
          <Button class="btn" style="background-color: #e53935" @click="deleteAlbumFun(record)">删除</Button>
        </div>
      </template>
    </template>
  </a-table>

  <a-modal v-model:open="albumDialogVisible" :title="title" @cancel="resetAddAlbumData">
    <template #footer>
    </template>
    <div class="flex-row">
      <span class="grey" style="width: 3rem">封面:</span>
      <UploadImage type="image" v-model="uploadCoverFile"/>
    </div>
    <InputText placeholder="请输入专辑名"/>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AlbumType, Pagination } from '@/types/global';
import Search from '@/components/Search.vue';
import Button from '@/components/Button.vue';
import { getManageAlbumList } from '@/api/album';
import { formatTime } from '@/util/time';
import UploadImage from '@/components/UploadImage.vue';
import InputText from '@/components/InputText.vue';

const columns = [
  {
    title: '封面',
    dataIndex: 'cover',
    key: 'cover',
  },
  {
    title: '专辑名',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
  },
  {
    title: '创建者',
    dataIndex: 'creator',
    key: 'creator',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
  },
  {
    title: '更新时间',
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

const albumList = ref<AlbumType[]>();

onMounted(() => {
  getManageAlbumListFun(undefined);
});

const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});
const getManageAlbumListFun = (key: string | undefined) => {
  getManageAlbumList({ page: pagination.value.page, size: 10, key }).then(response => {
    const { list, total } = response.data;
    list.forEach((album: AlbumType) => {
      album.createTime = formatTime(album.createTime, '{y}-{m}-{d} {h}:{i}');
      album.updateTime = formatTime(album.updateTime, '{y}-{m}-{d} {h}:{i}');
    });
    pagination.value.total = total;
    albumList.value = list;
  });
}

let title = '';
const key = ref('');
const searching = ref(false);

const albumDialogVisible = ref(false);
const handleUpdateAlbum = (album: AlbumType) => {

}

const deleteAlbumFun = (album: AlbumType) => {

}

const uploadCoverFile = ref();
const resetAddAlbumData = () => {

}
</script>

<style scoped lang="scss">

</style>
