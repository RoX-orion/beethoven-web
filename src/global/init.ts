import { getAppSetting } from "@/api/setting";
import { useSettingStore } from '@/store/global';
import pinia from '@/store/store';

export async function initApp() {
	getAppSetting().then(response => {
		const settingStore = useSettingStore(pinia);
		settingStore.updatePlayer(response.data);
	});
}
