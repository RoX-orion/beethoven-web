<template>
  <section class="storage-wrapper">
    <div class="overview-grid">
      <div v-for="item in overviewCards" :key="item.title" class="overview-card">
        <h3>{{ item.title }}</h3>
        <p class="card-desc">{{ item.desc }}</p>
      </div>
    </div>

    <div class="insight-panel">
      <div class="panel-head">
        <h3>后台维护建议</h3>
        <p>这部分不依赖额外接口，主要帮你快速判断日常维护优先级。</p>
      </div>
      <div class="insight-list">
        <div v-for="item in insights" :key="item.title" class="insight-item">
          <p class="insight-title">{{ item.title }}</p>
          <p class="insight-desc">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const overviewCards = [
  { title: '歌曲主资源', desc: '关注封面、音频、视频三类资源是否同时齐备，优先避免元数据齐全但文件缺失。' },
  { title: '专辑结构', desc: '专辑更适合用来组织内容层级，名称应保持简短清晰，便于前台检索。' },
  { title: '视频附加内容', desc: '建议把视频视为歌曲增强资源，在巡检时重点看封面和歌曲名是否一致。' },
  { title: '系统配置', desc: '默认封面和分片大小属于底层策略，改动后需要回看上传链路是否稳定。' },
];

const insights = [
  { title: '先排查封面资源', desc: '封面最容易暴露上传、缓存和格式问题，也是移动端列表里最先感知到的内容。' },
  { title: '移动端优先关注表单长度', desc: '管理后台很多操作都依赖弹窗，移动端需要控制表单字段堆叠后的阅读压力。' },
  { title: '尽量统一上传入口', desc: '歌曲、视频、默认封面如果交互风格一致，后续维护和培训成本会明显降低。' },
];
</script>

<style scoped lang="scss">
.storage-wrapper {
  display: grid;
  gap: 1rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.overview-card,
.insight-panel {
  border: 1px solid var(--surface-border);
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, .78);
  box-shadow: var(--surface-shadow);
  padding: 1.15rem;
}

.card-tag {
  color: var(--brand-primary);
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: .78rem;
}

h3,
.insight-title {
  font-size: 1.04rem;
  font-weight: 800;
  margin-top: .35rem;
}

.card-desc,
.panel-head p,
.insight-desc {
  margin-top: .45rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.insight-list {
  display: grid;
  gap: .8rem;
  margin-top: 1rem;
}

.insight-item {
  border-radius: 1rem;
  background: rgba(244, 248, 252, .82);
  padding: .95rem 1rem;
}

@media (max-width: 800px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
