import { vi } from 'vitest';

// Mock Remotion modules before any imports
vi.mock('@remotion/bundler', () => ({
  bundle: vi.fn().mockResolvedValue('/tmp/bundle'),
}));

vi.mock('@remotion/renderer', () => ({
  renderMedia: vi.fn().mockResolvedValue(undefined),
  selectComposition: vi.fn().mockResolvedValue({
    id: 'SlideShow',
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps: {},
    props: {},
    defaultCodec: 'h264',
    defaultOutName: 'video',
    enableTemporalDithering: false,
    everyNthFrame: 1,
    numberOfGifLoops: null,
    proResProfile: undefined,
    proRes4444: false,
    stretch: false,
    vCodec: 'h264',
    audioBitrate: null,
    audioCodec: null,
    crf: undefined,
    pixelFormat: 'yuv420p',
    audioFrequency: 48000,
    envVariables: {},
  }),
}));

// Mock file system operations
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    promises: {
      mkdir: vi.fn().mockResolvedValue(undefined),
      copyFile: vi.fn().mockResolvedValue(undefined),
      chmod: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(Buffer.from('fake video data')),
      rm: vi.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock OS operations
vi.mock('node:os', () => ({
  tmpdir: () => '/tmp',
}));

// Mock @ffmpeg-installer/ffmpeg
vi.mock('@ffmpeg-installer/ffmpeg', () => ({
  path: '/usr/local/bin/ffmpeg',
}));

// Mock createRequire to handle ffmpeg installer
vi.mock('node:module', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    createRequire: vi.fn(() => ({
      '@ffmpeg-installer/ffmpeg': {
        path: '/usr/local/bin/ffmpeg',
      },
      '@remotion/compositor-darwin-x64/package.json': '/fake/path/package.json',
      '@remotion/compositor-darwin-arm64/package.json': '/fake/path/package.json',
      '@remotion/compositor-linux-x64/package.json': '/fake/path/package.json',
      '@remotion/compositor-linux-arm64/package.json': '/fake/path/package.json',
    })),
  };
});

// Mock the binary setup function
vi.mock('../../server/exportVideo', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    ensureCompatibleBinariesDirectory: vi.fn().mockImplementation(async () => {
      // Always return a valid path for tests
      return '/tmp/test-binaries';
    }),
  };
});
