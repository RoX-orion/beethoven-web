<template>
  <div class="search-wrapper">
    <div style="margin: auto; width: 2.5rem">
      <Loading v-if="searching"/>
      <svg-icon v-else size="1.5rem" name="search" color="#1296db"/>
    </div>
    <input
      class="search"
      placeholder="Search"
      v-model="search"/>
    <IconButton
      icon-name="close"
      icon-color="rgba(0, 0, 0, .5)"
      v-show="search.trim().length > 0"
      @click="resetSearch"/>
  </div>
</template>

<script setup lang="ts">
import Loading from "./Loading.vue";
import SvgIcon from '@/components/SvgIcon.vue';
import IconButton from '@/components/IconButton.vue';

let search = defineModel({
  type: String,
  required: true
});

const searching = defineModel('searching', {
  required: true,
  default: false
});

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
  font-size: 1rem;
  background-color: inherit;
  //box-shadow: 0 0 .625rem 0 var(--color-default-shadow);
}
</style>
