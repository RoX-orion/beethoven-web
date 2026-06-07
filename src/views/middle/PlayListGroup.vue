<template>
  <Tag/>
  <Pinned v-if="pinnedList.length > 0"/>
  <div class="playlist-group-wrapper" v-for="data in groupPlayList" :key="data.groupTitle">
    <div class="section-heading">
      <div>
        <p>Discover</p>
        <h2>{{ data.groupTitle }}</h2>
      </div>
    </div>
    <div class="flex-row playlist-info-wrapper">
      <PlayListCard class="playlist-card" v-for="playList in data.playlist" :playList="playList"
                    :key="playList.id" @click="gotoPlayListInfo(playList.id)"></PlayListCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import PlayListCard from '@/views/middle/PlayListCard.vue';
import type { PlayList } from '@/types/global';
import { getHomePlaylist } from '@/api/playlist';
import router from '@/router';
import Pinned from "@/views/middle/Pinned.vue";
import Tag from "@/views/middle/Tag.vue";

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
  padding: 1.35rem;

  .section-heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;

    p {
      color: var(--brand-primary);
      font-size: .78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    h2 {
      color: var(--text-primary);
      font-size: 1.65rem;
      font-weight: 900;
      line-height: 1.2;
    }

    span {
      color: var(--text-secondary);
      font-size: .9rem;
    }
  }

  .playlist-info-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
    flex-wrap: wrap;
    gap: 1.15rem;

    .playlist-card {
      cursor: pointer;
    }
  }
}

@media (max-width: 800px) {
  .playlist-group-wrapper {
    padding: 1rem;

    .section-heading {
      display: block;

      span {
        display: block;
        margin-top: .35rem;
      }
    }

    .playlist-info-wrapper {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: .85rem;
    }
  }
}
</style>
