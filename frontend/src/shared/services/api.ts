import axios, { 
  type InternalAxiosRequestConfig, 
  type AxiosInstance, 
  type AxiosResponse, 
  type AxiosRequestConfig 
} from 'axios';
import type { User, Song, Playlist, RecentlyPlayed, UserPlaylist } from '../types/types';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom Axios Instance type to handle response.data interceptor
 */
interface ApiInstance extends AxiosInstance {
  get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}

/**
 * Standardized API Client
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ApiInstance;

// Request interceptor to add Authorization header
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authorization');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to simplify data access and handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);


// User API
export const userAPI = {
  /**
   * Login using payload instead of query parameters
   */
  async login(email: string, password: string): Promise<User> {
    // Moved email/password to payload as requested
    // Using /login as a more standard endpoint for payload-based auth
    const user = await api.post<User>('/login', { email, password });
    
    // Safety: ensure password is not in the object if returned by server
    if (user) {
      const { password: _, ...userWithoutPassword } = user as any;
      return userWithoutPassword as User;
    }
    return user;
  },

  async signup(email: string, password: string, displayName: string): Promise<User> {
    const newUser = {
      email,
      password,
      displayName,
      avatarUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 70)}/200/200`
    };
    
    // Moved to POST with payload
    const user = await api.post<User>('/signup', newUser);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user as any;
      return userWithoutPassword as User;
    }
    return user;
  }
};


// Song API
export const songAPI = {
  getAllSongs: () => api.get<Song[]>('/songs'),
  getSongById: (id: string) => api.get<Song>(`/songs/${id}`),
};

// Featured Playlists API
export const playlistsAPI = {
  getFeaturedPlaylists: () => api.get<Playlist[]>('/featuredPlaylists'),
};

// Playlist API
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

// Recently Played API
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

