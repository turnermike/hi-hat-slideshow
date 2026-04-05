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

  constructor(project: VideoProject, onProgress?: (progress: number) => void) {
    this.project = project;
    this.onProgress = onProgress;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas resolution based on export settings
    const { width, height } = this.getResolution();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private getResolution() {
    const { resolution, aspectRatio } = this.project.exportSettings;
    
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

  private async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private async renderFrame(frameIndex: number, totalFrames: number): Promise<ImageData> {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    
    // Black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);

    // Calculate which slide we're on
    const { images, slideDurations, transitionDurations, fps } = this.project;
    const frameTime = 1 / fps;
    let currentFrame = 0;
    let slideIndex = 0;

    // Find current slide
    for (let i = 0; i < images.length; i++) {
      const slideFrames = slideDurations[i] * fps;
      const transitionFrames = transitionDurations[i] * fps;
      const totalSlideFrames = slideFrames + transitionFrames;

      if (frameIndex < currentFrame + totalSlideFrames) {
        slideIndex = i;
        break;
      }
      currentFrame += totalSlideFrames;
    }

    if (slideIndex >= images.length) {
      return this.ctx.getImageData(0, 0, width, height);
    }

    // Load and draw current image
    try {
      const image = await this.loadImage(images[slideIndex].url);
      
      // Calculate aspect ratio fit
      const imageAspect = image.width / image.height;
      const canvasAspect = width / height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imageAspect > canvasAspect) {
        // Image is wider than canvas
        drawHeight = height;
        drawWidth = height * imageAspect;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      } else {
        // Image is taller than canvas
        drawWidth = width;
        drawHeight = width / imageAspect;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      }

      this.ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      
      // Add caption if exists
      if (this.project.captions[slideIndex]) {
        this.ctx.fillStyle = this.project.captionColors[slideIndex] || '#ffffff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(this.project.captions[slideIndex], width / 2, height - 50);
      }
    } catch (error) {
      console.error('Failed to load image:', error);
    }

    return this.ctx.getImageData(0, 0, width, height);
  }

  async generateVideo(): Promise<Blob> {
    const { fps, format } = this.project.exportSettings;
    const { images, slideDurations, transitionDurations } = this.project;
    
    // Calculate total frames
    let totalFrames = 0;
    for (let i = 0; i < images.length; i++) {
      totalFrames += (slideDurations[i] + transitionDurations[i]) * fps;
    }

    const stream = this.canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: format === 'webm' ? 'video/webm' : 'video/mp4',
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
          type: format === 'webm' ? 'video/webm' : 'video/mp4' 
        });
        resolve(blob);
      };

      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error'));
      };

      mediaRecorder.start();

      // Render frames
      this.renderFrames(totalFrames).then(() => {
        mediaRecorder.stop();
      }).catch(reject);
    });
  }

  private async renderFrames(totalFrames: number): Promise<void> {
    for (let frame = 0; frame < totalFrames; frame++) {
      await this.renderFrame(frame, totalFrames);
      
      // Update progress
      if (this.onProgress) {
        const progress = Math.round((frame / totalFrames) * 100);
        this.onProgress(progress);
      }
      
      // Small delay to match frame rate
      await new Promise(resolve => setTimeout(resolve, 1000 / this.project.exportSettings.fps));
    }
  }

  private getBitrate(): number {
    const { quality, resolution } = this.project.exportSettings;
    const baseBitrates: Record<string, Record<string, number>> = {
      '720p': { low: 1000000, medium: 2000000, high: 3000000 },
      '1080p': { low: 2000000, medium: 4000000, high: 6000000 },
      '4k': { low: 5000000, medium: 10000000, high: 15000000 }
    };

    return baseBitrates[resolution]?.[quality] || baseBitrates['1080p']['medium'];
  }
}