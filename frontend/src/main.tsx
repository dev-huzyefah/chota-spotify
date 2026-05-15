import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/authContext';
import { PlayerProvider } from '@/features/player/context/playerContext';
import { PlaylistProvider } from '@/features/playlists/context/playlistContext';
import { ToastProvider } from '@/shared/components/Toast/ToastContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <PlayerProvider>
            <PlaylistProvider>
              <App />
            </PlaylistProvider>
          </PlayerProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
