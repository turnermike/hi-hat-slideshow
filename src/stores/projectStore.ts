import { create } from 'zustand';
import type { ProjectState, TransitionType, Template, ExportSettings, AspectRatio } from '@/types';
import { initialProjectState } from '@/types';

interface ProjectActions {
  // Image management
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;

  // Transition management
  updateTransition: (index: number, transition: TransitionType) => void;
  updateTransitionDuration: (index: number, duration: number) => void;

  // Slide management
  updateSlideDuration: (index: number, duration: number) => void;
  updateCaption: (index: number, caption: string) => void;

  // Audio management
  setMusicFile: (file: File | null) => void;

  // Export settings
  updateExportSettings: (settings: Partial<ExportSettings>) => void;

  // Display settings
  setAspectRatio: (ratio: AspectRatio) => void;
  setTemplate: (template: Template | null) => void;
  setSelectedSlideIndex: (index: number) => void;

  // Export state
  setExporting: (isExporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setExportError: (error: string | null) => void;

  // Computed values
  getTotalDuration: () => number;
  getVideoResolution: () => { width: number; height: number };
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  ...initialProjectState,

  // Image management
  addImages: (files: File[]) => {
    set((state) => {
      const newImages = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
        order: state.images.length + index,
      }));

      const newState = {
        images: [...state.images, ...newImages],
      };

      // Initialize transitions, durations, and captions for new images
      const newTransitions = [...state.transitions];
      const newTransitionDurations = [...state.transitionDurations];
      const newSlideDurations = [...state.slideDurations];
      const newCaptions = [...state.captions];

      newImages.forEach(() => {
        newTransitions.push('fade');
        newTransitionDurations.push(1);
        newSlideDurations.push(3);
        newCaptions.push('');
      });

      return {
        ...newState,
        transitions: newTransitions,
        transitionDurations: newTransitionDurations,
        slideDurations: newSlideDurations,
        captions: newCaptions,
      };
    });
  },

  removeImage: (id: string) => {
    set((state) => {
      const index = state.images.findIndex((img) => img.id === id);
      if (index === -1) return state;

      const newImages = state.images.filter((_, i) => i !== index);
      const newTransitions = state.transitions.filter((_, i) => i !== index);
      const newTransitionDurations = state.transitionDurations.filter((_, i) => i !== index);
      const newSlideDurations = state.slideDurations.filter((_, i) => i !== index);
      const newCaptions = state.captions.filter((_, i) => i !== index);

      // Clean up blob URL to prevent memory leak
      URL.revokeObjectURL(state.images[index].url);

      return {
        images: newImages,
        transitions: newTransitions,
        transitionDurations: newTransitionDurations,
        slideDurations: newSlideDurations,
        captions: newCaptions,
        selectedSlideIndex: Math.min(state.selectedSlideIndex, newImages.length - 1) || 0,
      };
    });
  },

  reorderImages: (startIndex: number, endIndex: number) => {
    set((state) => {
      const newImages = Array.from(state.images);
      const newTransitions = Array.from(state.transitions);
      const newTransitionDurations = Array.from(state.transitionDurations);
      const newSlideDurations = Array.from(state.slideDurations);
      const newCaptions = Array.from(state.captions);

      // Reorder images
      const [removedImage] = newImages.splice(startIndex, 1);
      newImages.splice(endIndex, 0, removedImage);

      // Reorder associated data
      const [removedTransition] = newTransitions.splice(startIndex, 1);
      newTransitions.splice(endIndex, 0, removedTransition);

      const [removedTransitionDuration] = newTransitionDurations.splice(startIndex, 1);
      newTransitionDurations.splice(endIndex, 0, removedTransitionDuration);

      const [removedSlideDuration] = newSlideDurations.splice(startIndex, 1);
      newSlideDurations.splice(endIndex, 0, removedSlideDuration);

      const [removedCaption] = newCaptions.splice(startIndex, 1);
      newCaptions.splice(endIndex, 0, removedCaption);

      return {
        images: newImages,
        transitions: newTransitions,
        transitionDurations: newTransitionDurations,
        slideDurations: newSlideDurations,
        captions: newCaptions,
      };
    });
  },

  // Transition management
  updateTransition: (index: number, transition: TransitionType) => {
    set((state) => {
      const newTransitions = [...state.transitions];
      newTransitions[index] = transition;
      return { transitions: newTransitions };
    });
  },

  updateTransitionDuration: (index: number, duration: number) => {
    set((state) => {
      const newDurations = [...state.transitionDurations];
      newDurations[index] = Math.max(0.5, Math.min(2, duration)); // Clamp between 0.5-2s
      return { transitionDurations: newDurations };
    });
  },

  // Slide management
  updateSlideDuration: (index: number, duration: number) => {
    set((state) => {
      const newDurations = [...state.slideDurations];
      newDurations[index] = Math.max(1, Math.min(10, duration)); // Clamp between 1-10s
      return { slideDurations: newDurations };
    });
  },

  updateCaption: (index: number, caption: string) => {
    set((state) => {
      const newCaptions = [...state.captions];
      newCaptions[index] = caption;
      return { captions: newCaptions };
    });
  },

  // Audio management
  setMusicFile: (file: File | null) => {
    set({ musicFile: file });
  },

  // Export settings
  updateExportSettings: (settings: Partial<ExportSettings>) => {
    set((state) => ({
      exportSettings: {
        ...state.exportSettings,
        ...settings,
      },
    }));
  },

  // Display settings
  setAspectRatio: (ratio: AspectRatio) => {
    set({ aspectRatio: ratio });
  },

  setTemplate: (template: Template | null) => {
    set({ selectedTemplate: template });
  },

  setSelectedSlideIndex: (index: number) => {
    set({ selectedSlideIndex: index });
  },

  // Export state
  setExporting: (isExporting: boolean) => {
    set({ isExporting });
  },

  setExportProgress: (progress: number) => {
    set({ exportProgress: Math.max(0, Math.min(100, progress)) });
  },

  setExportError: (error: string | null) => {
    set({ exportError: error });
  },

  // Computed values
  getTotalDuration: () => {
    const state = get();
    const slideDuration = state.slideDurations.reduce((sum, d) => sum + d, 0);
    const transitionDuration = state.transitionDurations.reduce((sum, d) => sum + d, 0);
    return slideDuration + transitionDuration;
  },

  getVideoResolution: () => {
    const state = get();
    const { resolution, customWidth, customHeight } = state.exportSettings;
    const { aspectRatio } = state;

    const baseResolutions = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 },
    };

    if (resolution === 'custom' && customWidth && customHeight) {
      return { width: customWidth, height: customHeight };
    }

    let baseRes = baseResolutions[resolution as keyof typeof baseResolutions] || baseResolutions['1080p'];

    // Apply aspect ratio
    if (aspectRatio === '9:16') {
      return { width: Math.round(baseRes.height * 0.5625), height: baseRes.height };
    } else if (aspectRatio === '1:1') {
      const min = Math.min(baseRes.width, baseRes.height);
      return { width: min, height: min };
    }

    // Default 16:9
    return baseRes;
  },
}));
