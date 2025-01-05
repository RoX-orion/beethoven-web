export type AnyToVoidFunction = (...args: any[]) => void;
export type NoneToVoidFunction = () => void;

export interface ApiResponse {
	code: number;
	msg: string;
	data: any;
}

export type UploadType = 'image' | 'file';
export interface PlayList {
	cover: string;
	title: string;
	singers: Array<string>;
	musicCount: number;
}

export interface ProgressType {
	width: string;
	height: string;
	radius: string;
	percentage: number;
}

export interface BugItemType {
	img: string;
	title: string;
	summary: string;
	date: Date;
	platform?: string;
	type: 'Bug' | 'Tip';
	state: string;
}

export interface InputTextType {
	placeholder?: string;
	text: string
}

export interface ControlButton {
	button?: string;
}

export interface PlayerSetting {
	isMute: boolean;
	volume: number;
	playMode: 'loop' | 'random';
}

export interface SettingType {
	userId?: number;
	musicId: number;
	currentTime: number;
	isMute: boolean;
	volume: number;
	playMode: 'loop' | 'random';
}

export interface MusicItemType {
	id: string | null;
	link: string;
	cover?: string;
	name?: string;
	singer?: string;
	duration: number;
	mime: string;
	album?: string;
	size?: number;
}

export interface MusicConfigType {
	defaultMusicCover?: string;
	shardingSize?: any;
}

export type DialogType = {
	width?: string;
	title: string;
}

export interface FileListType {
	url?: string;
	file?: File;
}

export interface OAuth2LoginType {
	code: string;
	type: string;
}

export enum ComponentType {
	DEFAULT,
	SEARCH_RESULT,
	PLAYLIST,
}
