import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { ComponentType } from '@/types/global';

interface PlayerSetting {
	isMute: boolean;
	volume: number;
	defaultSound: number;
	defaultPlayMode: 'loop' | 'random';
	defaultMusicCover?: string
}

interface Setting {
	player: PlayerSetting;
	defaultMusicCover: string | undefined;
	defaultPlaylistCover: string | undefined;
}

interface ComponentState {
	currentRightComponent: ComponentType;
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
		},
		defaultMusicCover: undefined,
		defaultPlaylistCover: undefined,
	});

	function updatePlayer(playerSetting: PlayerSetting) {
		setting.player.isMute = playerSetting.isMute;
		setting.player.defaultMusicCover = playerSetting.defaultMusicCover;
	}

	return {
		setting,
		updatePlayer
	}
});


export const useComponentStateStore = defineStore('componentState', () => {
	const componentState = reactive<ComponentState>({
		currentRightComponent: ComponentType.DEFAULT,
	});

	return {
		componentState,
	}
});


export const useAccountStore = defineStore('account', () => {
	const account = reactive<Account>({
		userId: undefined,
	});

	return {
		account,
	}
});

export const useRouteStore = defineStore('route', () => {
	let type = ref<string | undefined>();
	let id = ref<string | undefined>();

	return {
		type,
		id,
	}
});

export const useGlobalStore = defineStore('global', () => {
	const global = reactive<any>({
		searchMusicKey: '',
	});

	return {
		global,
	}
});
