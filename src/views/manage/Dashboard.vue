<template>
  <section class="dashboard-page">
    <div class="hero-card">
      <div class="hero-copy">
        <h2>把内容管理做成稳定、清晰、适合日常维护的工作台。</h2>
        <p class="summary">
          这里聚合了音乐上传、专辑维护、视频内容检查和系统配置，桌面端强调效率，移动端则保留完整操作能力。
        </p>
      </div>
      <div class="hero-grid">
        <div v-for="item in quickStats" :key="item.label" class="stat-card">
          <p class="stat-value">{{ item.value }}</p>
          <p class="stat-label">{{ item.label }}</p>
          <p class="stat-note">{{ item.note }}</p>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>推荐操作顺序</h3>
          <p>适合你后续继续维护这套后台。</p>
        </div>
        <div class="timeline">
          <div v-for="step in steps" :key="step.title" class="timeline-item">
            <span class="step-index">{{ step.index }}</span>
            <div>
              <p class="step-title">{{ step.title }}</p>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3>功能入口</h3>
          <p>后台四个模块分别承担的职责。</p>
        </div>
        <div class="shortcut-list">
          <router-link
            v-for="item in shortcuts"
            :key="item.title"
            :to="item.to"
            class="shortcut-card"
          >
            <p class="shortcut-title">{{ item.title }}</p>
            <p class="shortcut-desc">{{ item.desc }}</p>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const quickStats = [
  { label: '统一上传', value: '01', note: '图片、音频、视频采用一致交互' },
  { label: '响应式后台', value: '02', note: '桌面与移动端均可完整访问' },
  { label: '内容工作流', value: '03', note: '上传、筛选、编辑、巡检一体化' },
  { label: '视觉升级', value: '04', note: '沿用蓝色玻璃质感并增强层次' },
];

const steps = [
  { index: '01', title: '先在媒体管理页处理内容', desc: '上传歌曲时可以同时补封面和视频，减少多处来回切换。' },
  { index: '02', title: '专辑和视频在同页联动检查', desc: '列表布局统一后，定位异常数据会更快。' },
  { index: '03', title: '系统设置作为收尾', desc: '默认封面和分片大小适合在内容准备完之后统一校准。' },
];

const shortcuts = [
  { title: '媒体管理', desc: '管理歌曲、视频、专辑与上传弹窗。', to: '/manage/music' },
  { title: '资源概览', desc: '查看内容规模、维护建议与排查重点。', to: '/manage/storage' },
  { title: '系统设置', desc: '配置默认封面与上传分片参数。', to: '/manage/system' },
];
</script>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 1rem;
}

.hero-card,
.panel {
  border: 1px solid var(--surface-border);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, .78);
  box-shadow: var(--surface-shadow);
  backdrop-filter: blur(1.1rem);
}

.hero-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
  padding: 1.4rem;
  background: radial-gradient(circle at top right, rgba(106, 168, 255, .18), transparent 36%), linear-gradient(135deg, rgba(255, 255, 255, .88), rgba(244, 249, 255, .82));
}

.hero-copy {

  h2 {
    margin-top: .5rem;
    font-size: clamp(1.5rem, 3vw, 2.6rem);
    line-height: 1.08;
    font-weight: 800;
    max-width: 12em;
  }

  .summary {
    margin-top: .9rem;
    max-width: 44rem;
    line-height: 1.75;
    color: var(--text-secondary);
  }
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .85rem;
}

.stat-card,
.shortcut-card {
  border-radius: 1.1rem;
  border: 1px solid rgba(55, 125, 255, .12);
  background: rgba(255, 255, 255, .72);
  padding: 1rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--brand-primary-hover);
}

.stat-label {
  margin-top: .35rem;
  font-weight: 700;
}

.stat-note,
.step-desc,
.shortcut-desc,
.panel-head p {
  margin-top: .3rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.panel {
  padding: 1.2rem;
}

.panel-head h3 {
  font-size: 1.08rem;
  font-weight: 800;
}

.timeline,
.shortcut-list {
  display: grid;
  gap: .8rem;
  margin-top: 1rem;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: .8rem;
  align-items: start;
}

.step-index {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: .75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(55, 125, 255, .12);
  color: var(--brand-primary-hover);
  font-weight: 800;
}

.step-title,
.shortcut-title {
  font-weight: 700;
}

.shortcut-card {
  text-decoration: none;
  color: inherit;
  transition: transform .18s ease, box-shadow .18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 .9rem 1.8rem rgba(55, 125, 255, .12);
  }
}

@media (max-width: 960px) {
  .hero-card,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .hero-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .hero-card,
  .panel {
    padding: 1rem;
    border-radius: 1.1rem;
  }

  .hero-grid {
    grid-template-columns: 1fr;
  }
}
</style>
