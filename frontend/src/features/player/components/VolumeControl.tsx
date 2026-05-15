import {
  PiSpeakerHighBold,
  PiSpeakerLowBold,
  PiSpeakerXBold,
} from 'react-icons/pi';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const currentVolume = isMuted ? 0 : volume;
  const volumePct = currentVolume * 100;

  const VolumeIcon = isMuted || volume === 0
    ? PiSpeakerXBold
    : volume < 0.5
      ? PiSpeakerLowBold
      : PiSpeakerHighBold;

  return (
    <div className="volume-control">
      <button
        className="volume-control__btn"
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        id="volume-mute-toggle"
      >
        <VolumeIcon size={20} />
      </button>
      
      <input
        type="range"
        className="volume-control__input"
        min={0}
        max={1}
        step={0.01}
        value={currentVolume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        style={{ '--progress': `${volumePct}%` } as any}
        id="volume-input"
        aria-label="Volume level"
      />
    </div>
  );
}
