import React, { useRef } from 'react';
import { Player } from '@remotion/player';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { event } from '@/utils/analytics';
import { SlideShow } from './SlideShow';
import { calculateTotalFrames } from '@/utils/transitions';
import { Comment } from '@/components/Comment';

export const VideoPreview: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const project = useProjectStore(
    useShallow((state) => ({
      images: state.images,
      transitions: state.transitions,
      slideDurations: state.slideDurations,
      transitionDurations: state.transitionDurations,
      captions: state.captions,
      captionColors: state.captionColors,
      musicFile: state.musicFile,
      exportSettings: state.exportSettings,
      aspectRatio: state.aspectRatio,
      selectedTemplate: state.selectedTemplate,
    })),
  );

  const totalFrames = calculateTotalFrames(project.slideDurations, project.transitionDurations, 30);
  const currentTime = (progress / totalFrames) * (project.slideDurations.reduce((a, b) => a + b, 0) + project.transitionDurations.reduce((a, b) => a + b, 0));
  const totalTime = project.slideDurations.reduce((a, b) => a + b, 0) + project.transitionDurations.reduce((a, b) => a + b, 0);

  const getVideoResolution = () => {
    const baseResolutions = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 },
    };

    let baseRes = baseResolutions['1080p'];

    if (project.aspectRatio === '9:16') {
      return { width: Math.round(baseRes.height * 0.5625), height: baseRes.height };
    } else if (project.aspectRatio === '1:1') {
      return { width: 1080, height: 1080 };
    }

    return baseRes;
  };

  const resolution = getVideoResolution();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (project.images.length === 0) {
    return (
      <div className="w-full bg-dark-surface rounded-lg border border-dark-border p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-text-secondary">Upload images to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full bg-dark-surface rounded-lg border border-dark-border overflow-hidden">
        <div style={{ aspectRatio: resolution.width / resolution.height }}>
          <Player
            ref={playerRef}
            component={SlideShow}
            durationInFrames={totalFrames}
            fps={30}
            compositionWidth={resolution.width}
            compositionHeight={resolution.height}
            style={{
              width: '100%',
              height: '100%',
            }}
            inputProps={{
              project: project,
            }}
            controls
            autoPlay={false}
            loop={false}
            allowFullscreen
            doubleClickToFullscreen
          />
        </div>
      </div>

      <Comment text="Player Controls" />
      <div className="flex items-center gap-3 bg-dark-surface rounded-lg border border-dark-border p-3">
        <button
          onClick={() => {
            if (playerRef.current) {
              if (isPlaying) {
                playerRef.current.pause();
                event({ action: 'pause_preview', category: 'engagement' });
              } else {
                playerRef.current.play();
                event({ action: 'play_preview', category: 'engagement' });
              }
              setIsPlaying(!isPlaying);
            }
          }}
          className="p-2 hover:bg-dark-border rounded transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5 text-primary" /> : <Play className="w-5 h-5 text-primary" />}
        </button>

        <button
          onClick={() => {
            setIsMuted(!isMuted);
            event({
              action: isMuted ? 'unmute_preview' : 'mute_preview',
              category: 'engagement',
            });
          }}
          className="p-2 hover:bg-dark-border rounded transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-text-secondary" /> : <Volume2 className="w-5 h-5 text-primary" />}
        </button>

        {/* Timeline scrubber */}
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={totalFrames}
            value={progress}
            aria-label="Preview scrubber"
            onChange={(e) => {
              const newProgress = Number(e.target.value);
              setProgress(newProgress);
              if (playerRef.current) {
                playerRef.current.seekToFrame(newProgress);
              }
            }}
            className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Time display */}
        <div className="text-text-secondary text-sm font-mono">
          {formatTime(currentTime)} / {formatTime(totalTime)}
        </div>

        <button
          onClick={() => {
            if (playerRef.current) {
              playerRef.current.toggleFullscreen();
              event({ action: 'preview_fullscreen', category: 'engagement' });
            }
          }}
          className="p-2 hover:bg-dark-border rounded transition-colors"
          title="Fullscreen"
        >
          <Maximize className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Video info */}
      <div className="text-text-secondary text-sm">
        <p>
          Resolution: {resolution.width}×{resolution.height} | Duration: {formatTime(totalTime)}
        </p>
      </div>
    </div>
  );
};
