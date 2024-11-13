import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface PlayerSetting {
	isMute: boolean;
	volume: number;
	defaultSound: number;
	defaultPlayMode: 'loop' | 'random';
}

interface Setting {
	player: PlayerSetting
}

interface ComponentState {
	searchResult: boolean;
}

interface Account {
	userId?: number;
	username?: string;
	avatar?: string;
}

export const useSettingStore = defineStore('setting', () => {
	const setting = reactive<Setting>({
		player: {
			isMute: false,
			volume: 10,
			defaultSound: 10,
			defaultPlayMode: 'loop',
		}
	});

	function updatePlayer(playerSetting: PlayerSetting) {
		setting.player.isMute = playerSetting.isMute;
	}

	return {
		setting,
		updatePlayer
	}
});


export const useComponentStateStore = defineStore('componentState', () => {
	const componentState = reactive<ComponentState>({
		searchResult: false,
	});

	return {
		componentState,
	}
});


export const useAccountStore = defineStore('account', () => {
	const account = reactive<Account>({
		userId: 1,
	});

	return {
		account,
	}
});
