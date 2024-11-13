<template>
  <div>
    <img class="avatar" :src="account.avatar" alt="avatar" @click="changeTheme">
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/store/global';
import { onMounted } from 'vue';
import { getAccountInfo } from '@/api/account';
import { storeToRefs } from 'pinia';

const changeTheme = () => {
  document.body.style.background = 'linear-gradient(0deg, rgba(243, 231, 233, 1) 0%, rgba(227, 238, 255, 1) 99%, rgba(227, 238, 255, 1) 100%)';
}

let accountStore = useAccountStore();
let {account} = storeToRefs(accountStore);
const userId = accountStore.account.userId;
onMounted(() => {
  getAccountInfo(userId).then(response => {
    Object.assign(account.value, response.data);
  });
});
</script>

<style lang="scss" scoped>
.avatar {
  width: var(--header-item-size);
  height: var(--header-item-size);
  border-radius: 50%;
  cursor: pointer;
}
</style>
