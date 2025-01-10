<template>
  <div class="container">
    <div class="search-wrapper">
      <input class="input" placeholder="搜索" @click="searchIssue"/>
    </div>

    <div class="filter-wrapper flex-row">
      <div class="btn-search">
        <span>所有</span>
        <span>Bug</span>
        <span>建议</span>
      </div>
      <div class="btn-sort">
        <span>热度</span>
        <span>时间</span>
      </div>
    </div>

    <div class="bug-wrapper">
      <div
        class="bug"
        v-for="bug in list"
        :key="bug.date">
        <BugItem
            :data="bug"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import BugItem from "./BugItem.vue";
import type { BugItemType } from '@/types/global';

const list = reactive<Array<BugItemType>>([
  {
    img: '/assets/img/bug.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Android',
    type: 'Bug',
    state: 'Open'
  },
  {
    img: '/assets/img/tip.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Web',
    type: 'Tip',
    state: 'Open'
  },
  {
    img: '/assets/img/bug.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Android',
    type: 'Bug',
    state: 'Open'
  },
  {
    img: '/assets/img/tip.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Web',
    type: 'Tip',
    state: 'Open'
  },
  {
    img: '/assets/img/bug.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Android',
    type: 'Bug',
    state: 'Open'
  },
  {
    img: '/assets/img/bug.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Android',
    type: 'Bug',
    state: 'Open'
  },
  {
    img: '/assets/img/bug.png',
    title: '获取消息列表错误',
    summary: '对爱情的渴望，对知识的追求，对人类苦难不可遏制的同情，这三种纯洁但无比强烈的感情支配着我的一生。这三种感情就像飓风一样，在深深的苦海上，肆意地把我吹来吹去，吹到濒临绝望的边缘。',
    date: new Date(),
    platform: 'Android',
    type: 'Bug',
    state: 'Open'
  },
])
const searchIssue = () => {

}

const getIssueList = () => {
  return list;
}

(() => {
  getIssueList();
})();
</script>

<style scoped>
.container {
  padding: 15px;
}

.search-wrapper {
  max-width: 550px;
  height: 45px;
  margin: 20px auto;
}

.input {
  height: 100%;
  width: 100%;
  outline: none;
  border: rgba(0, 0, 0, .1) solid .12rem;
  border-radius: 6px;
  padding: 0 10px;
}

.input:focus {
  border: #409eff solid .12rem;
  border-radius: 4px;
}

.filter-wrapper {
  margin: 0 auto;
  max-width: 550px;
  justify-content: space-between;
}

.filter-wrapper span {
  font-size: 13px;
}

.btn-search span {
  padding-right: 30px;
}

.btn-sort span {
  padding-left: 30px;
}

.bug-wrapper {
  max-width: 570px;
  margin: 0 auto;
}

.bug {
  width: 100%;
  cursor: pointer;
  margin: 10px 0;
  padding: 15px;
}

.bug:hover {
  background-color: rgba(0, 0, 0, .04);
  border-radius: 7px;
}
</style>
