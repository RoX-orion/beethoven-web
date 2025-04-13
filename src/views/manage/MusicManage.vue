<template>
  <a-tabs v-model:activeKey="activeKey" size="small">
    <a-tab-pane key="musicList" tab="歌曲">
      <div class="flex-row top">
        <Search v-model="key" :searching="searching" style="width: 100%"/>
        <Button style="width: 5rem; height: 2.25rem; border-radius: .25rem; margin: .25rem 0"
                @click="musicDialogVisible = true; title = '上传歌曲'">上传
        </Button>
      </div>
      <a-table class="music-item" :columns="columns" :data-source="musicList" :pagination="false">
        <template v-slot:bodyCell="{ column, record}">
          <template v-if="column.dataIndex === 'cover'">
            <img :src="record.cover" alt="" class="cover"/>
          </template>
          <template v-if="column.dataIndex === 'options'">
            <div class="flex-row">
              <Button class="btn" @click="handleUpdateMusic(record)">编辑</Button>
              <Button class="btn" style="background-color: #e53935" @click="deleteMusicFun(record)">删除</Button>
            </div>
          </template>
        </template>
      </a-table>
      <a-pagination v-model:current="pagination.page" :total="pagination.total" show-size-changer
                    @change="getManageMusicListFun"/>
    </a-tab-pane>
    <a-tab-pane key="playlist" tab="歌单"></a-tab-pane>
    <a-tab-pane key="album" tab="专辑"></a-tab-pane>
  </a-tabs>

  <!--UploadImage Music-->
  <a-modal v-model:open="musicDialogVisible" :title="title" @cancel="resetUploadMusicData">
    <template #footer>
    </template>
    <div class="manage-wrapper">
      <div class="flex-row">
        <span class="grey" style="width: 3rem">封面:</span>
        <UploadImage type="image" v-model="uploadCoverFile"/>
      </div>
      <div class="flex-row" style="margin: 1rem 0">
        <span class="grey" style="width: 3rem">音频:</span>
        <a-upload
          :max-count="1"
          :before-upload="(file: UploadChangeParam) => {uploadMusicFile = file; return false}">
          <a-button>
            <upload-outlined/>
            Upload
          </a-button>
        </a-upload>
      </div>
      <div class="flex-row">
        <span class="grey" style="width: 3rem">视频:</span>
        <a-upload
          :max-count="1"
          :before-upload="beforeUploadMusic">
          <a-button>
            <upload-outlined/>
            Upload
          </a-button>
        </a-upload>
      </div>
      <div class="music-info">
        <InputText class="input-text" placeholder="请输入歌曲名" v-model="data.name"/>
        <InputText class="input-text" placeholder="请输入歌手名" v-model="data.singer"/>
        <InputText class="input-text" placeholder="请输入专辑名(可选)" v-model="data.album"/>
        <Button @click="uploadOrUpdateMusic" label="FINISH" :loading="loading"/>
      </div>
    </div>

    <a-modal :open="previewVisible" :title="previewTitle" :footer="null"
             @cancel="handleCancel">
      <img alt="" style="width: 100%;" :src="previewImage"/>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import { deleteMusic, getManageMusicList, updateMusic, uploadMusic } from '@/api/music';
import { onMounted, reactive, ref, watch } from 'vue';
import { durationFormater, formatTime } from '@/util/time';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import InputText from '@/components/InputText.vue';
import { Modal, notification, UploadChangeParam } from 'ant-design-vue';
import { Pagination } from '@/types/global';
import { debounce } from '@/util/schedulers';
import UploadImage from "@/components/UploadImage.vue";

onMounted(() => {
  getManageMusicListFun(undefined);
});

const musicList = ref<any[]>();
const activeKey = ref("musicList");
let title = '';
let searching = ref(false);
let key = ref('');
const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});

watch(key, debounce(async (newValue, oldValue) => {
  searching.value = true;
  if (newValue.trim().length > 0 && oldValue.trim() !== newValue.trim()) {
    await getManageMusicListFun(newValue.trim())
      .finally(() => searching.value = false);
  } else if (newValue?.trim().length === 0) {
    await getManageMusicListFun(undefined)
      .finally(() => searching.value = false);
  }
}, 300, false));

