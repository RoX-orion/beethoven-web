import { getAppSetting } from "@/api/setting";
import { useSettingStore } from '@/store/global';
import pinia from '@/store/store';
import type { PlayerSetting } from '@/types/global';
import { saveData } from '@/util/localStorage';
import { PLAYER_SETTING } from '@/config';

export async function initApp() {
	await getAppSetting().then(response => {
		const settingStore = useSettingStore(pinia);
		settingStore.updatePlayer(response.data);
	});
	await initPlayerSetting();
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
