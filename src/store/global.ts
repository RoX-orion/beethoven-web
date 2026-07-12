import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { ComponentType, MusicItemType } from '@/types/global';
import { getData, setData } from "@/util/localStorage";

const DARK_MODE_KEY = 'beethoven-dark-mode';

function loadDarkMode(): boolean {
	const stored = getData(DARK_MODE_KEY);
	if (stored !== null && stored !== undefined) return stored === 'true';
	return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyDarkClass(dark: boolean) {
	if (dark) document.documentElement.classList.add('dark');
	else document.documentElement.classList.remove('dark');
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#080d16' : '#f7fbff');
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
	id?: string;
	username?: string;
	avatar?: string;
	token?: string;
}

export const useAccountStore = defineStore('account', () => {
	const account: Account = reactive({});

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
	interface GlobalMedia {
		musicId?: string;
		volume: number;
		currentTime: number;
	}
	interface GlobalPlayer {
		isMute: boolean;
		volume: number;
		playMode?: string;
		defaultSound: number;
		defaultPlayMode: string;
	}
	interface GlobalState {
		media: GlobalMedia;
		player: GlobalPlayer;
		music?: MusicItemType;
		searchKey: string;
		searching: boolean;
		defaultMusicCover?: string;
		defaultPlaylistCover?: string;
		windowWidth: number;
		videoId?: string;
		mobile: boolean;
		canPlay: boolean;
		showQueue: boolean;
		darkMode: boolean;
	}

	const savedDark = loadDarkMode();
	applyDarkClass(savedDark);
	const global = reactive<GlobalState>({
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
		searchKey: '',
		searching: false,
		defaultMusicCover: undefined,
		defaultPlaylistCover: undefined,
		windowWidth: window.innerWidth,
		videoId: undefined,
		mobile: false,
		canPlay: false,
		showQueue: true,
		darkMode: savedDark,
	});

	return {
		global,
		toggleDarkMode() {
			global.darkMode = !global.darkMode;
			applyDarkClass(global.darkMode);
			setData(DARK_MODE_KEY, String(global.darkMode));
		},
	}
});


export const useMusicStore = defineStore('music', () => {
	const music = reactive({
		video: undefined,
	});

	return { music }
});

export function setMusicInfo(music: MusicItemType) {
	setData('music', JSON.stringify(music));
}

export function getMusicInfoFromLocal(): MusicItemType | undefined {
	const raw = getData('music');
	if (!raw) return undefined;
	return JSON.parse(raw);
}

