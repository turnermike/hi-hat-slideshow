import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio } from 'remotion';
import type { SlideDirection } from '@/types';
import { Fade } from './Transitions/Fade';
import { Slide } from './Transitions/Slide';
import { Zoom } from './Transitions/Zoom';
import { Blur } from './Transitions/Blur';
import { Wipe } from './Transitions/Wipe';
import { KenBurns } from './Transitions/KenBurns';

interface SlideShowProps {
  project?: RenderProject;
}

interface RenderProject {
  images: Array<{ url: string }>;
  transitions: string[];
  slideDurations: number[];
  transitionDurations: number[];
  captions: string[];
  captionColors: string[];
  musicFile?: File | null;
  musicUrl?: string | null;
}

const safeDirection = (direction?: string): SlideDirection => {
  if (direction === 'right' || direction === 'up' || direction === 'down') {
    return direction;
  }
  return 'left';
};

const TransitionWrapper: React.FC<{
  type: string;
  direction?: string;
  progress: number;
  from: React.ReactNode;
  to: React.ReactNode;
}> = ({ type, direction, progress, from, to }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  switch (type) {
    case 'slide':
      return <Slide from={from} to={to} progress={clampedProgress} direction={safeDirection(direction)} />;
    case 'zoom':
      return <Zoom from={from} to={to} progress={clampedProgress} />;
    case 'blur':
      return <Blur from={from} to={to} progress={clampedProgress} />;
    case 'wipe':
      return <Wipe from={from} to={to} progress={clampedProgress} direction={safeDirection(direction)} />;
    case 'fade':
    default:
      return <Fade from={from} to={to} progress={clampedProgress} />;
  }
};

const ImageSlide: React.FC<{ url: string; applyKenBurns: boolean; slideProgress: number }> = ({ url, applyKenBurns, slideProgress }) => {
  const KBContent = (
    <img
      src={url}
      alt="Slide"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {applyKenBurns ? (
        <KenBurns progress={slideProgress} zoomAmount={1.1}>
          {KBContent}
        </KenBurns>
      ) : (
        KBContent
      )}
    </AbsoluteFill>
  );
};

export const SlideShow: React.FC<SlideShowProps> = ({ project }) => {
  const safeProject = project ?? { images: [], transitions: [], slideDurations: [], transitionDurations: [], captions: [], captionColors: [], musicFile: null, musicUrl: null };
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hasKenBurns = (index: number) => safeProject.transitions[index] === 'kenburns';
  const audioUrl = React.useMemo(() => {
    if (safeProject.musicUrl) return safeProject.musicUrl;
    if (typeof File !== 'undefined' && safeProject.musicFile instanceof File) {
      return URL.createObjectURL(safeProject.musicFile);
    }
    return null;
  }, [safeProject.musicFile, safeProject.musicUrl]);

  React.useEffect(() => {
    if (!audioUrl || safeProject.musicUrl) return;
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, safeProject.musicUrl]);

  if (safeProject.images.length === 0) {
    return (
      <AbsoluteFill style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: 24 }}>No images to display</div>
      </AbsoluteFill>
    );
  }

  let currentFrame = 0;
  const slides: {
    startFrame: number;
    endFrame: number;
    imageIndex: number;
    transitionStart?: number;
    transitionEnd?: number;
    nextImageIndex?: number;
  }[] = [];

  // Calculate frame ranges for all slides
  for (let i = 0; i < safeProject.images.length; i++) {
    const slideFrames = Math.round(safeProject.slideDurations[i] * fps);
    const transitionFrames = i < safeProject.transitionDurations.length ? Math.round(safeProject.transitionDurations[i] * fps) : 0;

    slides.push({
      startFrame: currentFrame,
      endFrame: currentFrame + slideFrames,
      imageIndex: i,
      transitionStart: currentFrame + slideFrames,
      transitionEnd: currentFrame + slideFrames + transitionFrames,
      nextImageIndex: i + 1,
    });

    currentFrame += slideFrames + transitionFrames;
  }

  // Find current slide and transition
  const currentSlide = slides.find((s) => frame >= s.startFrame && frame < s.endFrame);
  const currentTransition = slides.find((s) => s.transitionStart !== undefined && s.transitionEnd !== undefined && frame >= s.transitionStart && frame < s.transitionEnd);

  // Determine which content is showing
  const renderContent = () => {
    // During transition
    if (currentTransition && currentTransition.nextImageIndex !== undefined && currentTransition.nextImageIndex < safeProject.images.length) {
      const transitionStart = currentTransition.transitionStart || 0;
      const transitionEnd = currentTransition.transitionEnd || transitionStart + 1;
      const transitionProgress = (frame - transitionStart) / (transitionEnd - transitionStart);
      const fromImage = safeProject.images[currentTransition.imageIndex];
      const toImage = safeProject.images[currentTransition.nextImageIndex];

      return (
        <TransitionWrapper
          type={safeProject.transitions[currentTransition.imageIndex] || 'fade'}
          progress={transitionProgress}
          from={<ImageSlide url={fromImage.url} applyKenBurns={hasKenBurns(currentTransition.imageIndex)} slideProgress={1} />}
          to={<ImageSlide url={toImage.url} applyKenBurns={hasKenBurns(currentTransition.nextImageIndex)} slideProgress={0} />}
        />
      );
    }

    // During slide
    if (currentSlide) {
      const slideProgress = (frame - currentSlide.startFrame) / (currentSlide.endFrame - currentSlide.startFrame);
      const image = safeProject.images[currentSlide.imageIndex];

      return <ImageSlide url={image.url} applyKenBurns={hasKenBurns(currentSlide.imageIndex)} slideProgress={slideProgress} />;
    }

    // Fallback
    return <AbsoluteFill style={{ background: '#000' }} />;
  };

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {renderContent()}

      {/* Captions */}
      {(() => {
        const activeCaptionIndex = currentSlide?.imageIndex ?? currentTransition?.imageIndex;
        if (activeCaptionIndex === undefined || !safeProject.captions[activeCaptionIndex]) {
          return null;
        }

        return (
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: '80px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            }}
          >
            <div
              style={{
                color: safeProject.captionColors[activeCaptionIndex] || '#fff',
                fontSize: 31,
                fontWeight: 'bold',
                textAlign: 'center',
                maxWidth: '90%',
                fontFamily: '"Onest", sans-serif',
              }}
            >
              {safeProject.captions[activeCaptionIndex]}
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* Audio */}
      {audioUrl && <Audio src={audioUrl} volume={1} />}
    </AbsoluteFill>
  );
};
