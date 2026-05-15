export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  genre: string;
}

export interface Playlist {
  id: string;
  userId?: string;
  name: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  createdAt: string;
  isFeatured?: boolean;
}

export interface UserPlaylist extends Playlist {
  userId: string;
}



export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  password?: string;
}

export interface RecentlyPlayed {
  id: string;
  userId: string;
  songId: string;
  playedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

