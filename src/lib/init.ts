import { getSetting } from "@/api/setting";
import { getAppConfig } from '@/api/appConfig';
import { useGlobalStore } from '@/store/global';
import pinia from '@/store/store';
import type { PlayerSetting } from '@/types/global';
import { setData } from '@/util/localStorage';
import { PLAYER_SETTING, SHARDING_SIZE } from '@/config';

const globalStore = useGlobalStore(pinia);
export async function initApp() {
	await Promise.all([initGlobal(), initAppConfig()]);
}

export async function initGlobal(setting?: PlayerSetting) {
	getSetting().then(() => {
		if (!setting) {
			setData(PLAYER_SETTING, JSON.stringify({
				'isMute': false,
				'volume': 10,
				'playMode': 'random',
			}));
		} else {
			setData(PLAYER_SETTING, JSON.stringify(setting));
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
