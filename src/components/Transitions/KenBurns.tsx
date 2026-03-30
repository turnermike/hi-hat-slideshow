import React from 'react';
import { AbsoluteFill } from 'remotion';

interface KenBurnsProps {
  children: React.ReactNode;
  progress: number; // 0-1 over the slide duration
  zoomAmount?: number; // 1.1 = 10% zoom
}

/**
 * Ken Burns effect component
 * Applies a slow zoom and subtle pan effect to a slide
 */
export const KenBurns: React.FC<KenBurnsProps> = ({ children, progress, zoomAmount = 1.1 }) => {
  // Use smooth easing for the Ken Burns effect
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easedProgress = easeInOutCubic(progress);

  // Scale from 1 to zoom amount
  const scale = 1 + (zoomAmount - 1) * easedProgress;

  // Subtle pan effect: move in X and Y
  const panX = (easedProgress - 0.5) * 10; // -5% to 5%
  const panY = (easedProgress - 0.5) * 10; // -5% to 5%

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
