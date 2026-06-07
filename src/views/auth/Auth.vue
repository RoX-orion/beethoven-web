<template>
  <main class="auth-page">
    <section class="auth-shell">
      <div class="brand-panel">
        <div class="brand-top">
          <img class="brand-mark" src="/assets/brand.png" alt="Beethoven Music">
          <span>Beethoven Music</span>
        </div>
        <div class="hero-copy">
          <p class="eyebrow">Private music library</p>
          <h1>把音乐、歌单和灵感带回同一个地方。</h1>
          <p class="description">
            登录后同步你的音乐收藏，继续管理歌单、播放记录和个人媒体库。
          </p>
        </div>
        <div class="visualizer" aria-hidden="true">
          <span v-for="bar in bars" :key="bar" :style="{ height: `${bar}%` }"></span>
        </div>
        <div class="feature-row">
          <div>
            <strong>OAuth</strong>
            <span>GitHub 安全授权</span>
          </div>
          <div>
            <strong>Cloud</strong>
            <span>跨设备访问</span>
          </div>
          <div>
            <strong>Library</strong>
            <span>统一管理媒体</span>
          </div>
        </div>
      </div>

      <div class="login-panel">
        <div class="login-card">
          <div class="card-heading">
            <p>欢迎回来</p>
            <h2>登录 Beethoven</h2>
            <span>使用 GitHub 账号继续访问你的音乐空间。</span>
          </div>

          <button class="github-button" type="button" :disabled="loading" @click="handleAuth">
            <img src="/assets/img/GitHub.png" alt="">
            <span>{{ loading ? '正在跳转...' : '使用 GitHub 登录' }}</span>
          </button>

          <div class="divider">
            <span></span>
            <p>当前支持 GitHub OAuth</p>
            <span></span>
          </div>

          <div class="security-note">
            <span class="note-icon">✓</span>
            <p>授权完成后将自动返回 Beethoven Music Web。</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { notification } from 'ant-design-vue';
import { getOAuth2Info } from '@/api/auth';

const bars = [34, 58, 82, 46, 72, 95, 56, 68, 40, 76, 62, 88, 52, 70];
const loading = ref(false);

const handleAuth = async () => {
  if (loading.value) {
    return;
  }

  loading.value = true;
  try {
    const response = await getOAuth2Info('GITHUB');
    const { data } = response;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&state=${data.state}`;
  } catch (error) {
    loading.value = false;
    notification.error({
      message: '登录失败',
      description: '暂时无法获取 GitHub 授权信息，请稍后再试。',
    });
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #18212f;
  background: radial-gradient(circle at 18% 16%, rgba(84, 196, 255, .45), transparent 28rem),
  radial-gradient(circle at 86% 82%, rgba(255, 182, 117, .34), transparent 24rem),
  linear-gradient(135deg, #f7fbff 0%, #eef6f0 48%, #fff7ee 100%);
}

.auth-shell {
  width: min(68rem, 100%);
  min-height: 39rem;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(22rem, .92fr);
  overflow: hidden;
  border: 1px solid rgba(24, 33, 47, .08);
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, .72);
  box-shadow: 0 1.5rem 4rem rgba(32, 53, 77, .18);
  backdrop-filter: blur(1.5rem);
}

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 39rem;
  padding: 2rem;
  overflow: hidden;
  color: white;
  background: linear-gradient(145deg, rgba(19, 42, 73, .94), rgba(27, 96, 111, .86)),
  url('/assets/img/playlistCover.png') center / cover;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, .12), transparent 42%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, .06) 0 1px, transparent 1px 5rem);
    pointer-events: none;
  }
}

.brand-top,
.hero-copy,
.visualizer,
.feature-row {
  position: relative;
  z-index: 1;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: .75rem;
  font-size: .95rem;
  font-weight: 700;
  letter-spacing: .04rem;
}

.brand-mark {
  width: 2.35rem;
  height: 2.35rem;
  object-fit: contain;
  border-radius: .5rem;
  background: rgba(255, 255, 255, .9);
}

.hero-copy {
  max-width: 30rem;

  .eyebrow {
    margin-bottom: .85rem;
    color: #a8f1d7;
    font-size: .8rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.08;
    font-weight: 800;
  }

  .description {
    width: min(100%, 25rem);
    margin-top: 1.2rem;
    color: rgba(255, 255, 255, .78);
    font-size: 1rem;
    line-height: 1.8;
  }
}

.visualizer {
  display: flex;
  align-items: end;
  gap: .55rem;
  height: 6rem;
  width: min(100%, 32rem);
  padding: .9rem;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 1rem;
  background: rgba(255, 255, 255, .08);

  span {
    flex: 1;
    min-width: .35rem;
    border-radius: 999px;
    background: linear-gradient(180deg, #f6d27f, #5be7c4);
    box-shadow: 0 0 1rem rgba(91, 231, 196, .28);
  }
}

.feature-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .75rem;

  div {
    padding: .85rem;
    border: 1px solid rgba(255, 255, 255, .12);
    border-radius: .75rem;
    background: rgba(255, 255, 255, .08);
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: .9rem;
    font-weight: 800;
  }

  span {
    margin-top: .35rem;
    color: rgba(255, 255, 255, .68);
    font-size: .78rem;
  }
}

.login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: min(100%, 25rem);
}

.card-heading {
  margin-bottom: 2rem;

  p {
    color: #2f8f76;
    font-size: .9rem;
    font-weight: 800;
  }

  h2 {
    margin: .35rem 0 .6rem;
    color: #152238;
    font-size: 2rem;
    font-weight: 800;
  }

  span {
    color: #6d7888;
    line-height: 1.7;
  }
}

.github-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  width: 100%;
  height: 3.5rem;
  border: 0;
  border-radius: .75rem;
  color: white;
  background: #171b22;
  cursor: pointer;
  box-shadow: 0 .8rem 1.6rem rgba(23, 27, 34, .18);
  transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: #252b35;
    box-shadow: 0 1rem 2rem rgba(23, 27, 34, .24);
  }

  &:disabled {
    cursor: wait;
    opacity: .72;
  }

  img {
    width: 1.35rem;
    height: 1.35rem;
  }

  span {
    font-size: .98rem;
    font-weight: 800;
  }
}

.divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: .75rem;
  margin: 1.5rem 0;
  color: #8a95a4;
  font-size: .8rem;

  span {
    height: 1px;
    background: rgba(21, 34, 56, .12);
  }
}

.security-note {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .9rem 1rem;
  border: 1px solid rgba(47, 143, 118, .16);
  border-radius: .75rem;
  color: #516071;
  background: rgba(47, 143, 118, .08);

  p {
    line-height: 1.55;
  }
}

.note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  color: white;
  background: #2f8f76;
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .auth-page {
    padding: 1rem;
    align-items: flex-start;
  }

  .auth-shell {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .brand-panel {
    min-height: 28rem;
    padding: 1.35rem;
  }

  .feature-row {
    grid-template-columns: 1fr;
  }

  .login-panel {
    padding: 1.5rem;
  }
}
</style>
