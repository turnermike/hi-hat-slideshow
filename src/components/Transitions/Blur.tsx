import React from 'react';
import { AbsoluteFill } from 'remotion';

interface BlurProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number; // 0-1
}

/**
 * Blur transition component
 * Blurs out the current image while fading in the next
 */
export const Blur: React.FC<BlurProps> = ({ from, to, progress }) => {
  const maxBlur = 20;
  const fromBlur = progress * maxBlur;
  const fromOpacity = 1 - progress;

  const toOpacity = progress;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `blur(${fromBlur}px)`,
          opacity: fromOpacity,
        }}
      >
        {from}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: toOpacity,
        }}
      >
        {to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
