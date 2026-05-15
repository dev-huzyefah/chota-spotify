import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../hooks/usePlaylist';
import { ROUTES } from '@/shared/constants';
import './Playlist.css';

export function CreatePlaylistPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createPlaylist } = usePlaylist();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const playlist = await createPlaylist(name.trim(), description.trim());
      navigate(`${ROUTES.PLAYLISTS}/${playlist.id}`);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };


  return (
    <div className="create-playlist" id="create-playlist-page">
      <h1 className="create-playlist__title">New Playlist</h1>
      <p className="create-playlist__subtitle">Give your playlist a name and optional description</p>

      <form className="create-playlist__form" onSubmit={handleSubmit}>
        <div className="create-playlist__field">
          <label className="create-playlist__label" htmlFor="playlist-name">Name</label>
          <input
            className="create-playlist__input"
            id="playlist-name"
            type="text"
            placeholder="My awesome playlist"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="create-playlist__field">
          <label className="create-playlist__label" htmlFor="playlist-desc">Description</label>
          <textarea
            className="create-playlist__textarea"
            id="playlist-desc"
            placeholder="What's this playlist about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="create-playlist__submit" id="create-playlist-submit">
          Create Playlist
        </button>
      </form>
    </div>
  );
}
