import { getAppSetting } from "@/api/setting";
import { getAppConfig } from '@/api/appConfig';
import { useSettingStore } from '@/store/global';
import pinia from '@/store/store';
import type { PlayerSetting } from '@/types/global';
import { saveData } from '@/util/localStorage';
import { PLAYER_SETTING, SHARDING_SIZE } from '@/config';

export async function initApp() {
	await getAppSetting().then(response => {
		const settingStore = useSettingStore(pinia);
		settingStore.updatePlayer(response.data);
	});
	await initPlayerSetting();
	await initAppGlobal();
}

export async function initPlayerSetting(setting?: PlayerSetting) {
	if (!setting) {
		saveData(PLAYER_SETTING, JSON.stringify({
			'isMute': false,
			'volume': 10,
			'playMode': 'random',
		}));
	} else {
		saveData(PLAYER_SETTING, JSON.stringify(setting));
	}
}

async function initAppGlobal() {
	getAppConfig().then(response => response.data)
		.then(data => {
			saveData(SHARDING_SIZE, data.shardingSize ? data.shardingSize : 1024 * 512);
			const settingStore = useSettingStore(pinia);
			settingStore.setting.defaultMusicCover = data.defaultMusicCover;
		});
}
