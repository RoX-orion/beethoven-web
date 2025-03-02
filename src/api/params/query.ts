export interface Page {
	page: number;
	size: number;
}

export interface SearchPageParam extends Page {
	key: string;
}
