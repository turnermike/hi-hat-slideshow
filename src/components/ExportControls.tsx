import React from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { estimateFileSize, formatDurationString, getCodecInfo } from '@/utils/videoExporter';
import type { ExportSettings } from '@/types';

export const ExportControls: React.FC = () => {
  const [isExporting, setIsExporting] = React.useState(false);
  
  console.log('ExportControls component rendered');
  
  const { images, transitions, captions, captionColors, musicFile, slideDurations, transitionDurations, exportSettings, aspectRatio, updateExportSettings, setExporting, exportProgress, setExportProgress, exportError, setExportError } = useProjectStore(
    useShallow((state) => ({
      images: state.images,
      transitions: state.transitions,
      captions: state.captions,
      captionColors: state.captionColors,
      musicFile: state.musicFile,
      slideDurations: state.slideDurations,
      transitionDurations: state.transitionDurations,
      exportSettings: state.exportSettings,
      aspectRatio: state.aspectRatio,
      updateExportSettings: state.updateExportSettings,
      setExporting: state.setExporting,
      exportProgress: state.exportProgress,
      setExportProgress: state.setExportProgress,
      exportError: state.exportError,
      setExportError: state.setExportError,
    })),
  );

  const project = { images, transitions, captions, captionColors, musicFile, slideDurations, transitionDurations, exportSettings, aspectRatio };

  const videoDuration = project.slideDurations.reduce((a, b) => a + b, 0) + project.transitionDurations.reduce((a, b) => a + b, 0);

  const getResolution = () => {
    if (exportSettings.resolution === 'custom') {
      return {
        width: exportSettings.customWidth || 1920,
        height: exportSettings.customHeight || 1080,
      };
    }
    const resolutions = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 },
    };
    return resolutions[exportSettings.resolution as keyof typeof resolutions] || resolutions['1080p'];
  };

  const resolution = getResolution();
  const estimatedSize = estimateFileSize(videoDuration, resolution, exportSettings);

  const toDataUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read media data'));
      reader.readAsDataURL(blob);
    });
  };

  const fileToDataUrl = async (file: File) => {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read uploaded file'));
      reader.readAsDataURL(file);
    });
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    console.log('handleExport called, images.length:', images.length);
    
    if (images.length === 0) {
      console.log('No images, returning early');
      setExportError('Please upload images first');
      return;
    }

    console.log('Starting export process...');
    setIsExporting(true);
    setExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      console.log('Setting progress to 10%');
      setExportProgress(10);
      const imageDataUrls = await Promise.all(project.images.map((image) => toDataUrl(image.url)));
      const musicUrl = project.musicFile ? await fileToDataUrl(project.musicFile) : null;

      console.log('Progress 35%, sending API request...');
      setExportProgress(35);
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: {
            images: project.images.map((image, index) => ({
              id: image.id,
              url: imageDataUrls[index],
              order: image.order,
            })),
            transitions: project.transitions,
            slideDurations: project.slideDurations,
            transitionDurations: project.transitionDurations,
            captions: project.captions,
            captionColors: project.captionColors,
            musicUrl,
            exportSettings: project.exportSettings,
            aspectRatio: project.aspectRatio,
          },
        }),
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        console.log('API response not ok, parsing error...');
        const body = await response.json().catch(() => ({ error: 'Video export failed' }));
        console.log('API error:', body);
        throw new Error(body.error || 'Video export failed');
      }

      console.log('Progress 90%, downloading blob...');
      setExportProgress(90);
      const codecInfo = getCodecInfo(project.exportSettings.format);
      const blob = await response.blob();
      const filename = `portfolio-video-${Date.now()}.${codecInfo.container}`;
      console.log('Downloading file:', filename);
      downloadBlob(new Blob([blob], { type: codecInfo.mimeType }), filename);
      setExportProgress(100);
      console.log('Export completed successfully');
    } catch (error) {
      console.log('Export error caught:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      console.log('Export process finished, resetting state...');
      setIsExporting(false);
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-text-primary font-medium">Export Settings</h3>

      {/* Basic settings row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Resolution */}
        <div>
          <label className="text-text-secondary text-xs block mb-1">Resolution</label>
          <select value={exportSettings.resolution} onChange={(e) => updateExportSettings({ resolution: e.target.value as ExportSettings['resolution'] })} disabled={isExporting} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1.5 text-text-primary text-sm disabled:opacity-50">
            <option value="720p">720p (1280×720)</option>
            <option value="1080p">1080p (1920×1080)</option>
            <option value="4k">4K (3840×2160)</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-text-secondary text-xs block mb-1">Format</label>
          <select value={exportSettings.format} onChange={(e) => updateExportSettings({ format: e.target.value as 'mp4' | 'webm' })} disabled={isExporting} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1.5 text-text-primary text-sm disabled:opacity-50">
            <option value="mp4">MP4 (H.264)</option>
            <option value="webm">WebM (VP9)</option>
          </select>
        </div>
      </div>

      {/* Quality and FPS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Quality */}
        <div>
          <label className="text-text-secondary text-xs block mb-1">Quality</label>
          <select value={exportSettings.quality} onChange={(e) => updateExportSettings({ quality: e.target.value as 'low' | 'medium' | 'high' })} disabled={isExporting} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1.5 text-text-primary text-sm disabled:opacity-50">
            <option value="low">Low (Faster)</option>
            <option value="medium">Medium</option>
            <option value="high">High (Best)</option>
          </select>
        </div>

        {/* FPS */}
        <div>
          <label className="text-text-secondary text-xs block mb-1">Frame Rate</label>
          <select value={exportSettings.fps} onChange={(e) => updateExportSettings({ fps: parseInt(e.target.value) as 24 | 30 | 60 })} disabled={isExporting} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1.5 text-text-primary text-sm disabled:opacity-50">
            <option value="24">24 FPS</option>
            <option value="30">30 FPS</option>
            <option value="60">60 FPS</option>
          </select>
        </div>
      </div>

      {/* Info section */}
      <div className="bg-dark-surface rounded-lg p-3 text-text-secondary text-sm">
        <p>Duration: {formatDurationString(videoDuration)}</p>
        <p>
          Resolution: {resolution.width}×{resolution.height}
        </p>
        <p>Estimated Size: {estimatedSize.readable}</p>
      </div>

      {/* Error message */}
      {exportError && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{exportError}</p>
        </div>
      )}

      {/* Progress bar */}
      {isExporting && (
        <div className="bg-dark-surface rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-primary text-sm font-medium">Exporting...</span>
            <span className="text-text-secondary text-sm">{exportProgress}%</span>
          </div>
          <div className="w-full bg-dark-border rounded-full h-2">
            <div className="bg-primary rounded-full h-2 transition-all duration-300" style={{ width: `${exportProgress}%` }} />
          </div>
        </div>
      )}

      {/* Export button */}
      <button onClick={handleExport} disabled={isExporting || project.images.length === 0} className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
        <Download className="w-5 h-5" />
        {isExporting ? 'Exporting...' : 'Export as ' + exportSettings.format.toUpperCase()}
      </button>
    </div>
  );
};
