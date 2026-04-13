import React, { useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import { pageview } from '@/utils/analytics';
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
import { ExportSettingsInfo } from '@/components/ExportSettingsInfo';
import hiHatLogo from '@/assets/hi-hat-logo-transparent.png';

function App() {
  const [showHelp, setShowHelp] = React.useState(false);
  const canonicalUrl = 'https://slideshow.hi-hatconsulting.com/';
  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareText = encodeURIComponent('Check out the Hi-hat Slideshow Video Generator — create polished slideshow videos fast.');
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;

  useEffect(() => {
    pageview(window.location.pathname);
  }, []);

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
          <p className="text-text-secondary text-left pb-4">Create polished slideshow videos from your images with an intuitive editor built for fast results. Upload photos, layer captions, pick from six animated transitions, add background music, and export in multiple resolutions including 4K. Preview your slideshow instantly, choose the right aspect ratio, and get a finished video that’s ready to share.</p>
          <p className="text-text-secondary text-left pb-4">
            Brought to you by:{' '}
            <a href="https://hi-hat.consulting" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-text-secondary transition-colors">
              Hi-hat Consulting - www.hi-hatconsulting.com
            </a>
          </p>
        </div>
      </header>

      <Comment text="========== INSTRUCTIONS PANEL ==========" />
      <div className="bg-dark-bg">
        <div className="main-content mx-auto px-6 py-6">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mx-auto text-left">
            <h2 className="text-text-primary font-bold text-xl mb-4">How to Use the Slideshow Video Generator</h2>
            <p className="text-text-secondary mb-4">Follow these simple steps to build a polished slideshow video with image uploads, music, transitions, and export settings optimized for sharing.</p>
            <ol className="space-y-4 list-decimal list-inside text-text-secondary">
              <li>
                <strong>Upload your images.</strong> Add high-quality photos in PNG, JPG, or WEBP format and reorder them to define the slideshow flow.
              </li>
              <li>
                <strong>Customize each slide.</strong> Add captions, choose transitions, and adjust slide duration for a compelling visual story.
              </li>
              <li>
                <strong>Set the aspect ratio.</strong> Pick the best format for your target platform, such as square, widescreen, or portrait.
              </li>
              <li>
                <strong>Upload music.</strong> Add background audio in MP3, WAV, or OGG to make your slideshow more engaging.
              </li>
              <li>
                <strong>Review the preview.</strong> Use the real-time preview to validate animation, timing, and pacing before export.
              </li>
              <li>
                <strong>Export your video.</strong> Choose the export quality and format, then download a share-ready slideshow video.
              </li>
              <li>
                <strong>Share on social media.</strong> Publish your finished slideshow to Facebook, X, LinkedIn, and other relevant platforms to showcase your visuals, engage your audience, and drive traffic to your brand.
              </li>
            </ol>

            <div className="mt-6 border-t border-dark-border pt-6">
              <p className="text-text-primary font-medium mb-3">Share the app:</p>
              <div className="flex flex-wrap gap-3">
                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg px-4 py-2 text-text-primary hover:bg-dark-border transition-colors">
                  <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
                  Facebook
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg px-4 py-2 text-text-primary hover:bg-dark-border transition-colors">
                  <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />X
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg px-4 py-2 text-text-primary hover:bg-dark-border transition-colors">
                  <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Comment text="========== EXPORT SETTINGS INFO ==========" />
      <div className="bg-dark-bg">
        <div className="main-content mx-auto px-6 py-6">
          <ExportSettingsInfo />
        </div>
      </div>

      <Comment text="========== MAIN CONTENT ==========" />
      <main className="main-content max-w-screen-2xl mx-auto px-6 py-6" aria-label="Slideshow editor">
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
      </main>

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
