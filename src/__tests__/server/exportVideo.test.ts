import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

// Import the module - mocks are already set up in setup.ts
const { renderProjectVideo } = await import('../../server/exportVideo');
import { createMockExportPayload } from '../utils/testHelpers';

// Mock platform detection
const originalPlatform = process.platform;
const originalArch = process.arch;

describe('renderProjectVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    // Restore original platform/arch
    Object.defineProperty(process, 'platform', { value: originalPlatform });
    Object.defineProperty(process, 'arch', { value: originalArch });
  });

  it('should successfully render a video with valid payload', async () => {
    const payload = createMockExportPayload();
    
    const result = await renderProjectVideo(payload);
    
    expect(result).toEqual({
      buffer: Buffer.from('fake video data'),
      fileExtension: 'mp4',
      mimeType: 'video/mp4',
    });
  });

  it('should handle WebM export correctly', async () => {
    const payload = createMockExportPayload({
      project: {
        ...createMockExportPayload().project,
        exportSettings: {
          resolution: '1080p',
          format: 'webm',
          quality: 'high',
          fps: 30,
        },
      },
    });
    
    const result = await renderProjectVideo(payload);
    
    expect(result.fileExtension).toBe('webm');
    expect(result.mimeType).toBe('video/webm');
  });

  it('should include audio track when music URL is provided', async () => {
    const { renderMedia } = await import('@remotion/renderer');
    const payload = createMockExportPayload({
      project: {
        ...createMockExportPayload().project,
        musicUrl: 'https://example.com/music.mp3',
      },
    });
    
    await renderProjectVideo(payload);
    
    expect(vi.mocked(renderMedia)).toHaveBeenCalledWith(
      expect.objectContaining({
        muted: false,
        enforceAudioTrack: true,
        audioCodec: 'aac',
      })
    );
  });

  it('should throw error for unsupported platform', async () => {
    // Mock unsupported platform
    Object.defineProperty(process, 'platform', { value: 'freebsd' });
    
    // Import the module fresh to get the updated platform detection
    const { renderProjectVideo: renderProjectVideoFresh } = await import('../../server/exportVideo');
    
    // Mock the binary setup function to return null for unsupported platform
    const { ensureCompatibleBinariesDirectory } = await import('../../server/exportVideo');
    vi.mocked(ensureCompatibleBinariesDirectory).mockResolvedValue(null);
    
    const payload = createMockExportPayload();
    
    await expect(renderProjectVideoFresh(payload)).rejects.toThrow(
      'Platform freebsd with architecture'
    );
    
    // Restore original platform
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  it('should clean up temporary files after rendering', async () => {
    const { promises: fsPromises } = await import('node:fs');
    const payload = createMockExportPayload();
    
    await renderProjectVideo(payload);
    
    // Verify cleanup was called
    expect(vi.mocked(fsPromises.rm)).toHaveBeenCalledWith(
      expect.stringContaining('bundle'),
      { recursive: true, force: true }
    );
    
    expect(vi.mocked(fsPromises.rm)).toHaveBeenCalledWith(
      expect.stringContaining('.mp4'),
      { force: true }
    );
  });
});
