export interface PlaylistType {
	id: string;
	title: string;
	musicCount?: number;
	author?: string;
	cover?: string;
	createTime?: string;
	introduction?: string;
	accessible: boolean;
}

export interface AddMusicFormType {
	musicId: string;
	playlistIds: string[];
}
