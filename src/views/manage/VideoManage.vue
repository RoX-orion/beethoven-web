<template>
  <section class="module-page">
    <div class="module-toolbar">
      <Search v-model="key" :searching="searching" class="search-box"/>
      <Button class="toolbar-button" @click="getManageVideoListFun">刷新列表</Button>
    </div>

    <div class="summary-row">
      <div class="summary-card">
        <p class="summary-label">视频资源数</p>
        <p class="summary-value">{{ pagination.total }}</p>
      </div>
      <div class="summary-card">
        <p class="summary-label">筛选关键词</p>
        <p class="summary-value small">{{ key.trim() || '全部视频' }}</p>
      </div>
    </div>

    <div class="video-cards">
      <div v-for="record in videoList" :key="record.id" class="video-card">
        <img :src="record.cover" alt="" class="cover"/>
        <div class="video-content">
          <p class="video-title">{{ record.name }}</p>
          <p class="video-meta">{{ record.singer }}</p>
          <p class="video-meta">时长：{{ record.duration }}</p>
          <p class="video-meta">大小：{{ record.size }}</p>
          <p class="video-meta">更新时间：{{ record.updateTime }}</p>
        </div>
        <Button class="btn btn-danger" @click="deleteVideoFun(record)">删除</Button>
      </div>
    </div>

    <a-table :columns="columns" :data-source="videoList" :pagination="false" class="desktop-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'cover'">
          <img :src="record.cover" alt="" class="cover"/>
        </template>
        <template v-if="column.dataIndex === 'options'">
          <div class="table-actions">
            <Button class="btn btn-danger" @click="deleteVideoFun(record)">删除</Button>
          </div>
        </template>
      </template>
    </a-table>

    <a-pagination
      v-model:current="pagination.page"
      :total="pagination.total"
      show-size-changer
      @change="getManageVideoListFun"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Search from '@/components/Search.vue';
import Button from '@/components/Button.vue';
import { getManageVideoList } from '@/api/video';
import type { Pagination } from '@/types/global';
import { durationFormater, formatTime } from '@/util/time';
import { sizeFormater } from '@/util/file';
import { Modal } from 'ant-design-vue';
import { debounce } from '@/util/schedulers';

const searching = ref(false);
const key = ref('');
const videoList = ref<any[]>([]);
const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});

const columns = [
  { title: '封面', dataIndex: 'cover', key: 'cover' },
  { title: '歌曲名', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '歌手', dataIndex: 'singer', key: 'singer', ellipsis: true },
  { title: '时长', dataIndex: 'duration', key: 'duration', ellipsis: true },
  { title: '大小', dataIndex: 'size', key: 'size', ellipsis: true },
  { title: 'MIME', dataIndex: 'mime', key: 'mime', ellipsis: true },
  { title: '添加时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
  { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', ellipsis: true },
  { title: '操作', dataIndex: 'options', key: 'options' },
];

const deleteVideoFun = (record: any) => {
  Modal.info({
    title: `视频《${record.name}》暂未接入删除接口`,
    content: '当前仓库只提供了列表接口，没有删除接口。布局已预留，后端补齐后可以直接串接。',
  });
};

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
};

watch(key, debounce(async (newValue) => {
  searching.value = true;
  key.value = newValue.trim();
  pagination.value.page = 1;
  await getManageVideoListFun();
  searching.value = false;
}, 300, false));

onMounted(() => {
  getManageVideoListFun();
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

.summary-card {
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, .8);
  box-shadow: var(--surface-shadow);
  padding: 1rem;
  border-radius: 1.1rem;
}

.summary-label,
.video-meta {
  color: var(--text-secondary);
}

.summary-value {
  margin-top: .35rem;
  font-size: 1.6rem;
  font-weight: 800;

  &.small {
    font-size: 1rem;
  }
}

.desktop-table .cover,
.video-card .cover {
  width: 4rem;
  height: 4rem;
  border-radius: .9rem;
  object-fit: cover;
}

.table-actions {
  display: flex;
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

.video-cards {
  display: none;
}

.video-title {
  font-weight: 800;
}

@media (max-width: 820px) {
  .module-toolbar,
  .summary-row {
    grid-template-columns: 1fr;
  }

  .desktop-table {
    display: none;
  }

  .video-cards {
    display: grid;
    gap: .8rem;
  }

  .video-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .85rem;
    border: 1px solid var(--surface-border);
    background: rgba(255, 255, 255, .82);
    box-shadow: var(--surface-shadow);
    padding: .95rem;
    border-radius: 1.1rem;
  }

  .video-content {
    display: grid;
    gap: .25rem;
  }

  .btn {
    width: 100%;
    grid-column: 1 / -1;
  }
}
</style>
