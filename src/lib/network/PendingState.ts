export default class PendingState {
	_pending: Map<string, object>;

	constructor() {
		this._pending = new Map();
	}

	set(msgId: string, state: object) {
		this._pending.set(msgId.toString(), state);
	}

	get(msgId: string) {
		return this._pending.get(msgId.toString());
	}

	getAndDelete(msgId: string) {
		const state = this.get(msgId);
		this.delete(msgId);
		return state;
	}

	values() {
		return Array.from(this._pending.values());
	}

	delete(msgId: string) {
		this._pending.delete(msgId.toString());
	}

	clear() {
		this._pending.clear();
	}
}
