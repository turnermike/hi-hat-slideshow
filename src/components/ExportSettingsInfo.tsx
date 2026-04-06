import React from 'react';
import { Info } from 'lucide-react';

export const ExportSettingsInfo: React.FC = () => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mx-auto text-left">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-text-primary font-medium text-lg">Understanding Export Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Resolution */}
        <div className="space-y-2">
          <h4 className="text-text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Resolution
          </h4>
          <div className="text-text-secondary space-y-1">
            <p><strong>720p (1280×720):</strong> Good for web sharing, smaller file size</p>
            <p><strong>1080p (1920×1080):</strong> Full HD, standard quality for most devices</p>
            <p><strong>4K (3840×2160):</strong> Ultra HD, best quality but larger files</p>
            <p><strong>Custom:</strong> Set your own dimensions for specific needs</p>
          </div>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <h4 className="text-text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Format
          </h4>
          <div className="text-text-secondary space-y-1">
            <p><strong>MP4 (H.264):</strong> Most compatible format, works on all devices</p>
            <p><strong>WebM (VP9):</strong> Modern web format, smaller file size, better compression</p>
            <p className="text-xs mt-2">Choose MP4 for maximum compatibility, WebM for web optimization</p>
          </div>
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <h4 className="text-text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Quality
          </h4>
          <div className="text-text-secondary space-y-1">
            <p><strong>Low:</strong> Faster export, smaller files, good for previews</p>
            <p><strong>Medium:</strong> Balanced quality and file size</p>
            <p><strong>High:</strong> Best visual quality, larger files, slower export</p>
            <p className="text-xs mt-2">Higher quality settings increase processing time and file size</p>
          </div>
        </div>

        {/* Frame Rate */}
        <div className="space-y-2">
          <h4 className="text-text-primary font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Frame Rate
          </h4>
          <div className="text-text-secondary space-y-1">
            <p><strong>24 FPS:</strong> Cinematic look, standard for films</p>
            <p><strong>30 FPS:</strong> Standard video, smooth motion for most content</p>
            <p><strong>60 FPS:</strong> Very smooth motion, best for fast-paced content</p>
            <p className="text-xs mt-2">Higher frame rates create smoother motion but larger files</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dark-border">
        <p className="text-text-secondary text-xs">
          <strong>Tip:</strong> For most slideshow videos, 1080p resolution with Medium quality and 30 FPS provides the best balance between quality and file size.
        </p>
      </div>
    </div>
  );
};
