import type {MusicItemType} from '@/types/global';

export type PlayMode = 'SEQUENCE' | 'LOOP' | 'RANDOM' | 'SINGLE_LOOP';

export type ChangeTrackReason = 'ended' | 'manual-next' | 'manual-prev';

export const PLAY_MODE_ORDER: PlayMode[] = ['LOOP', 'SEQUENCE', 'RANDOM', 'SINGLE_LOOP'];

export type QueueSourceType = 'playlist' | 'search' | 'album' | 'manual' | 'single';

export interface PlayQueueItem {
	queueItemId: string;
	musicId: string;
	music: MusicItemType;
	sourceType?: QueueSourceType | string;
	sourceId?: string;
	sortNo?: number;
}

export interface PlayQueueState {
	id?: string;
	items: PlayQueueItem[];
	currentIndex: number;
	currentMusicId?: string;
	currentTime: number;
	playMode: PlayMode;
	/** Random playback history/order, stored by stable queue item id rather than array index. */
	randomOrder: string[];
	randomCursor: number;
	sourceType?: QueueSourceType | string;
	sourceId?: string;
	version: number;
}

export interface PlayQueueResponse {
	id?: string;
	userId?: string;
	sourceType?: QueueSourceType | string;
	sourceId?: string;
	playMode?: PlayMode;
	currentMusicId?: string;
	currentIndex?: number;
	currentTime?: number;
	randomSeed?: number;
	version?: number;
	items?: PlayQueueItem[];
}

export interface BuildQueueFromPlaylistDTO {
	playlistId: string;
	startMusicId?: string;
	playMode?: PlayMode;
}

export interface BuildQueueFromMusicListDTO {
	musicIds: string[];
	startMusicId?: string;
	playMode?: PlayMode;
	sourceType?: QueueSourceType | string;
	sourceId?: string;
}

export interface AddQueueItemDTO {
	musicId: string;
	sourceType?: QueueSourceType | string;
	sourceId?: string;
}
