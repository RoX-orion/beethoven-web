import { DEBUG } from '@/config';
import { pause } from '@/util/schedulers';

const ACTIVATE_TIMEOUT = 3000;

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (e: ExtendableEvent) => {
	if (DEBUG) {
		// eslint-disable-next-line no-console
		console.log('ServiceWorker installed');
	}

	// Activate worker immediately
	e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
	if (DEBUG) {
		// eslint-disable-next-line no-console
		console.log('ServiceWorker activated');
	}

	e.waitUntil(
		Promise.race([
			// An attempt to fix freezing UI on iOS
			pause(ACTIVATE_TIMEOUT),
			Promise.all([
				self.caches.delete('kkkkkkkk'),
				// Become available to all pages
				self.clients.claim(),
			]),
		]),
	);
});


self.addEventListener('fetch', (e: FetchEvent) => {
	console.log('service worker fetch');
	const { url } = e.request;
	const scope = self.registration.scope;
	if (!url.startsWith(scope)) {
		return false;
	}

	const { pathname, protocol } = new URL(url);
	const { pathname: scopePathname } = new URL(scope);
	console.log('fetch', pathname);
	//
	// if (pathname.includes('/progressive/')) {
	// 	e.respondWith(respondForProgressive(e));
	// 	return true;
	// }

	if (pathname.includes('/download/')) {
		// e.respondWith(respondForDownload(e));
		return true;
	}
	//
	// if (pathname.includes('/share/')) {
	// 	e.respondWith(respondForShare(e));
	// }
	//
	// if (protocol === 'http:' || protocol === 'https:') {
	// 	if (pathname === scopePathname || pathname.match(RE_NETWORK_FIRST_ASSETS)) {
	// 		e.respondWith(respondWithCacheNetworkFirst(e));
	// 		return true;
	// 	}
	//
	// 	if (pathname.match(RE_CACHE_FIRST_ASSETS)) {
	// 		e.respondWith(respondWithCache(e));
	// 		return true;
	// 	}
	// }

	return false;
});
