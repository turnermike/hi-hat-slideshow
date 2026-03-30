import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { X } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useShallow } from 'zustand/react/shallow';
import { Comment } from '@/components/Comment';

export const ImagePreview: React.FC = () => {
  const { images, removeImage, reorderImages, selectedSlideIndex, setSelectedSlideIndex } = useProjectStore(
    useShallow((state) => ({
      images: state.images,
      removeImage: state.removeImage,
      reorderImages: state.reorderImages,
      selectedSlideIndex: state.selectedSlideIndex,
      setSelectedSlideIndex: state.setSelectedSlideIndex,
    })),
  );

  const [localImages, setLocalImages] = useState(images);

  React.useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleReorder = (newOrder: typeof images) => {
    setLocalImages(newOrder);
    const startIndex = images.findIndex((img) => img.id === newOrder[0]?.id) || 0;
    const endIndex = images.findIndex((img) => img.id === newOrder[newOrder.length - 1]?.id) || 0;
    if (startIndex !== endIndex) {
      reorderImages(startIndex, endIndex);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p>No images uploaded yet</p>
      </div>
    );
  }

  return (
    <>
      <Comment text="Image Preview - Slide Strip Container" />
      <div className="flex flex-col gap-3">
        <h3 className="text-text-primary font-medium">Slides ({images.length})</h3>
        <Comment text="Dynamic height slide thumbnails with wrapping" />
        <div>
          <Reorder.Group axis="x" values={localImages} onReorder={handleReorder} className="flex flex-wrap gap-3">
            {localImages.map((image, index) => (
              <Reorder.Item key={image.id} value={image} className={`flex-shrink-0 relative group cursor-move transition-all rounded-lg overflow-visible ${selectedSlideIndex === index ? 'ring-2 ring-primary' : ''}`}>
                <img src={image.url} alt={`Slide ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" onClick={() => setSelectedSlideIndex(index)} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{index + 1}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete slide"
                >
                  <X className="w-4 h-4" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </>
  );
};
