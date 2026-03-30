import React from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { SlideThumbnail } from './SlideThumbnail';
import { Comment } from '@/components/Comment';

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
    <>
      <Comment text="Slide Settings - Timeline Container" />
      <div className="flex flex-col gap-3">
        {images.map((image, index) => (
          <SlideThumbnail key={image.id} slideIndex={index} image={image} />
        ))}
      </div>
    </>
  );
};
