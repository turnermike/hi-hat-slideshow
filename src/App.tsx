import React from 'react';
import { HelpCircle } from 'lucide-react';
import './App.css';
import { UploadZone } from '@/components/UploadZone/UploadZone';
import { ImagePreview } from '@/components/UploadZone/ImagePreview';
import { VideoPreview } from '@/components/VideoPreview';
import { Timeline } from '@/components/Timeline/Timeline';
import { AudioUpload } from '@/components/AudioUpload';
import { ExportControls } from '@/components/ExportControls';
import { AspectRatioSelector } from '@/components/AspectRatioSelector';
import { Comment } from '@/components/Comment';
import { Footer } from '@/components/Footer';
import { ExportDebugPanel } from '@/components/ExportDebugPanel';
import hiHatLogo from '@/assets/hi-hat-logo-transparent.png';

function App() {
  const [showHelp, setShowHelp] = React.useState(false);

  //
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Comment text="========== APP HEADER ==========" />
      <header>
        <div className="inner-wrapper mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={hiHatLogo} alt="Hi-hat Logo" className="w-12 h-12" />
              <h1 className="text-2xl font-bold">Hi-hat Slideshow Video Generator</h1>
            </div>
            <button onClick={() => setShowHelp(!showHelp)} className="p-2 hover:bg-dark-border rounded transition-colors" title="Help">
              <HelpCircle className="w-6 h-6 text-text-secondary" />
            </button>
          </div>
          <p className="text-text-secondary text-left pb-4">
            Easily create customized slideshow videos by uploading images, adding captions, and choosing from six dynamic transitions. Adjust slide durations, select from three design templates, and upload background music to enhance your video. With support for multiple aspect ratios and export options in up to 4K resolution, you can preview your slideshow in real-time before downloading.
          </p>
          <p className="text-text-secondary text-left pb-4">
            Brought to you by: <a href="https://hi-hat.consulting" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-text-secondary transition-colors">Hi-hat Consulting - www.hi-hatconsulting.com</a>
          </p>
        </div>
      </header>

      <Comment text="========== MAIN CONTENT ==========" />
      <div className="main-content max-w-screen-2xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Comment text="========== LEFT SIDEBAR: UPLOAD AND CONTROLS ==========" />
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Comment text="---- Upload Zone ----" />
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Upload Images</h2>
              <UploadZone />
            </section>

            <Comment text="---- Image Preview Strip ----" />
            {true && (
              <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
                <ImagePreview />
              </section>
            )}

            <Comment text="---- Aspect Ratio Selector ----" />
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <AspectRatioSelector />
            </section>

            <Comment text="---- Audio Upload ----" />
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <AudioUpload />
            </section>

            <Comment text="---- Export Controls ----" />
            <section className="hidden lg:block bg-dark-surface border border-dark-border rounded-lg p-4">
              <ExportControls />
            </section>
          </div>

          <Comment text="========== MIDDLE COLUMN: SLIDE SETTINGS ==========" />
          <div className="lg:col-span-1 flex flex-col gap-6">
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Slide Settings</h2>
              <Timeline />
            </section>
          </div>

          <Comment text="========== RIGHT COLUMN: VIDEO PREVIEW ==========" />
          <div className="lg:col-span-1">
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <h2 className="text-text-primary font-medium mb-3">Preview</h2>
              <VideoPreview />
            </section>
          </div>

          <Comment text="========== MOBILE/TABLET BOTTOM: EXPORT CONTROLS ==========" />
          <div className="lg:hidden">
            <Comment text="---- Export Controls ----" />
            <section className="bg-dark-surface border border-dark-border rounded-lg p-4">
              <ExportControls />
            </section>
          </div>
        </div>
      </div>

      <Comment text="========== HELP MODAL ==========" />
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
      
      <Comment text="========== DEBUG PANEL ==========" />
      <ExportDebugPanel />
      
      <Footer />
    </div>
  );
}

export default App;
