export interface PlaylistType {
	id: string;
	title: string;
	musicCount?: number;
	author?: string;
	cover?: string;
	createTime?: string;
	introduction?: string;
}

export interface AddMusicFormType {
	musicId: string;
	playlistIds: string[];
}
