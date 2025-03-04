<template>
  <div style="display: flex; margin-left: 1rem">
    <a-dropdown v-if="account.avatar" :trigger="['click']">
      <img class="avatar" :src="account.avatar" alt="">
      <template #overlay>
        <a-menu @click="handleClick">
          <a-menu-item key="github">
            <a href="#">GitHub</a>
          </a-menu-item>
          <a-menu-item key="about">
            <a href="#">About Beethoven Music</a>
          </a-menu-item>
          <a-menu-item key="logout">Logout</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <svg-icon style="margin: auto" class="pointer" v-else name="account" size="2rem" color="grey" @click="goToAuth"/>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/global';
import { onMounted } from 'vue';
import { getAccountInfoByToken } from '@/api/account';
import { storeToRefs } from 'pinia';
import SvgIcon from '@/components/SvgIcon.vue';
import {handleOAuth2Login, logout} from '@/api/auth';
import { useRoute, useRouter } from 'vue-router';
import {deleteData, getData, setData} from '@/util/localStorage';
import { TOKEN } from '@/config';
import { initApp } from "@/lib/init";

let accountStore = useAccountStore();
let {account} = storeToRefs(accountStore);

const route = useRoute();
const router = useRouter();
onMounted(async () => {
  const token = getData(TOKEN);
  if (!token) {
    const code = route.query.code as string;
    if (code) {
      await handleOAuth2Login({ code, type: 'GITHUB' }).then(async response => {
        if (response.code === 200) {
          Object.assign(account.value, response.data);
          console.log(account.value.token);
          setData(TOKEN, account.value.token);
          await initApp();
          await router.push({path: '/'});
        }
      });
    }
  } else {
    if (!account.value.id) {
      getAccountInfoByToken().then(response => {
        Object.assign(account.value, response.data);
      });
    }
  }
});
const goToAuth = () => {
  router.push({ path: '/auth' });
}

const handleLogout = async () => {
  logout().then(() => {
    deleteData(TOKEN);
    router.push({path: '/'});
    window.location.reload();
  });
};

const handleClick = async (e: any) => {
  if (e.key === 'logout')
    await handleLogout();
};
</script>

<style lang="scss" scoped>
.avatar {
  width: var(--header-item-size);
  height: var(--header-item-size);
  border-radius: 50%;
  cursor: pointer;
}
</style>
