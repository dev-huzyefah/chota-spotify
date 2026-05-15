import {
  PiPlayFill,
  PiPauseFill,
  PiSkipForwardFill,
  PiSkipBackFill,
} from 'react-icons/pi';
import { usePlayer } from '../hooks/usePlayer';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import './PlayerBar.css';

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();



  if (!currentSong) {
    return (
      <div className="player-bar player-bar--empty" id="player-bar">
        <span className="player-bar__empty-text">Select a song to start listening</span>
      </div>
    );
  }

  return (
    <div className="player-bar" id="player-bar">
      {/* Song Info */}
      <div className="player-bar__song">
        <img
          className="player-bar__cover"
          src={currentSong.coverUrl}
          alt={currentSong.album}
        />
        <div className="player-bar__song-info">
          <span className="player-bar__song-title">{currentSong.title}</span>
          <span className="player-bar__song-artist">{currentSong.artist}</span>
        </div>
      </div>

      {/* Center Controls */}
      <div className="player-bar__center">
        <div className="player-bar__controls">
          <button
            className="player-bar__control-btn player-bar__control-btn--prev"
            onClick={prevTrack}
            title="Previous"
            aria-label="Previous track"
            id="player-prev"
          >
            <PiSkipBackFill size={20} />
          </button>

          <button
            className="player-bar__play-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            id="player-play-toggle"
          >
            {isPlaying ? <PiPauseFill size={18} /> : <PiPlayFill size={18} />}
          </button>

          <button
            className="player-bar__control-btn player-bar__control-btn--next"
            onClick={nextTrack}
            title="Next"
            aria-label="Next track"
            id="player-next"
          >
            <PiSkipForwardFill size={20} />
          </button>
        </div>

        {/* Progress Bar Component */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
      </div>

      {/* Volume Control Component */}
      <div className="player-bar__right">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />
      </div>
    </div>
  );
}
