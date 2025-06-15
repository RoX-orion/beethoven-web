import { getSetting } from "@/api/setting";
import { getAppConfig } from '@/api/appConfig';
import { useGlobalStore } from '@/store/global';
import pinia from '@/store/store';
import { setData } from '@/util/localStorage';
import { PLAYER_SETTING, SHARDING_SIZE } from '@/config';
import { Connection } from '@/lib/network/Connection';
import Logger from '@/lib/Logger';

const globalStore = useGlobalStore(pinia);
const log = new Logger();
export async function initApp() {
	await Promise.all([initAppConfig(), initWebsocket()]);
}

export async function initGlobal() {
	getSetting().then(response => {
		if (response.data) {
			setData(PLAYER_SETTING, JSON.stringify(response.data));
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

async function initWebsocket() {
	const url = new URL(import.meta.env.VITE_WS_API);
	const connection = new Connection(url.hostname, Number(url.port), log);
	await connection.connect();
}
