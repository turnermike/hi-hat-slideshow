import React from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { estimateFileSize, formatDurationString } from '@/utils/videoExporter';

export const ExportControls: React.FC = () => {
  const [isExporting, setIsExporting] = React.useState(false);

  const project = useProjectStore((state) => ({
    images: state.images,
    slideDurations: state.slideDurations,
    transitionDurations: state.transitionDurations,
    exportSettings: state.exportSettings,
  }));

  const exportSettings = useProjectStore((state) => state.exportSettings);
  const updateExportSettings = useProjectStore((state) => state.updateExportSettings);
  const setExporting = useProjectStore((state) => state.setExporting);
  const exportProgress = useProjectStore((state) => state.exportProgress);
  const setExportProgress = useProjectStore((state) => state.setExportProgress);
  const exportError = useProjectStore((state) => state.exportError);
  const setExportError = useProjectStore((state) => state.setExportError);

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

  const handleExport = async () => {
    if (project.images.length === 0) {
      setExportError('Please upload images first');
      return;
    }

    setIsExporting(true);
    setExporting(true);
    setExportProgress(0);
    setExportError(null);

    try {
      // Simulate export progress for now
      // In real implementation, this would use Remotion's renderMedia
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Create download link
      const mockBlob = new Blob(['Mock video data'], { type: 'video/mp4' });
      const url = URL.createObjectURL(mockBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress(100);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
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
          <select value={exportSettings.resolution} onChange={(e) => updateExportSettings({ resolution: e.target.value as any })} disabled={isExporting} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1.5 text-text-primary text-sm disabled:opacity-50">
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
