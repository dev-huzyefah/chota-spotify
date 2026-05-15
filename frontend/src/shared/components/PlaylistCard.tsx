import type { Playlist } from '@/shared/types/types';
import './PlaylistCard.css';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: (id: string) => void;
}

export function PlaylistCard({ playlist, onClick }: PlaylistCardProps) {
  return (
    <div
      className="playlist-card"
      onClick={() => onClick(playlist.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(playlist.id)}
      id={`playlist-card-${playlist.id}`}
    >
      <div className="playlist-card__cover-wrapper">
        <img
          className="playlist-card__cover"
          src={playlist.coverUrl}
          alt={playlist.name}
          loading="lazy"
        />
      </div>
      <span className="playlist-card__name">{playlist.name}</span>
      <span className="playlist-card__description">{playlist.description}</span>
    </div>
  );
}
