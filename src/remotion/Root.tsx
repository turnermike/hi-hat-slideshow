import React from 'react';
import { Composition } from 'remotion';
import { SlideShow } from '../components/SlideShow';
import { initialProjectState } from '../types';
import { calculateTotalFrames } from '../utils/transitions';

const FALLBACK_FPS = 30;
const defaultDurationInFrames = calculateTotalFrames(initialProjectState.slideDurations, initialProjectState.transitionDurations, FALLBACK_FPS) || FALLBACK_FPS;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SlideShow"
      component={SlideShow}
      durationInFrames={defaultDurationInFrames}
      fps={FALLBACK_FPS}
      width={1920}
      height={1080}
      defaultProps={{
        project: initialProjectState,
      }}
    />
  );
};
