<template>
  <section class="module-page">
    <div class="module-toolbar">
      <Search v-model="key" :searching="searching" class="search-box"/>
      <Button class="toolbar-button" @click="openCreateDialog">添加专辑</Button>
    </div>

    <div class="summary-row">
      <div class="summary-card">
        <p class="summary-label">专辑数量</p>
        <p class="summary-value">{{ pagination.total }}</p>
      </div>
      <div class="summary-card">
        <p class="summary-label">当前关键词</p>
        <p class="summary-value small">{{ key.trim() || '全部内容' }}</p>
      </div>
    </div>

    <div class="list-panel">
      <div class="panel-head">
        <h3>专辑列表</h3>
        <p>优先作为歌曲内容的结构化整理入口。</p>
      </div>

      <div class="album-cards">
        <div v-for="record in albumList" :key="record.name + record.createTime" class="album-card">
          <div>
            <p class="album-name">{{ record.name }}</p>
            <p class="album-meta">创建者：{{ record.creator || '系统' }}</p>
            <p class="album-meta">创建时间：{{ record.createTime }}</p>
            <p class="album-meta">更新时间：{{ record.updateTime }}</p>
          </div>
          <div class="card-actions">
            <Button class="btn" @click="handleUpdateAlbum(record)">编辑</Button>
            <Button class="btn btn-danger" @click="deleteAlbumFun(record)">删除</Button>
          </div>
        </div>
      </div>

      <a-table :columns="columns" :data-source="albumList" :pagination="false" class="desktop-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'options'">
            <div class="table-actions">
              <Button class="btn" @click="handleUpdateAlbum(record)">编辑</Button>
              <Button class="btn btn-danger" @click="deleteAlbumFun(record)">删除</Button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <a-pagination
      v-model:current="pagination.page"
      :total="pagination.total"
      show-size-changer
      @change="getManageAlbumListFun"
    />

    <a-modal v-model:open="albumDialogVisible" :title="title" @cancel="resetAddAlbumData">
      <div class="dialog-form">
        <InputText v-model="addAlbumParam.name" placeholder="请输入专辑名"/>
        <Button @click="addAlbumFun" label="保存专辑" :loading="loading"/>
      </div>
      <template #footer/>
    </a-modal>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { AlbumType, Pagination } from '@/types/global';
import Search from '@/components/Search.vue';
import Button from '@/components/Button.vue';
import { addAlbum, getManageAlbumList } from '@/api/album';
import { formatTime } from '@/util/time';
import InputText from '@/components/InputText.vue';
import type { AddAlbumType } from '@/types/album';
import { Modal, notification } from 'ant-design-vue';
import { debounce } from '@/util/schedulers';

const columns = [
  { title: '专辑名', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '创建者', dataIndex: 'creator', key: 'creator', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', ellipsis: true },
  { title: '操作', dataIndex: 'options', key: 'options' },
];

const albumList = ref<AlbumType[]>([]);
const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});
const key = ref('');
const searching = ref(false);
const albumDialogVisible = ref(false);
const loading = ref(false);
const addAlbumParam = ref<AddAlbumType>({ name: '' });
let title = '';

const getManageAlbumListFun = () => {
  getManageAlbumList({ page: pagination.value.page, size: 10, key: key.value.trim() }).then(response => {
    const { list, total } = response.data;
    list.forEach((album: AlbumType) => {
      album.createTime = formatTime(album.createTime, '{y}-{m}-{d} {h}:{i}') ?? '';
      album.updateTime = formatTime(album.updateTime, '{y}-{m}-{d} {h}:{i}') ?? '';
    });
    pagination.value.total = total;
    albumList.value = list;
  });
};

watch(key, debounce(async (newValue) => {
  searching.value = true;
  key.value = newValue.trim();
  pagination.value.page = 1;
  await getManageAlbumListFun();
  searching.value = false;
}, 300, false));

const openCreateDialog = () => {
  title = '添加专辑';
  addAlbumParam.value = { name: '' };
  albumDialogVisible.value = true;
};

const addAlbumFun = () => {
  if (addAlbumParam.value.name?.trim().length === 0) {
    notification.warning({
      message: '专辑名不能为空',
    });
    return;
  }
  loading.value = true;
  addAlbum({ name: addAlbumParam.value.name.trim() }).then(() => {
    getManageAlbumListFun();
    albumDialogVisible.value = false;
    addAlbumParam.value = { name: '' };
  }).finally(() => {
    loading.value = false;
  });
};

const handleUpdateAlbum = (album: AlbumType) => {
  title = '调整专辑信息';
  addAlbumParam.value = { name: album.name };
  albumDialogVisible.value = true;
};

const deleteAlbumFun = (album: AlbumType) => {
  Modal.info({
    title: `专辑《${album.name}》暂未接入删除接口`,
    content: '当前项目里还没有对应的后端删除接口，这里先保留操作入口，等接口补齐后可以直接接入。',
  });
};

const resetAddAlbumData = () => {
  addAlbumParam.value = { name: '' };
};

onMounted(() => {
  getManageAlbumListFun();
});
</script>

<style scoped lang="scss">
.module-page {
  display: grid;
  gap: 1rem;
}

.module-toolbar,
.summary-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .85rem;
}

.summary-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.summary-card,
.list-panel {
  border: 1px solid var(--surface-border);
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, .8);
  box-shadow: var(--surface-shadow);
}

.summary-card {
  padding: 1rem;
}

.summary-label,
.panel-head p,
.album-meta {
  color: var(--text-secondary);
}

.summary-value {
  margin-top: .35rem;
  font-size: 1.6rem;
  font-weight: 800;

  &.small {
    font-size: 1rem;
    line-height: 1.5;
  }
}

.list-panel {
  padding: 1rem;
}

.panel-head h3,
.album-name {
  font-weight: 800;
}

.album-cards {
  display: none;
}

.table-actions,
.card-actions {
  display: flex;
  gap: .6rem;
}

.btn {
  width: 4.2rem;
  min-height: 2rem;
}

.btn-danger:deep(.button-wrapper),
.btn-danger.button-wrapper {
  background: linear-gradient(135deg, #e05a5a, #cf3b3b);
  box-shadow: 0 .7rem 1.25rem rgba(217, 74, 74, .16);
}

.dialog-form {
  display: grid;
  gap: 1rem;
}

@media (max-width: 820px) {
  .module-toolbar,
  .summary-row {
    grid-template-columns: 1fr;
  }

  .toolbar-button {
    width: 100%;
  }

  .desktop-table {
    display: none;
  }

  .album-cards {
    display: grid;
    gap: .8rem;
    margin-top: 1rem;
  }

  .album-card {
    border: 1px solid rgba(55, 125, 255, .1);
    border-radius: 1rem;
    background: rgba(244, 248, 252, .82);
    padding: 1rem;
    display: grid;
    gap: 1rem;
  }
}
</style>
