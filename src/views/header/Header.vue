<template>
  <div class="flex-row header-container">
    <Search class="search-container"/>
    <Account/>
  </div>
</template>

<script setup lang="ts">
import Search from "@/components/Search.vue";
import Account from './Account.vue';
</script>

<style lang="scss" scoped>
.header-container {
  //justify-content: center;
  padding: 10px;

  .search-container {
    margin: auto;
    width: var(--search-width);
  }


}
</style>
