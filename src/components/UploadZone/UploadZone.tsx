import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { validateImageFile, optimizeImage } from '@/utils/imageOptimizer';
import { useProjectStore } from '@/stores/projectStore';
import { event } from '@/utils/analytics';
import { AlertCircle } from 'lucide-react';

export const UploadZone: React.FC = () => {
  const addImages = useProjectStore((state) => state.addImages);
  const [errors, setErrors] = React.useState<string[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setErrors([]);
      const filesToAdd: File[] = [];
      const validationErrors: string[] = [];

      // Validate files
      for (const file of acceptedFiles) {
        const error = validateImageFile(file);
        if (error) {
          validationErrors.push(`${file.name}: ${error}`);
        } else {
          filesToAdd.push(file);
        }
      }

      // Optimize images if valid
      if (filesToAdd.length > 0) {
        try {
          const optimizedFiles: File[] = [];
          for (const file of filesToAdd) {
            const { blob } = await optimizeImage(file, 1920, 1080);
            const optimizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            optimizedFiles.push(optimizedFile);
          }
          addImages(optimizedFiles);
          event({
            action: 'upload_images',
            category: 'media',
            label: `${optimizedFiles.length} images`,
            value: optimizedFiles.length,
          });
        } catch (err) {
          validationErrors.push(`Failed to process images: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
      }
    },
    [addImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="flex flex-col gap-4">
      <div {...getRootProps()} className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-dark-border hover:border-primary/50'}`}>
        <input {...getInputProps()} aria-label="Upload images" />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-text-primary font-medium">{isDragActive ? 'Drop images here' : 'Drag and drop images here'}</p>
          <p className="text-text-secondary text-sm">or click to select (PNG, JPG, WEBP - max 10MB each, up to 20 images)</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-error/10 border border-error/30 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <div>
            {errors.map((error, i) => (
              <p key={i} className="text-error text-sm">
                {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
