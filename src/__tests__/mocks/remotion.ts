import { vi, beforeEach } from 'vitest';

export const mockBundle = vi.fn();
export const mockSelectComposition = vi.fn();
export const mockRenderMedia = vi.fn();

vi.mock('@remotion/bundler', () => ({
  bundle: mockBundle,
}));

vi.mock('@remotion/renderer', () => ({
  renderMedia: mockRenderMedia,
  selectComposition: mockSelectComposition,
}));

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
