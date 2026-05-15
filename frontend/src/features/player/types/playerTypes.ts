import type { Song } from '@/shared/types/types';

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
}
