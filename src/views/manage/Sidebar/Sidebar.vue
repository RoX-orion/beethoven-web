<template>
  <aside class="sidebar-wrapper custom-scroll" :class="{ mobile }">
    <div class="logo-wrapper pointer" @click="gotoHome">
      <img src="/assets/brand.png" alt="brand">
      <div class="brand-copy">
        <p class="brand-title">Beethoven</p>
        <p class="brand-subtitle">内容管理后台</p>
      </div>
    </div>
    <div class="nav-group">
      <Menu
        v-for="menu in manageRoutes[0]?.children"
        :key="menu.path"
        :menu="menu"
        @click="changeRoute(menu)"
      />
    </div>
    <div class="sidebar-footer">
      <p class="footer-title">设计目标</p>
      <p class="footer-text">让音乐、专辑、视频和系统设置都能在同一套清晰流程中维护。</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import Menu from './Menu.vue';
import router, { manageRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';

defineProps<{
  mobile?: boolean;
}>();

const emit = defineEmits<{
  navigate: [];
}>();

const changeRoute = (menu: RouteRecordRaw) => {
  router.push({ path: menu.path });
  emit('navigate');
};

const gotoHome = () => {
  router.push({ path: '/' });
  emit('navigate');
};
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: linear-gradient(180deg, rgba(17, 42, 92, .96), rgba(22, 36, 64, .96));
  padding: 1rem .85rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-right: 1px solid rgba(255, 255, 255, .08);

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: .85rem;
    background: rgba(255, 255, 255, .09);
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 1rem;
    padding: .9rem;

    img {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: .9rem;
      background: rgba(255, 255, 255, .9);
      padding: .35rem;
    }

    .brand-copy {
      color: white;
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 800;
    }

    .brand-subtitle {
      margin-top: .2rem;
      color: rgba(255, 255, 255, .68);
      font-size: .8rem;
    }
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: .35rem;
  }

  .footer-title {
    padding: 0 .3rem;
    font-size: .78rem;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, .52);
  }

  .sidebar-footer {
    margin-top: auto;
    padding: .9rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, .08);
    color: white;
  }

  .footer-text {
    margin-top: .45rem;
    font-size: .82rem;
    line-height: 1.55;
    color: rgba(255, 255, 255, .72);
  }
}

.sidebar-wrapper.mobile {
  position: static;
  width: 100%;
  min-height: 100%;
  border-right: 0;
}
</style>
