<template>
  <header class="flex-row header-wrapper content-space-between">
    <IconButton class="menu" icon-name="menu" @click="openLeft"/>
    <div class="flex-row brand-wrapper pointer" @click="goToHome">
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
  </header>
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
watch(key, debounce(async (newValue, oldValue) => {
  if (newValue.trim().length > 0 && oldValue.trim() !== newValue.trim()) {
    await router.replace(`/music?search=${newValue}`);
    globalStore.global.searching = true;
    globalStore.global.searchKey = newValue;
  } else if (newValue.trim().length === 0) {
    await router.replace({ path: '/' });
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
  width: min(100%, 98rem);
  height: 4.5rem;
  margin: 0 auto;
  padding: .55rem .7rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-panel);
  background: var(--surface-color);
  box-shadow: var(--surface-shadow);
  backdrop-filter: blur(1.25rem);

  .brand-wrapper {
    align-items: center;
    min-width: 16rem;
  }

  .brand {
    width: var(--header-item-size);
    height: var(--header-item-size);
    margin: auto 0;
    border-radius: var(--radius-card);
    box-shadow: 0 .4rem 1rem rgba(47, 143, 118, .12);
  }

  .brand-text {
    color: var(--text-primary);
    font-size: 1.35rem;
    font-weight: 800;
    line-height: 2.17rem;
    margin: auto .85rem;
    width: 12.5rem;
    letter-spacing: 0;
  }

  .search-wrapper {
    margin: auto .5rem;
    width: var(--search-width);
  }

  .header-right {
    align-items: center;

    .button-group {
      margin: auto;
      gap: .35rem;

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.45rem;
        height: 2.45rem;
        border-radius: var(--radius-control);
        transition: background-color .18s ease, transform .18s ease;

        &:hover {
          background: var(--svg-button-shadow);
          transform: translateY(-1px);
        }
      }
    }
  }
}

@media (min-width: 801px) {
  .menu {
    display: none;
  }
}

@media (max-width: 800px) {
  .header-wrapper {
    height: auto;
    gap: .5rem;
    padding: .5rem;
    border-radius: var(--radius-panel);
  }

  .brand-wrapper {
    min-width: auto !important;
  }

  .brand-text {
    display: none;
  }

  .search-wrapper {
    flex: 1;
    min-width: 0;
  }

  .button-group {
    display: none;
  }
}
</style>
