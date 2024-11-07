<template>
  <div class="svg-wrapper">
    <svg-icon v-if="iconName" :name="iconName" :size="size" :color="iconColor"/>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue';

const props = defineProps({
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
  padding: .5rem;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background-color: var(--svg-button-shadow);
  }
}
</style>
