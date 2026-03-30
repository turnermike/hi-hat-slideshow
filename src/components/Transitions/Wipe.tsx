import React from 'react';
import { AbsoluteFill } from 'remotion';

interface WipeProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number; // 0-1
  direction?: 'left' | 'right' | 'up' | 'down';
}

/**
 * Wipe transition component
 * Wipes from one image to another using clip-path
 */
export const Wipe: React.FC<WipeProps> = ({ from, to, progress, direction = 'left' }) => {
  const getRectClipPath = (direction: string, percentage: number) => {
    switch (direction) {
      case 'right':
        return `inset(0 ${100 - percentage}% 0 0)`;
      case 'left':
        return `inset(0 0 0 ${100 - percentage}%)`;
      case 'down':
        return `inset(${100 - percentage}% 0 0 0)`;
      case 'up':
      default:
        return `inset(0 0 ${100 - percentage}% 0)`;
    }
  };

  const toClipPath = getRectClipPath(direction, progress * 100);
  const fromOpacity = 1 - progress * 0.3;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fromOpacity }}>{from}</AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: toClipPath,
        }}
      >
        {to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
