<template>
  <aside class="sidebar-wrapper custom-scroll" :class="{ mobile, collapsed }">
    <!-- Logo Section -->
    <div class="logo-wrapper" :class="{ collapsed: isCollapsed }" @click="gotoHome">
      <img src="/assets/brand.png" alt="brand">
      <div class="brand-copy" v-show="!isCollapsed">
        <p class="brand-title">Beethoven</p>
        <p class="brand-subtitle">管理后台</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="nav-group">
      <Menu
        v-for="menu in manageRoutes[0]?.children"
        :key="menu.path"
        :menu="menu"
        :collapsed="isCollapsed"
        @click="changeRoute(menu)"
      />
    </div>

    <!-- Collapse Toggle Button -->
    <div class="collapse-toggle pointer" @click="toggleCollapse" :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'">
      <svg-icon :name="isCollapsed ? 'next' : 'prev'" size="1.15rem" color="var(--text-tertiary)"/>
      <span v-show="!isCollapsed" class="toggle-label">收起侧边栏</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Menu from './Menu.vue';
import router, { manageRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps<{
  mobile?: boolean;
  collapsed?: boolean;
}>();

const emit = defineEmits<{
  navigate: [];
  'update:collapsed': [value: boolean];
}>();

const isCollapsed = computed(() => props.collapsed ?? false);

const changeRoute = (menu: RouteRecordRaw) => {
  router.push({ path: menu.path });
  emit('navigate');
};

const gotoHome = () => {
  router.push({ path: '/' });
  emit('navigate');
};

const toggleCollapse = () => {
  emit('update:collapsed', !isCollapsed.value);
};
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--surface-color-strong);
  backdrop-filter: blur(.75rem);
  padding: 1rem .75rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  border-right: 1px solid var(--surface-border);
  transition: width .25s cubic-bezier(.4, 0, .2, 1);
  z-index: 100;
  overflow-x: hidden;
  overflow-y: auto;

  // Scrollbar styling
  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .1);
    border-radius: 3px;
  }

  // ---- Collapsed state ----
  &.collapsed {
    width: var(--sidebar-width-collapsed);

    .nav-group {
      align-items: center;
    }

    .collapse-toggle {
      justify-content: center;
      padding: .7rem 0;
    }
  }

  // ---- Logo section ----
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .5rem .45rem;
    border-radius: .75rem;
    transition: background-color .2s ease;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      background: var(--surface-hover);
    }

    img {
      width: 2.6rem;
      height: 2.6rem;
      border-radius: .8rem;
      flex-shrink: 0;
    }

    .brand-copy {
      color: var(--text-primary);
      overflow: hidden;
      white-space: nowrap;
    }

    .brand-title {
      font-size: 1rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .brand-subtitle {
      margin-top: .15rem;
      color: var(--text-tertiary);
      font-size: .75rem;
    }
  }

  // ---- Nav group ----
  .nav-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .25rem;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: .25rem 0;
  }

  // ---- Collapse toggle ----
  .collapse-toggle {
    display: flex;
    align-items: center;
    gap: .65rem;
    padding: .7rem .75rem;
    border-radius: .75rem;
    transition: background-color .2s ease, color .2s ease;
    color: var(--text-tertiary);
    font-size: .82rem;
    font-weight: 600;
    flex-shrink: 0;
    border-top: 1px solid var(--surface-border);

    &:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }

    .toggle-label {
      white-space: nowrap;
    }
  }
}

// ---- Mobile override ----
.sidebar-wrapper.mobile {
  position: static;
  width: 100%;
  min-height: 100%;
  border-right: 0;

  &.collapsed {
    width: 100%;
  }
}
</style>
