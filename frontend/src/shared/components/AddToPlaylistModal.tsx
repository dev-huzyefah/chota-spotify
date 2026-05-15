import { useState } from 'react';
import type { Song, Playlist } from '@/shared/types/types';
import './AddToPlaylistModal.css';

interface AddToPlaylistModalProps {
  song: Song;
  playlists: Playlist[];
  onClose: () => void;
  onAdd: (playlistId: string, songId: string) => Promise<void>;
}

export function AddToPlaylistModal({ 
  song, 
  playlists, 
  onClose, 
  onAdd 
}: AddToPlaylistModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaylistSelect = async (playlistId: string) => {
    setIsAdding(true);
    setError(null);
    try {
      await onAdd(playlistId, song.id);
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add song to playlist';
      setError(errorMsg);
      console.error('Failed to add song to playlist:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className="add-songs-overlay" 
      onClick={onClose}
    >
      <div 
        className="add-to-playlist-modal"
        onClick={e => e.stopPropagation()}
      >
        <h2>Add to Playlist</h2>
        <p className="add-to-playlist-modal__description">
          Choose a playlist for "{song.title}"
        </p>
        
        {error && (
          <div className="add-to-playlist-modal__error">
            {error}
          </div>
        )}
        
        <div className="add-to-playlist-modal__list">
          {playlists.length === 0 ? (
            <p className="add-to-playlist-modal__empty">
              You haven't created any playlists yet.
            </p>
          ) : (
            playlists.map(playlist => (
              <button
                key={playlist.id}
                className="add-to-playlist-modal__item"
                onClick={() => handlePlaylistSelect(playlist.id)}
                disabled={isAdding}
              >
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.name} 
                  className="add-to-playlist-modal__item-img"
                />
                <span className="add-to-playlist-modal__item-name">{playlist.name}</span>
              </button>
            ))
          )}
        </div>
        
        <button 
          className="add-to-playlist-modal__cancel"
          onClick={onClose}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
