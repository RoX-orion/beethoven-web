<template>
  <div class="flex-row">
    <img :src="data.img" alt="cover" width="80" height="80"/>
    <div class="context-wrapper">
      <span class="title-wrapper" v-cloak>{{data.title}}</span>
      <div class="summary-wrapper" v-cloak>{{data.summary}}</div>
      <div class="info">
        <span>{{formatTime(data.date, '{y}-{m}-{d}')}}</span>
<!--        <el-divider direction="vertical" />-->
        <span>{{data.type}}</span>
<!--        <el-divider direction="vertical" />-->
        <span>{{data.platform}}</span>
<!--        <el-divider direction="vertical" />-->
        <span>{{data.state}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from "@/util/time";
import type { BugItemType } from '@/types/global';

const props = defineProps<{
  data: BugItemType
}>();
</script>

<style scoped lang="scss">
.context-wrapper {
  overflow: hidden;
  position: relative;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-wrapper {
  padding-top: 5px;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  //-webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.info {
  font-size: 12px;
  color: gray;
}
</style>
