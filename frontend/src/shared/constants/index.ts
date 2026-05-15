/**
 * Application-wide route paths
 */
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PLAYLISTS: '/playlists',
  PLAYLIST_DETAIL: '/playlists/:id',
  NEW_PLAYLIST: '/playlists/new',
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  RECENTLY_PLAYED_PREFIX: 'recently_played_',
} as const;

/**
 * Search-related constants
 */
export const SEARCH = {
  FILTERS: [
    { label: 'All', value: 'all' },
    { label: 'Title', value: 'title' },
    { label: 'Artist', value: 'artist' },
    { label: 'Album', value: 'album' },
  ],
  PLACEHOLDER: 'What do you want to listen to?',
  EMPTY_TITLE: 'Find your music',
  EMPTY_MESSAGE: 'Search by song title, artist name, or album to discover tracks.',
  NO_RESULTS_TITLE: 'No results',
} as const;

/**
 * UI Defaults and Limits
 */
export const DEFAULTS = {
  MAX_RECENT_SONGS: 6,
  SKELETON_ITEMS_FEATURED: 6,
  SKELETON_ITEMS_SONGS: 8,
} as const;

/**
 * Player-specific constants
 */
export const PLAYER = {
  DEFAULT_VOLUME: 0.7,
  PREV_TRACK_THRESHOLD: 3, // seconds before skipping back to start vs prev track
} as const;