const getManageMusicListFun = async (key: string | undefined) => {
  await getManageMusicList({ page: pagination.value.page, size: 10, key }).then(response => {
    const { list, total } = response.data;
    list.forEach((music: any) => {
      music.duration = durationFormater(music.duration);
      music.size = sizeFormater(music.size);
      music.createTime = formatTime(music.createTime, '{y}-{m}-{d} {h}:{i}');
      music.updateTime = formatTime(music.updateTime, '{y}-{m}-{d} {h}:{i}');
    });
    pagination.value.total = total;
    musicList.value = list;
  });
};

const musicDialogVisible = ref(false);

// UploadImage Music
let data = reactive({
  musicId: undefined,
  name: '',
  singer: '',
  album: '',
});

const uploadMusicFile = ref();
const uploadCoverFile = ref();
const uploadVideoFile = ref();

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

let loading = ref(false);

const resetUploadMusicData = () => {
  uploadMusicFile.value = undefined;
  uploadCoverFile.value = undefined;
  uploadVideoFile.value = undefined;
  data = {
    musicId: undefined,
    name: '',
    singer: '',
    album: '',
  }
}

const uploadOrUpdateMusic = () => {
  data.musicId ? updateMusicFun() : uploadMusicFun();
}

const uploadMusicFun = () => {
  if (!uploadMusicFile.value) {
    notification.warning({
      message: 'Please select music',
    });
    return;
  }
  if (!uploadCoverFile.value?.file) {
    notification.warning({
      message: 'Please select cover',
    });
    return;
  }
  if (data.name?.trim().length === 0) {
    notification.warning({
      message: '歌曲名不能为空！',
    });
    return;
  }
  if (data.singer?.trim().length === 0) {
    notification.warning({
      message: '歌手不能为空！',
    });
    return;
  }
  loading.value = true;
  const musicData = new FormData();
  if (uploadVideoFile.value) {
    musicData.append('video', uploadVideoFile.value);
  }
  musicData.append('music', uploadMusicFile.value);
  musicData.append('cover', uploadCoverFile.value.file);
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album.trim());

  uploadMusic(musicData).then(async () => {
    await getManageMusicListFun(key.value?.trim());
    musicDialogVisible.value = false;
    resetUploadMusicData();
  }).finally(() => {
    loading.value = false;
  });
};

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const beforeUploadMusic = (file: UploadChangeParam) => {
  uploadMusicFile.value = file;
  return false;
}

const deleteMusicFun = (record: any) => {
  Modal.confirm({
    title: `删除歌曲《${record.name}》?`,
    // icon: Outlined),
    content: '是否确定删除此歌曲？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      deleteMusic(record.id).then(() => {
        getManageMusicListFun(key.value?.trim());
        notification.success({
          message: '成功',
          description: '删除成功！'
        });
      });
    },
    onCancel() {},
  });
}

const handleUpdateMusic = (record: any) => {
  musicDialogVisible.value = true;
  title = '编辑歌曲';
  data.musicId = record.id;
  data.name = record.name;
  data.singer = record.singer;
  data.album = record.album;
  uploadCoverFile.value = { url: record.cover }
}

const updateMusicFun = () => {
  if (data.name?.trim().length === 0) {
    notification.warning({
      message: '歌曲名不能为空！',
    });
    return;
  }
  if (data.singer?.trim().length === 0) {
    notification.warning({
      message: '歌手不能为空！',
    });
    return;
  }
  loading.value = true;
  const musicData = new FormData();
  if (uploadCoverFile.value.file) {
    musicData.append('cover', uploadCoverFile.value.file);
  }
  if (uploadMusicFile.value) {
    musicData.append('music', uploadMusicFile.value);
  }
  if (uploadVideoFile.value) {
    musicData.append('video', uploadVideoFile.value);
  }
  musicData.append('musicId', data.musicId!);
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album?.trim());

  updateMusic(musicData).then(() => {

  }).finally(() => {
    loading.value = false;
  });
}
</script>

<style scoped lang="scss">
.top {
  justify-content: right;
  margin-bottom: .5rem;
  gap: 1rem;
}

.music-item {
  padding: .25rem;
  border-radius: .25rem;
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

  &:hover {
    background-color: rgba(0, 0, 0, .1);
  }
}

.manage-wrapper {
  max-width: 30rem;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: .3rem;

  .music-info {
    .input-text {
      margin: 1.25rem 0;
      width: 100%;
      height: 3rem;
    }
  }
}
</style>
