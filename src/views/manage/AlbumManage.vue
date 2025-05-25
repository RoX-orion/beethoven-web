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
    <InputText v-model="addAlbumParam.name" placeholder="请输入专辑名"/>
    <Button style="margin-top: 1rem" @click="addAlbumFun" label="FINISH" :loading="loading"/>
    <template #footer/>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AlbumType, Pagination } from '@/types/global';
import Search from '@/components/Search.vue';
import Button from '@/components/Button.vue';
import { addAlbum, getManageAlbumList } from '@/api/album';
import { formatTime } from '@/util/time';
import InputText from '@/components/InputText.vue';
import type { AddAlbumType } from '@/types/album';
import { notification } from 'ant-design-vue';

const columns = [
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
  getManageAlbumListFun();
});

const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});
let title = '';
const key = ref('');
const searching = ref(false);

const getManageAlbumListFun = () => {
  getManageAlbumList({ page: pagination.value.page, size: 10, key: key.value?.trim() }).then(response => {
    const { list, total } = response.data;
    list.forEach((album: AlbumType) => {
      album.createTime = formatTime(album.createTime, '{y}-{m}-{d} {h}:{i}');
      album.updateTime = formatTime(album.updateTime, '{y}-{m}-{d} {h}:{i}');
    });
    pagination.value.total = total;
    albumList.value = list;
  });
}

const albumDialogVisible = ref(false);
const loading = ref(false);
const addAlbumParam = ref<AddAlbumType>({ name: '' });
const addAlbumFun = () => {
  if (addAlbumParam.value.name?.trim().length === 0) {
    notification.warning({
      message: '专辑名不能为空',
    });
    return;
  }
  loading.value = true;
  addAlbum(addAlbumParam.value).then(() => {
    getManageAlbumListFun();
    albumDialogVisible.value = false;
  }).finally(() => {
    loading.value = false;
  });
};
const handleUpdateAlbum = (album: AlbumType) => {

}

const deleteAlbumFun = (album: AlbumType) => {

}

const uploadCoverFile = ref();
const resetAddAlbumData = () => {

}
</script>

<style scoped lang="scss">
.btn {
  width: 4rem;
  height: 1.5rem;
}
</style>
