<template>
  <div style="display: flex; margin-left: 1rem">
    <img class="avatar" v-if="account.avatar" :src="account.avatar" alt="">
    <svg-icon style="margin: auto" class="pointer" v-else name="account" size="2rem" color="grey" @click="goToAuth"/>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/global';
import { onMounted } from 'vue';
import { getAccountInfoByToken } from '@/api/account';
import { storeToRefs } from 'pinia';
import SvgIcon from '@/components/SvgIcon.vue';
import { handleOAuth2Login } from '@/api/auth';
import { useRoute, useRouter } from 'vue-router';
import { getData, setData } from '@/util/localStorage';
import { TOKEN } from '@/config';

let accountStore = useAccountStore();
let {account} = storeToRefs(accountStore);

const route = useRoute();
const router = useRouter();
onMounted(async () => {
  const token = getData(TOKEN);
  if (!token) {
    const code = route.query.code as string;
    if (code) {
      await handleOAuth2Login({ code, type: 'GITHUB' }).then(response => {
        Object.assign(account.value, response.data);
        setData(TOKEN, account.value.token);
        router.push({ path: '/' });
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
</script>

<style lang="scss" scoped>
.avatar {
  width: var(--header-item-size);
  height: var(--header-item-size);
  border-radius: 50%;
  cursor: pointer;
}
</style>
