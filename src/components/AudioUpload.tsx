import React from 'react';
import { Music, X } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { event } from '@/utils/analytics';
import { useShallow } from 'zustand/react/shallow';

export const AudioUpload: React.FC = () => {
  const { musicFile, setMusicFile } = useProjectStore(
    useShallow((state) => ({
      musicFile: state.musicFile,
      setMusicFile: state.setMusicFile,
    })),
  );
  const [duration, setDuration] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'].includes(file.type)) {
      setError('Only MP3, WAV, and OGG files are supported');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('Audio file must be smaller than 100MB');
      return;
    }

    // Get audio duration
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
      setMusicFile(file);
      event({
        action: 'select_audio',
        category: 'media',
        label: file.type,
        value: file.size,
      });
    };
    audio.onerror = () => {
      setError('Could not load audio file');
    };
  };

  const handleRemove = () => {
    setMusicFile(null);
    setDuration(null);
    event({
      action: 'remove_audio',
      category: 'media',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-text-primary font-medium">Background Music</h3>

      {musicFile ? (
        <div className="bg-dark-surface border border-success/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-success" />
            <div>
              <p className="text-text-primary font-medium text-sm truncate">{musicFile.name}</p>
              {duration && <p className="text-text-secondary text-xs">{formatTime(duration)}</p>}
            </div>
          </div>
          <button onClick={handleRemove} className="p-1 hover:bg-dark-border rounded transition-colors" title="Remove audio">
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-dark-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors">
          <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
          <div className="flex flex-col items-center gap-2">
            <Music className="w-6 h-6 text-text-secondary" />
            <p className="text-text-primary text-sm">Click to add background music</p>
            <p className="text-text-secondary text-xs">MP3, WAV, OGG (max 100MB)</p>
          </div>
        </label>
      )}

      {error && <div className="text-error text-sm">{error}</div>}
    </div>
  );
};
