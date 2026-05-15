import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/features/player/components/PlayerBar';
import { useKeyboardShortcuts } from '@/features/player/hooks/useKeyboardShortcuts';
import './Layout.css';

export function Layout() {
  useKeyboardShortcuts();

  return (
    <div className="layout" id="app-layout">
      <Sidebar />
      <div className="layout__content">
        <main className="layout__main">
          <Outlet />
        </main>
        <PlayerBar />
      </div>
    </div>
  );
}
