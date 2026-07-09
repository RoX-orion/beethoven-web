import { computed, reactive, ref, shallowRef, watch } from 'vue';
import type { MusicItemType, ProgressType, SettingType } from '@/types/global';
import { getMusicInfoFromLocal, setMusicInfo, useGlobalStore } from '@/store/global';
import { PLAYER_SETTING, TOKEN, VOLUME_MUSIC } from '@/config';
import { getData, setData } from '@/util/localStorage';
import { throttle } from '@/util/schedulers';
import { getSetting, updateSetting } from '@/api/setting';
import Player, { Events } from 'xgplayer';
import { getMusicInfo } from '@/api/music';
import { useRoute } from 'vue-router';
import { usePlayQueueStore } from '@/store/playQueue';

const playerInstance = shallowRef<any>(null);
let initPromise: Promise<void> | null = null;
let seeking = false;
let watchersInitialized = false;

const paused = ref(true);
const loading = ref(false);
const currentTime = ref(0);
const volume = ref(50);
const music: MusicItemType = reactive({
	link: '',
	duration: 0,
	mime: '',
});

const progressData: ProgressType = reactive({
	width: '100%',
	height: '5px',
	radius: '0.156rem',
	percentage: 0,
});

const setting = ref<SettingType>({
	userId: '',
	musicId: '',
	currentTime: 0,
	isMute: false,
	volume: 0,
	playMode: 'random',
});

