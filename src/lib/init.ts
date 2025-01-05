import { getSetting } from "@/api/setting";
import { getAppConfig } from '@/api/appConfig';
import { useGlobalStore } from '@/store/global';
import pinia from '@/store/store';
import type { PlayerSetting } from '@/types/global';
import { saveData } from '@/util/localStorage';
import { PLAYER_SETTING, SHARDING_SIZE } from '@/config';

const globalStore = useGlobalStore(pinia);
export async function initApp() {
	await Promise.all([initGlobal(), initAppConfig()]);
}

export async function initGlobal(setting?: PlayerSetting) {
	getSetting().then(response => {
		if (!setting) {
			saveData(PLAYER_SETTING, JSON.stringify({
				'isMute': false,
				'volume': 10,
				'playMode': 'random',
			}));
		} else {
			saveData(PLAYER_SETTING, JSON.stringify(setting));
		}
	});
}

async function initAppConfig() {
	getAppConfig().then(response => response.data)
		.then(data => {
			saveData(SHARDING_SIZE, data.shardingSize ? data.shardingSize : 1024 * 512);
			globalStore.global.defaultMusicCover = data.defaultMusicCover;
		});
}
