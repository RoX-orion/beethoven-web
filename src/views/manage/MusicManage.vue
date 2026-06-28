<template>
  <section class="media-manage">
    <div class="hero-panel">
      <div>
        <h2>歌曲、视频、专辑统一在一个工作台内管理。</h2>
        <p class="hero-summary">
          上传流程现在统一成了封面、音频、视频三段式选择，桌面端适合批量巡检，移动端也能完整完成新增和编辑。
        </p>
      </div>
      <div class="hero-actions">
        <Button class="primary-action" @click="openCreateDialog">上传歌曲</Button>
        <div class="hero-stat">
          <span>当前歌曲总数</span>
          <strong>{{ pagination.total }}</strong>
        </div>
      </div>
    </div>

    <a-tabs v-model:activeKey="activeKey" class="media-tabs" :animated="false">
      <a-tab-pane key="musicManage" tab="歌曲管理">
        <section class="module-page">
          <div class="module-toolbar">
            <Search v-model="key" :searching="searching" class="search-box"/>
            <Button class="toolbar-button" @click="openCreateDialog">新增歌曲</Button>
          </div>

          <div class="summary-row">
            <div class="summary-card">
              <p class="summary-label">内容总数</p>
              <p class="summary-value">{{ pagination.total }}</p>
            </div>
            <div class="summary-card">
              <p class="summary-label">当前过滤</p>
              <p class="summary-value small">{{ key.trim() || '全部歌曲' }}</p>
            </div>
            <div class="summary-card">
              <p class="summary-label">上传模式</p>
              <p class="summary-value small">{{ data.musicId ? '编辑现有歌曲' : '新增完整内容' }}</p>
            </div>
          </div>

          <div class="music-cards">
            <div v-for="record in musicList" :key="record.id" class="music-card">
              <img :src="record.cover" alt="" class="cover"/>
              <div class="music-main">
                <div class="title-row">
                  <p class="music-title">{{ record.name }}</p>
                  <span class="badge">{{ record.video }}</span>
                </div>
                <p class="music-meta">{{ record.singer }}</p>
                <p class="music-meta">专辑：{{ record.album || '未填写' }}</p>
                <p class="music-meta">时长：{{ record.duration }}</p>
                <p class="music-meta">大小：{{ record.size }}</p>
                <p class="music-meta">更新时间：{{ record.updateTime }}</p>
              </div>
              <div class="card-actions">
                <Button class="btn" @click="handleUpdateMusic(record)">编辑</Button>
                <Button class="btn btn-danger" @click="deleteMusicFun(record)">删除</Button>
              </div>
            </div>
          </div>

          <a-table class="music-table desktop-table" :columns="columns" :data-source="musicList" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'cover'">
                <img :src="record.cover" alt="" class="cover"/>
              </template>
              <template v-if="column.dataIndex === 'options'">
                <div class="table-actions">
                  <Button class="btn" @click="handleUpdateMusic(record)">编辑</Button>
                  <Button class="btn btn-danger" @click="deleteMusicFun(record)">删除</Button>
                </div>
              </template>
            </template>
          </a-table>

          <a-pagination
            class="music-pagination"
            v-model:current="pagination.page"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            :show-total="showPaginationTotal"
            show-size-changer
            @change="handlePageChange"
          />
        </section>
      </a-tab-pane>
      <a-tab-pane key="videoManage" tab="视频管理">
        <VideoManage/>
      </a-tab-pane>
      <a-tab-pane key="albumManage" tab="专辑管理">
        <AlbumManage/>
      </a-tab-pane>
    </a-tabs>

    <a-modal v-model:open="musicDialogVisible" :title="dialogTitle" :width="modalWidth" @cancel="resetUploadMusicData">
      <template #footer/>
      <div class="dialog-layout">
        <div class="upload-grid">
          <div class="upload-card">
            <p class="field-title">封面</p>
            <p class="field-desc">建议使用方图，列表和移动端展示都会更稳定。</p>
            <UploadImage
              v-model="uploadCoverFile"
              type="image"
              title="上传歌曲封面"
              hint="支持点击替换，编辑时可保留原封面"
            />
          </div>
          <div class="upload-card">
            <p class="field-title">音频文件</p>
            <p class="field-desc">新增时必填，编辑时可选填替换。</p>
            <UploadImage
              v-model="uploadMusicFile"
              type="file"
              accept="audio/*"
              title="选择音频文件"
              hint="支持 MP3、WAV、FLAC 等常见格式"
            />
          </div>
          <div class="upload-card">
            <p class="field-title">视频文件</p>
            <p class="field-desc">如果歌曲带 MV 或演出视频，可以在这里补充。</p>
            <UploadImage
              v-model="uploadVideoFile"
              type="file"
              accept="video/*"
              title="选择视频文件"
              hint="可选项，不上传也能保存歌曲"
            />
          </div>
        </div>

        <div class="form-card">
          <p class="section-title">歌曲信息</p>
          <div class="form-grid">
            <InputText placeholder="请输入歌曲名" v-model="data.name"/>
            <InputText placeholder="请输入歌手名" v-model="data.singer"/>
            <InputText placeholder="请输入专辑名（可选）" v-model="data.album"/>
          </div>
          <Button @click="uploadOrUpdateMusic" :label="data.musicId ? '保存修改' : '完成上传'" :loading="loading"/>
        </div>
      </div>
    </a-modal>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { deleteMusic, getManageMusicList, updateMusic, uploadMusic } from '@/api/music';
