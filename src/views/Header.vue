<template>
  <div class="flex-row header-container">
    <Search class="search-container"/>
  </div>
</template>

<script setup lang="ts">
import Search from "@/components/Search.vue";
</script>

<style scoped>
.header-container {
  justify-content: center;

  .search-container {
    width: 30%;
  }
}
</style>
