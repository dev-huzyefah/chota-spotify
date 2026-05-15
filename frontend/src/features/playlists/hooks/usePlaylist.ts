import { useContext } from 'react';
import { PlaylistContext, type PlaylistContextType } from '../context/playlistContext';

export function usePlaylist(): PlaylistContextType {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}
