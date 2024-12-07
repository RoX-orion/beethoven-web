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

export interface PlaylistInfo {
	title: string,
	introduction?: string
}

export interface ControlButton {
	button?: string;
}

export type AnyToVoidFunction = (...args: any[]) => void;
export type NoneToVoidFunction = () => void;

export interface PlayerSetting {
	isMute: boolean;
	volume: number;
	playMode: 'loop' | 'random';
}

export interface MusicItemType {
	id: string;
	link: string;
	cover?: string;
	name: string;
	singer?: string;
	duration: number;
	mime: string;
}

export type DialogType = {
	width?: string;
	title: string;
}
