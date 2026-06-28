<template>
  <div class="manage-layout">
    <Sidebar class="desktop-sidebar"/>
    <a-drawer
      v-model:open="drawerOpen"
      placement="left"
      :width="280"
      class="mobile-drawer"
      :body-style="{ padding: '0' }"
    >
      <Sidebar mobile @navigate="drawerOpen = false"/>
    </a-drawer>
    <div class="manage-main">
      <header class="manage-header">
        <div class="header-content">
          <button class="menu-button pointer" type="button" @click="drawerOpen = true">
            <svg-icon name="menu" size="1.2rem" color="var(--text-primary)"/>
          </button>
          <div>
            <h1>{{ currentTitle }}</h1>
          </div>
        </div>
        <button class="home-button pointer" type="button" @click="router.push('/')">
          返回前台
        </button>
      </header>
      <div class="right-container custom-scroll">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Sidebar from './Sidebar/Sidebar.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const route = useRoute();
const router = useRouter();
const drawerOpen = ref(false);

const currentTitle = computed(() => String(route.meta?.title ?? '后台管理'));
</script>

<style scoped lang="scss">
.manage-layout {
  height: 100dvh;
}

.manage-main {
  margin-left: var(--sidebar-width);
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.manage-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  background: rgba(247, 251, 255, .72);
  backdrop-filter: blur(1.25rem);
  border-bottom: 1px solid rgba(24, 33, 47, .06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: .9rem;

  .eyebrow {
    font-size: .78rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--brand-primary);
    margin-bottom: .2rem;
  }

  h1 {
    font-size: clamp(1.25rem, 2vw, 1.9rem);
    font-weight: 800;
    line-height: 1.1;
  }
}

.menu-button,
.home-button {
  border: 1px solid var(--surface-border);
  background: rgba(255, 255, 255, .72);
  border-radius: .9rem;
  color: var(--text-primary);
}

.menu-button {
  width: 2.8rem;
  height: 2.8rem;
  display: none;
  align-items: center;
  justify-content: center;
}

.home-button {
  padding: .8rem 1rem;
  font-weight: 700;
  transition: transform .18s ease, box-shadow .18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--surface-shadow);
  }
}

.right-container {
  flex: 1;
  min-height: 0;
  padding: 1rem 1.25rem 1.5rem;
  overflow: auto !important;
}

:deep(.mobile-drawer .ant-drawer-body) {
  padding: 0 !important;
}

@media (max-width: 960px) {
  .desktop-sidebar {
    display: none;
  }

  .manage-main {
    margin-left: 0;
  }

  .menu-button {
    display: inline-flex;
  }

  .home-button {
    padding: .75rem .9rem;
    font-size: .9rem;
  }

  .right-container {
    padding: .85rem .85rem 1.25rem;
  }
}
</style>

