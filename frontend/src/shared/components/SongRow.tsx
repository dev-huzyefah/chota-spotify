import { PiPlusBold } from 'react-icons/pi';
import type { Song } from '@/shared/types/types';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import './SongRow.css';

interface SongRowProps {
  song: Song;
  index: number;
  queue?: Song[];
  onAddToPlaylist?: (songId: string) => void;
  showAlbum?: boolean;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SongRow({ song, index, queue, onAddToPlaylist, showAlbum = true, actionLabel, actionIcon }: SongRowProps) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  const handleClick = () => {
    playSong(song, queue, index);
  };

  return (
    <div
      className={`song-row ${isActive ? 'song-row--active' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      id={`song-row-${song.id}`}
    >
      <span className="song-row__number">
        {isActive && isPlaying ? (
          <span style={{ fontSize: '14px' }}>♪</span>
        ) : (
          index + 1
        )}
      </span>
      <img className="song-row__cover" src={song.coverUrl} alt={song.album} loading="lazy" />
      <div className="song-row__info">
        <span className="song-row__title">{song.title}</span>
        <span className="song-row__artist">{song.artist}</span>
      </div>
      {showAlbum && <span className="song-row__album">{song.album}</span>}
      <span className="song-row__duration">{formatDuration(song.duration)}</span>
      <div className="song-row__actions">
        {onAddToPlaylist && (
          <button
            className="song-row__action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(song.id);
            }}
            title={actionLabel || 'Add to playlist'}
            aria-label={`${actionLabel || 'Add'} ${song.title}`}
          >
            {actionIcon || <PiPlusBold size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
