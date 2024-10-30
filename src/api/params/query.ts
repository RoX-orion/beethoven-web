export class Page {
	page: Number;
	size: Number;

	constructor(page: Number, size: Number) {
		this.page = page;
		this.size = size;
	}
}

export class SearchMusicParam extends Page {
	key: string;

	constructor(page: Number, size: Number, key: string) {
		super(page, size);
		this.key = key;
	}
}
