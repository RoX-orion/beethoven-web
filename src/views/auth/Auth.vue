<template>
  <div class="auth-wrapper">
    <div class="auth flex-col">
      <div class="login-wrapper">
        Beethoven Music Web
        <img class="oauth-item pointer" src="/assets/img/GitHub.png" alt="" @click="handleAuth">
        <p class=" grey">目前只支持GitHub登录</p>
        <Button style="" @click="handleAuth">登录</Button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue';
import { getOAuth2Info } from '@/api/auth';

const handleAuth = () => {
  getOAuth2Info('GITHUB').then(response => {
    const { data } = response;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectUri}&state=${data.state}`;
  });
}
</script>

<style scoped lang="scss">
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  height: 100dvh;

  .auth {
    width: 100%;
    max-width: max(30%, 25rem);
    height: 30rem;
    border-radius: 1rem;
    background-color: white !important;
    box-shadow: 0 .5rem 2rem 0 rgba(0, 0, 0, .15);

    .login-wrapper {
      margin: auto;

      .oauth-item {
        width: 4rem;
        margin: auto auto 1rem auto;
      }
    }
  }
}
</style>
