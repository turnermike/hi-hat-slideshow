import { describe, it, expect } from 'vitest';
import { calculateFrameRange, calculateTotalFrames, getTransitionConfig, validateTransitionDurations, validateSlideDurations, interpolate, getEasingFunction } from './transitions';

describe('transitions.ts', () => {
  describe('calculateFrameRange', () => {
    it('should calculate correct frame range for first slide', () => {
      const result = calculateFrameRange(0, [3, 3], [1, 1], 30);
      expect(result.startFrame).toBe(0);
      expect(result.durationFrames).toBe(90); // 3 seconds * 30 fps
      expect(result.endFrame).toBe(90);
    });

    it('should calculate correct frame range for second slide', () => {
      const result = calculateFrameRange(1, [3, 3], [1, 1], 30);
      // First slide: 90 frames, transition: 30 frames
      expect(result.startFrame).toBe(120); // 90 + 30
      expect(result.durationFrames).toBe(90);
      expect(result.endFrame).toBe(210);
    });

    it('should handle 24 fps correctly', () => {
      const result = calculateFrameRange(0, [3], [1], 24);
      expect(result.durationFrames).toBe(72); // 3 * 24
    });

    it('should handle 60 fps correctly', () => {
      const result = calculateFrameRange(0, [3], [1], 60);
      expect(result.durationFrames).toBe(180); // 3 * 60
    });
  });

  describe('calculateTotalFrames', () => {
    it('should calculate correct total frames', () => {
      const slideDurations = [3, 3, 3];
      const transitionDurations = [1, 1, 1];
      const total = calculateTotalFrames(slideDurations, transitionDurations, 30);
      // 9 seconds of slides * 30 + 3 seconds of transitions * 30 = 360
      expect(total).toBe(360);
    });

    it('should handle single slide', () => {
      const total = calculateTotalFrames([3], [], 30);
      expect(total).toBe(90);
    });

    it('should handle empty arrays', () => {
      const total = calculateTotalFrames([], [], 30);
      expect(total).toBe(0);
    });
  });

  describe('getTransitionConfig', () => {
    it('should return fade config', () => {
      const config = getTransitionConfig('fade');
      expect(config.duration).toBe(1);
      expect(config.easing).toBe('easeInOut');
    });

    it('should return slide config with direction', () => {
      const config = getTransitionConfig('slide');
      expect(config.duration).toBe(1);
      expect(config.direction).toBe('left');
    });

    it('should return blur config with maxBlur', () => {
      const config = getTransitionConfig('blur');
      expect(config.maxBlur).toBe(20);
    });

    it('should return kenburns config', () => {
      const config = getTransitionConfig('kenburns');
      expect(config.scale).toBe(1.1);
    });
  });

  describe('validateTransitionDurations', () => {
    it('should validate valid durations', () => {
      const errors = validateTransitionDurations([1, 1.5, 2]);
      expect(errors.length).toBe(0);
    });

    it('should error on duration too short', () => {
      const errors = validateTransitionDurations([0.3]);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('0.5');
    });

    it('should error on duration too long', () => {
      const errors = validateTransitionDurations([2.5]);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('2');
    });

    it('should validate multiple errors', () => {
      const errors = validateTransitionDurations([0.2, 3]);
      expect(errors.length).toBe(2);
    });
  });

  describe('validateSlideDurations', () => {
    it('should validate valid durations', () => {
      const errors = validateSlideDurations([1, 5, 10]);
      expect(errors.length).toBe(0);
    });

    it('should error on duration too short', () => {
      const errors = validateSlideDurations([0.5]);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('1');
    });

    it('should error on duration too long', () => {
      const errors = validateSlideDurations([11]);
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('10');
    });
  });

  describe('interpolate', () => {
    it('should linearly interpolate fade', () => {
      expect(interpolate(0, 'fade')).toBe(0);
      expect(interpolate(0.5, 'fade')).toBe(0.5);
      expect(interpolate(1, 'fade')).toBe(1);
    });

    it('should handle clamping', () => {
      expect(interpolate(-0.5, 'fade')).toBe(0);
      expect(interpolate(1.5, 'fade')).toBe(1);
    });

    it('should interpolate all transition types', () => {
      const types: const[] = ['fade', 'slide', 'zoom', 'blur', 'wipe', 'kenburns'];
      types.forEach((type) => {
        const value = interpolate(0.5, type);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('getEasingFunction', () => {
    it('should return linear function', () => {
      const fn = getEasingFunction('linear');
      expect(fn(0)).toBe(0);
      expect(fn(0.5)).toBe(0.5);
      expect(fn(1)).toBe(1);
    });

    it('should return easeIn cubic', () => {
      const fn = getEasingFunction('easeIn');
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      expect(fn(0.5)).toBeLessThan(0.5); // easeIn means slower start
    });

    it('should return easeOut cubic', () => {
      const fn = getEasingFunction('easeOut');
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      expect(fn(0.5)).toBeGreaterThan(0.5); // easeOut means faster end
    });
  });
});
