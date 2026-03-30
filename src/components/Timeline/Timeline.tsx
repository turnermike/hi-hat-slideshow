import React from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { SlideThumbnail } from './SlideThumbnail';

export const Timeline: React.FC = () => {
  const images = useProjectStore((state) => state.images);

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p>Upload images to configure slide settings</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
      {images.map((image, index) => (
        <SlideThumbnail key={image.id} slideIndex={index} image={image} />
      ))}
    </div>
  );
};
