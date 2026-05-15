import { createContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import type { Song } from '@/shared/types/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { songAPI } from '@/shared/services/api';
import { PLAYER, STORAGE_KEYS } from '@/shared/constants';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export interface PlayerContextType {
  currentSong: Song | null;
  queue: Song[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number; 
  isMuted: boolean;
  playSong: (song: Song, queue?: Song[], index?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const { showToast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(PLAYER.DEFAULT_VOLUME);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const [, setRecentlyPlayedIds] = useLocalStorage<string[]>(
    auth.user?.id ? `${STORAGE_KEYS.RECENTLY_PLAYED_PREFIX}${auth.user.id}` : '',
    []
  );

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = PLAYER.DEFAULT_VOLUME;
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      nextTrackRef.current();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
    // Only initialize the Audio element and listeners once. handleEnded uses
    // nextTrackRef to call the latest nextTrack without triggering re-runs.
  }, []);

  // When queue changes and an ended event bumps queueIndex, auto-play the next song
  useEffect(() => {
    if (queue.length > 0 && queueIndex < queue.length) {
      const song = queue[queueIndex];
      if (song && song.id !== currentSong?.id) {
        setCurrentSong(song);
        if (audioRef.current) {
          audioRef.current.src = song.audioUrl;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }
  }, [queueIndex, queue, currentSong?.id]);

  const playSong = useCallback((song: Song, newQueue?: Song[], index?: number) => {
    const q = newQueue ?? [song];
    const idx = index ?? 0;
    setQueue(q);
    setQueueIndex(idx);
    setCurrentSong(song);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = song.audioUrl;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // Save to recently played in localStorage (user-specific)
    if (auth.user?.id) {
      setRecentlyPlayedIds(prev => {
        const filtered = prev.filter(id => id !== song.id);
        // Keep the 50 most recent
        return [song.id, ...filtered].slice(0, 50);
      });

      // Still emit the specific event for compatibility if any other component expects it
      window.dispatchEvent(new CustomEvent('recentlyPlayedUpdated', {
        detail: { userId: auth.user.id, songId: song.id }
      }));
    }
  }, [auth.user?.id]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentSong]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentSong]);

  const nextTrack = useCallback(async () => {
    if (queueIndex < queue.length - 1) {
      setQueueIndex(prev => prev + 1);
    } else {
      // End of queue - autoplay random song
      try {
        const allSongs = await songAPI.getAllSongs();
        if (allSongs.length > 0) {
          // Filter out current song to avoid immediate repeat if possible
          const otherSongs = allSongs.filter(s => s.id !== currentSong?.id);
          const pool = otherSongs.length > 0 ? otherSongs : allSongs;
          const randomSong = pool[Math.floor(Math.random() * pool.length)];
          
          setQueue(prev => [...prev, randomSong]);
          setQueueIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Autoplay failed:', error);
        showToast('Autoplay failed', 'error');
        setIsPlaying(false);
      }
    }
  }, [queueIndex, queue.length, currentSong?.id]);

  const nextTrackRef = useRef(nextTrack);
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > PLAYER.PREV_TRACK_THRESHOLD) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else if (queueIndex > 0) {
      setQueueIndex(prev => prev - 1);
    }
  }, [queueIndex]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        queueIndex,
        isPlaying,
        volume,
        currentTime,
        duration,
        isMuted,
        playSong,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

