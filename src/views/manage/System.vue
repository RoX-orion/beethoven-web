<template>
  <section class="system-page">
    <div class="system-card">
      <div class="card-head">
        <div>
          <h2>音乐上传基础配置</h2>
        </div>
        <Button class="save-btn" :loading="loading" label="保存配置" @click="updateMusicConfigFun"/>
      </div>

      <div class="system-grid">
        <div class="field-card">
          <p class="label-text">默认音乐封面</p>
          <p class="help-text">没有单独封面的资源会优先使用这里设置的默认图片。</p>
          <UploadImage
            v-model="defaultMusicCover"
            type="image"
            title="上传默认封面"
            hint="建议使用清晰方图，移动端列表展示更稳定"
          />
        </div>

        <div class="field-card">
          <p class="label-text">分片大小</p>
          <p class="help-text">单位为字节，建议不小于 `1024`，用于控制大文件上传切分策略。</p>
          <InputText v-model="musicConfig.shardingSize" placeholder="请输入分片大小"/>
          <div class="tips">
            <div class="tip-chip">推荐大于 1 KB</div>
            <div class="tip-chip">适合大体积音频</div>
            <div class="tip-chip">修改后建议回归上传流程</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import UploadImage from '@/components/UploadImage.vue';
import InputText from '@/components/InputText.vue';
import Button from '@/components/Button.vue';
import { getMusicConfig, updateMusicConfig } from '@/api/appConfig';
import type { FileListType, MusicConfigType } from '@/types/global';

const defaultMusicCover = ref<FileListType>();
const loading = ref(false);
const musicConfig: MusicConfigType = reactive({});

const getMusicConfigFun = () => {
  getMusicConfig().then(response => {
    Object.assign(musicConfig, response.data);
    defaultMusicCover.value = { url: musicConfig.defaultMusicCover };
  });
};

const updateMusicConfigFun = () => {
  if (!/^(?!0\d)\d+$/.test(String(musicConfig.shardingSize)) || musicConfig.shardingSize < 1024) {
    return;
  }
  const musicConfigData = new FormData();
  if (defaultMusicCover.value?.file) {
    musicConfigData.append('defaultMusicCoverFile', defaultMusicCover.value.file);
  }
  musicConfigData.append('shardingSize', String(musicConfig.shardingSize));
  loading.value = true;
  updateMusicConfig(musicConfigData)
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getMusicConfigFun();
});
</script>

<style scoped lang="scss">
.system-page {
  display: grid;
}

.system-card {
  border: 1px solid var(--surface-border);
  border-radius: 1.35rem;
  background: rgba(255, 255, 255, .82);
  box-shadow: var(--surface-shadow);
  padding: 1.2rem;
}

.card-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.eyebrow {
  color: var(--brand-primary);
  font-size: .8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}

h2 {
  margin-top: .35rem;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  font-weight: 800;
}

.save-btn {
  width: auto;
  min-width: 8rem;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.field-card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(243, 247, 252, .88);
}

.label-text {
  font-size: .98rem;
  font-weight: 700;
}

.help-text {
  margin: .45rem 0 1rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.tips {
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
  margin-top: .85rem;
}

.tip-chip {
  padding: .45rem .7rem;
  border-radius: 999px;
  background: rgba(55, 125, 255, .1);
  color: var(--brand-primary-hover);
  font-size: .8rem;
  font-weight: 700;
}

@media (max-width: 840px) {
  .card-head,
  .system-grid {
    grid-template-columns: 1fr;
    display: grid;
  }

  .save-btn {
    width: 100%;
  }
}
</style>