import { durationFormater, formatTime } from '@/util/time';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import InputText from '@/components/InputText.vue';
import { Modal, notification } from 'ant-design-vue';
import type { FileListType, Pagination } from '@/types/global';
import { debounce } from '@/util/schedulers';
import UploadImage from '@/components/UploadImage.vue';
import AlbumManage from '@/views/manage/AlbumManage.vue';
import VideoManage from '@/views/manage/VideoManage.vue';

type MusicRecord = {
  id: number;
  cover: string;
  name: string;
  singer: string;
  duration: string;
  size: string;
  mime: string;
  video: string;
  album?: string;
  createTime: string;
  updateTime: string;
};

const activeKey = ref('musicManage');
const musicList = ref<MusicRecord[]>([]);
const searching = ref(false);
const key = ref('');
const pagination = ref<Pagination>({
  page: 1,
  size: 10,
  total: 0,
});

const musicDialogVisible = ref(false);
const loading = ref(false);
const data = reactive({
  musicId: undefined as string | number | undefined,
  name: '',
  singer: '',
  album: '',
});

const uploadMusicFile = ref<FileListType>();
const uploadCoverFile = ref<FileListType>();
const uploadVideoFile = ref<FileListType>();

const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);
const dialogTitle = computed(() => data.musicId ? '编辑歌曲' : '上传歌曲');
const modalWidth = computed(() => viewportWidth.value < 760 ? '94vw' : '940px');
const showPaginationTotal = (total: number) => `共 ${total} 首`;

const columns = [
  { title: '封面', dataIndex: 'cover', key: 'cover' },
  { title: '歌曲名', dataIndex: 'name', key: 'name', ellipsis: true },
  { title: '歌手', dataIndex: 'singer', key: 'singer', ellipsis: true },
  { title: '专辑', dataIndex: 'album', key: 'album', ellipsis: true },
  { title: '时长', dataIndex: 'duration', key: 'duration', ellipsis: true },
  { title: '大小', dataIndex: 'size', key: 'size', ellipsis: true },
  { title: 'MIME', dataIndex: 'mime', key: 'mime', ellipsis: true },
  { title: '视频', dataIndex: 'video', key: 'video', ellipsis: true },
  { title: '添加时间', dataIndex: 'createTime', key: 'createTime', ellipsis: true },
  { title: '修改时间', dataIndex: 'updateTime', key: 'updateTime', ellipsis: true },
  { title: '操作', dataIndex: 'options', key: 'options' },
];

