import React from 'react';
import { HelpCircle } from 'lucide-react';
import './App.css';
import { UploadZone } from '@/components/UploadZone/UploadZone';
import { ImagePreview } from '@/components/UploadZone/ImagePreview';
import { VideoPreview } from '@/components/VideoPreview';
import { Timeline } from '@/components/Timeline/Timeline';
import { AudioUpload } from '@/components/AudioUpload';
import { ExportControls } from '@/components/ExportControls';
import { TemplateSelector } from '@/components/TemplateSelector';
import { AspectRatioSelector } from '@/components/AspectRatioSelector';

function App() {
  const [showHelp, setShowHelp] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      {/* Header */}
      <header className="border-b border-dark-border">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <h1 className="text-2xl font-bold">Portfolio Video Creator</h1>
          </div>
          <button onClick={() => setShowHelp(!showHelp)} className="p-2 hover:bg-dark-border rounded transition-colors" title="Help">
            <HelpCircle className="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-full mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Upload and controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Upload Zone */}
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Upload Images</h2>
              <UploadZone />
            </section>

            {/* Image preview strip */}
            {true && (
              <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
                <ImagePreview />
              </section>
            )}

            {/* Template selector */}
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <TemplateSelector />
            </section>

            {/* Aspect ratio selector */}
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <AspectRatioSelector />
            </section>

            {/* Audio Upload */}
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <AudioUpload />
            </section>

            {/* Export Controls */}
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <ExportControls />
            </section>
          </div>

          {/* Middle column - Video preview */}
          <div className="lg:col-span-1">
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Preview</h2>
              <VideoPreview />
            </section>
          </div>

          {/* Right sidebar - Slide controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Slide Settings</h2>
              <Timeline />
            </section>
          </div>
        </div>
      </div>

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-md">
            <h2 className="text-text-primary font-bold text-lg mb-3">How to use</h2>
            <ul className="text-text-secondary text-sm space-y-2">
              <li>
                <strong>Upload:</strong> Drag & drop or click to add images (PNG, JPG, WEBP)
              </li>
              <li>
                <strong>Reorder:</strong> Drag thumbnails to rearrange slides
              </li>
              <li>
                <strong>Configure:</strong> Select transitions, durations, and captions per slide
              </li>
              <li>
                <strong>Add Audio:</strong> Upload background music (MP3, WAV, OGG)
              </li>
              <li>
                <strong>Export:</strong> Choose resolution and format, then export
              </li>
            </ul>
            <button onClick={() => setShowHelp(false)} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white py-2 rounded transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
