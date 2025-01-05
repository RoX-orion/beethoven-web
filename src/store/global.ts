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



export const useComponentStateStore = defineStore('componentState', () => {
	const componentState = reactive<ComponentState>({
		currentRightComponent: ComponentType.DEFAULT,
	});

	return {
		componentState,
	}
});

interface Account {
	userId?: number;
	username?: string;
	avatar?: string;
}

export const useAccountStore = defineStore('account', () => {
	const account: Account = reactive({
		userId: 1,
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
		media: {
			musicId: undefined,
			volume: 0,
			currentTime: 0,
		},
		player: {
			isMute: false,
			volume: 10,
			playMode: undefined,
			defaultSound: 10,
			defaultPlayMode: 'loop',
		},
		music: undefined,
		searchMusicKey: '',
		defaultMusicCover: undefined,
		defaultPlaylistCover: undefined,
	});

	return {
		global,
	}
});