const getManageMusicListFun = async () => {
  await getManageMusicList({
    page: pagination.value.page,
    size: pagination.value.size ?? 10,
    key: key.value.trim(),
  }).then(response => {
    const { list, total } = response.data;
    musicList.value = list.map((music: any) => ({
      ...music,
      duration: durationFormater(music.duration),
      size: sizeFormater(music.size),
      video: music.videoId ? '含视频' : '纯音频',
      createTime: formatTime(music.createTime, '{y}-{m}-{d} {h}:{i}'),
      updateTime: formatTime(music.updateTime, '{y}-{m}-{d} {h}:{i}'),
    }));
    pagination.value.total = total;
  });
};

const handlePageChange = async (page: number, pageSize: number) => {
  pagination.value.page = page;
  pagination.value.size = pageSize;
  await getManageMusicListFun();
};

watch(key, debounce(async (newValue) => {
  searching.value = true;
  key.value = newValue.trim();
  pagination.value.page = 1;
  await getManageMusicListFun();
  searching.value = false;
}, 300, false));

const resetUploadMusicData = () => {
  uploadMusicFile.value = undefined;
  uploadCoverFile.value = undefined;
  uploadVideoFile.value = undefined;
  Object.assign(data, {
    musicId: undefined,
    name: '',
    singer: '',
    album: '',
  });
};

const openCreateDialog = () => {
  resetUploadMusicData();
  musicDialogVisible.value = true;
};

const validateMusicData = () => {
  if (!data.musicId && !uploadMusicFile.value?.file) {
    notification.warning({ message: '请选择音频文件' });
    return false;
  }
  if (!data.musicId && !uploadCoverFile.value?.file) {
    notification.warning({ message: '请选择歌曲封面' });
    return false;
  }
  if (data.name.trim().length === 0) {
    notification.warning({ message: '歌曲名不能为空' });
    return false;
  }
  if (data.singer.trim().length === 0) {
    notification.warning({ message: '歌手不能为空' });
    return false;
  }
  return true;
};

const uploadOrUpdateMusic = () => {
  if (!validateMusicData()) {
    return;
  }
  data.musicId ? updateMusicFun() : uploadMusicFun();
};

const uploadMusicFun = () => {
  loading.value = true;
  const musicData = new FormData();
  if (uploadVideoFile.value?.file) {
    musicData.append('video', uploadVideoFile.value.file);
  }
  musicData.append('music', uploadMusicFile.value!.file!);
  musicData.append('cover', uploadCoverFile.value!.file!);
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album.trim());

  uploadMusic(musicData).then(async () => {
    await getManageMusicListFun();
    musicDialogVisible.value = false;
    resetUploadMusicData();
  }).finally(() => {
    loading.value = false;
  });
};

const updateMusicFun = () => {
  loading.value = true;
  const musicData = new FormData();
  if (uploadCoverFile.value?.file) {
    musicData.append('cover', uploadCoverFile.value.file);
  }
  if (uploadMusicFile.value?.file) {
    musicData.append('music', uploadMusicFile.value.file);
  }
  if (uploadVideoFile.value?.file) {
    musicData.append('video', uploadVideoFile.value.file);
  }
  musicData.append('musicId', String(data.musicId));
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album.trim());

  updateMusic(musicData).then(async () => {
    await getManageMusicListFun();
    musicDialogVisible.value = false;
    resetUploadMusicData();
  }).finally(() => {
    loading.value = false;
  });
};

const deleteMusicFun = (record: MusicRecord) => {
  Modal.confirm({
    title: `删除歌曲《${record.name}》？`,
    content: '删除后将无法恢复，请确认当前资源已不再使用。',
    okText: '确认删除',
    cancelText: '取消',
    async onOk() {
      await deleteMusic(record.id);
      await getManageMusicListFun();
      notification.success({
        message: '删除成功',
        description: '歌曲已从后台列表移除。',
      });
    },
  });
};

