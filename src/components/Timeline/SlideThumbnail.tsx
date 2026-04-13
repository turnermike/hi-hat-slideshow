import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useShallow } from 'zustand/react/shallow';
import type { ImageItem, TransitionType } from '@/types';

interface SlideThumbnailProps {
  slideIndex: number;
  image: ImageItem;
}

const TRANSITIONS: TransitionType[] = ['fade', 'slide', 'zoom', 'blur', 'wipe', 'kenburns'];

export const SlideThumbnail: React.FC<SlideThumbnailProps> = ({ slideIndex, image }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const { transitions, transitionDurations, slideDurations, captions, captionColors, selectedSlideIndex, setSelectedSlideIndex, updateTransition, updateTransitionDuration, updateSlideDuration, updateCaption, updateCaptionColor } = useProjectStore(
    useShallow((state) => ({
      transitions: state.transitions,
      transitionDurations: state.transitionDurations,
      slideDurations: state.slideDurations,
      captions: state.captions,
      captionColors: state.captionColors,
      selectedSlideIndex: state.selectedSlideIndex,
      setSelectedSlideIndex: state.setSelectedSlideIndex,
      updateTransition: state.updateTransition,
      updateTransitionDuration: state.updateTransitionDuration,
      updateSlideDuration: state.updateSlideDuration,
      updateCaption: state.updateCaption,
      updateCaptionColor: state.updateCaptionColor,
    })),
  );

  const isSelected = selectedSlideIndex === slideIndex;
  const transitionType = transitions[slideIndex] || 'fade';
  const slideDuration = slideDurations[slideIndex] || 3;
  const transitionDuration = transitionDurations[slideIndex] || 1;
  const caption = captions[slideIndex] || '';
  const captionColor = captionColors[slideIndex] || '#ffffff';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-lg border-2 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-dark-border hover:border-dark-border/50'}`} onClick={() => setSelectedSlideIndex(slideIndex)}>
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <img src={image.url} alt={`Slide ${slideIndex + 1}`} className="w-16 h-16 rounded object-cover flex-shrink-0" />

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text-primary font-medium">Slide {slideIndex + 1}</span>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="p-1 hover:bg-dark-border rounded transition-colors">
              <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Main controls */}
          <div className="grid grid-cols-2 gap-2">
            {/* Transition dropdown */}
            <div>
              <label htmlFor={`transition-${slideIndex}`} className="text-text-secondary text-xs">Transition</label>
              <select id={`transition-${slideIndex}`} value={transitionType} onChange={(e) => updateTransition(slideIndex, e.target.value as TransitionType)} className="w-full bg-dark-border border border-dark-border rounded px-2 py-1 text-text-primary text-sm">
                {TRANSITIONS.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Slide duration */}
            <div>
              <label htmlFor={`slide-duration-${slideIndex}`} className="text-text-secondary text-xs">Duration: {slideDuration}s</label>
              <input id={`slide-duration-${slideIndex}`} type="range" min="1" max="10" step="0.1" value={slideDuration} onChange={(e) => updateSlideDuration(slideIndex, parseFloat(e.target.value))} className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary" aria-valuemin={1} aria-valuemax={10} />
            </div>
          </div>

          {/* Caption input */}
          <div>
            <label htmlFor={`caption-${slideIndex}`} className="text-text-secondary text-xs">Caption (optional)</label>
            <input id={`caption-${slideIndex}`} type="text" value={caption} onChange={(e) => updateCaption(slideIndex, e.target.value)} placeholder="Add text overlay..." className="w-full bg-dark-border border border-dark-border rounded px-2 py-1 text-text-primary text-sm placeholder-text-secondary" />
          </div>

          {/* Caption color picker */}
          <div>
            <label htmlFor={`caption-color-${slideIndex}`} className="text-text-secondary text-xs">Caption Color</label>
            <div className="flex items-center gap-2">
              <input 
                id={`caption-color-${slideIndex}`} 
                type="color" 
                value={captionColor} 
                onChange={(e) => updateCaptionColor(slideIndex, e.target.value)}
                className="w-8 h-8 bg-dark-border border border-dark-border rounded cursor-pointer"
              />
              <input 
                id={`caption-color-text-${slideIndex}`} 
                type="text" 
                value={captionColor} 
                onChange={(e) => updateCaptionColor(slideIndex, e.target.value)}
                placeholder="#ffffff"
                aria-label="Caption color hex code"
                className="flex-1 bg-dark-border border border-dark-border rounded px-2 py-1 text-text-primary text-sm placeholder-text-secondary font-mono"
              />
            </div>
          </div>

          {/* Advanced controls */}
          {showAdvanced && transitionType !== 'kenburns' && (
            <div className="pt-2 border-t border-dark-border">
              <label htmlFor={`transition-duration-${slideIndex}`} className="text-text-secondary text-xs">Transition Duration: {transitionDuration.toFixed(1)}s</label>
              <input id={`transition-duration-${slideIndex}`} type="range" min="0.5" max="2" step="0.1" value={transitionDuration} onChange={(e) => updateTransitionDuration(slideIndex, parseFloat(e.target.value))} className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer accent-secondary" aria-valuemin={0.5} aria-valuemax={2} />
            </div>
          )}

          {/* Ken Burns note */}
          {transitionType === 'kenburns' && <div className="text-text-secondary text-xs italic">Ken Burns effect is applied per-slide, not as a transition</div>}
        </div>
      </div>
    </motion.div>
  );
};
