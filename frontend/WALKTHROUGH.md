# Spotify - Spotify Clone Walkthrough

Welcome to Spotify! This is a fully functional music player web application built with React, TypeScript, and modern web technologies.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Key Features](#key-features)
4. [User Guide](#user-guide)
5. [Architecture Overview](#architecture-overview)

---

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation & Setup

```bash
# Navigate to the project directory
cd react-proj

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── features/                 # Feature modules
│   ├── auth/                # Authentication
│   │   ├── components/      # LoginForm, SignupForm
│   │   ├── hooks/          # useAuth
│   │   ├── services/       # authAPI
│   │   ├── store/          # authStore
│   │   └── types/          # authTypes
│   ├── home/               # Home/Discovery page
│   │   └── components/     # HomePage
│   ├── player/             # Music player
│   │   ├── components/     # PlayerBar, ProgressBar, VolumeControl
│   │   ├── hooks/          # usePlayer, useKeyboardShortcuts
│   │   ├── store/          # playerStore
│   │   └── types/          # playerTypes
│   ├── playlists/          # Playlist management
│   │   ├── components/     # PlaylistPage, CreatePlaylistPage
│   │   ├── hooks/          # usePlaylist
│   │   └── store/          # playlistStore
│   └── search/             # Search functionality
│       └── components/     # SearchPage
├── shared/                  # Shared components & utilities
│   ├── components/         # Reusable components
│   ├── data/              # Mock data (songs.json)
│   ├── hooks/             # useLocalStorage
│   └── types/             # TypeScript interfaces
└── App.tsx                # Main app component with routing
```

---

## Key Features

### 🔐 Authentication

- **Login**: Sign in with email and password
- **Signup**: Create a new account
- **Protected Routes**: Only authenticated users can access the app
- **Persistent Sessions**: Stay logged in across browser sessions

### 🎵 Music Player

- **Play/Pause**: Control playback with intuitive controls
- **Previous/Next**: Navigate through songs in a queue
- **Progress Bar**: Seek to any point in the song
- **Volume Control**: Adjust volume with mute toggle
- **Playing Indicator**: Visual indicator shows currently playing song
- **Smart Queue**: Context-aware playlists when playing

### 🏠 Home Page

- **Personalized Greeting**: Changes based on time of day
- **Featured Playlists**: Curated playlists with album art
- **Recently Played**: Quick access to your most recent songs
- **Browse All Songs**: Complete music library listing

### 🔍 Search

- **Live Search**: Real-time filtering as you type
- **Filter Chips**: Search by:
  - All (title, artist, or album)
  - Title
  - Artist
  - Album
- **Instant Results**: See results as you search

### 📋 Playlists

- **View Playlists**: Access all your playlists in the sidebar
- **Featured Playlists**: Special curated playlists (read-only)
- **Create Playlist**: Add custom playlists with names and descriptions
- **Manage Songs**:
  - Add songs to playlists via modal browser
  - Remove songs with one click
  - View full playlist details
- **Play Playlists**: Play all songs or individual songs from any playlist

### ⏯️ Playback Controls

- **Keyboard Shortcuts**:
  - Space = Play/Pause
  - → = Next track
  - ← = Previous track
  - ↑ = Volume up
  - ↓ = Volume down
- **Click to Play**: Click any song to start playing
- **Album Info**: See cover art, title, and artist in the player

### 📱 Responsive Design

- **Desktop**: Full-featured experience with sidebar
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with mobile menu toggle

---

## User Guide

### First Time Setup

1. **Sign Up**
   - Click "Sign Up" on the login page
   - Enter your name, email, and password
   - Click "Create Account"

2. **Login**
   - Enter your credentials
   - Click "Sign In"
   - You'll be redirected to the home page

### Playing Music

1. **From Home Page**
   - Browse "Featured Playlists" or "All Songs"
   - Click any song to start playing
   - Use controls at the bottom to manage playback

2. **From Search**
   - Click "Search" in the sidebar
   - Type to find songs by title, artist, or album
   - Click chips to filter results
   - Click any song to play

3. **From Playlists**
   - Click a playlist in "Your Library" section
   - View all songs in the playlist
   - Click "Play All" to play the entire playlist
   - Click individual songs to start from that song

### Managing Playlists

1. **Create New Playlist**
   - Click "New Playlist" button in sidebar
   - Enter name and optional description
   - Click "Create"
   - You'll enter the empty playlist

2. **Add Songs to Playlist**
   - Open the playlist
   - Click "Add Songs" button
   - Browse available songs
   - Click the "Add" button next to songs
   - Close the modal when done

3. **Remove Songs from Playlist**
   - Open the playlist
   - Click the minus icon (−) on any song
   - Song is immediately removed

4. **Delete Playlist**
   - Open your playlist
   - Click "Delete" button
   - Playlist is removed (cannot be undone)

### Player Controls

**Bottom Player Bar:**

- **Left Section**: Current song cover, title, and artist
- **Center Section**:
  - Skip back / Play-Pause / Skip forward buttons
  - Progress bar with current time / total time
- **Right Section**:
  - Volume icon showing current level
  - Volume slider

**Keyboard Shortcuts:**

- `Space` - Toggle play/pause
- `→` - Next track
- `←` - Previous track
- `↑` - Increase volume
- `↓` - Decrease volume

### Featured Playlists

Pre-curated playlists available in the sidebar:

- **Late Night Drives** - Atmospheric tracks for midnight journeys
- **Digital Sunrise** - Electronic beats to start your day
- **Acoustic Warmth** - Gentle folk and indie for rainy afternoons
- **Dreamscape** - Ethereal sounds for deep focus

Click any featured playlist to browse and play songs.

---

## Architecture Overview

### State Management

**Context API + React Hooks** pattern for state management:

1. **AuthProvider** - User authentication state
   - Current user info
   - Login/Signup/Logout functions
   - Protected route guards

2. **PlayerProvider** - Music playback state
   - Current song playing
   - Queue management
   - Play/pause state
   - Progress and duration
   - Volume control
   - Keyboard shortcuts

3. **PlaylistProvider** - Playlist management
   - User playlists list
   - Create/Delete/Add-to playlists
   - Persistent storage via localStorage

### Data Flow

```
URL Route
    ↓
App.tsx (Route matching)
    ↓
Feature Component (HomePage, SearchPage, etc.)
    ↓
useAuth/usePlayer/usePlaylist hooks
    ↓
Context Stores
    ↓
Shared Components (SongRow, PlaylistCard, etc.)
```

### Storage

- **localStorage** - Persistent data:
  - User authentication tokens
  - User playlists and songs
  - Recently played songs history
  - Player volume preference

### Styling

- **CSS Variables** - Centralized design system
  - Colors (primary, accent, surfaces)
  - Typography (font family, sizes)
  - Spacing (consistent gap values)
  - Transitions and animations
- **BEM Naming** - Block-Element-Modifier convention
- **Responsive Media Queries** - Mobile-first approach

### Component Hierarchy

```
Layout
├── Sidebar
│   ├── Navigation Links
│   ├── Featured Playlists
│   ├── Your Library (Playlists)
│   └── User Profile
├── Main Content Area
│   └── Feature Routes
│       ├── HomePage
│       ├── SearchPage
│       ├── PlaylistPage
│       └── CreatePlaylistPage
└── PlayerBar
    ├── Song Info
    ├── Player Controls
    ├── ProgressBar
    └── VolumeControl
```

---

## Development Workflow

### Adding a New Feature

1. **Create Feature Folder** under `src/features/`
2. **Organize by Pattern**:
   - `components/` - Feature UI components
   - `hooks/` - Custom hooks if needed
   - `store/` - Context/state if needed
   - `types/` - TypeScript interfaces
3. **Export Barrel** - Create `index.tsx` with exports
4. **Wire Routes** - Add route in `App.tsx`
5. **Style** - Add component CSS files

### Code Standards

- **TypeScript** - All code fully typed
- **Functional Components** - Use React hooks
- **Custom Hooks** - Reuse logic across components
- **Props Interfaces** - Document component APIs
- **Accessibility** - ARIA labels and semantic HTML
- **Mobile First** - Responsive design patterns

### Testing

Run the dev server and manually test:

1. Authentication flow
2. Music playback in different scenarios
3. Playlist management operations
4. Search functionality
5. Mobile responsiveness

---

## Troubleshooting

### Songs Not Playing

- Check browser console for errors
- Verify audio URLs in `songs.json` are accessible
- Check browser autplay policy (may require user interaction)

### Playlists Not Persisting

- Check if localStorage is enabled
- Clear browser cache and try again
- Check browser DevTools > Application > Local Storage

### Styles Not Applied

- Clear browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
- Restart dev server

### Routes Not Working

- Verify route paths in `App.tsx`
- Check URL format in browser address bar
- Ensure `BrowserRouter` is wrapping the app in `main.tsx`

---

## Browser Compatibility

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support (iOS 14+)
- **Mobile Browsers** - Good support with responsive design

---

## Performance Tips

- **Lazy Loading** - Playlists loaded on demand
- **Memoization** - Components use useMemo for expensive operations
- **Event Delegation** - Efficient event handling
- **CSS Variables** - Reduced CSS file size via theming

---

## Future Enhancements

Potential features to add:

- Dark/Light theme toggle
- User preferences (shuffle, repeat modes)
- Collaborative playlists
- Song ratings and favorites
- Offline play support
- Advanced search filters
- Playlist sharing
- Social features

---

## Credits

Built with:

- React 18
- TypeScript 5
- React Router v6
- react-icons
- uuid
- Vite

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review component documentation in code comments
3. Check browser console for error messages
4. Review recent changes in git history

---

Happy listening! 🎵
