<template>
  <div class="flex-row header-wrapper">
    <img class="brand" src="../../assets/brand.png" alt="">
    <span class="brand-text">Beethoven Music</span>
    <Search class="search-wrapper" v-model:searching="searching" v-model="key"/>
    <div class="flex-row header-right">
      <div class="button-group flex-row">
        <router-link to="/">
          <svg-icon class="button pointer" name="message" size="1.5rem" color="rgba(0, 0, 0, .5)"/>
        </router-link>
        <router-link to="/bug-report">
          <svg-icon class="button pointer" name="bug" size="1.5rem"/>
        </router-link>
      </div>
      <Account/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from "@/components/Search.vue";
import Account from './Account.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { ref, watch } from 'vue';
import { searchMusic } from '@/api/music';
import { SearchMusicParam } from '@/api/params/query';
import eventBus from '@/util/eventBus';
import { useComponentStateStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import { pause } from '@/util/schedulers';

const key = ref('');
const searching = ref(false);

const componentStateStore = useComponentStateStore();
const { componentState } = storeToRefs(componentStateStore);

watch(key,  async (newValue, oldValue) => {
  if (newValue.trim().length > 0 && oldValue.trim() !== newValue.trim()) {
    searching.value = true;
    let param = new SearchMusicParam(1, 10, newValue);
    await searchMusic(param).then(async response => {
      componentState.value.searchResult = true;
      await pause(50);
      eventBus.emit('getSearchMusicResult', response.data);
    }).finally(() => {
      searching.value = false;
    });
  } else if (newValue.trim().length === 0) {
    componentState.value.searchResult = false;
  }
});
</script>

<style lang="scss" scoped>
.header-wrapper {
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

  .search-wrapper {
    margin: auto;
    width: var(--search-width);
  }

  .header-right {
    justify-items: center;

    .button-group {
      margin: auto;
      padding: 0 1rem;

      .button {
        display: inline-block;
        margin: 0 .5rem;
      }
    }
  }
}
</style>
