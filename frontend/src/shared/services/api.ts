import axios, { 
  type InternalAxiosRequestConfig, 
  type AxiosInstance, 
  type AxiosResponse, 
  type AxiosRequestConfig 
} from 'axios';
import type { AuthResponse } from '@/features/auth/types/authTypes';
import { clearSession, getAccessToken } from '@/features/auth/services/authAPI';
import type { Song, Playlist, RecentlyPlayed, UserPlaylist } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

const PUBLIC_PATHS = ['/login', '/signup'];

interface ApiInstance extends AxiosInstance {
  get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ApiInstance;

function isPublicRequest(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_PATHS.some((path) => url.includes(path));
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (isPublicRequest(config.url)) {
    return config;
  }

  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function formatErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'API request failed';
  }

  const data = error.response?.data;
  if (typeof data === 'object' && data !== null) {
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if ('detail' in data) {
      return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    }
  }

  return error.message || 'API request failed';
}

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearSession();
    }
    return Promise.reject(new Error(formatErrorMessage(error)));
  }
);

export const userAPI = {
  login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/login', { email, password });
  },

  signup(email: string, password: string, displayName: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/signup', {
      email,
      password,
      displayName,
      avatarUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 70)}/200/200`,
    });
  },
};

export const songAPI = {
  getAllSongs: () => api.get<Song[]>('/songs'),
  getSongById: (id: string) => api.get<Song>(`/songs/${id}`),
};

export const playlistsAPI = {
  getFeaturedPlaylists: () => api.get<Playlist[]>('/featuredPlaylists'),
};

export const playlistAPI = {
  getPlaylists: (userId: string) => api.get<UserPlaylist[]>('/playlists', { params: { userId } }),
  
  getPlaylist: (id: string) => api.get<UserPlaylist>(`/playlists/${id}`),

  createPlaylist: (userId: string, name: string, description: string) => 
    api.post<UserPlaylist>('/playlists', {
      userId,
      name,
      description,
      coverUrl: `https://picsum.photos/seed/${Date.now()}/300/300`,
      songIds: [],
      createdAt: new Date().toISOString()
    }),

  updatePlaylist: (playlistId: string, updates: Partial<UserPlaylist>) => 
    api.patch<UserPlaylist>(`/playlists/${playlistId}`, updates),

  deletePlaylist: (id: string) => api.delete(`/playlists/${id}`),

  async addSongToPlaylist(playlistId: string, songId: string): Promise<UserPlaylist> {
    const playlist = await this.getPlaylist(playlistId);
    if (!playlist.songIds.includes(songId)) {
      return this.updatePlaylist(playlistId, { 
        songIds: [...playlist.songIds, songId] 
      });
    }
    return playlist;
  },

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<UserPlaylist> {
    const playlist = await this.getPlaylist(playlistId);
    return this.updatePlaylist(playlistId, { 
      songIds: playlist.songIds.filter(id => id !== songId) 
    });
  }
};

export const recentlyPlayedAPI = {
  addToRecentlyPlayed: (userId: string, songId: string) => 
    api.post<RecentlyPlayed>('/recentlyPlayed', {
      userId,
      songId,
      playedAt: new Date().toISOString()
    }),

  getRecentlyPlayed: (userId: string) => 
    api.get<RecentlyPlayed[]>('/recentlyPlayed', {
      params: { 
        userId, 
        _sort: 'playedAt', 
        _order: 'desc' 
      }
    }),
};
