import { getSetting } from "@/api/setting";
import { getAppConfig } from '@/api/appConfig';
import { useGlobalStore } from '@/store/global';
import pinia from '@/store/store';
import { setData } from '@/util/localStorage';
import { PLAYER_SETTING, SHARDING_SIZE } from '@/config';

const globalStore = useGlobalStore(pinia);
export async function initApp() {
	await Promise.all([initAppConfig()]);
}

export async function initGlobal() {
	getSetting().then(response => {
		if (response.data) {
			setData(PLAYER_SETTING, response.data);
			globalStore.global.player = response.data;
		}
	});
}

async function initAppConfig() {
	getAppConfig().then(response => response.data)
		.then(data => {
			setData(SHARDING_SIZE, data.shardingSize ? data.shardingSize : 1024 * 512);
			globalStore.global.defaultMusicCover = data.defaultMusicCover;
		});
}
