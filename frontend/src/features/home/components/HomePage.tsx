import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePlaylist } from '@/features/playlists/hooks/usePlaylist';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { SongRow } from '@/shared/components/SongRow';
import { PlaylistCard } from '@/shared/components/PlaylistCard';
import { AddToPlaylistModal } from '@/shared/components/AddToPlaylistModal';
import { songAPI, playlistsAPI } from '@/shared/services/api';
import { STORAGE_KEYS, DEFAULTS } from '@/shared/constants';
import type { Song, Playlist } from '@/shared/types/types';
import './HomePage.css';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { playlists, addSongToPlaylist, isLoading: isPlaylistsLoading } = usePlaylist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [featured, setFeatured] = useState<Playlist[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [recentIds] = useLocalStorage<string[]>(user?.id ? `${STORAGE_KEYS.RECENTLY_PLAYED_PREFIX}${user.id}` : '', []);

  const recentSongs = useMemo(() => {
    if (!user?.id || allSongs.length === 0) return [];
    
    return recentIds
      .map(id => allSongs.find(s => s.id === id))
      .filter((s): s is Song => !!s)
      .slice(0, DEFAULTS.MAX_RECENT_SONGS);
  }, [recentIds, allSongs, user?.id]);

  // Fetch songs and featured playlists on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [songs, featuredPlaylists] = await Promise.all([
          songAPI.getAllSongs(),
          playlistsAPI.getFeaturedPlaylists()
        ]);
        setAllSongs(songs);
        setFeatured(featuredPlaylists);
      } catch (error) {
        console.error('Failed to fetch songs or featured playlists:', error);
        showToast('Failed to load home page content.', 'error');
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlaylistClick = (id: string) => {
    // Navigate to playlist view (works for both user and featured playlists)
    navigate(`/playlists/${id}`);
  };

  const handleAddToPlaylist = (songId: string) => {
    if (playlists.length === 0) {
      navigate('/playlists/new');
      return;
    }
    const song = allSongs.find(s => s.id === songId);
    if (song) setSelectedSong(song);
  };

  const isLoading = authLoading || isPlaylistsLoading || isDataLoading;

  return (
    <div className="home-page" id="home-page">
      <h1 className="home-page__greeting">
        {getGreeting()}, <span>{user?.displayName ?? 'there'}</span>
      </h1>

      {/* Featured Playlists */}
      <section className="home-page__section">
        <div className="home-page__section-header">
          <h2 className="home-page__section-title">Featured Playlists</h2>
        </div>
        <div className="home-page__grid">
          {isLoading
            ? Array.from({ length: DEFAULTS.SKELETON_ITEMS_FEATURED }).map((_, i) => (
                <div key={i} className="playlist-card-skeleton">
                  <div className="playlist-card-skeleton__cover skeleton" />
                  <div className="skeleton-text" style={{ width: '80%', marginTop: 'var(--space-3)' }} />
                  <div className="skeleton-text" style={{ width: '60%', height: '0.8rem' }} />
                </div>
              ))
            : featured.map(pl => (
                <PlaylistCard key={pl.id} playlist={pl} onClick={handlePlaylistClick} />
              ))}
        </div>
      </section>

      {/* Recently Played */}
      {!isLoading && recentSongs.length > 0 && (
        <section className="home-page__section">
          <div className="home-page__section-header">
            <h2 className="home-page__section-title">Recently Played</h2>
          </div>
          <div className="home-page__recent-list">
            {recentSongs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                queue={recentSongs}
                onAddToPlaylist={handleAddToPlaylist}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Songs */}
      <section className="home-page__all-songs-section">
        <div className="home-page__section-header">
          <h2 className="home-page__section-title">All Songs</h2>
        </div>
        <div className="home-page__all-songs-header">
          <span>#</span>
          <span></span>
          <span>Title</span>
          <span>Album</span>
          <span>Duration</span>
          <span></span>
        </div>
        <div className="home-page__recent-list">
          {isLoading
            ? Array.from({ length: DEFAULTS.SKELETON_ITEMS_SONGS }).map((_, i) => (
                <div key={i} className="song-row-skeleton">
                  <div className="skeleton-text" style={{ width: '12px', marginBottom: 0 }} />
                  <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)' }} />
                  <div className="skeleton-text" style={{ width: '120px', marginBottom: 0 }} />
                  <div className="skeleton-text" style={{ width: '80px', marginBottom: 0 }} />
                  <div className="skeleton-text" style={{ width: '40px', marginBottom: 0 }} />
                </div>
              ))
            : allSongs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  queue={allSongs}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              ))}
        </div>
      </section>

      {/* Add to Playlist Modal */}
      {selectedSong && (
        <AddToPlaylistModal
          song={selectedSong}
          playlists={playlists}
          onClose={() => setSelectedSong(null)}
          onAdd={addSongToPlaylist}
        />
      )}
    </div>
  );
}

