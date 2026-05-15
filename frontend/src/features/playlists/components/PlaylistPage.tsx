import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PiPlayFill, PiTrashBold, PiMusicNotesBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import { usePlaylist } from '../hooks/usePlaylist';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { SongRow } from '@/shared/components/SongRow';
import { EmptyState } from '@/shared/components/EmptyState';
import { songAPI, playlistsAPI } from '@/shared/services/api';
import { ROUTES } from '@/shared/constants';
import type { Song, Playlist } from '@/shared/types/types';
import './Playlist.css';

export function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPlaylist, 
    deletePlaylist, 
    removeSongFromPlaylist, 
    addSongToPlaylist, 
    isLoading: isUserPlaylistsLoading,
    error: playlistError 
  } = usePlaylist();
  const { playSong } = usePlayer();
  const { isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [featured, setFeatured] = useState<Playlist[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);

  // Fetch songs and featured playlists on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsFeaturedLoading(true);
      try {
        const [songs, featuredPlaylists] = await Promise.all([
          songAPI.getAllSongs(),
          playlistsAPI.getFeaturedPlaylists()
        ]);
        setAllSongs(songs);
        setFeatured(featuredPlaylists);
      } catch (error) {
        console.error('Failed to fetch songs or featured playlists:', error);
        showToast('Failed to load playlist data.', 'error');
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check user playlists first, then featured
  const playlist = useMemo(() => {
    if (!id) return undefined;
    const userPl = getPlaylist(id);
    if (userPl) return { ...userPl, isUserPlaylist: true };
    const featuredPl = featured.find(f => String(f.id) === String(id));
    if (featuredPl) return { ...featuredPl, isUserPlaylist: false };
    return undefined;
  }, [id, getPlaylist, featured]);

  const songs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map(sid => allSongs.find(s => s.id === sid))
      .filter((s): s is Song => !!s);
  }, [playlist, allSongs]);

  if (authLoading || isUserPlaylistsLoading || isFeaturedLoading) {
    return (
      <div className="playlist-page--loading">
        <div className="playlist-page__header">
          <div className="playlist-page__cover skeleton" />
          <div className="playlist-page__info">
            <div className="skeleton-text skeleton-label" />
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-description" />
            <div className="skeleton-text skeleton-meta" />
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <EmptyState
        icon={<PiMusicNotesBold />}
        title="Playlist not found"
        message="This playlist doesn't exist or has been deleted."
      />
    );
  }

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs, 0);
    }
  };

  const handleDelete = async () => {
    if (!playlist.isUserPlaylist) return;

    const confirmed = window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deletePlaylist(playlist.id);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };


  const handleRemoveSong = async (songId: string) => {
    if (playlist.isUserPlaylist) {
      try {
        await removeSongFromPlaylist(playlist.id, songId);
      } catch (error) {
        console.error('Failed to remove song:', error);
      }
    }
  };

  const handleAddSong = async (songId: string) => {
    if (playlist.isUserPlaylist) {
      try {
        await addSongToPlaylist(playlist.id, songId);
      } catch (error) {
        console.error('Failed to add song:', error);
      }
    }
  };

  const availableSongs = allSongs.filter(
    song => !playlist.songIds.includes(song.id)
  );

  const totalDuration = songs.reduce((acc, s) => acc + s.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);
  const durationText = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

  return (
    <div className="playlist-page" id="playlist-page">
      {playlistError && (
        <div className="error-banner animate-fade-in">
          {playlistError}
        </div>
      )}
      <div className="playlist-page__header">
        <img
          className="playlist-page__cover"
          src={playlist.coverUrl}
          alt={playlist.name}
        />
        <div className="playlist-page__info">
          <span className="playlist-page__label">Playlist</span>
          <h1 className="playlist-page__name">{playlist.name}</h1>
          {playlist.description && (
            <p className="playlist-page__description">{playlist.description}</p>
          )}
          <span className="playlist-page__meta">
            {songs.length} song{songs.length !== 1 ? 's' : ''} · {durationText}
          </span>
          <div className="playlist-page__actions">
            <button
              className="playlist-page__play-btn"
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              id="playlist-play-all"
            >
              <PiPlayFill size={16} />
              Play All
            </button>
            {playlist.isUserPlaylist && (
              <>
                <button
                  className="playlist-page__add-btn"
                  onClick={() => setShowAddSongs(true)}
                  id="playlist-add-songs"
                >
                  <PiPlusBold size={16} />
                  Add Songs
                </button>
                <button
                  className="playlist-page__delete-btn"
                  onClick={handleDelete}
                  id="playlist-delete"
                >
                  <PiTrashBold size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {songs.length > 0 ? (
        <>
          <div className="playlist-page__songs-header">
            <span>#</span>
            <span></span>
            <span>Title</span>
            <span>Album</span>
            <span>Duration</span>
            <span></span>
          </div>
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              queue={songs}
              onAddToPlaylist={
                playlist.isUserPlaylist
                  ? () => handleRemoveSong(song.id)
                  : undefined
              }
              actionLabel={playlist.isUserPlaylist ? 'Remove' : undefined}
              actionIcon={playlist.isUserPlaylist ? <PiMinusBold size={16} /> : undefined}
            />
          ))}
        </>
      ) : (
        <EmptyState
          icon={<PiMusicNotesBold />}
          title="Empty playlist"
          message={playlist.isUserPlaylist ? 'Click "Add Songs" to get started.' : 'No songs in this playlist.'}
        />
      )}

      {/* Add Songs Modal */}
      {showAddSongs && playlist.isUserPlaylist && (
        <div
          className="add-songs-overlay"
          onClick={() => setShowAddSongs(false)}
        >
          <div
            className="add-songs-modal"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="add-songs-modal__title">
              Add Songs to {playlist.name}
            </h2>
            {availableSongs.length === 0 ? (
              <p className="add-songs-modal__empty">
                All songs are already in this playlist.
              </p>
            ) : (
              <div className="add-songs-modal__list">
                <div className="playlist-page__songs-header add-songs-modal__list-header">
                  <span>#</span>
                  <span></span>
                  <span>Title</span>
                  <span>Album</span>
                  <span>Duration</span>
                  <span></span>
                </div>
                {availableSongs.map((song, i) => (
                  <SongRow
                    key={song.id}
                    song={song}
                    index={i + 1}
                    onAddToPlaylist={() => handleAddSong(song.id)}
                    actionLabel="Add"
                  />
                ))}
              </div>
            )}
            <button
              className="add-songs-modal__close"
              onClick={() => setShowAddSongs(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
