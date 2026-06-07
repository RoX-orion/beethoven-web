<template>
  <!--  <video controls src="https://minio.kxcpp.top/api/v1/download-shared-object/aHR0cHM6Ly9vc3Mua3hjcHAudG9wL2JlZXRob3Zlbi9WSURfMjAyNDA1MjlfMTAzNzM0Lm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUdISzlPUlJPUTZaSUFIUzJGSDNRJTJGMjAyNTAzMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMzI0VDEzMDc1M1omWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSkhTRXM1VDFKU1QxRTJXa2xCU0ZNeVJrZ3pVU0lzSW1WNGNDSTZNVGMwTWpnMk5EZ3dNaXdpY0dGeVpXNTBJam9pWVc1a2NtVWlmUS5YUUpxTVdlR3pKZEFjSXdTd0wya0JObWJiaUZ3dmlKZHNHN0RXRVMwdS1VMGUxaC1LWU8tdjhTWjhRTXR1NzZxclpZd2YxcHVpSUtYbnRrbHQ3WWFYZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTFlMTRkYTVmZGQyMmYzZTRjODEzMjJkMTM0MzAwYjY1ZWJhY2E1ZWZkN2JlZmZmNzJhMGI3NzQ0YTQzZDk5YTI"></video>-->
  <div id="player"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';

const player = ref();

onMounted(() => {
  player.value = new Player({
    id: "player",
    // autoplay: true,
    url: "https://minio.kxcpp.top/api/v1/download-shared-object/aHR0cHM6Ly9vc3Mua3hjcHAudG9wL2JlZXRob3Zlbi9WSURfMjAyNDA1MjlfMTAzNzM0Lm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUdISzlPUlJPUTZaSUFIUzJGSDNRJTJGMjAyNTAzMjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMzI0VDEzMDc1M1omWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSkhTRXM1VDFKU1QxRTJXa2xCU0ZNeVJrZ3pVU0lzSW1WNGNDSTZNVGMwTWpnMk5EZ3dNaXdpY0dGeVpXNTBJam9pWVc1a2NtVWlmUS5YUUpxTVdlR3pKZEFjSXdTd0wya0JObWJiaUZ3dmlKZHNHN0RXRVMwdS1VMGUxaC1LWU8tdjhTWjhRTXR1NzZxclpZd2YxcHVpSUtYbnRrbHQ3WWFYZyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTFlMTRkYTVmZGQyMmYzZTRjODEzMjJkMTM0MzAwYjY1ZWJhY2E1ZWZkN2JlZmZmNzJhMGI3NzQ0YTQzZDk5YTI",
    playsinline: true,
    poster: "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg",
    plugins: [],
    fluid: true,
  });
});
</script>

<style scoped lang="scss">
//.player {
//  width: 50rem;
//  height: auto;
//}
</style>
