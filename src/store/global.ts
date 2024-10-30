import { defineStore } from 'pinia';
import { reactive } from 'vue';

interface PlayerSetting {
	isMute: boolean;
	defaultSound: number;
	defaultPlayMode: 'loop' | 'random';
}

interface Setting {
	player: PlayerSetting
}

export const useSettingStore = defineStore('setting', () => {
	const setting = reactive<Setting>({
		player: {
			isMute: false,
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

interface ComponentState {
	searchResult: boolean;
}

export const useComponentStateStore = defineStore('componentState', () => {
	const componentState = reactive<ComponentState>({
		searchResult: false,
	});

	return {
		componentState,
	}
});
