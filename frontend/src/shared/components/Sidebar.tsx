import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PiHouseBold, PiMagnifyingGlassBold, PiMusicNotesBold, PiPlusBold, PiSignOutBold, PiListBold, PiStarBold } from 'react-icons/pi';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { usePlaylist } from '@/features/playlists/hooks/usePlaylist';
import { useToast } from '@/shared/components/Toast/ToastContext';
import { playlistsAPI } from '@/shared/services/api';
import { ROUTES } from '@/shared/constants';
import type { Playlist } from '@/shared/types/types';
import './Sidebar.css';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { playlists } = usePlaylist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featured, setFeatured] = useState<Playlist[]>([]);

  // Fetch featured playlists on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featuredPlaylists = await playlistsAPI.getFeaturedPlaylists();
        setFeatured(featuredPlaylists);
      } catch (error) {
        console.error('Failed to fetch featured playlists:', error);
        showToast('Failed to load featured playlists.', 'error');
      }
    };

    fetchFeatured();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        id="mobile-menu-toggle"
      >
        <PiListBold size={20} />
      </button>

      <div
        className={`sidebar-overlay ${mobileOpen ? 'sidebar-overlay--open' : ''}`}
        onClick={closeMobile}
      />

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`} id="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <img src="/spotify.svg" alt="Spotify" />
          </div>
          <span className="sidebar__logo-text">Spotify</span>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to={ROUTES.HOME}
            end
            className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
            onClick={closeMobile}
            id="nav-home"
          >
            <PiHouseBold size={20} />
            Home
          </NavLink>
          <NavLink
            to={ROUTES.SEARCH}
            className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
            onClick={closeMobile}
            id="nav-search"
          >
            <PiMagnifyingGlassBold size={20} />
            Search
          </NavLink>
        </nav>

        <div className="sidebar__divider" />

        <span className="sidebar__section-title">Featured</span>

        <div className="sidebar__featured">
          {featured.map(pl => (
            <NavLink
              key={pl.id}
              to={`${ROUTES.PLAYLISTS}/${pl.id}`}
              className="sidebar__featured-item"
              onClick={closeMobile}
              title={pl.name}
            >
              <PiStarBold size={16} />
              <span>{pl.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar__divider" />

        <span className="sidebar__section-title">Your Library</span>

        <button
          className="sidebar__create-btn"
          onClick={() => navigate(ROUTES.NEW_PLAYLIST)}
          id="create-playlist-btn"
        >
          <PiPlusBold size={16} />
          New Playlist
        </button>

        <div className="sidebar__playlists">
          {playlists.map(pl => (
            <NavLink
              key={pl.id}
              to={`${ROUTES.PLAYLISTS}/${pl.id}`}
              className="sidebar__playlist-item"
              onClick={closeMobile}
            >
              <PiMusicNotesBold size={16} />
              {pl.name}
            </NavLink>
          ))}
        </div>

        {user && (
          <div className="sidebar__user">
            <img className="sidebar__user-avatar" src={user.avatarUrl} alt={user.displayName} />
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.displayName}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </div>
            <button
              className="sidebar__logout-btn"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              id="logout-btn"
            >
              <PiSignOutBold size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

