// Transition types
export type TransitionType = 'fade' | 'slide' | 'zoom' | 'blur' | 'wipe' | 'kenburns';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type ExportFormat = 'mp4' | 'webm';

export type ExportQuality = 'low' | 'medium' | 'high';

// Image item in the slideshow
export interface ImageItem {
  id: string;
  file: File;
  url: string; // blob URL for display
  order: number;
}

// Export settings
export interface ExportSettings {
  resolution: '720p' | '1080p' | '4k' | 'custom';
  customWidth?: number;
  customHeight?: number;
  format: ExportFormat;
  quality: ExportQuality;
  fps: 24 | 30 | 60;
}

// Template definition
export interface Template {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  textFont: 'sans' | 'serif';
  textShadow: boolean;
  accentColor?: string;
}

// Transition configuration
export interface TransitionConfig {
  type: TransitionType;
  direction?: SlideDirection;
  duration: number; // in seconds
}

// Project state
export interface ProjectState {
  // Images
  images: ImageItem[];

  // Transitions and timing
  transitions: TransitionType[];
  transitionDurations: number[]; // in seconds, 0.5-2 seconds
  slideDurations: number[]; // in seconds, 1-10 seconds

  // Captions and audio
  captions: string[];
  captionColors: string[];
  musicFile: File | null;

  // Export and display
  exportSettings: ExportSettings;
  aspectRatio: AspectRatio;
  selectedTemplate: Template | null;
  selectedSlideIndex: number;

  // UI state
  isExporting: boolean;
  exportProgress: number; // 0-100
  exportError: string | null;
}

// Initial state
export const initialProjectState: ProjectState = {
  images: [],
  transitions: [],
  transitionDurations: [],
  slideDurations: [],
  captions: [],
  captionColors: [],
  musicFile: null,
  exportSettings: {
    resolution: '1080p',
    format: 'mp4',
    quality: 'high',
    fps: 30,
  },
  aspectRatio: '16:9',
  selectedTemplate: null,
  selectedSlideIndex: 0,
  isExporting: false,
  exportProgress: 0,
  exportError: null,
};
