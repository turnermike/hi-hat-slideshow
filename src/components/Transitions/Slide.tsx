import React from 'react';
import { AbsoluteFill } from 'remotion';

interface SlideProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number; // 0-1
  direction?: 'left' | 'right' | 'up' | 'down';
}

/**
 * Slide transition component
 * Slides from one image to another in the specified direction
 */
export const Slide: React.FC<SlideProps> = ({ from, to, progress, direction = 'left' }) => {
  const getTransform = (direction: string, offset: number) => {
    switch (direction) {
      case 'right':
        return `translateX(${offset * 100}%)`;
      case 'left':
        return `translateX(${-offset * 100}%)`;
      case 'down':
        return `translateY(${-offset * 100}%)`;
      case 'up':
      default:
        return `translateY(${offset * 100}%)`;
    }
  };

  const fromTransform = getTransform(direction, progress);
  const toTransform = getTransform(direction, 1 - progress);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: fromTransform,
          opacity: 1 - progress * 0.2,
        }}
      >
        {from}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: toTransform,
          opacity: Math.min(1, progress * 2),
        }}
      >
        {to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
