<template>
  <TagGroup/>
  <Pinned v-if="pinnedList.length > 0"/>
  <div class="playlist-group-wrapper" v-for="data in groupPlayList">
    <span class="playlist-group-title">{{data.groupTitle}}</span>
    <div class="flex-row playlist-info-wrapper">
      <PlayListCard class="playlist-card" v-for="playList in data.playlist" :playList="playList"
                    @click="gotoPlayListInfo(playList.id)"></PlayListCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import PlayListCard from '@/views/middle/PlayListCard.vue';
import type { PlayList } from '@/types/global';
import TagGroup from '@/views/middle/TagGroup.vue';
import { getHomePlaylist } from '@/api/playlist';
import router from '@/router';
import Pinned from "@/views/middle/Pinned.vue";

interface GroupPlayListArray {
  groupTitle: string,
  playlist: Array<PlayList>
}

const groupPlayList: GroupPlayListArray[] = reactive([]);
const pinnedList = ref<any[]>([]);
onMounted(() => {
  const params = {
    page: 1,
    size: 15,
    key: '',
  }
  getHomePlaylist(params).then(response => {
    groupPlayList[0] = { playlist: response.data, groupTitle: '热门歌单' };
  });
});

const gotoPlayListInfo = (playlistId: string) => {
  router.push({ path: `/playlist/${playlistId}` });
}
</script>

<style scoped lang="scss">
.playlist-group-wrapper {
  padding: var(--base-padding);

  .playlist-group-title {
    font-size: 1.375rem;
    padding: .5rem 0;
    display: inline-block;
    text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.25);
  }

  .playlist-info-wrapper {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;

    .playlist-card {
      flex: 1 1 30%;
      cursor: pointer;
      margin: .5rem 0;
    }
  }
}
</style>
