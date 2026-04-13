import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../api/export/route';
import { renderProjectVideo } from '../../server/exportVideo';

// Mock the export function
vi.mock('../../server/exportVideo', () => ({
  renderProjectVideo: vi.fn(),
}));

describe('/api/export/route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return video on successful export', async () => {
    const mockVideoBuffer = Buffer.from('video content');
    vi.mocked(renderProjectVideo).mockResolvedValue({
      buffer: mockVideoBuffer,
      fileExtension: 'mp4',
      mimeType: 'video/mp4',
    });

    const request = new Request('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({
        project: {
          images: [],
          transitions: [],
          slideDurations: [],
          transitionDurations: [],
          captions: [],
          captionColors: [],
          exportSettings: {
            resolution: '1080p',
            format: 'mp4',
            quality: 'medium',
            fps: 30,
          },
          aspectRatio: '16:9',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('video/mp4');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
    
    const responseBuffer = await response.arrayBuffer();
    expect(Buffer.from(responseBuffer)).toEqual(mockVideoBuffer);
  });

  it('should return 400 for missing project data', async () => {
    const request = new Request('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid payload: project data required');
  });

  it('should return 500 for export errors', async () => {
    vi.mocked(renderProjectVideo).mockRejectedValue(new Error('Export failed'));

    const request = new Request('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({
        project: {
          images: [],
          transitions: [],
          slideDurations: [],
          transitionDurations: [],
          captions: [],
          captionColors: [],
          exportSettings: {
            resolution: '1080p',
            format: 'mp4',
            quality: 'medium',
            fps: 30,
          },
          aspectRatio: '16:9',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('Export failed');
  });
});
