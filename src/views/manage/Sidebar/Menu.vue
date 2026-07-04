<template>
  <div class="menu-item pointer" :class="{ active: isActive, collapsed }" @click="$emit('click')">
    <!-- Icon -->
    <div class="menu-icon">
      <svg-icon
        v-if="iconName"
        :name="iconName"
        size="1.25rem"
        :color="isActive ? 'var(--brand-primary)' : 'var(--text-tertiary)'"
      />
    </div>

    <!-- Label (hidden when collapsed header) -->
    <div class="menu-label" v-show="!collapsed">
      <p class="title">{{ menu.meta?.title }}</p>
    </div>

    <!-- Active indicator bar -->
    <div class="active-bar" v-if="isActive"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps<{
  menu: RouteRecordRaw;
  collapsed?: boolean;
}>();

defineEmits<{
  click: [];
}>();

const route = useRoute();

const isActive = computed(() => route.path === `/manage/${props.menu.path}`);

const iconName = computed(() => {
  return (props.menu.meta?.icon as string | undefined) ?? '';
});
</script>

<style scoped lang="scss">
.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .7rem .75rem;
  border-radius: .65rem;
  transition: background-color .2s ease, transform .18s ease;
  overflow: hidden;

  .menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }

  .menu-label {
    overflow: hidden;

    .title {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: .88rem;
      white-space: nowrap;
      transition: color .2s ease;
    }
  }

  // Active indicator bar (right side)
  .active-bar {
    position: absolute;
    right: -.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 1.4rem;
    border-radius: 3px;
    background: linear-gradient(180deg, #6aa8ff, #377dff);
    box-shadow: 0 0 6px rgba(55, 125, 255, .5);
  }

  // Hover state
  &:hover {
    background: var(--surface-hover);
    transform: translateX(2px);

    .menu-icon :deep(svg) {
      color: var(--text-primary) !important;
    }

    .title {
      color: var(--text-primary) !important;
    }
  }

  // Active state
  &.active {
    background: var(--surface-active);

    .menu-icon :deep(svg) {
      color: var(--brand-primary) !important;
    }

    .title {
      color: var(--brand-primary) !important;
    }

    &:hover {
      transform: translateX(0);
    }
  }

  // Collapsed state (icon only)
  &.collapsed {
    justify-content: center;
    padding: .7rem 0;
    width: 2.8rem;
    margin: 0 auto;
    border-radius: .75rem;

    .menu-icon {
      width: 1.35rem;
      height: 1.35rem;
    }
  }
}
</style>
