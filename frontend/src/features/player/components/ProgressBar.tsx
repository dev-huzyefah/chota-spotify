import './ProgressBar.css';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="progress-bar">
      <span className="progress-bar__time">{formatTime(currentTime)}</span>
      
      <input
        type="range"
        className="progress-bar__input"
        min={0}
        max={duration || 0}
        value={currentTime || 0}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{ '--progress': `${progressPct}%` } as any}
        id="progress-bar-input"
        aria-label="Progress bar"
      />

      <span className="progress-bar__time">{formatTime(duration)}</span>
    </div>
  );
}

