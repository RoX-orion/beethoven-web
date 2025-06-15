import { Mutex } from "async-mutex";

const mutex = new Mutex();

const closeError = new Error('WebSocket was closed');
const CONNECTION_TIMEOUT = 3000;
const MAX_TIMEOUT = 30000;

export default class PromisedWebSockets {
	private closed: boolean;

	private timeout: number;

	private queue: object[];

	private canRead?: boolean | Promise<boolean>;

	private resolveRead: ((value?: any) => void) | undefined;

	private client: WebSocket | undefined;

	private website?: string;

	private disconnectedCallback: () => void;

	constructor(disconnectedCallback: () => void) {
		this.client = undefined;
		this.closed = true;
		this.queue = [];
		this.disconnectedCallback = disconnectedCallback;
		this.timeout = CONNECTION_TIMEOUT;
	}

	async read() {
		if (this.closed) {
			throw closeError;
		}
		await this.canRead;
		if (this.closed) {
			throw closeError;
		}
		const toReturn = this.queue.shift();
		if (this.queue.length === 0) {
			this.canRead = new Promise((resolve) => {
				this.resolveRead = resolve;
			});
		}

		return toReturn;
	}

	async readAll() {
		if (this.closed || !await this.canRead) {
			throw closeError;
		}
		const toReturn = this.queue;
		this.queue = [];
		this.canRead = new Promise((resolve) => {
			this.resolveRead = resolve;
		});

		return toReturn;
	}

	getWebSocketLink(ip: string, port: number) {
		if (port === 443) {
			return `wss://${ip}:${port}/apiws`;
		} else {
			return `ws://${ip}:${port}/apiws`;
		}
	}

	connect(port: number, ip: string) {
		this.queue = [];
		this.canRead = new Promise((resolve) => {
			this.resolveRead = resolve;
		});
		this.closed = false;
		this.website = this.getWebSocketLink(ip, port);
		this.client = new WebSocket(this.website);
		return new Promise((resolve, reject) => {
			if (!this.client) return;
			let hasResolved = false;
			let timeout: ReturnType<typeof globalThis.setTimeout> | undefined;
			this.client.onopen = () => {
				this.receive();
				resolve(this);
				hasResolved = true;
				if (timeout) clearTimeout(timeout);
			};
			this.client.onerror = (error) => {
				// eslint-disable-next-line no-console
				console.error('WebSocket error', error);
				reject(error);
				hasResolved = true;
				if (timeout) clearTimeout(timeout);
			};
			this.client.onclose = (event) => {
				const { code, reason, wasClean } = event;
				if (code !== 1000) {
					// eslint-disable-next-line no-console
					console.error(`Socket ${ip} closed. Code: ${code}, reason: ${reason}, was clean: ${wasClean}`);
				}

				this.resolveRead?.(false);
				this.closed = true;
				if (this.disconnectedCallback) {
					this.disconnectedCallback();
				}
				hasResolved = true;
				if (timeout) clearTimeout(timeout);
			};

			timeout = setTimeout(() => {
				if (hasResolved) return;

				reject(new Error('WebSocket connection timeout'));
				this.resolveRead?.(false);
				this.closed = true;
				if (this.disconnectedCallback) {
					this.disconnectedCallback();
				}
				this.client?.close();
				this.timeout *= 2;
				this.timeout = Math.min(this.timeout, MAX_TIMEOUT);
				timeout = undefined;
			}, this.timeout);

			// CONTEST
			// Seems to not be working, at least in a web worker
			// eslint-disable-next-line no-restricted-globals
			self.addEventListener('offline', async () => {
				await this.close();
				this.resolveRead?.(false);
			});
		});
	}

	write(data: any) {
		if (this.closed) {
			throw closeError;
		}
		this.client?.send(data);
	}

	async close() {
		await this.client?.close();
		this.closed = true;
	}

	receive() {
		if (!this.client) return;
		this.client.onmessage = async (message) => {
			await mutex.runExclusive(async () => {
				const data = message.data;
				this.queue.push(data);
				this.resolveRead?.(true);
			});
		};
	}
}
