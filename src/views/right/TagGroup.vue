<template>
  <div class="tag-wrapper">
    <Tag class="tag pointer" v-for="() in 4"/>
  </div>
</template>

<script setup lang="ts">
import Tag from './Tag.vue';
</script>

<style scoped lang="scss">
.tag-wrapper {
  padding: 0 var(--base-padding);
  .tag {
    display: inline-block;
    margin-right: 1.187rem;
  }
}
</style>
