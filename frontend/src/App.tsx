import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { HomePage } from '@/features/home/components/HomePage';
import { SearchPage } from '@/features/search/components/SearchPage';
import { PlaylistPage } from '@/features/playlists/components/PlaylistPage';
import { CreatePlaylistPage } from '@/features/playlists/components/CreatePlaylistPage';
import { ROUTES } from '@/shared/constants';

function App() {
  return (
    <Routes>
      {/* Auth routes — no layout */}
      <Route path={ROUTES.LOGIN} element={<LoginForm />} />
      <Route path={ROUTES.SIGNUP} element={<SignupForm />} />

      {/* Protected app routes — with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.NEW_PLAYLIST} element={<CreatePlaylistPage />} />
        <Route path={ROUTES.PLAYLIST_DETAIL} element={<PlaylistPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}


export default App;
