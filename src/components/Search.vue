<template>
  <div class="search-wrapper">
    <div class="search-icon">
      <Loading v-if="searching"/>
      <svg-icon v-else size="1.5rem" name="search" color="#1296db"/>
    </div>
    <input
      class="search"
      placeholder="搜索歌曲、歌单"
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
  padding: 5px .65rem;
  outline: none;
  border: rgba(32, 53, 77, .08) solid 1px;
  background: rgba(255, 255, 255, .72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .85);
  transition: border-color .18s ease, box-shadow .18s ease, background-color .18s ease;

  &:focus-within {
    border-color: rgba(64, 158, 255, .5);
    background: rgba(255, 255, 255, .95);
    box-shadow: 0 0 0 .25rem rgba(64, 158, 255, .1);
  }
}

.search-icon {
  display: flex;
  flex: 0 0 2.25rem;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.search {
  width: 100%;
  outline: none;
  border: none;
  font-size: 1rem;
  color: var(--text-primary);
  background-color: inherit;

  &::placeholder {
    color: var(--text-secondary);
  }
}
</style>
