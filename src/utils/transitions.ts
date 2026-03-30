import type { TransitionType } from '@/types';

const DEFAULT_FPS = 30;

/**
 * Calculate frame range for a specific slide
 */
export function calculateFrameRange(slideIndex: number, slideDurations: number[], transitionDurations: number[], fps: number = DEFAULT_FPS): { startFrame: number; endFrame: number; durationFrames: number } {
  let frame = 0;

  // Calculate frames for all previous slides + transitions
  for (let i = 0; i < slideIndex; i++) {
    frame += Math.round(slideDurations[i] * fps);
    if (i < transitionDurations.length) {
      frame += Math.round(transitionDurations[i] * fps);
    }
  }

  const startFrame = frame;
  const durationFrames = Math.round(slideDurations[slideIndex] * fps);
  const endFrame = startFrame + durationFrames;

  return { startFrame, endFrame, durationFrames };
}

/**
 * Calculate total video frames
 */
export function calculateTotalFrames(slideDurations: number[], transitionDurations: number[], fps: number = DEFAULT_FPS): number {
  const slidesFrames = slideDurations.reduce((sum, duration) => sum + Math.round(duration * fps), 0);
  const transitionsFrames = transitionDurations.reduce((sum, duration) => sum + Math.round(duration * fps), 0);
  return slidesFrames + transitionsFrames;
}

/**
 * Get transition configuration
 */
export interface TransitionConfig {
  duration: number; // in seconds
  easing?: string;
  [key: string]: any;
}

export function getTransitionConfig(type: TransitionType): TransitionConfig {
  const configs: Record<TransitionType, TransitionConfig> = {
    fade: {
      duration: 1,
      easing: 'easeInOut',
    },
    slide: {
      duration: 1,
      easing: 'easeInOut',
      direction: 'left',
    },
    zoom: {
      duration: 1,
      easing: 'easeInOut',
    },
    blur: {
      duration: 1,
      easing: 'easeInOut',
      maxBlur: 20,
    },
    wipe: {
      duration: 1,
      easing: 'linear',
      direction: 'left',
    },
    kenburns: {
      duration: 1,
      scale: 1.1,
      easing: 'easeInOut',
    },
  };

  return configs[type] || configs.fade;
}

/**
 * Validate transition durations
 */
export function validateTransitionDurations(durations: number[]): string[] {
  const errors: string[] = [];

  durations.forEach((duration, index) => {
    if (duration < 0.5) {
      errors.push(`Transition ${index} duration must be at least 0.5 seconds`);
    }
    if (duration > 2) {
      errors.push(`Transition ${index} duration must not exceed 2 seconds`);
    }
  });

  return errors;
}

/**
 * Validate slide durations
 */
export function validateSlideDurations(durations: number[]): string[] {
  const errors: string[] = [];

  durations.forEach((duration, index) => {
    if (duration < 1) {
      errors.push(`Slide ${index} duration must be at least 1 second`);
    }
    if (duration > 10) {
      errors.push(`Slide ${index} duration must not exceed 10 seconds`);
    }
  });

  return errors;
}

/**
 * Interpolate value between 0 and 1
 */
export function interpolate(progress: number, type: TransitionType): number {
  // Progress should be clamped between 0 and 1
  const p = Math.max(0, Math.min(1, progress));

  switch (type) {
    case 'fade':
      return p; // Linear fade

    case 'slide':
      // Ease-in-out cubic
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    case 'zoom':
      // Ease-out cubic
      return 1 - Math.pow(1 - p, 3);

    case 'blur':
      // Linear blur progression
      return p;

    case 'wipe':
      // Linear wipe
      return p;

    case 'kenburns':
      // Slow, smooth progression for Ken Burns effect
      return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

    default:
      return p;
  }
}

/**
 * Get easing function
 */
export function getEasingFunction(easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' = 'easeInOut'): (t: number) => number {
  switch (easing) {
    case 'linear':
      return (t) => t;

    case 'easeIn':
      return (t) => t * t * t; // Cubic ease-in

    case 'easeOut':
      return (t) => 1 - Math.pow(1 - t, 3); // Cubic ease-out

    case 'easeInOut':
    default:
      return (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  }
}
