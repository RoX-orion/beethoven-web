<template>
  <button class="button-wrapper" :disabled="loading">
    <Loading color="white" v-if="loading"/>
    <label v-else>{{ label }}</label>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import Loading from '@/components/Loading.vue';

defineProps<{
  loading?: boolean;
  label?: string;
}>();
</script>

<style lang="scss" scoped>
.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3rem;
  border: 0;
  border-radius: var(--radius-control);
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  padding: 0.625rem 1rem;
  color: white;
  font-weight: 800;
  line-height: 1.2;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
  text-decoration: none !important;
  box-shadow: 0 .7rem 1.25rem rgba(55, 125, 255, .18);

  &:hover {
    filter: brightness(1.02);
    transform: translateY(-1px);
    box-shadow: 0 .85rem 1.5rem rgba(55, 125, 255, .22);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 .25rem var(--focus-ring), 0 .85rem 1.5rem rgba(55, 125, 255, .22);
  }

  &:disabled {
    cursor: default;
    filter: grayscale(.2);
    opacity: .72;
    transform: none;
  }
}
</style>
