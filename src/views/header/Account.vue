<template>
  <div style="display: flex; margin-left: 1rem">
    <img class="avatar" v-if="account.avatar" :src="account.avatar" @click="changeTheme" alt="">
    <svg-icon style="margin: auto" class="pointer" v-else name="account" size="2rem" color="grey" @click="handleAuth"/>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/global';
import { onMounted } from 'vue';
import { getAccountInfoByToken } from '@/api/account';
import { storeToRefs } from 'pinia';
import SvgIcon from '@/components/SvgIcon.vue';
import { getOAuth2Info, handleOAuth2Login } from '@/api/auth';
import { useRoute } from 'vue-router';
import { getData, setData } from '@/util/localStorage';
import { TOKEN } from '@/config';

const changeTheme = () => {
  document.body.style.background = 'linear-gradient(0deg, rgba(243, 231, 233, 1) 0%, rgba(227, 238, 255, 1) 99%, rgba(227, 238, 255, 1) 100%)';
}

let accountStore = useAccountStore();
let {account} = storeToRefs(accountStore);

const route = useRoute();
onMounted(async () => {
  const token = getData(TOKEN);
  if (!token) {
    const code = route.query.code as string;
    if (code) {
      await handleOAuth2Login({ code, type: 'GITHUB' }).then(response => {
        Object.assign(account.value, response.data);
        setData(TOKEN, account.value.token);
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
const handleAuth = () => {
  getOAuth2Info('GITHUB').then(response => {
    const { data } = response;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&state=${data.state}`;
  });
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
