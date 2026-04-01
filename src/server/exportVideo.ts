import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import type { ExportSettings } from '../types';

export interface ExportPayload {
  project: {
    images: Array<{ id: string; url: string; order: number }>;
    transitions: string[];
    slideDurations: number[];
    transitionDurations: number[];
    captions: string[];
    musicUrl?: string | null;
    exportSettings: ExportSettings;
    aspectRatio: '16:9' | '9:16' | '1:1';
  };
}

const RESOLUTION_MAP = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
} as const;

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
} as const;

const getCodecInfo = (format: 'mp4' | 'webm') => {
  if (format === 'webm') {
    return {
      codec: 'vp9',
      container: 'webm',
      mimeType: 'video/webm',
    } as const;
  }

  return {
    codec: 'h264',
    container: 'mp4',
    mimeType: 'video/mp4',
  } as const;
};

const getBitrate = (settings: ExportSettings) => QUALITY_BITRATE_MAP[settings.quality][settings.format];

const calculateTotalFrames = (slideDurations: number[], transitionDurations: number[], fps: number): number => {
  const slidesFrames = slideDurations.reduce((sum, duration) => sum + Math.round(duration * fps), 0);
  const transitionsFrames = transitionDurations.reduce((sum, duration) => sum + Math.round(duration * fps), 0);
  return slidesFrames + transitionsFrames;
};

let compatBinariesDirectory: string | null = null;

const getCompositorPackageName = () => {
  if (process.platform !== 'darwin') return null;
  if (process.arch === 'x64') return '@remotion/compositor-darwin-x64';
  if (process.arch === 'arm64') return '@remotion/compositor-darwin-arm64';
  return null;
};

const ensureCompatibleBinariesDirectory = async () => {
  if (process.platform !== 'darwin') return null;
  if (compatBinariesDirectory) return compatBinariesDirectory;

  const require = createRequire(import.meta.url);
  const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg') as { path: string };
  const compositorPackage = getCompositorPackageName();
  if (!compositorPackage) return null;

  const compositorPackageJson = require.resolve(`${compositorPackage}/package.json`);
  const compositorDir = path.dirname(compositorPackageJson);
  const compatDir = path.join(os.tmpdir(), 'remotion-binaries-compat');

  await fs.mkdir(compatDir, { recursive: true });
  await fs.copyFile(path.join(compositorDir, 'remotion'), path.join(compatDir, 'remotion'));
  await fs.copyFile(path.join(compositorDir, 'ffprobe'), path.join(compatDir, 'ffprobe'));
  await fs.copyFile(ffmpegInstaller.path, path.join(compatDir, 'ffmpeg'));
  await fs.chmod(path.join(compatDir, 'remotion'), 0o755);
  await fs.chmod(path.join(compatDir, 'ffprobe'), 0o755);
  await fs.chmod(path.join(compatDir, 'ffmpeg'), 0o755);

  compatBinariesDirectory = compatDir;
  return compatBinariesDirectory;
};

const getResolution = (project: ExportPayload['project']) => {
  const { resolution, customWidth, customHeight } = project.exportSettings;
  const base = resolution === 'custom' ? { width: customWidth ?? 1920, height: customHeight ?? 1080 } : RESOLUTION_MAP[resolution] ?? RESOLUTION_MAP['1080p'];

  if (project.aspectRatio === '9:16') {
    return { width: Math.round(base.height * 0.5625), height: base.height };
  }
  if (project.aspectRatio === '1:1') {
    const min = Math.min(base.width, base.height);
    return { width: min, height: min };
  }
  return base;
};

export async function renderProjectVideo(payload: ExportPayload) {
  const binariesDirectory = await ensureCompatibleBinariesDirectory();
  const codecInfo = getCodecInfo(payload.project.exportSettings.format);
  const hasAudioTrack = Boolean(payload.project.musicUrl);
  const fps = payload.project.exportSettings.fps;
  const durationInFrames = calculateTotalFrames(payload.project.slideDurations, payload.project.transitionDurations, fps);
  const resolution = getResolution(payload.project);
  const bitrateKbps = getBitrate(payload.project.exportSettings);
  const entry = path.resolve(process.cwd(), 'src/remotion/index.ts');

  const outputFile = path.join(os.tmpdir(), `portfolio-video-${Date.now()}.${codecInfo.container}`);
  const bundleLocation = await bundle({
    entryPoint: entry,
    webpackOverride: (config) => {
      const nextConfig = config as {
        resolve?: {
          alias?: Record<string, string>;
        };
      };
      nextConfig.resolve = nextConfig.resolve ?? {};
      nextConfig.resolve.alias = {
        ...(nextConfig.resolve.alias ?? {}),
        '@': path.resolve(process.cwd(), 'src'),
      };
      return config;
    },
  });

  try {
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'SlideShow',
      binariesDirectory,
      inputProps: {
        project: payload.project,
      },
    });

    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
        width: resolution.width,
        height: resolution.height,
      },
      serveUrl: bundleLocation,
      binariesDirectory,
      codec: codecInfo.codec as 'h264' | 'vp9',
      outputLocation: outputFile,
      inputProps: {
        project: payload.project,
      },
      imageFormat: 'jpeg',
      audioCodec: hasAudioTrack ? (codecInfo.container === 'mp4' ? 'aac' : 'opus') : null,
      muted: !hasAudioTrack,
      enforceAudioTrack: hasAudioTrack,
      pixelFormat: codecInfo.container === 'mp4' ? 'yuv420p' : undefined,
      ffmpegOverride: ({ args }) => {
        if (codecInfo.container !== 'mp4') return args;
        return [...args, '-movflags', '+faststart'];
      },
      videoBitrate: `${bitrateKbps}k`,
      ...(codecInfo.container === 'mp4' ? { x264Preset: 'medium' as const } : {}),
    });

    const buffer = await fs.readFile(outputFile);
    return {
      buffer,
      fileExtension: codecInfo.container,
      mimeType: codecInfo.mimeType,
    };
  } finally {
    await fs.rm(bundleLocation, { recursive: true, force: true }).catch(() => undefined);
    await fs.rm(outputFile, { force: true }).catch(() => undefined);
  }
}
