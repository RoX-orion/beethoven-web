<template>
  <div class="svg-wrapper">
    <svg-icon v-if="iconName" :name="iconName" :size="size" :color="iconColor"/>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';

defineProps({
  iconName: {
    type: String,
  },
  iconColor: {
    type: String,
    default: 'rgb(0, 0, 0)'
  },
  size: {
    type: String,
    default: '1.5rem',
  },
});
</script>

<style scoped lang="scss">
.svg-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  padding: .5rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: var(--svg-button-shadow);
  }
}
</style>
