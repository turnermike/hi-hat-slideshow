import type { ExportSettings } from '@/types';

/**
 * Quality to bitrate mapping (in Kbps)
 */
const QUALITY_BITRATE_MAP = {
  low: {
    mp4: 2500,
    webm: 2000,
  },
  medium: {
    mp4: 5000,
    webm: 4000,
  },
  high: {
    mp4: 8000,
    webm: 6000,
  },
};

/**
 * Validate export settings
 */
export function validateExportSettings(settings: ExportSettings): string[] {
  const errors: string[] = [];

  if (!settings.format || !['mp4', 'webm'].includes(settings.format)) {
    errors.push('Invalid export format');
  }

  if (!settings.quality || !['low', 'medium', 'high'].includes(settings.quality)) {
    errors.push('Invalid quality setting');
  }

  if (!settings.fps || ![24, 30, 60].includes(settings.fps)) {
    errors.push('Invalid FPS setting');
  }

  if (settings.resolution === 'custom') {
    if (!settings.customWidth || !settings.customHeight) {
      errors.push('Custom resolution requires width and height');
    }
    if (settings.customWidth && settings.customWidth < 320) {
      errors.push('Width must be at least 320px');
    }
    if (settings.customHeight && settings.customHeight < 240) {
      errors.push('Height must be at least 240px');
    }
  }

  return errors;
}

/**
 * Estimate file size for export
 */
export function estimateFileSize(videoDurationSeconds: number, _resolution: { width: number; height: number }, settings: ExportSettings): { bytes: number; megabytes: number; readable: string } {
  const bitrate = QUALITY_BITRATE_MAP[settings.quality][settings.format];
  const bytes = (videoDurationSeconds * bitrate * 1000) / 8;
  const megabytes = bytes / (1024 * 1024);
  const readable = `${megabytes.toFixed(1)} MB`;

  return { bytes, megabytes, readable };
}

/**
 * Get bitrate for given settings
 */
export function getBitrate(settings: ExportSettings): number {
  return QUALITY_BITRATE_MAP[settings.quality][settings.format];
}

/**
 * Get video codec and container for format
 */
export function getCodecInfo(format: 'mp4' | 'webm'): { codec: string; container: string; mimeType: string } {
  if (format === 'webm') {
    return {
      codec: 'vp9',
      container: 'webm',
      mimeType: 'video/webm',
    };
  }

  return {
    codec: 'h264',
    container: 'mp4',
    mimeType: 'video/mp4',
  };
}

/**
 * Parse duration string (e.g., "0:30" or "1:23")
 */
export function parseDurationString(str: string): number {
  const parts = str.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

/**
 * Format seconds to duration string (e.g., "1:23" or "0:30")
 */
export function formatDurationString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate estimated encoding time
 * Rough estimate: depends on resolution, quality, and system performance
 */
export function estimateEncodingTime(videoDurationSeconds: number, resolution: { width: number; height: number }, quality: 'low' | 'medium' | 'high'): number {
  // Base encoding speed: pixels per second
  const pixelCount = resolution.width * resolution.height;
  const baseSpeed = {
    low: 100000000, // 100 megapixels/second
    medium: 50000000, // 50 megapixels/second
    high: 25000000, // 25 megapixels/second
  };

  const speed = baseSpeed[quality];
  const encodingSpeed = (pixelCount / speed) * 30; // FPS adjustment

  const estimatedSeconds = videoDurationSeconds * encodingSpeed;

  return Math.max(5, Math.ceil(estimatedSeconds)); // Minimum 5 seconds
}
