import { useEffect, useCallback } from 'react';
import { usePlayer } from './usePlayer';

export function useKeyboardShortcuts() {
  const { togglePlay, setVolume, volume, seek, currentTime } = usePlayer();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
        break;
      case 'ArrowRight':
        e.preventDefault();
        seek(currentTime + 5);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
        break;
    }
  }, [togglePlay, setVolume, volume, seek, currentTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
