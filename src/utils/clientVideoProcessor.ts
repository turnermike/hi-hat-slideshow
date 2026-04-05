// Client-side video processor using Canvas and MediaRecorder APIs

export interface VideoProject {
  images: Array<{
    id: string;
    url: string;
    order: number;
  }>;
  transitions: string[];
  slideDurations: number[];
  transitionDurations: number[];
  captions: string[];
  captionColors: string[];
  musicUrl: string | null;
  exportSettings: {
    resolution: string;
    format: string;
    quality: string;
    fps: number;
  };
  aspectRatio: string;
}

export class ClientVideoProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private project: VideoProject;
  private onProgress?: (progress: number) => void;
  private preloadedImages: Map<string, HTMLImageElement> = new Map();

  constructor(project: VideoProject, onProgress?: (progress: number) => void) {
    this.project = project;
    this.onProgress = onProgress;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    })!;
    
    // Set canvas resolution based on export settings
    const { width, height } = this.getResolution();
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Enable image smoothing for better quality
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  private getResolution() {
    const { resolution } = this.project.exportSettings;
    const { aspectRatio } = this.project;
    
    // Base resolutions
    const resolutions: Record<string, { width: number; height: number }> = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 }
    };

    const baseRes = resolutions[resolution] || resolutions['1080p'];
    
    // Adjust for aspect ratio
    if (aspectRatio === '9:16') {
      // Portrait mode
      return { width: baseRes.height, height: baseRes.width };
    } else if (aspectRatio === '1:1') {
      // Square
      const size = Math.min(baseRes.width, baseRes.height);
      return { width: size, height: size };
    }
    
    return baseRes;
  }

  private async preloadImages(): Promise<void> {
    console.log('Preloading images...');
    const loadPromises = this.project.images.map(async (image) => {
      if (!this.preloadedImages.has(image.url)) {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            this.preloadedImages.set(image.url, img);
            resolve();
          };
          img.onerror = reject;
          img.src = image.url;
        });
      }
    });
    
    await Promise.all(loadPromises);
    console.log('All images preloaded');
  }

  private async renderFrame(frameIndex: number, totalFrames: number): Promise<void> {
    const { width, height } = this.canvas;
    const { images, slideDurations, transitionDurations } = this.project;
    const fps = this.project.exportSettings.fps;
    
    // Clear canvas with black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);

    // Calculate which slide we're on
    let currentFrame = 0;
    let slideIndex = 0;
    let frameInSlide = 0;
    let isTransitioning = false;
    let transitionProgress = 0;

    // Find current slide and transition state
    for (let i = 0; i < images.length; i++) {
      const slideFrames = slideDurations[i] * fps;
      const transitionFrames = transitionDurations[i] * fps;
      const totalSlideFrames = slideFrames + transitionFrames;

      if (frameIndex < currentFrame + totalSlideFrames) {
        slideIndex = i;
        frameInSlide = frameIndex - currentFrame;
        isTransitioning = frameInSlide >= slideFrames;
        
        if (isTransitioning) {
          transitionProgress = (frameInSlide - slideFrames) / transitionFrames;
        }
        break;
      }
      currentFrame += totalSlideFrames;
    }

    if (slideIndex >= images.length) return;

    // Get current and next images for transition
    const currentImage = this.preloadedImages.get(images[slideIndex].url);
    const nextImage = slideIndex < images.length - 1 
      ? this.preloadedImages.get(images[slideIndex + 1].url)
      : null;

    if (currentImage) {
      // Calculate aspect ratio fit
      const imageAspect = currentImage.width / currentImage.height;
      const canvasAspect = width / height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imageAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = height * imageAspect;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imageAspect;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      }

      // Apply transition effects
      if (isTransitioning && nextImage) {
        // Simple fade transition
        this.ctx.globalAlpha = 1 - transitionProgress;
        this.ctx.drawImage(currentImage, drawX, drawY, drawWidth, drawHeight);
        
        this.ctx.globalAlpha = transitionProgress;
        this.ctx.drawImage(nextImage, drawX, drawY, drawWidth, drawHeight);
        this.ctx.globalAlpha = 1;
      } else {
        this.ctx.drawImage(currentImage, drawX, drawY, drawWidth, drawHeight);
      }
      
      // Add caption if exists
      if (this.project.captions[slideIndex]) {
        this.ctx.fillStyle = this.project.captionColors[slideIndex] || '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.fillText(this.project.captions[slideIndex], width / 2, height - 50);
        this.ctx.shadowColor = 'transparent';
      }
    }
  }

  async generateVideo(): Promise<Blob> {
    const { fps, format } = this.project.exportSettings;
    const { images, slideDurations, transitionDurations } = this.project;
    
    // Calculate total frames
    let totalFrames = 0;
    for (let i = 0; i < images.length; i++) {
      totalFrames += (slideDurations[i] + transitionDurations[i]) * fps;
    }

    // Preload all images first
    await this.preloadImages();

    // Check for MediaRecorder support and use appropriate MIME type
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    const mimeType = format === 'webm' ? 'video/webm' : (isFirefox ? 'video/webm' : 'video/webm;codecs=vp9');
    
    const stream = this.canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: this.getBitrate()
    });

    const chunks: Blob[] = [];
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: mimeType
        });
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error'));
      };

      mediaRecorder.start(100); // Record in 100ms chunks for better quality

      // Render frames
      this.renderFrames(totalFrames).then(() => {
        mediaRecorder.stop();
      }).catch(reject);
    });
  }

  private async renderFrames(totalFrames: number): Promise<void> {
    const fps = this.project.exportSettings.fps;
    const frameDuration = 1000 / fps;
    
    for (let frame = 0; frame < totalFrames; frame++) {
      const startTime = performance.now();
      
      await this.renderFrame(frame, totalFrames);
      
      // Update progress
      if (this.onProgress && frame % Math.floor(fps) === 0) { // Update once per second
        const progress = Math.round((frame / totalFrames) * 100);
        this.onProgress(progress);
      }
      
      // Maintain consistent frame timing
      const renderTime = performance.now() - startTime;
      const waitTime = Math.max(0, frameDuration - renderTime);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  private getBitrate(): number {
    const { quality, resolution } = this.project.exportSettings;
    const baseBitrates: Record<string, Record<string, number>> = {
      '720p': { low: 2000000, medium: 4000000, high: 6000000 },
      '1080p': { low: 4000000, medium: 8000000, high: 12000000 },
      '4k': { low: 8000000, medium: 16000000, high: 24000000 }
    };

    return baseBitrates[resolution]?.[quality] || baseBitrates['1080p']['medium'];
  }
}