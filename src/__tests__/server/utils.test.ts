import { describe, it, expect } from 'vitest';
import { calculateTotalFrames, getResolution, getCodecInfo, getBitrate } from '../../server/exportVideo';
import { ExportSettings, ExportFormat, ExportQuality } from '../../types';

describe('Export Video Utilities', () => {
  describe('calculateTotalFrames', () => {
    it('should calculate total frames correctly', () => {
      const slideDurations = [2, 3, 4]; // 9 seconds total
      const transitionDurations = [0.5, 0.5]; // 1 second total
      const fps = 30;
      
      const result = calculateTotalFrames(slideDurations, transitionDurations, fps);
      expect(result).toBe((9 + 1) * 30); // 300 frames
    });

    it('should handle empty arrays', () => {
      const result = calculateTotalFrames([], [], 30);
      expect(result).toBe(0);
    });
  });

  describe('getResolution', () => {
    it('should return correct resolution for preset', () => {
      const project = {
        images: [],
        transitions: [],
        slideDurations: [],
        transitionDurations: [],
        captions: [],
        captionColors: [],
        musicUrl: null,
        exportSettings: { resolution: '1080p' as const, format: 'mp4' as ExportFormat, quality: 'medium' as ExportQuality, fps: 30 as const },
        aspectRatio: '16:9' as const,
      };
      
      const result = getResolution(project);
      expect(result).toEqual({ width: 1920, height: 1080 });
    });

    it('should adjust for 9:16 aspect ratio', () => {
      const project = {
        images: [],
        transitions: [],
        slideDurations: [],
        transitionDurations: [],
        captions: [],
        captionColors: [],
        musicUrl: null,
        exportSettings: { resolution: '1080p' as const, format: 'mp4' as ExportFormat, quality: 'medium' as ExportQuality, fps: 30 as const },
        aspectRatio: '9:16' as const,
      };
      
      const result = getResolution(project);
      expect(result.width).toBe(Math.round(1080 * 0.5625)); // ~607
      expect(result.height).toBe(1080);
    });

    it('should handle custom resolution', () => {
      const project = {
        images: [],
        transitions: [],
        slideDurations: [],
        transitionDurations: [],
        captions: [],
        captionColors: [],
        musicUrl: null,
        exportSettings: { 
          resolution: 'custom' as const, 
          customWidth: 1280, 
          customHeight: 720,
          format: 'mp4' as ExportFormat, 
          quality: 'medium' as ExportQuality, 
          fps: 30 as const
        },
        aspectRatio: '16:9' as const,
      };
      
      const result = getResolution(project);
      expect(result).toEqual({ width: 1280, height: 720 });
    });
  });

  describe('getCodecInfo', () => {
    it('should return MP4 codec info', () => {
      const result = getCodecInfo('mp4');
      expect(result).toEqual({
        codec: 'h264',
        container: 'mp4',
        mimeType: 'video/mp4',
      });
    });

    it('should return WebM codec info', () => {
      const result = getCodecInfo('webm');
      expect(result).toEqual({
        codec: 'vp9',
        container: 'webm',
        mimeType: 'video/webm',
      });
    });
  });

  describe('getBitrate', () => {
    it('should return correct bitrate for MP4 medium quality', () => {
      const settings: ExportSettings = { resolution: '1080p', format: 'mp4', quality: 'medium', fps: 30 };
      const result = getBitrate(settings);
      expect(result).toBe(5000);
    });

    it('should return correct bitrate for WebM high quality', () => {
      const settings: ExportSettings = { resolution: '1080p', format: 'webm', quality: 'high', fps: 30 };
      const result = getBitrate(settings);
      expect(result).toBe(6000);
    });
  });
});