const handleUpdateMusic = (record: any) => {
  resetUploadMusicData();
  musicDialogVisible.value = true;
  Object.assign(data, {
    musicId: record.id,
    name: record.name,
    singer: record.singer,
    album: record.album ?? '',
  });
  uploadCoverFile.value = { url: record.cover };
};

const handleResize = () => {
  viewportWidth.value = window.innerWidth;
};

onMounted(() => {
  getManageMusicListFun();
  window.addEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.media-manage {
  display: grid;
  gap: 1rem;
}

.hero-panel,
.summary-card,
.music-card,
.upload-card,
.form-card {
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, .82);
  box-shadow: var(--surface-shadow);
}

.hero-panel {
  border-radius: 1.35rem;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 1.35fr auto;
  gap: 1rem;
  background: radial-gradient(circle at top right, rgba(106, 168, 255, .18), transparent 30%), linear-gradient(135deg, rgba(255, 255, 255, .92), rgba(242, 248, 255, .84));
}

.hero-panel h2 {
  margin-top: .4rem;
  font-size: clamp(1.35rem, 2.6vw, 2.25rem);
  font-weight: 800;
  line-height: 1.08;
}

.hero-summary {
  margin-top: .8rem;
  max-width: 48rem;
  color: var(--text-secondary);
  line-height: 1.75;
}

.hero-actions {
  display: grid;
  align-content: space-between;
  gap: 1rem;
}

.primary-action {
  width: 10rem;
}

.hero-stat {
  min-width: 12rem;
  padding: 1rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, .75);
  border: 1px solid rgba(55, 125, 255, .12);

  span {
    color: var(--text-secondary);
  }

  strong {
    display: block;
    margin-top: .4rem;
    font-size: 2rem;
    color: var(--brand-primary-hover);
  }
}

.module-page {
  display: grid;
  gap: 1rem;
}

.module-toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .85rem;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .85rem;
}

.summary-card {
  border-radius: 1.2rem;
  padding: 1rem;
}

.summary-label,
.music-meta,
.field-desc {
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

.music-cards {
  display: none;
}

.music-pagination {
  justify-self: end;
}

.music-table .cover,
.music-card .cover {
  width: 4rem;
  height: 4rem;
  border-radius: .9rem;
  object-fit: cover;
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

.btn-danger.button-wrapper {
  background: linear-gradient(135deg, #e05a5a, #cf3b3b);
  box-shadow: 0 .7rem 1.25rem rgba(217, 74, 74, .16);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: .28rem .58rem;
  border-radius: 999px;
  background: rgba(55, 125, 255, .1);
  color: var(--brand-primary-hover);
  font-size: .78rem;
  font-weight: 700;
}

.dialog-layout {
  display: grid;
  gap: 1rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.upload-card,
.form-card {
  border-radius: 1.1rem;
  padding: 1rem;
}

.field-title,
.section-title,
.music-title {
  font-weight: 800;
}

.form-grid {
  display: grid;
  gap: .85rem;
  margin: 1rem 0;
}


@media (max-width: 960px) {
  .hero-panel,
  .summary-row,
  .upload-grid {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    align-content: start;
  }
}

@media (max-width: 820px) {
  .module-toolbar {
    grid-template-columns: 1fr;
  }

  .toolbar-button,
  .primary-action {
    width: 100%;
  }

  .desktop-table {
    display: none;
  }

  .music-cards {
    display: grid;
    gap: .8rem;
  }

  .music-card {
    border-radius: 1.1rem;
    padding: .95rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .85rem;
  }

  .music-main {
    display: grid;
    gap: .2rem;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: .55rem;
    flex-wrap: wrap;
  }

  .card-actions {
    grid-column: 1 / -1;
  }

  .btn {
    width: 100%;
  }

  .music-pagination {
    justify-self: stretch;
  }
}
</style>




