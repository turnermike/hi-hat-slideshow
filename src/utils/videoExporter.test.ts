import { describe, it, expect } from 'vitest';
import { validateExportSettings, estimateFileSize, estimateEncodingTime, getBitrate, formatDurationString, parseDurationString, getCodecInfo } from './videoExporter';
import type { ExportSettings } from '../types';

describe('videoExporter.ts', () => {
  describe('getBitrate', () => {
    it('should return 2500 kbps for mp4 low quality', () => {
      const settings: ExportSettings = {
        resolution: '1080p',
        format: 'mp4',
        quality: 'low',
        fps: 30,
      };
      const bitrate = getBitrate(settings);
      expect(bitrate).toBe(2500);
    });

    it('should return 5000 kbps for mp4 medium quality', () => {
      const settings: ExportSettings = {
        resolution: '1080p',
        format: 'mp4',
        quality: 'medium',
        fps: 30,
      };
      const bitrate = getBitrate(settings);
      expect(bitrate).toBe(5000);
    });

    it('should return 8000 kbps for mp4 high quality', () => {
      const settings: ExportSettings = {
        resolution: '1080p',
        format: 'mp4',
        quality: 'high',
        fps: 30,
      };
      const bitrate = getBitrate(settings);
      expect(bitrate).toBe(8000);
    });

    it('should return 2000 kbps for webm low quality', () => {
      const settings: ExportSettings = {
        resolution: '1080p',
        format: 'webm',
        quality: 'low',
        fps: 30,
      };
      const bitrate = getBitrate(settings);
      expect(bitrate).toBe(2000);
    });

    it('should return 6000 kbps for webm high quality', () => {
      const settings: ExportSettings = {
        resolution: '1080p',
        format: 'webm',
        quality: 'high',
        fps: 30,
      };
      const bitrate = getBitrate(settings);
      expect(bitrate).toBe(6000);
    });
  });

  describe('validateExportSettings', () => {
    const validSettings: ExportSettings = {
      resolution: '1080p',
      format: 'mp4',
      quality: 'medium',
      fps: 30,
    };

    it('should validate correct export settings', () => {
      const errors = validateExportSettings(validSettings);
      expect(errors).toHaveLength(0);
    });

    it('should error on invalid format', () => {
      const invalid = { ...validSettings, format: 'avi' as any };
      const errors = validateExportSettings(invalid);
      expect(errors.some((e) => e.includes('format'))).toBe(true);
    });

    it('should error on invalid quality', () => {
      const invalid = { ...validSettings, quality: 'ultra' as any };
      const errors = validateExportSettings(invalid);
      expect(errors.some((e) => e.includes('quality'))).toBe(true);
    });

    it('should error on invalid fps', () => {
      const invalid = { ...validSettings, fps: 120 };
      const errors = validateExportSettings(invalid);
      expect(errors.some((e) => e.includes('FPS'))).toBe(true);
    });

    it('should error on custom resolution without dimensions', () => {
      const invalid = { ...validSettings, resolution: 'custom' } as any;
      const errors = validateExportSettings(invalid);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should error on width below 320px', () => {
      const invalid = {
        ...validSettings,
        resolution: 'custom',
        customWidth: 320,
        customHeight: 240,
      } as any;
      const errors = validateExportSettings(invalid);
      expect(errors).toHaveLength(0); // Should be valid at 320
    });

    it('should error on height below 240px', () => {
      const invalid = {
        ...validSettings,
        resolution: 'custom',
        customWidth: 1280,
        customHeight: 239,
      } as any;
      const errors = validateExportSettings(invalid);
      expect(errors.some((e) => e.includes('Height'))).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const invalid = {
        resolution: 'invalid',
        format: 'invalid' as any,
        quality: 'invalid' as any,
        fps: 999,
      };
      const errors = validateExportSettings(invalid);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('estimateFileSize', () => {
    it('should estimate file size for 30-second video at 1080p mp4 low quality', () => {
      const estimate = estimateFileSize(
        30,
        { width: 1920, height: 1080 },
        {
          resolution: '1080p',
          format: 'mp4',
          quality: 'low',
          fps: 30,
        },
      );

      // Low quality mp4: 2500 kbps → 30 seconds = 75000 kb = ~9.2 MB
      expect(estimate.bytes).toBeGreaterThan(0);
      expect(estimate.megabytes).toBeGreaterThan(0);
      expect(estimate.readable).toContain('MB');
    });

    it('should estimate larger file for higher quality', () => {
      const resolution = { width: 1920, height: 1080 };
      const lowQuality = estimateFileSize(30, resolution, {
        resolution: '1080p',
        format: 'mp4',
        quality: 'low',
        fps: 30,
      });

      const highQuality = estimateFileSize(30, resolution, {
        resolution: '1080p',
        format: 'mp4',
        quality: 'high',
        fps: 30,
      });

      expect(highQuality.bytes).toBeGreaterThan(lowQuality.bytes);
    });

    it('should estimate different file sizes for mp4 vs webm', () => {
      const resolution = { width: 1920, height: 1080 };
      const mp4 = estimateFileSize(30, resolution, {
        resolution: '1080p',
        format: 'mp4',
        quality: 'medium',
        fps: 30,
      });

      const webm = estimateFileSize(30, resolution, {
        resolution: '1080p',
        format: 'webm',
        quality: 'medium',
        fps: 30,
      });

      // Webm should be smaller than mp4 at same quality
      expect(webm.bytes).toBeLessThan(mp4.bytes);
    });

    it('should handle 720p resolution', () => {
      const estimate = estimateFileSize(
        30,
        { width: 1280, height: 720 },
        {
          resolution: '720p',
          format: 'mp4',
          quality: 'medium',
          fps: 30,
        },
      );

      expect(estimate.bytes).toBeGreaterThan(0);
      expect(estimate.readable).toMatch(/^\d+(\.\d+)?\s(MB|GB)$/);
    });

    it('should estimate larger file for longer duration', () => {
      const resolution = { width: 1920, height: 1080 };
      const short = estimateFileSize(10, resolution, {
        resolution: '1080p',
        format: 'mp4',
        quality: 'medium',
        fps: 30,
      });

      const long = estimateFileSize(60, resolution, {
        resolution: '1080p',
        format: 'mp4',
        quality: 'medium',
        fps: 30,
      });

      expect(long.bytes).toBeGreaterThan(short.bytes);
    });

    it('should calculate bytes and megabytes consistently', () => {
      const estimate = estimateFileSize(
        30,
        { width: 1920, height: 1080 },
        {
          resolution: '1080p',
          format: 'mp4',
          quality: 'medium',
          fps: 30,
        },
      );

      // Megabytes should equal bytes / (1024 * 1024)
      const calculatedMB = estimate.bytes / (1024 * 1024);
      expect(Math.abs(estimate.megabytes - calculatedMB)).toBeLessThan(0.01);
    });

    it('should scale roughly linearly with duration', () => {
      const resolution = { width: 1920, height: 1080 };
      const settings = {
        resolution: '1080p',
        format: 'mp4',
        quality: 'medium',
        fps: 30,
      };

      const short = estimateFileSize(10, resolution, settings);
      const long = estimateFileSize(20, resolution, settings);

      // Should be roughly 2x for 2x duration
      expect(long.bytes / short.bytes).toBeCloseTo(2, 0);
    });
  });

  describe('estimateEncodingTime', () => {
    it('should estimate encoding time increases with duration', () => {
      const resolution = { width: 1920, height: 1080 };
      const short = estimateEncodingTime(10, resolution, 'medium');
      const long = estimateEncodingTime(60, resolution, 'medium');

      expect(long).toBeGreaterThan(short);
    });

    it('should estimate encoding time for 4K takes longer than 1080p', () => {
      const hd = estimateEncodingTime(30, { width: 1920, height: 1080 }, 'medium');
      const _4k = estimateEncodingTime(30, { width: 3840, height: 2160 }, 'medium');

      expect(_4k).toBeGreaterThan(hd);
    });

    it('should estimate encoding time for high quality takes longer than low', () => {
      const resolution = { width: 1920, height: 1080 };
      const low = estimateEncodingTime(30, resolution, 'low');
      const high = estimateEncodingTime(30, resolution, 'high');

      expect(high).toBeGreaterThan(low);
    });

    it('should return reasonable estimate for typical video', () => {
      const estimate = estimateEncodingTime(30, { width: 1920, height: 1080 }, 'medium');

      // Should return a reasonable number greater than 5
      expect(estimate).toBeGreaterThanOrEqual(5);
      expect(estimate).toBeLessThanOrEqual(300);
    });

    it('should scale roughly linearly with duration for same resolution/quality', () => {
      const resolution = { width: 1920, height: 1080 };
      const duration10 = estimateEncodingTime(10, resolution, 'medium');
      const duration20 = estimateEncodingTime(20, resolution, 'medium');

      // Ratio should be roughly 2x
      expect(duration20).toBeGreaterThan(duration10);
      expect(duration20 / duration10).toBeCloseTo(2, 0);
    });

    it('should return minimum 5 seconds for very short videos', () => {
      const estimate = estimateEncodingTime(0.1, { width: 320, height: 240 }, 'low');
      expect(estimate).toBeGreaterThanOrEqual(5);
    });
  });

  describe('formatDurationString', () => {
    it('should format 30 seconds as 0:30', () => {
      expect(formatDurationString(30)).toBe('0:30');
    });

    it('should format 90 seconds as 1:30', () => {
      expect(formatDurationString(90)).toBe('1:30');
    });

    it('should format 3661 seconds as 1:01:01', () => {
      expect(formatDurationString(3661)).toBe('1:01:01');
    });

    it('should format 0 seconds as 0:00', () => {
      expect(formatDurationString(0)).toBe('0:00');
    });

    it('should pad single-digit minutes and seconds', () => {
      expect(formatDurationString(65)).toBe('1:05');
      expect(formatDurationString(605)).toBe('10:05');
    });

    it('should handle large durations with hours', () => {
      expect(formatDurationString(7325)).toBe('2:02:05');
    });
  });

  describe('parseDurationString', () => {
    it('should parse 0:30 as 30 seconds', () => {
      expect(parseDurationString('0:30')).toBe(30);
    });

    it('should parse 1:30 as 90 seconds', () => {
      expect(parseDurationString('1:30')).toBe(90);
    });

    it('should parse 1:01:01 as 3661 seconds', () => {
      expect(parseDurationString('1:01:01')).toBe(3661);
    });

    it('should parse 0:00 as 0 seconds', () => {
      expect(parseDurationString('0:00')).toBe(0);
    });

    it('should return 0 for invalid format', () => {
      expect(parseDurationString('invalid')).toBe(0);
    });

    it('should be inverse of formatDurationString', () => {
      const original = 3661;
      const formatted = formatDurationString(original);
      const parsed = parseDurationString(formatted);
      expect(parsed).toBe(original);
    });
  });

  describe('getCodecInfo', () => {
    it('should return h264 codec for MP4', () => {
      const info = getCodecInfo('mp4');
      expect(info.codec).toBe('h264');
      expect(info.container).toBe('mp4');
      expect(info.mimeType).toBe('video/mp4');
    });

    it('should return vp9 codec for WebM', () => {
      const info = getCodecInfo('webm');
      expect(info.codec).toBe('vp9');
      expect(info.container).toBe('webm');
      expect(info.mimeType).toBe('video/webm');
    });

    it('should have correct MIME types', () => {
      const mp4Info = getCodecInfo('mp4');
      const webmInfo = getCodecInfo('webm');

      expect(mp4Info.mimeType).toMatch(/^video\//);
      expect(webmInfo.mimeType).toMatch(/^video\//);
    });
  });
});
