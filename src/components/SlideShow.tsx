import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio } from 'remotion';
import type { ProjectState } from '@/types';
import { Fade } from './Transitions/Fade';
import { Slide } from './Transitions/Slide';
import { Zoom } from './Transitions/Zoom';
import { Blur } from './Transitions/Blur';
import { Wipe } from './Transitions/Wipe';
import { KenBurns } from './Transitions/KenBurns';

interface SlideShowProps {
  project: ProjectState;
}

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
      return <Slide from={from} to={to} progress={clampedProgress} direction={direction as any} />;
    case 'zoom':
      return <Zoom from={from} to={to} progress={clampedProgress} />;
    case 'blur':
      return <Blur from={from} to={to} progress={clampedProgress} />;
    case 'wipe':
      return <Wipe from={from} to={to} progress={clampedProgress} direction={direction as any} />;
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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (project.images.length === 0) {
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
  for (let i = 0; i < project.images.length; i++) {
    const slideFrames = Math.round(project.slideDurations[i] * fps);
    const transitionFrames = i < project.transitionDurations.length ? Math.round(project.transitionDurations[i] * fps) : 0;

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
  let currentSlide = slides.find((s) => frame >= s.startFrame && frame < s.endFrame);
  let currentTransition = slides.find((s) => s.transitionStart !== undefined && s.transitionEnd !== undefined && frame >= s.transitionStart && frame < s.transitionEnd);

  // Determine which content is showing
  const renderContent = () => {
    // During transition
    if (currentTransition && currentTransition.nextImageIndex !== undefined && currentTransition.nextImageIndex < project.images.length) {
      const transitionStart = currentTransition.transitionStart || 0;
      const transitionEnd = currentTransition.transitionEnd || transitionStart + 1;
      const transitionProgress = (frame - transitionStart) / (transitionEnd - transitionStart);
      const fromImage = project.images[currentTransition.imageIndex];
      const toImage = project.images[currentTransition.nextImageIndex];

      return <TransitionWrapper type={project.transitions[currentTransition.imageIndex] || 'fade'} progress={transitionProgress} from={<ImageSlide url={fromImage.url} applyKenBurns={currentTransition.imageIndex > 0} slideProgress={1} />} to={<ImageSlide url={toImage.url} applyKenBurns={true} slideProgress={0} />} />;
    }

    // During slide
    if (currentSlide) {
      const slideProgress = (frame - currentSlide.startFrame) / (currentSlide.endFrame - currentSlide.startFrame);
      const image = project.images[currentSlide.imageIndex];

      return <ImageSlide url={image.url} applyKenBurns={project.transitions[currentSlide.imageIndex] === 'kenburns'} slideProgress={slideProgress} />;
    }

    // Fallback
    return <AbsoluteFill style={{ background: '#000' }} />;
  };

  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {renderContent()}

      {/* Captions */}
      {currentSlide && project.captions[currentSlide.imageIndex] && (
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '40px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          }}
        >
          <div
            style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: 'bold',
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            {project.captions[currentSlide.imageIndex]}
          </div>
        </AbsoluteFill>
      )}

      {/* Audio */}
      {project.musicFile && <Audio src={URL.createObjectURL(project.musicFile)} volume={1} />}
    </AbsoluteFill>
  );
};
