<template>
  <div class="search-wrapper">
    <div>
      <Loading v-if="searching"/>
      <svg-icon v-else style="margin: auto; display: block;" size="2rem" name="search"/>
    </div>
    <input
      class="search"
      placeholder="Search"
      v-model="search"
      @click="$emit('activeCallback')"
      @input="searchChange"/>
    <div class="close" v-show="search.trim().length >= 0">
      <svg-icon size="1.25rem" name="close" @click="resetSearch"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Loading from "./Loading.vue";
import SvgIcon from '@/components/SvgIcon.vue';

let search = ref<string>("");
const searching = ref(false);

const searchChange = () => {
  search.value = search.value.trim();
  if (!searching.value) {
    searching.value = search.value.length > 0;
    setTimeout(() => {
      searching.value = false;
    }, 2000);
  }
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
  height: var(--header-item-size);
  justify-content: space-between;
  border-radius: 2rem;
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
  background-color: inherit;
  //box-shadow: 0 0 .625rem 0 var(--color-default-shadow);
}

.close {
  width: 2rem;
  cursor: pointer;
  border-radius: 50%;
  padding: .25rem;

  &:hover {
    background-color: rgba(0, 0, 0, .07);
  }
}
</style>
