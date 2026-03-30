import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProjectStore } from './projectStore';
import type { TransitionType } from '../types';

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = () => 'blob:mock-url';
global.URL.revokeObjectURL = () => {};

describe('projectStore.ts', () => {
  beforeEach(() => {
    useProjectStore.setState({
      images: [],
      transitions: [],
      transitionDurations: [],
      slideDurations: [],
      captions: [],
      musicFile: null,
      aspectRatio: '16:9',
      selectedTemplate: null,
      selectedSlideIndex: 0,
      isExporting: false,
      exportProgress: 0,
      exportError: null,
      exportSettings: {
        resolution: '1080p',
        format: 'mp4',
        quality: 'high',
        fps: 30,
      },
    });
  });

  describe('Image management', () => {
    it('should add images', () => {
      const { result } = renderHook(() => useProjectStore());
      const file = new File(['test'], 'image.png', { type: 'image/png' });
      act(() => {
        result.current.addImages([file]);
      });
      expect(result.current.images.length).toBe(1);
    });
  });

  describe('Transition management', () => {
    it('should update transition', () => {
      const { result } = renderHook(() => useProjectStore());
      const file = new File(['test'], 'image.png', { type: 'image/png' });
      act(() => {
        result.current.addImages([file]);
        result.current.updateTransition(0, 'zoom');
      });
      expect(result.current.transitions[0]).toBe('zoom');
    });
  });

  describe('Computed properties', () => {
    it('should get video resolution', () => {
      const { result } = renderHook(() => useProjectStore());
      act(() => {
        result.current.updateExportSettings({ resolution: '1080p' });
      });
      const resolution = result.current.getVideoResolution();
      expect(resolution).toEqual({ width: 1920, height: 1080 });
    });
  });
});
