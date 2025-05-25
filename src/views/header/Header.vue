<template>
  <div class="flex-row header-wrapper content-space-between">
    <IconButton class="menu" icon-name="menu" @click="openLeft"/>
    <div class="flex-row pointer" style="justify-items: center" @click="goToHome">
      <img class="brand" src="/assets/brand.png" alt="">
      <span class="brand-text">Beethoven Music</span>
    </div>
    <Search class="search-wrapper" v-model:searching="globalStore.global.searching" v-model="key"/>
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
import mitt from '@/util/eventBus';
import { useGlobalStore } from '@/store/global';
import { debounce } from '@/util/schedulers';
import router from '@/router';
import IconButton from '@/components/IconButton.vue';

const key = ref('');

const globalStore = useGlobalStore();
const goToHome = () => {
  router.push('/');
}
watch(key, debounce((newValue, oldValue) => {
  if (newValue.trim().length > 0 && oldValue.trim() !== newValue.trim()) {
    router.replace(`/music?search=${newValue}`);
    globalStore.global.searching = true;
    globalStore.global.searchKey = newValue;
  } else if (newValue.trim().length === 0) {
    router.replace({ path: '/' });
    globalStore.global.searching = false;
    globalStore.global.searchKey = '';
  }
}, 300, false));

const openLeft = () => {
  mitt.emit('showDrawer');
}
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

@media (min-width: 801px) {
  .menu {
    display: none;
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
