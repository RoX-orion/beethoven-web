import PromisedWebSockets from '@/lib/network/PromisedWebSockets';
import AsyncQueue from '@/lib/network/AsyncQueue';
import { sleep } from '@/util/time';
import Logger from '@/lib/Logger';

const PING_INTERVAL = 3000; // 3 sec
const PING_TIMEOUT = 5000; // 5 sec
const PING_FAIL_ATTEMPTS = 3;
const PING_FAIL_INTERVAL = 100; // ms

// An unusually long interval is a sign of returning from background mode...
const PING_INTERVAL_TO_WAKE_UP = 5000; // 5 sec
// ... so we send a quick "wake-up" ping to confirm than connection was dropped ASAP
const PING_WAKE_UP_TIMEOUT = 3000; // 3 sec
// We also send a warning to the user even a bit more quickly
const PING_WAKE_UP_WARNING_TIMEOUT = 1000; // 1 sec

const PING_DISCONNECT_DELAY = 60000; // 1 min

type TimeoutId = ReturnType<typeof setTimeout>;

export class Connection {

	readonly _ip: string;

	readonly _port: number;

	_connected: boolean;

	isReconnecting: boolean;

	sendQueue: AsyncQueue<object>;

	recvQueue: AsyncQueue<object | undefined>;

	_log: Logger;

	// _pendingState: PendingState;

	socket: PromisedWebSockets;

	constructor(ip: string, port: number, log: Logger) {
		this._ip = ip;
		this._port = port;
		this._connected = false;
		this.isReconnecting = false;
		this.sendQueue = new AsyncQueue<Buffer>();
		this.recvQueue = new AsyncQueue<Buffer>();
		this._log = log;
		// this._pendingState =
		this.socket = new PromisedWebSockets(this.disconnectCallback.bind(this));
	}

	async connect() {
		while (!this._connected) {
			try {
				await this.socket.connect(this._port, this._ip);
				this._connected = true;
				break;
			} catch {
				this._log.error('Connect error, try reconnect!');
			}
		}
		this._sendLoop();
		this._recvLoop();
		this.updateLoop();
	}

	async send(data: any) {
		console.log('this._connected', this._connected);
		if (!this._connected) {
			throw new Error('Not connected');
		}
		await this.sendQueue.push(data);
	}

	async handleUpdate() {
		while (this._connected) {
			const result = await this.recvQueue.pop();

			// null = sentinel value = keep trying
			if (result) {
				return result;
			}
		}
		throw new Error('Not connected');
	}

	_send(data: any) {
		this.socket.write(data);
	}

	_recv() {
		return this.socket.read();
	}

	async _sendLoop() {
		// TODO handle errors
		try {
			while (this._connected) {
				const data = await this.sendQueue.pop();
				if (!data) {
					// this._sendTask = undefined;
					return;
				}
				await this._send(data);
			}
		} catch (e) {
			this._log.info('The server closed the connection while sending');
		}
	}

	async _recvLoop() {
		let data;
		while (this._connected) {
			try {
				data = await this._recv();
				if (!data) {
					throw new Error('no data received');
				}
			} catch (e) {
				this._log.info('connection closed');
				// await this._recvArray.push()

				this.disconnect();
				return;
			}
			await this.recvQueue.push(data);
		}
	}

	async disconnectCallback() {
		await this.disconnect(true);
	}

	async disconnect(fromCallback = false) {
		if (!this._connected) {
			return;
		}

		this._connected = false;
		void this.recvQueue.push(undefined);
		if (!fromCallback) {
			await this.socket.close();
		}
	}

	async updateLoop() {
		let lastPongAt;
		console.log(this._connected);

		while (this._connected) {
			await sleep(3000);

			try {
				const ping = () => {
					// if (this._destroyed) {
					// 	return undefined;
					// }

					this.send(JSON.stringify({ pingId: Date.now() }));
					// return sender.send(new Api.PingDelayDisconnect({
					// 	pingId: bigInt(getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
					// }));
				};

				const pingAt = Date.now();
				const lastInterval = lastPongAt ? pingAt - lastPongAt : undefined;

				if (!lastInterval || lastInterval < PING_INTERVAL_TO_WAKE_UP) {
					await attempts(() => timeout(ping, PING_TIMEOUT), PING_FAIL_ATTEMPTS, PING_FAIL_INTERVAL);
				} else {
					let wakeUpWarningTimeout: TimeoutId | undefined = setTimeout(() => {
						console.log('disConnected');
						wakeUpWarningTimeout = undefined;
					}, PING_WAKE_UP_WARNING_TIMEOUT);

					await timeout(ping, PING_WAKE_UP_TIMEOUT);

					if (wakeUpWarningTimeout) {
						clearTimeout(wakeUpWarningTimeout);
						wakeUpWarningTimeout = undefined;
					}

					// this._handleUpdate(new UpdateConnectionState(UpdateConnectionState.connected));
				}

				lastPongAt = Date.now();
			} catch (err) {
				// eslint-disable-next-line no-console
				console.warn(err);

				lastPongAt = undefined;

				if (this.isReconnecting) {
					continue;
				}

				this.reconnect();
			}

			// We need to send some content-related request at least hourly
			// for Telegram to keep delivering updates, otherwise they will
			// just stop even if we're connected. Do so every 30 minutes.

			// if (Date.now() - this._lastRequest > 30 * 60 * 1000) {
			// 	try {
			// 		await this.pingCallback?.();
			// 	} catch (e: unknown) {
			// 		// we don't care about errors here
			// 	}
			//
			// 	lastPongAt = undefined;
			// }
		}
	}

	reconnect() {
		if (!this.isReconnecting) {
			this.isReconnecting = true;
			sleep(1000)
				.then(() => {
					this._reconnect();
				});
		}
	}

	async _reconnect() {
		// this.sendQueue.append(undefined);
		// this._state.reset();

		await this.connect();

		this.isReconnecting = false;
		// this.sendQueue.prepend(this._pendingState.values());
		// this._pendingState.clear();

		// if (this._autoReconnectCallback) {
		// 	await this._autoReconnectCallback();
		// }
	}
}

function timeout(cb: () => void, ms: number) {
	let isResolved = false;

	return Promise.race([
		cb(),
		sleep(ms).then(() => (isResolved ? undefined : Promise.reject(new Error('TIMEOUT')))),
	]).finally(() => {
		isResolved = true;
	});
}

async function attempts(cb: () => void, times: number, pause: number) {
	for (let i = 0; i < times; i++) {
		try {
			// We need to `return await` here so it can be caught locally
			// eslint-disable-next-line @typescript-eslint/return-await
			return await cb();
		} catch (err) {
			if (i === times - 1) {
				throw err;
			}

			await sleep(pause);
		}
	}
	return undefined;
}
