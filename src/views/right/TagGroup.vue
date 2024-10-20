<template>
  <div class="tag-container">
    <Tag class="tag" v-for="() in 4"/>
  </div>
</template>

<script setup lang="ts">
import Tag from './Tag.vue';
</script>

<style scoped lang="scss">
.tag-container {
  .tag {
    display: inline-block;
    margin-right: 1.187rem;
  }
}
</style>
