import React from 'react';
import { AbsoluteFill } from 'remotion';

interface ZoomProps {
  from: React.ReactNode;
  to: React.ReactNode;
  progress: number; // 0-1
}

/**
 * Zoom transition component
 * Zooms out from the current image while zooming in the next
 */
export const Zoom: React.FC<ZoomProps> = ({ from, to, progress }) => {
  // Smooth easing for scale
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easedProgress = easeOutCubic(progress);

  const fromScale = 1 - easedProgress * 0.2;
  const fromOpacity = 1 - progress;

  const toScale = 0.8 + easedProgress * 0.2;
  const toOpacity = progress;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${fromScale})`,
          opacity: fromOpacity,
          transformOrigin: 'center center',
        }}
      >
        {from}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: `scale(${toScale})`,
          opacity: toOpacity,
          transformOrigin: 'center center',
        }}
      >
        {to}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
