import { debounce } from '@/util/schedulers';
import { DEBUG } from '@/config';

const soundPlayedDelay = 3 * 1000;
const soundPlayedIds = new Set<string>();
const notificationSound = new Audio('./notification.mp3');

export async function playNotifySound(id?: string, volume?: number) {
	if (id !== undefined && soundPlayedIds.has(id)) return;
	// const { notificationSoundVolume } = selectNotifySettings(getGlobal());
	const notificationSoundVolume = 100;
	const currentVolume = volume ? volume / 10 : notificationSoundVolume / 10;
	if (currentVolume === 0) return;
	notificationSound.volume = currentVolume;
	if (id !== undefined) {
		notificationSound.addEventListener('ended', () => {
			soundPlayedIds.add(id);
		}, {once: true});

		setTimeout(() => {
			soundPlayedIds.delete(id);
		}, soundPlayedDelay);
	}

	try {
		await notificationSound.play();
	} catch (error) {
		if (DEBUG) {
			// eslint-disable-next-line no-console
			console.warn('[PUSH] Unable to play notification sound');
		}
	}
}

export const playNotifySoundDebounced = debounce(playNotifySound, 1000, true, false);

// Notify service worker that client is fully loaded
export function notifyClientReady() {
	if (!navigator.serviceWorker?.controller) return;
	navigator.serviceWorker.controller.postMessage({
		type: 'clientReady',
	});
}
