import React from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { event } from '@/utils/analytics';
import { useShallow } from 'zustand/react/shallow';
import type { AspectRatio } from '@/types';

interface AspectRatioOption {
  ratio: AspectRatio;
  label: string;
  description: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    ratio: '16:9',
    label: '16:9',
    description: 'YouTube, Desktop',
  },
  {
    ratio: '9:16',
    label: '9:16',
    description: 'TikTok, Reels',
  },
  {
    ratio: '1:1',
    label: '1:1',
    description: 'Instagram, Square',
  },
];

export const AspectRatioSelector: React.FC = () => {
  const { aspectRatio, setAspectRatio } = useProjectStore(
    useShallow((state) => ({
      aspectRatio: state.aspectRatio,
      setAspectRatio: state.setAspectRatio,
    })),
  );

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-text-primary font-medium">Aspect Ratio</h3>
      <div className="grid grid-cols-3 gap-2">
        {ASPECT_RATIOS.map((option) => (
          <button
            key={option.ratio}
            onClick={() => {
              setAspectRatio(option.ratio);
              event({
                action: 'select_aspect_ratio',
                category: 'settings',
                label: option.ratio,
              });
            }}
            className={`p-2 rounded-lg border-2 transition-colors text-center ${aspectRatio === option.ratio ? 'border-primary bg-primary/5' : 'border-dark-border'}`}
          >
            <p className="text-text-primary font-medium text-sm">{option.label}</p>
            <p className="text-text-secondary text-xs">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
