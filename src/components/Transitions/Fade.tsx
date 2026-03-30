import React from 'react';
import { AbsoluteFill } from 'remotion';

interface TransitionProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number; // 0-1
}

/**
 * Fade transition component
 * Smoothly fades from one image to another
 */
export const Fade: React.FC<TransitionProps> = ({ from, to, progress }) => {
  const fromOpacity = 1 - progress;
  const toOpacity = progress;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fromOpacity }}>{from}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: toOpacity }}>{to}</AbsoluteFill>
    </AbsoluteFill>
  );
};
