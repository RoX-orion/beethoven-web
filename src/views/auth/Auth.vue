<template>
  <div class="auth-wrapper">
    <div class="auth">
      <div class="login-wrapper flex-col">
        <img class="oauth-item pointer" src="/assets/img/GitHub.png" alt="" @click="handleAuth">
        <h2>Beethoven Music Web</h2>
        <p style="margin: 1rem 0" class="grey">目前只支持GitHub登录</p>
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
    max-width: max(30%, 30rem);
    height: 25rem;
    border-radius: 1rem;
    background-color: white !important;
    box-shadow: 0 .5rem 2rem 0 rgba(0, 0, 0, .15);

    .login-wrapper {
      margin: 4rem auto 0 auto;
      align-items: center;
      width: 80%;

      .oauth-item {
        width: 5rem;
        margin: 1rem;
      }
    }
  }
}
</style>
