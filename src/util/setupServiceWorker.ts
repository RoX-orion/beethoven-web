// import { getActions } from '../global';

// import { DEBUG, DEBUG_MORE, IS_TEST } from '../config';
// import { formatShareText } from './deeplink';
// import { validateFiles } from './files';
import { notifyClientReady, playNotifySoundDebounced } from './notifications';
import { IS_SERVICE_WORKER_SUPPORTED } from './windowEnvironment';
import { DEBUG, DEBUG_MORE } from '@/config';
import ServiceWorkerURL from '../../sw?worker&url';

type WorkerAction = {
	type: string;
	payload: Record<string, any>;
};

function handleWorkerMessage(e: MessageEvent) {
	const action: WorkerAction = e.data;
	console.log('service worker invoke');
	if (DEBUG_MORE) {
		// eslint-disable-next-line no-console
		console.log('[SW] Message from worker', action);
	}
	if (!action.type) return;
	// const dispatch = getActions();
	const payload = action.payload;
	switch (action.type) {
		case 'focusMessage':
			// dispatch.focusMessage?.(payload as any);
			break;
		case 'playNotificationSound':
			playNotifySoundDebounced(action.payload.id);
			break;
		// case 'share':
		//   dispatch.openChatWithDraft({
		//     text: formatShareText(payload.url, payload.text, payload.title),
		//     files: validateFiles(payload.files),
		//   });
		//   break;
	}
}

function subscribeToWorker() {
	navigator.serviceWorker.removeEventListener('message', handleWorkerMessage);
	navigator.serviceWorker.addEventListener('message', handleWorkerMessage);
	// Notify web worker that client is ready to receive messages
	notifyClientReady();
}

if (IS_SERVICE_WORKER_SUPPORTED) {
	window.addEventListener('load', async () => {
		try {
			const controller = navigator.serviceWorker.controller;
			if (!controller) {
				const ourRegistrations = await navigator.serviceWorker.getRegistrations();
				if (ourRegistrations.length) {
					if (DEBUG) {
						// eslint-disable-next-line no-console
						console.log('[SW] Hard reload detected, re-enabling Service Worker');
					}
					await Promise.all(ourRegistrations.map((r) => r.unregister()));
				}
			}

			await navigator.serviceWorker.register(ServiceWorkerURL, { type: 'module', scope: '/' });

			if (DEBUG) {
				// eslint-disable-next-line no-console
				console.log('[SW] ServiceWorker registered');
			}

			await navigator.serviceWorker.ready;

			// Wait for registration to be available
			await navigator.serviceWorker.getRegistration();

			if (navigator.serviceWorker.controller) {
				if (DEBUG) {
					// eslint-disable-next-line no-console
					console.log('[SW] ServiceWorker ready');
				}
				subscribeToWorker();
			} else {
				if (DEBUG) {
					// eslint-disable-next-line no-console
					console.error('[SW] ServiceWorker not available');
				}

				// if (!IS_IOS && !IS_ANDROID && !IS_TEST) {
				//   getActions().showDialog?.({ data: { message: 'SERVICE_WORKER_DISABLED', hasErrorKey: true } });
				// }
			}
		} catch (err) {
			if (DEBUG) {
				// eslint-disable-next-line no-console
				console.error('[SW] ServiceWorker registration failed: ', err);
			}
		}
	});
	window.addEventListener('focus', async () => {
		await navigator.serviceWorker.ready;
		subscribeToWorker();
	});
}
