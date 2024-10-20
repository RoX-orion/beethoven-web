<template>
  <div class="flex-row header-container">
    <img class="brand" src="../../assets/brand.png" alt="brand">
    <span class="brand-text">Beethoven Music</span>
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
  padding: 10px;

  .brand {
    width: var(--header-item-size);
    height: var(--header-item-size);
    margin: auto 0 auto 2vw;
  }

  .brand-text {
    color: rgba(56, 56, 56, 1);
    font-size: 1.5rem;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.25);
    font-weight: 700;
    line-height: 2.17rem;
    //padding: 0.5rem 1rem;
    margin: auto 1rem;
  }

  .search-container {
    margin: auto;
    width: var(--search-width);
  }
}
</style>