export function useAudioPlayer() {
	const globalStore = useGlobalStore();
	const playQueueStore = usePlayQueueStore();
	const route = useRoute();

	const cover = computed(() => {
		return music?.cover ? music.cover : globalStore.global.defaultMusicCover;
	});

	const getMediaElement = (): HTMLMediaElement | undefined => {
		return playerInstance.value?.media ?? playerInstance.value?.video;
	};

	const setMetadataPreload = () => {
		const media = getMediaElement();
		if (media) {
			media.preload = 'metadata';
		}
	};

	const updateSettingFun = async () => {
		if (getData(TOKEN)) {
			try {
				await updateSetting(setting.value);
			} catch { /* non-critical */
			}
		}
	};

	const updateCurrentTime = throttle((time: number) => {
		globalStore.global.media.currentTime = time;
		playQueueStore.updateCurrentTime(time);
	}, 15 * 1000, false);

	const onTimeUpdate = async () => {
		if (!playerInstance.value || !music.duration) return;
		if (!seeking) {
			currentTime.value = playerInstance.value!.currentTime;
			progressData.percentage = Math.min(currentTime.value / music.duration * 100, 100);
		}
		updateCurrentTime(playerInstance.value!.currentTime);
	};

	const seekToTime = async (targetTime: number) => {
		if (!Number.isFinite(targetTime)) return;
		currentTime.value = Math.min(Math.max(targetTime, 0), music.duration);
		progressData.percentage = music.duration ? currentTime.value / music.duration * 100 : 0;
		await handleEvent('changeCurrentTime', progressData.percentage);
	};

	const handleEvent = async (eventName: string, state: any) => {
		if (!playerInstance.value) return;
		setting.value.currentTime = Math.floor(currentTime.value);
		if (eventName === 'play') {
			paused.value = false;
			playerInstance.value!.currentTime = currentTime.value;
			loading.value = true;
			try {
				await playerInstance.value!.play();
				loading.value = false;
				await updateSettingFun();
			} catch {
				paused.value = true;
				loading.value = false;
			}
		} else if (eventName === 'pause') {
			paused.value = true;
			playerInstance.value!.pause();
			await updateSettingFun();
		} else if (eventName === 'changeVolume') {
			playerInstance.value!.volume = state;
			globalStore.global.player.volume = Math.floor(state * 100);
		} else if (eventName === 'changeCurrentTime') {
			loading.value = !paused.value;
			progressData.percentage = Number(state);
			playerInstance.value!.currentTime = currentTime.value;
			await updateSettingFun();
		} else if (eventName === 'updateTime') {
			currentTime.value = state / 100 * music.duration;
		}
	};

	const playOrPause = () => {
		if (!playerInstance.value || !music.id || loading.value) return;
		updateCurrentTime(playerInstance.value!.currentTime);
		if (paused.value) {
			handleEvent('play', undefined);
		} else {
			handleEvent('pause', undefined);
		}
	};

	const setMusic = async (musicInfo: MusicItemType) => {
		if (!playerInstance.value || !musicInfo || (music && musicInfo.id === music.id)) return;
		const nextCurrentTime = setting.value.musicId === musicInfo.id
			? Math.min(currentTime.value, musicInfo.duration)
			: 0;
		Object.assign(music, musicInfo);
		loading.value = true;
		currentTime.value = nextCurrentTime;
		progressData.percentage = music.duration ? currentTime.value / music.duration * 100 : 0;
		playerInstance.value!.src = music.link;
		setMetadataPreload();
		playerInstance.value!.currentTime = currentTime.value;
		setting.value.musicId = musicInfo.id;
		await updateSettingFun();
	};

	const playQueueItem = async () => {
		const item = playQueueStore.currentItem;
		if (!item?.music) return;
		setMusicInfo(item.music);
		globalStore.global.media.musicId = item.musicId;
		await setMusic(item.music);
		if (globalStore.global.canPlay) {
			currentTime.value = 0;
			await handleEvent('play', null);
		}
	};

	const changeCurrentTime = async (e: any) => {
		seeking = false;
		const percentage = Number(e);
		if (!Number.isFinite(percentage) || !music.duration) return;
		await seekToTime(Math.min(Math.max(percentage, 0), 100) / 100 * music.duration);
	};

	const updateTime = (e: any) => {
		seeking = true;
		handleEvent('updateTime', e);
	};

	const changeMute = () => {
		if (volume.value === 0) {
			volume.value = globalStore.global.player.volume;
		} else {
			globalStore.global.player.volume = volume.value;
			volume.value = 0;
		}
	};


	if (!watchersInitialized) {
		watchersInitialized = true;

		watch(volume, (newVolume) => {
			setData(VOLUME_MUSIC, String(newVolume));
			handleEvent('changeVolume', newVolume / 100);
		});

		watch(() => globalStore.global.media.musicId, async (musicId) => {
			try {
				const localMusic = getMusicInfoFromLocal();
				if ((!localMusic || localMusic.id !== musicId) && musicId) {
					await getMusicInfo(musicId as string).then(async (response) => {
						if (response.data) {
							await setMusic(response.data);
						}
					});
				} else if (localMusic) {
					await setMusic(localMusic);
				}
				if (globalStore.global.canPlay) {
					currentTime.value = 0;
					await handleEvent('play', null);
				}
			} catch { /* music load failure is non-critical */
			}
		});

		watch(() => playQueueStore.queue.currentMusicId, async () => {
			try {
				await playQueueItem();
			} catch { /* queue item load failure is non-critical */
			}
		});
	}

	const playNext = async () => {
		const beforeIndex = playQueueStore.queue.currentIndex;
		const beforeMusicId = playQueueStore.queue.currentMusicId;
		const moved = playQueueStore.next();
		if (!moved) {
			paused.value = true;
			globalStore.global.canPlay = false;
			return;
		}
		globalStore.global.canPlay = true;
		if (beforeIndex === playQueueStore.queue.currentIndex && beforeMusicId === playQueueStore.queue.currentMusicId) {
			currentTime.value = 0;
			progressData.percentage = 0;
			await handleEvent('play', null);
		}
	};

	const playPrev = async () => {
		const beforeIndex = playQueueStore.queue.currentIndex;
		const beforeMusicId = playQueueStore.queue.currentMusicId;
		const moved = playQueueStore.prev();
		if (!moved) return;
		globalStore.global.canPlay = true;
		if (beforeIndex === playQueueStore.queue.currentIndex && beforeMusicId === playQueueStore.queue.currentMusicId) {
			currentTime.value = 0;
			progressData.percentage = 0;
			await handleEvent('play', null);
		}
	};

	const playModeTitle = computed(() => {
		const titleMap = {
			LOOP: '列表循环',
			SEQUENCE: '顺序播放',
			RANDOM: '随机播放',
			SINGLE_LOOP: '单曲循环',
		};
		return titleMap[playQueueStore.queue.playMode];
	});

	const handleSeek = async (forward: number) => {
		let targetTime = forward === -1 ? currentTime.value - 15 : currentTime.value + 15;
		if (forward === -1) {
			targetTime = targetTime < 0 ? 0 : targetTime;
		} else {
			targetTime = targetTime > music.duration ? music.duration : targetTime;
		}
		await seekToTime(targetTime);
		await onTimeUpdate();
	};

	const handleKeyEvent = (e: KeyboardEvent) => {
		switch (e.key) {
			case ' ':
			case 'Enter':
				e.preventDefault();
				playOrPause();
				break;
			case 'Left':
			case 'ArrowLeft':
				handleSeek(-1);
				break;
			case 'Right':
			case 'ArrowRight':
				handleSeek(1);
				break;
		}
	};

	const init = async (): Promise<void> => {
		if (initPromise) return initPromise;

		initPromise = (async () => {
			playerInstance.value = new Player({
				id: 'audioPlayer',
				mediaType: 'audio',
				url: '',
				videoAttributes: { preload: 'metadata' },
				height: '100%',
				width: '100%',
				volume: 0.5,
			});
			setMetadataPreload();

			playerInstance.value.on(Events.TIME_UPDATE, onTimeUpdate);
			playerInstance.value.on(Events.PLAY, () => paused.value = false);
			playerInstance.value.on(Events.PAUSE, () => paused.value = true);
			playerInstance.value.on(Events.LOAD_START, () => loading.value = true);
			playerInstance.value.on(Events.WAITING, () => loading.value = true);
			playerInstance.value.on(Events.SEEKING, () => loading.value = true);
			playerInstance.value.on(Events.LOADED_METADATA, () => {
				if (paused.value) loading.value = false;
			});
			playerInstance.value.on(Events.CANPLAY, () => loading.value = false);
			playerInstance.value.on(Events.PLAYING, () => loading.value = false);
			playerInstance.value.on(Events.SEEKED, () => loading.value = false);
			playerInstance.value.on(Events.ERROR, () => loading.value = false);
			playerInstance.value.on(Events.ENDED, playNext);

			const media = getMediaElement();
			media?.addEventListener('timeupdate', onTimeUpdate);
			media?.addEventListener('playing', () => loading.value = false);
			media?.addEventListener('canplay', () => loading.value = false);
			media?.addEventListener('seeked', () => loading.value = false);
			media?.addEventListener('error', () => loading.value = false);

			const { id, type } = route.params;

			try {
				const response = await getSetting();
				if (response.data) {
					setting.value = response.data;
					const savedMusic = getData('music');
					setData(PLAYER_SETTING, JSON.stringify(response.data));
					globalStore.global.player = response.data;
					if (type === 'music' && id) {
						globalStore.global.media.musicId = response.data.musicId;
					} else if (response.data.musicId) {
						currentTime.value = response.data.currentTime;
						globalStore.global.media.musicId = response.data.musicId;
						globalStore.global.media.currentTime = response.data.currentTime;
						changeCurrentTime(null);
					} else if (savedMusic) {
						setMusic(JSON.parse(savedMusic));
					}
				}
			} catch { /* non-critical: backend may be offline */
			}

			await playQueueStore.restoreQueue();
			if (playQueueStore.currentItem?.music) {
				currentTime.value = playQueueStore.queue.currentTime || currentTime.value;
				globalStore.global.media.currentTime = currentTime.value;
				await playQueueItem();
			}

			if (globalStore.global.mobile) {
				volume.value = 50;
				await handleEvent('changeVolume', 0.5);
			} else {
				const localVolume = getData(VOLUME_MUSIC);
				volume.value = localVolume ? Number.parseInt(localVolume) : 50;
				await handleEvent('changeVolume', volume.value / 100);
			}

			document.addEventListener('keydown', handleKeyEvent, false);
		})();

		return initPromise;
	};

	const destroy = () => {
		document.removeEventListener('keydown', handleKeyEvent, false);
		if (playerInstance.value) {
			playerInstance.value.destroy();
			playerInstance.value = null;
		}
		initPromise = null;
	};

	return {
		paused,
		loading,
		currentTime,
		volume,
		music,
		progressData,
		cover,
		setting,
		playerInstance,
		playOrPause,
		seekToTime,
		changeCurrentTime,
		updateTime,
		changeMute,
		setMusic,
		handleEvent,
		handleSeek,
		playNext,
		playPrev,
		playModeTitle,
		cyclePlayMode: playQueueStore.cyclePlayMode,
		init,
		destroy,
	};
}
