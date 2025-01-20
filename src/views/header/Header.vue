<template>
  <div class="flex-row header-wrapper content-space-between">
    <div class="flex-row pointer" style="justify-items: center" @click="goToHome">
      <img class="brand" src="/assets/brand.png" alt="">
      <span class="brand-text">Beethoven Music</span>
    </div>
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
import eventBus from '@/util/eventBus';
import { useGlobalStore } from '@/store/global';
import { debounce, pause } from '@/util/schedulers';
import { ComponentType } from '@/types/global';
import { componentState } from '@/store/componentState';
import router from '@/router';

const key = ref('');
const searching = ref(false);

const globalStore = useGlobalStore();
const goToHome = () => {
  router.push('/');
}
watch(key, debounce(async (newValue, oldValue) => {
  if (newValue.trim().length > 0 && oldValue.trim() !== newValue.trim()) {
    await router.replace(`/music/${newValue}`);
    globalStore.global.searchMusicKey = newValue;

    searching.value = true;
    await searchMusic({ page: 1, size: 10, key: newValue }).then(async response => {
      componentState.currentRightComponent = ComponentType.SEARCH_RESULT;
      await pause(50);
      eventBus.emit('getSearchMusicResult', response.data);
    }).finally(() => {
      searching.value = false;
    });
  } else if (newValue.trim().length === 0) {
    // await router.replace({ path: '/' });
    // componentState.value.currentRightComponent = ComponentType.DEFAULT;
  }
}, 300, false));
</script>

<style lang="scss" scoped>
.header-wrapper {
  padding: 10px;
  width: 100vw;

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
    margin: auto 1rem;
    width: 12.5rem;
  }

  .search-wrapper {
    margin: auto .5rem;
    width: var(--search-width);
  }

  .header-right {
    justify-items: center;

    .button-group {
      margin: auto;
      gap: 1rem;
    }
  }
}

@media (max-width: 800px) {
  .brand-text {
    display: none;
  }

  .button-group {
    display: none;
  }
}
</style>
