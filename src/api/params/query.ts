export interface Page {
	page: number;
	size: number;
}

export interface SearchMusicParam extends Page {
	key: string;
}
