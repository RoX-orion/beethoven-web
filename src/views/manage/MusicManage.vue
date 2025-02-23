<template>
  <a-tabs v-model:activeKey="activeKey" size="small">
    <a-tab-pane key="musicList" tab="歌曲">
      <div class="flex-row top">
        <Search v-model="name" :searching="searching" style="width: 100%"/>
        <Button style="width: 5rem; height: 2.25rem; border-radius: .25rem; margin: .25rem 0"
                @click="uploadMusicDialogVisible = true">上传
        </Button>
      </div>
      <a-table class="music-item" :columns="columns" :data-source="musicList" :pagination="false">
        <template v-slot:bodyCell="{ column, record}">
          <template v-if="column.dataIndex === 'cover'">
            <img :src="record.cover" alt="" class="cover"/>
          </template>
          <template v-if="column.dataIndex === 'options'">
            <div class="flex-row">
              <Button class="btn">编辑</Button>
              <Button class="btn" style="background-color: #e53935">删除</Button>
            </div>
          </template>
        </template>
      </a-table>
      <a-pagination v-model:current="pagination.page" :total="pagination.total" show-size-changer
                    @change="getManageMusicListFun"/>
    </a-tab-pane>
    <a-tab-pane key="uploadMusic" tab="歌单"></a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
  </a-tabs>

  <!--Upload Music-->
  <a-modal v-model:open="uploadMusicDialogVisible" width="30rem" title="上传歌曲">
    <template #footer>
    </template>
    <div class="manage-wrapper">
      <div class="flex-row">
        <span class="grey" style="width: 3rem">封面:</span>
        <a-upload
          style="margin: auto"
          :max-count="1"
          list-type="picture-card"
          :before-upload="beforeUploadCover"
          @preview="handlePreview">
          <plus-outlined v-if="!uploadCoverFile"/>
        </a-upload>

      </div>
      <div class="flex-row">
        <span class="grey" style="width: 3rem">音频:</span>
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
        <Button @click="uploadMusicFun" label="FINISH" :loading="uploading"/>
      </div>
    </div>

    <a-modal style="z-index: 9999;  position: relative;" :open="previewVisible" :title="previewTitle" :footer="null"
             @cancel="handleCancel">
      <img alt="" style="width: 100%;" :src="previewImage"/>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import { getManageMusicList } from '@/api/music';
import { onMounted, ref, reactive } from 'vue';
import { durationFormater, formatTime } from '@/util/time';
import { sizeFormater } from '@/util/file';
import Button from '@/components/Button.vue';
import Search from '@/components/Search.vue';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import InputText from '@/components/InputText.vue';
import { uploadMusic } from '@/api/music';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { getBase64 } from '@/util/file';
import { Pagination } from '@/types/global';

onMounted(() => {
  getManageMusicListFun();
});

const musicList = ref<any[]>();
const activeKey = ref("musicList");
let searching = ref(false);
let name = ref('');
const pagination = ref<Pagination>({
  page: 1,
  total: 0,
});

const getManageMusicListFun = async () => {
  getManageMusicList({ page: pagination.value.page, size: 10, key: '' }).then(response => {
    const { list, total } = response.data;
    list.forEach(music => {
      music.duration = durationFormater(music.duration);
      music.size = sizeFormater(music.size);
      music.createTime = formatTime(music.createTime, '{y}-{m}-{d} {h}:{i}');
      music.updateTime = formatTime(music.updateTime, '{y}-{m}-{d} {h}:{i}');
    });
    pagination.value.total = total;
    musicList.value = list;
  });
};

const uploadMusicDialogVisible = ref(false);

// Upload Music
const data = reactive({
  name: '',
  singer: '',
  album: '',
});

let uploadMusicFile = ref();
let uploadCoverFile = ref();

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

let uploading = ref(false);

const uploadMusicFun = () => {
  if (!uploadMusicFile.value) {
    alert('Please select music!');
    return;
  }
  if (!uploadCoverFile.value) {
    alert('Please select cover!');
    return;
  }
  uploading.value = true;
  const musicData = new FormData();
  musicData.append('music', uploadMusicFile.value);
  musicData.append('cover', uploadCoverFile.value);
  musicData.append('name', data.name.trim());
  musicData.append('singer', data.singer.trim());
  musicData.append('album', data.album.trim());

  uploadMusic(musicData).then(async response => {
    if (response.code === 200) {
      await getManageMusicListFun();
      uploadMusicDialogVisible.value = false;
      uploadCoverFile.value = undefined;
    }
  }).finally(() => {
    uploading.value = false;
  });
};

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const handlePreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const beforeUploadCover = (file: UploadChangeParam) => {
  uploadCoverFile.value = file;
  return false;
}
const beforeUploadMusic = (file: UploadChangeParam) => {
  uploadMusicFile.value = file;
  return false;
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
