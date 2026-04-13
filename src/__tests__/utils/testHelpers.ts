import { ExportPayload } from '../../server/exportVideo';
import { ExportSettings, AspectRatio } from '../../types';

export const createMockExportPayload = (overrides: Partial<ExportPayload> = {}): ExportPayload => ({
  project: {
    images: [
      { id: '1', url: 'blob:http://example.com/image1.jpg', order: 0 },
      { id: '2', url: 'blob:http://example.com/image2.jpg', order: 1 },
    ],
    transitions: ['fade', 'slide'],
    slideDurations: [2, 3],
    transitionDurations: [0.5, 0.5],
    captions: ['Slide 1', 'Slide 2'],
    captionColors: ['#ffffff', '#000000'],
    musicUrl: null,
    exportSettings: {
      resolution: '1080p',
      format: 'mp4',
      quality: 'medium',
      fps: 30,
    },
    aspectRatio: '16:9' as AspectRatio,
  },
  ...overrides,
});

export const mockExportSettings: ExportSettings = {
  resolution: '1080p',
  format: 'mp4',
  quality: 'medium',
  fps: 30,
};
