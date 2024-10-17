<template>
  <div class="search-wrapper">
    <div>
      <Loading v-if="searching"/>
      <svg-icon v-else style="margin: auto; display: block; width: 2rem" size="1.5rem" name="search"/>
    </div>
    <input
      class="search"
      placeholder="Search"
      v-model="search"
      @click="$emit('activeCallback')"
      @input="searchChange"/>
    <div class="close" v-show="search.trim().length > 0">
      <svg-icon size="100%" name="close"  @click="resetSearch"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Loading from "./Loading.vue";

const search = ref<string>("");
const searching = ref(false);

const searchChange = () => {
  searching.value = true;
  setTimeout(() => {
    searching.value = false;
  }, 1000);
}

const resetSearch = () => {
  search.value = '';
}
</script>

<style scoped lang="scss">
.search-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.2rem;

  border-radius: 1.375rem;
  padding: 5px 10px;
  outline: none;
  border: rgba(0, 0, 0, .05) solid 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .04), 0 0 6px rgba(0, 0, 0, .04);

  &:focus {
    outline: none;
    border: #3390ec solid 2px;
  }
}
.search {
  width: 100%;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 0 10px;
  //box-shadow: 0 0 .625rem 0 var(--color-default-shadow);
}

.close {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 16px;
  cursor: pointer;
  align-items: center;
  padding: 7px 10px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, .07);
  }
}
</style>
